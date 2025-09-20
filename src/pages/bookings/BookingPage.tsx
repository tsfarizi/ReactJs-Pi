import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState, useEffect, useCallback } from "react";
import type { UserBookingItem } from "../../models/model";
import {
  cancelUserBooking,
  getMyBookings,
} from "../../services/bookingService";
import { generateMidtransToken } from "../../services/midtransService";
import { toast } from "react-toastify";
import { loadMidtransScript } from "../../utils/loadMidtrans";
import { payWithMidtrans } from "../../utils/midtrans";
import axios from "axios";
import { Button } from "@mui/material";
import { info, warn, error, mask } from "../../utils/logger";

export default function BookingPage() {
  const [bookings, setBookings] = useState<UserBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processingBookingIds, setProcessingBookingIds] = useState<string[]>([]);

  const formatStatus = (status: string): string => {
    const normalized = status?.toLowerCase();
    const map: Record<string, string> = {
      down_payment: "Menunggu DP",
      down_payment_paid: "DP Terbayar",
      final_payment: "Menunggu Pelunasan",
      final_payment_paid: "Pelunasan Terbayar",
      cancelled: "Dibatalkan",
    };

    return map[normalized] ?? status;
  };
  const getStatusNote = (booking: UserBookingItem): string | null => {
    const normalizedStatus = booking.status?.toLowerCase();
    if (normalizedStatus === 'cancelled' || normalizedStatus === 'final_payment_paid') {
      return null;
    }
    const hasFinalAvailable = booking.available_payments?.includes('final') ?? false;

    if (normalizedStatus === 'down_payment_paid' && !hasFinalAvailable) {
      return 'Menunggu konfirmasi admin untuk pelunasan.';
    }

    return null;
  };
  const formatBookingDate = (date: string): string =>
    new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const buildContactLink = (booking: UserBookingItem): string => {
    const phone = "6281697779709";
    const decorationTitle = booking.decoration?.title ?? "paket dekorasi";
    const eventDate = formatBookingDate(booking.date);
    const message = `Halo admin Chiz Décor, saya ingin menanyakan perkembangan pesanan saya untuk paket ${decorationTitle} pada tanggal ${eventDate}.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };



  useEffect(() => {
    const state = location.state as {
      successMessage?: string;
    };

    if (state?.successMessage) {
      setSuccessMessage(state.successMessage);
    }

    window.history.replaceState({}, document.title);
  }, [location.state]);

  const fetchBookings = useCallback(
    async ({ showSpinner = false }: { showSpinner?: boolean } = {}): Promise<
      UserBookingItem[]
    > => {
      try {
        info("booking:fetch", "Fetching bookings", { showSpinner });
        if (showSpinner) setLoading(true);
        const res = await getMyBookings();
        const data = res.data;
        info("booking:fetch", "Fetched bookings", { count: data?.length });
        setBookings(data);
        return data;
      } catch (err) {
        error("booking:fetch", "Failed to fetch bookings", err);
        toast.error("Gagal memuat data booking.");
        return [];
      } finally {
        if (showSpinner) setLoading(false);
      }
  }, []);

  useEffect(() => {
    fetchBookings({ showSpinner: true });
  }, [fetchBookings]);

  useEffect(() => {
    const key = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "";
    info("booking:midtrans", "Initializing Midtrans", { clientKey: mask(key) });
    loadMidtransScript(key)
      .then(() => info("booking:midtrans", "Midtrans script loaded"))
      .catch((e) => {
        error("booking:midtrans", "Failed to load Midtrans", e);
        toast.error("Gagal memuat Midtrans Snap.");
      });
  }, []);

  const handlePayment = async (
    bookingId: string,
    paymentType: "dp" | "first" | "final"
  ) => {
    try {
      const opId = `${bookingId}-${paymentType}-${Date.now()}`;
      const tag = `pay:${opId}`;
      info(tag, "Starting payment", { bookingId, paymentType });
      const { token } = await generateMidtransToken({ bookingId, paymentType });
      info(tag, "Midtrans token acquired", { token: mask(token) });

      const expectedStatuses: Record<"dp" | "first" | "final", string[]> = {
        dp: ["down_payment_paid", "final_payment", "final_payment_paid"],
        first: ["final_payment", "final_payment_paid"],
        final: ["final_payment_paid"],
      };

      const markProcessing = () => {
        info(tag, "Mark processing");
        setProcessingBookingIds((prev) =>
          prev.includes(bookingId) ? prev : [...prev, bookingId]
        );
      };

      const unmarkProcessing = () => {
        info(tag, "Unmark processing");
        setProcessingBookingIds((prev) => prev.filter((id) => id !== bookingId));
      };

      markProcessing();

      const pollStatus = async (attempt = 0): Promise<void> => {
        if (attempt >= 30) {
          toast.info(
            "Status pembayaran akan diperbarui dalam beberapa saat. Silakan refresh jika belum berubah."
          );
          warn(tag, "Polling reached max attempts");
          unmarkProcessing();
          return;
        }

        info(tag, `Polling status (attempt=${attempt + 1})`);
        const data = await fetchBookings();
        const updated = data?.find((booking) => booking.id === bookingId);
        const normalized = updated?.status?.toLowerCase();
        const targetStatuses = expectedStatuses[paymentType];
        const paidByFlag = (() => {
          if (!updated) return false;
          try {
            if (paymentType === "dp") return updated.paid_payments?.includes("dp");
            if (paymentType === "first") return updated.paid_payments?.includes("first");
            if (paymentType === "final") return updated.paid_payments?.includes("final");
            return false;
          } catch {
            return false;
          }
        })();

        info(tag, "Current status", {
          status: normalized,
          targetStatuses,
          paidByFlag,
          paidPayments: updated?.paid_payments,
          availablePayments: updated?.available_payments,
        });
        if ((normalized && targetStatuses.includes(normalized)) || paidByFlag) {
          info(tag, "Desired status reached, stop polling");
          unmarkProcessing();
          return;
        }

        setTimeout(() => {
          void pollStatus(attempt + 1);
        }, 2000);
      };

      const refreshAfterPayment = () => {
        info(tag, "Scheduling status refresh in 1500ms");
        setTimeout(() => {
          void pollStatus();
        }, 1500);
      };

      info(tag, "Calling payWithMidtrans");
      payWithMidtrans(token, {
        onSuccess: refreshAfterPayment,
        onPending: refreshAfterPayment,
        onError: () => {
          error(tag, "Snap onError, stopping processing");
          unmarkProcessing();
        },
        onClose: () => {
          // Tetap cek status setelah popup ditutup, untuk kasus pembayaran via redirect/wallet
          warn(tag, "Snap closed, still refreshing status");
          refreshAfterPayment();
        },
      });
      // Mulai polling segera meski callback Snap tidak terpanggil
      info(tag, "Start background polling immediately");
      refreshAfterPayment();
    } catch (err: unknown) {
      setProcessingBookingIds((prev) => prev.filter((id) => id !== bookingId));
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 409) {
          info("pay:error", "409 Conflict received, refreshing bookings");
          toast.info("Transaksi sebelumnya masih diproses, memeriksa status...");
          await fetchBookings();
        } else if (status === 400) {
          toast.error(message || "Pembayaran belum tersedia.");
        } else {
          toast.error("Gagal memulai pembayaran.");
        }
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui.");
      }

      error("pay:error", "Unhandled error in handlePayment", err);
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelUserBooking(bookingId);
      toast.success("Booking berhasil dibatalkan.");
      fetchBookings();
    } catch (error) {
      console.error("❌ Failed to cancel booking:", error);
      toast.error("Gagal membatalkan booking.");
    }
  };

  const renderPaymentButtons = (booking: UserBookingItem) => {
    if (
      !booking.available_payments ||
      booking.available_payments.length === 0
    ) {
      return null;
    }

    const normalizedStatus = booking.status?.toLowerCase();
    const isDpPaid = booking.paid_payments?.includes("dp");
    const isFinalPaid = booking.paid_payments?.includes("final");
    const showDownPaymentButton =
      normalizedStatus === "down_payment" &&
      !isDpPaid &&
      (booking.available_payments?.includes("dp") ?? true);
    const showFinalButton =
      booking.available_payments.includes("final") &&
      normalizedStatus === "final_payment" &&
      !isFinalPaid;
    const isProcessing = processingBookingIds.includes(booking.id);

    if (!showDownPaymentButton && !showFinalButton) {
      return null;
    }

    return (
      <div className="flex flex-col items-center space-y-1">
        {showDownPaymentButton && (
          <Button
            variant="outlined"
            color="primary"
            sx={{ textTransform: "none", width: "70%" }}
            size="small"
            onClick={() => handlePayment(booking.id, "dp")}
            className="mt-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            disabled={isProcessing}
          >
            Bayar DP
          </Button>
        )}
        {showFinalButton && (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ textTransform: "none", width: "70%" }}
            onClick={() => handlePayment(booking.id, "final")}
            className="mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={isProcessing}
          >
            Pelunasan
          </Button>
        )}
        {isProcessing && (
          <p className="text-xs text-gray-500 mt-1">
            Sedang memverifikasi pembayaran…
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto pt-28 px-4 pb-12">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Booking Saya</h1>

        {successMessage && (
          <div className="mb-4 px-4 py-3 rounded bg-green-100 text-green-800 border border-green-300">
            {successMessage}
          </div>
        )}

        {loading ? (
          <p className="text-gray-600">Memuat data...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">Belum ada booking.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-xl">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 border-b">Judul Dekorasi</th>
                  <th className="px-4 py-3 border-b">Tanggal Acara</th>
                  <th className="px-4 py-3 border-b">Status</th>
                  <th className="px-4 py-3 border-b text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking: UserBookingItem) => {
                  const statusNote = getStatusNote(booking);

                  return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b">
                      {booking.decoration.title}
                    </td>
                    <td className="px-4 py-3 border-b">
                      {new Date(booking.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 border-b capitalize">
                      <div>{formatStatus(booking.status)}</div>
                      {statusNote && (
                        <p className="text-xs text-amber-600 mt-1">{statusNote}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 border-b text-center space-y-2">
                      <Link
                        to={`/invoice/${booking.id}`}
                        className="text-blue-600 hover:underline block"
                      >
                        Lihat Invoice
                      </Link>
                      {booking.status?.toLowerCase() === "down_payment_paid" && (
                        <Button
                          component="a"
                          href={buildContactLink(booking)}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          color="secondary"
                          size="small"
                          sx={{ textTransform: "none", width: "70%" }}
                        >
                          Hubungi Admin
                        </Button>
                      )}
                      {booking.status?.toLowerCase() !== "cancelled" &&
                        renderPaymentButtons(booking)}
                      <Button
                        variant="outlined"
                        sx={{ textTransform: "none", width: "70%" }}
                        color="error"
                        size="small"
                        disabled={
                          ["cancelled", "final_payment_paid"].includes(
                            booking.status?.toLowerCase() ?? ""
                          ) || processingBookingIds.includes(booking.id)
                        }
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



