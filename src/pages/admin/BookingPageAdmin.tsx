import { useEffect, useState } from "react";
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
} from "@mui/material";
import {
  getAllBookings,
  cancelBooking,
  deleteBooking,
} from "../../services/bookingService";
import type { BookingDetailAdmin } from "../../models/model";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function BookingPageAdmin() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [bookings, setBookings] = useState<BookingDetailAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch bookings:", error);
      toast.error("Gagal memuat data booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success("Booking berhasil dibatalkan.");
      fetchBookings(); // refresh tabel
    } catch (error) {
      console.error("❌ Failed to cancel booking:", error);
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

  const confirmDelete = async () => {
    if (!selectedBookingId) return;
    try {
      await deleteBooking(selectedBookingId);
      toast.success("Paket booking berhasil dihapus.");
      fetchBookings();
    } catch (error) {
      console.error("❌ Failed to delete booking:", error);
      toast.error("Gagal menghapus paket booking.");
    } finally {
      setOpenDeleteModal(false);
      setSelectedBookingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setSelectedBookingId(id);
    setOpenDeleteModal(true);
  };

  // Helper function untuk format status
  const formatStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      pending: "pending",
      cancelled: "cancelled",
      first_paid: "first paid",
      fully_paid: "fully paid",
      confirmed: "confirmed",
    };
    return statusMap[status] || status.toUpperCase();
  };

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
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.user.name}</TableCell>
                  <TableCell>{booking.decoration.title}</TableCell>
                  <TableCell>{formatDate(booking.date)}</TableCell>
                  <TableCell>{formatStatus(booking.status)}</TableCell>
                  <TableCell>{formatCurrency(booking.total_price)}</TableCell>
                  <TableCell>{booking.payment_summary}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      disabled={
                        booking.status === "Done" ||
                        booking.status === "cancelled"
                      }
                      sx={{ mr: 1 }}
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleDelete(booking.id)}
                    >
                      Delete
                    </Button>
                    {booking && (
                      <Link to={`/admin/bookings/${booking.id}`}>
                        <Button variant="outlined" color="warning" size="small">
                          Detail
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    Tidak ada data booking.
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
