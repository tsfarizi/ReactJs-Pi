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
} from "../../services/bookingService";
import type { BookingDetailAdmin } from "../../models/model";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  cancelled: "Cancelled",
  first_paid: "First Paid",
  fully_paid: "Fully Paid",
  confirmed: "Confirmed",
  paid: "Paid",
  dp_paid: "DP Paid",
  done: "Done",
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

const STATUS_FILTER_DEFAULT = "paid";

export default function BookingPageAdmin() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [bookings, setBookings] = useState<BookingDetailAdmin[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(
    STATUS_FILTER_DEFAULT
  );
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

  const handleFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(normalizeStatus(event.target.value));
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
                  <TableCell>{booking.decoration.title}</TableCell>
                  <TableCell>{formatDate(booking.date)}</TableCell>
                  <TableCell>{getStatusLabel(booking.status)}</TableCell>
                  <TableCell>{formatCurrency(booking.total_price)}</TableCell>
                  <TableCell>{booking.payment_summary}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      disabled={
                        ["done", "cancelled"].includes(
                          normalizeStatus(booking.status)
                        )
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
