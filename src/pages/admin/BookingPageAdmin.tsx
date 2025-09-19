import { useEffect, useMemo, useState } from "react";
import Header from "../../components/admin/Header";
import { tokens } from "../../theme";
import {
  Box,
  Button,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  getAllBookings,
  cancelBooking,
  deleteBooking,
  getBookingDetailAdmin,
} from "../../services/bookingService";
import { convertPaymentToFinal, ensureFinalPayment } from "../../services/paymentService";
import type { BookingDetailAdmin, BookingDetail, BookingPayment } from "../../models/model";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { info, warn, error } from "../../utils/logger";

const STATUS_LABELS: Record<string, string> = {
  down_payment: "Down Payment",
  down_payment_paid: "Down Payment Paid",
  final_payment: "Final Payment",
  final_payment_paid: "Final Payment Paid",
  cancelled: "Cancelled",
};

const normalizeStatus = (status?: string): string => (status ?? "").toLowerCase();

const getStatusLabel = (status: string): string => {
  const normalized = normalizeStatus(status);
  if (!normalized) return "-";
  if (STATUS_LABELS[normalized]) return STATUS_LABELS[normalized];
  return normalized
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const STATUS_FILTER_DEFAULT = "all";

export default function BookingPageAdmin() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [bookings, setBookings] = useState<BookingDetailAdmin[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(
    STATUS_FILTER_DEFAULT
  );
  const [convertingBookingId, setConvertingBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const logTag = "admin:booking";
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  const fetchBookings = async () => {
    info(logTag, "Fetching bookings");
    try {
      const res = await getAllBookings();
      const items = res.data ?? [];
      info(logTag, "Bookings fetched", { count: items.length });
      setBookings(items);
    } catch (err) {
      error(logTag, "Failed to fetch bookings", err);
      toast.error("Gagal memuat data booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    info(logTag, "Mount BookingPageAdmin");
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    info(logTag, "Request cancel booking", { bookingId });
    try {
      await cancelBooking(bookingId);
      info(logTag, "Booking cancelled", { bookingId });
      toast.success("Booking berhasil dibatalkan.");
      fetchBookings();
    } catch (err) {
      error(logTag, "Failed to cancel booking", err);
      toast.error("Gagal membatalkan booking.");
    }
  };

  // Helper function untuk format currency
  const formatCurrency = (amount: number): string => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  // Helper function untuk format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const normalizePhoneNumber = (phone: string): string => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("62")) return digits;
    if (digits.startsWith("0")) {
      return `62${digits.slice(1)}`;
    }
    return digits;
  };

  const sendWhatsappNotification = (
    phoneNumber: string,
    customerName: string,
    amount: number
  ) => {
    info(logTag, "Preparing WhatsApp notification", {
      phoneNumber,
      customerName,
      amount,
    });
    const normalized = normalizePhoneNumber(phoneNumber);
    if (!normalized) {
      warn(logTag, "Invalid phone number for WhatsApp", { phoneNumber, customerName });
      toast.error("Nomor WhatsApp pengguna tidak valid.");
      return;
    }

    if (typeof window === "undefined") {
      warn(logTag, "Window undefined when trying to send WhatsApp notification");
      return;
    }

    const amountText = formatCurrency(amount);
    const message = `Halo ${customerName}! Terima kasih, DP kamu sudah kami terima. Sekarang kamu sudah bisa menyelesaikan pelunasan sebesar ${amountText} lewat dashboard kami ya. Kalau ada yang ingin ditanyakan, balas pesan ini saja ya :)`; 
    const url = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
    info(logTag, "Opening WhatsApp chat", { phone: normalized });
    window.open(url, "_blank");
  };

  const canConvertToFinal = (booking: BookingDetailAdmin): boolean => {
    const status = normalizeStatus(booking.status);
    return status === "down_payment_paid";
  };

  const confirmDelete = async () => {
    if (!selectedBookingId) {
      warn(logTag, "confirmDelete called without selected booking");
      return;
    }
    info(logTag, "Deleting booking", { bookingId: selectedBookingId });
    try {
      await deleteBooking(selectedBookingId);
      info(logTag, "Booking deleted", { bookingId: selectedBookingId });
      toast.success("Paket booking berhasil dihapus.");
      fetchBookings();
    } catch (err) {
      error(logTag, "Failed to delete booking", err);
      toast.error("Gagal menghapus paket booking.");
    } finally {
      setOpenDeleteModal(false);
      setSelectedBookingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    info(logTag, "Open delete confirmation", { bookingId: id });
    setSelectedBookingId(id);
    setOpenDeleteModal(true);
  };

  const handleConvertToFinal = async (booking: BookingDetailAdmin) => {
    info(logTag, "Activate final payment clicked", { bookingId: booking.id });
    try {
      setConvertingBookingId(booking.id);
      const detailResponse = await getBookingDetailAdmin(booking.id);
      const detail: BookingDetail = detailResponse.data;
      const payments = detail?.payments ?? [];
      info(logTag, "Admin detail fetched", {
        bookingId: booking.id,
        paymentsCount: payments.length,
      });
      let finalPayment = payments.find(
        (payment) => payment.type === "final" && payment.payment_status !== "paid"
      );

      if (!finalPayment) {
        info(logTag, "No pending final payment found, ensuring creation", {
          bookingId: booking.id,
        });
        try {
          const ensureResponse = await ensureFinalPayment(booking.id);
          const ensureData = ensureResponse.data;
          if (ensureData?.payment) {
            finalPayment = ensureData.payment ?? undefined;
            info(logTag, "Final payment row ensured", {
              bookingId: booking.id,
              paymentId: finalPayment.id,
              created: ensureData.created,
            });
          } else {
            warn(logTag, "Ensure final payment did not return payment", {
              bookingId: booking.id,
            });
          }
        } catch (ensureError) {
          error(logTag, "Failed to ensure final payment row", ensureError);
          toast.error("Gagal menyiapkan data pelunasan.");
          return;
        }
      }

      if (!finalPayment) {
        toast.error("Data pembayaran final tidak ditemukan atau sudah lunas.");
        return;
      }
      info(logTag, "Final payment is available for user", {
        bookingId: booking.id,
        paymentId: finalPayment.id,
      });
      toast.success("Pelunasan diaktifkan. Pengguna sekarang bisa melunasi.");
      await fetchBookings();
      if (detail.user.phone_number) {
        const parsedAmount =
          typeof finalPayment.amount === "number"
            ? finalPayment.amount
            : Number(finalPayment.amount ?? detail.final_payment_amount);
        const finalAmount = Number.isFinite(parsedAmount)
          ? parsedAmount
          : detail.final_payment_amount;
        sendWhatsappNotification(
          detail.user.phone_number,
          detail.user.name,
          finalAmount
        );
      } else {
        warn(logTag, "No phone number when final payment activated", {
          bookingId: booking.id,
        });
        toast.info("Pelunasan aktif, namun nomor WhatsApp pengguna tidak tersedia.");
      }
    } catch (err) {
      error(logTag, "Failed to activate final payment", err);
      toast.error("Gagal mengaktifkan pelunasan.");
    } finally {
      info(logTag, "Final payment conversion flow finished", {
        bookingId: booking.id,
      });
      setConvertingBookingId(null);
    }
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    const value = normalizeStatus(event.target.value);
    info(logTag, "Status filter changed", { value });
    setStatusFilter(value);
  };

  const statusOptions = useMemo(() => {
    const statuses = new Set<string>([STATUS_FILTER_DEFAULT]);

    bookings.forEach((booking) => {
      const status = normalizeStatus(booking.status);
      if (status) {
        statuses.add(status);
      }
    });

    statuses.add(normalizeStatus(statusFilter));

    return [
      "all",
      ...Array.from(statuses)
        .filter((status) => status !== "all")
        .sort(),
    ];
  }, [bookings, statusFilter]);

  const filteredBookings = useMemo(() => {
    const normalizedFilter = normalizeStatus(statusFilter);
    if (normalizedFilter === "all") {
      return bookings;
    }

    return bookings.filter(
      (booking) => normalizeStatus(booking.status) === normalizedFilter
    );
  }, [bookings, statusFilter]);

  if (loading) {
    return (
      <Box
        m="20px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Booking" subtitle="Manage your bookings here" />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="booking-status-filter-label">
            Filter Status
          </InputLabel>
          <Select
            labelId="booking-status-filter-label"
            id="booking-status-filter"
            value={statusFilter}
            label="Filter Status"
            onChange={handleFilterChange}
          >
            {statusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status === "all" ? "Semua Status" : getStatusLabel(status)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box mt="20px">
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: colors.primary[400] }}>
              <TableRow>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Nama Pelanggan
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Nomor Telepon
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Paket Dekorasi
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Tanggal Booking
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Total Harga
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Rincian Pembayaran
                </TableCell>
                <TableCell
                  sx={{
                    color: colors.grey[100],
                    fontWeight: "bold",
                    width: "300px",
                  }}
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.user.name}</TableCell>
                  <TableCell>{booking.user.phone_number || "-"}</TableCell>
                  <TableCell>{booking.decoration.title}</TableCell>
                  <TableCell>{formatDate(booking.date)}</TableCell>
                  <TableCell>{getStatusLabel(booking.status)}</TableCell>
                  <TableCell>{formatCurrency(booking.total_price)}</TableCell>
                  <TableCell>{booking.payment_summary}</TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" alignItems="center" gap={1}>
                      <Link
                        to={`/admin/bookings/${booking.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          sx={{ textTransform: "none" }}
                        >
                          Detail
                        </Button>
                      </Link>
                      {canConvertToFinal(booking) && (
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ textTransform: "none" }}
                          onClick={() => handleConvertToFinal(booking)}
                          disabled={convertingBookingId === booking.id}
                        >
                          {
                            convertingBookingId === booking.id
                              ? "Memproses..."
                              : "Aktifkan Pelunasan"
                          }
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        sx={{ textTransform: "none" }}
                        disabled={
                          ["final_payment_paid", "cancelled"].includes(
                            normalizeStatus(booking.status)
                          )
                        }
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ textTransform: "none" }}
                        onClick={() => handleDelete(booking.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {filteredBookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Tidak ada data booking untuk status ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="delete-confirmation-dialog-title"
        aria-describedby="delete-confirmation-dialog-description"
      >
        <DialogTitle id="delete-confirmation-dialog-title">
          Konfirmasi Hapus
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-confirmation-dialog-description">
            Apakah Anda yakin ingin menghapus booking ini? Tindakan ini tidak
            dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="inherit">
            Batal
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}







