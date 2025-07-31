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
  Alert,
} from "@mui/material";
import {
  getAllAdminDecorations,
  deleteDecoration,
} from "../../services/decorationService";
import type { Decoration } from "../../models/model";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

export default function PackagePageAdmin() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedDecorationId, setSelectedDecorationId] = useState<
    string | null
  >(null);

  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const fetchDecorations = async () => {
    try {
      const res = await getAllAdminDecorations();
      setDecorations(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch decorations:", error);
      toast.error("Gagal memuat data paket dekorasi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setSelectedDecorationId(id);
    setOpenDeleteModal(true);
  };

  useEffect(() => {
    const state = location.state as {
      message?: string;
      type?: "success" | "error";
    };
    if (state?.message) {
      setMessage(state.message);
      setMessageType(state.type || "success");
      window.history.replaceState({}, document.title); // hapus state agar tidak muncul lagi di refresh
    }
  }, [location.state]);

  const confirmDelete = async () => {
    if (!selectedDecorationId) return;
    try {
      await deleteDecoration(selectedDecorationId);
      toast.success("Paket dekorasi berhasil dihapus.");
      fetchDecorations();
    } catch (error) {
      console.error("❌ Failed to delete decoration:", error);
      toast.error("Gagal menghapus paket dekorasi.");
    } finally {
      setOpenDeleteModal(false);
      setSelectedDecorationId(null);
    }
  };

  useEffect(() => {
    fetchDecorations();
  }, []);

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
        <Header title="Packages" subtitle="Manage your packages here" />
        <Button
          variant="contained"
          color="primary"
          sx={{ bgcolor: colors.blueAccent[500], color: "#fff" }}
          onClick={() => navigate("add")}
        >
          Add
        </Button>
      </Box>

      {message && (
        <Box my={2}>
          <Alert severity={messageType || "success"}>{message}</Alert>
        </Box>
      )}

      <Box mt="20px" p="20px">
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: colors.primary[400] }}>
              <TableRow>
                {/* <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  ID
                </TableCell> */}
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Title
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Category
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Base Price
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Created At
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {decorations.map((decoration) => (
                <TableRow key={decoration.id}>
                  {/* <TableCell>{decoration.id}</TableCell> */}
                  <TableCell>{decoration.title}</TableCell>
                  <TableCell>{decoration.category}</TableCell>
                  <TableCell>{`Rp ${decoration.base_price.toLocaleString(
                    "id-ID"
                  )}`}</TableCell>
                  <TableCell>
                    {new Date(decoration.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() =>
                        navigate(`/admin/packages/${decoration.id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(decoration.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {decorations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Tidak ada paket dekorasi.
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
            Apakah Anda yakin ingin menghapus project decoration ini? Tindakan
            ini tidak dapat dibatalkan.
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
