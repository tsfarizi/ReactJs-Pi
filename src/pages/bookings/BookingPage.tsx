import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
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

export default function BookingPage() {
  const [bookings, setBookings] = useState<UserBookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [showWaModal, setShowWaModal] = useState(false);

  useEffect(() => {
    const state = location.state as {
      successMessage?: string;
      whatsappLink?: string;
    };

    if (state?.successMessage) {
      setSuccessMessage(state.successMessage);
    }

    if (state?.whatsappLink) {
      setWhatsappLink(state.whatsappLink);
      setShowWaModal(true);
    }

    window.history.replaceState({}, document.title);
  }, [location.state]);

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (error) {
      console.error("❌ Gagal mengambil data booking:", error);
      toast.error("Gagal memuat data booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    loadMidtransScript(import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "")
      .then(() => console.log("✅ Midtrans script loaded"))
      .catch(() => toast.error("Gagal memuat Midtrans Snap."));
  }, []);

  const handlePayment = async (
    bookingId: string,
    paymentType: "dp" | "first" | "final"
  ) => {
    try {
      const { token } = await generateMidtransToken({ bookingId, paymentType });
      payWithMidtrans(token);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 409) {
          toast.error("Masih ada transaksi sebelumnya yang belum selesai.");
        } else if (status === 400) {
          toast.error(message || "Pembayaran belum tersedia.");
        } else {
          toast.error("Gagal memulai pembayaran.");
        }
      } else {
        toast.error("Terjadi kesalahan yang tidak diketahui.");
      }

      console.error("Midtrans error:", err);
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

    return (
      <div className="flex flex-col items-center space-y-1">
        {booking.available_payments.includes("dp") && (
          <Button
            variant="outlined"
            color="primary"
            sx={{ textTransform: "none", width: "70%" }}
            size="small"
            onClick={() => handlePayment(booking.id, "dp")}
            className="mt-1 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Bayar DP
          </Button>
        )}
        {booking.available_payments.includes("first") && (
          <Button
            variant="outlined"
            color="primary"
            sx={{ textTransform: "none", width: "70%" }}
            size="small"
            onClick={() => handlePayment(booking.id, "first")}
            className="mt-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Bayar Tahap 1
          </Button>
        )}
        {booking.available_payments.includes("final") && (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            sx={{ textTransform: "none", width: "70%" }}
            onClick={() => handlePayment(booking.id, "final")}
            disabled={booking.available_payments.includes("first")}
            className="mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Pelunasan
          </Button>
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
                {bookings.map((booking: UserBookingItem) => (
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
                      {booking.status}
                    </td>
                    <td className="px-4 py-3 border-b text-center space-y-2">
                      <Link
                        to={`/invoice/${booking.id}`}
                        className="text-blue-600 hover:underline block"
                      >
                        Lihat Invoice
                      </Link>
                      {booking.status !== "cancelled" &&
                        renderPaymentButtons(booking)}
                      <Button
                        variant="outlined"
                        sx={{ textTransform: "none", width: "70%" }}
                        color="error"
                        size="small"
                        disabled={
                          booking.status === "cancelled" ||
                          booking.status === "done"
                        }
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showWaModal && whatsappLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Booking Berhasil!
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Klik tombol di bawah untuk menghubungi admin via WhatsApp.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowWaModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Nanti Saja
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowWaModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Buka WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
