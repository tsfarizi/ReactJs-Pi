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
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  getAllGalleryDecorations,
  deleteGalleryDecoration,
} from "../../services/galleryService";
import type { GalleryItem } from "../../models/model";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

export default function GalleryPageAdmin() {
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const fetchGalleries = async () => {
    try {
      const res = await getAllGalleryDecorations();
      setGalleries(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch galleries:", error);
      toast.error("Gagal memuat data gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const state = location.state as {
      message?: string;
      type?: "success" | "error";
    };
    if (state?.message) {
      setMessage(state.message);
      setMessageType(state.type || "success");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteGalleryDecoration(selectedId);
      toast.success("Gambar gallery berhasil dihapus.");
      fetchGalleries(); // refresh data
    } catch (error) {
      console.error("❌ Failed to delete gallery item:", error);
      toast.error("Gagal menghapus gambar gallery.");
    } finally {
      setOpenDeleteModal(false);
      setSelectedId(null);
    }
  };

  const handleOpenDeleteModal = (id: string) => {
    setSelectedId(id);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedId(null);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/galleries/${id}/edit`);
  };

  const normalizeImageUrl = (url: string) => {
    if (url.includes("/uploads/")) {
      return url.replace("/uploads/", "/wdstorage/");
    }
    return url;
  };

  useEffect(() => {
    fetchGalleries();
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
        <Header title="Gallery" subtitle="Manage your gallery here" />
        <Button
          variant="contained"
          color="primary"
          sx={{ bgcolor: colors.blueAccent[500], color: "#fff" }}
          onClick={() => navigate("/admin/galleries/add")}
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
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Image
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Title
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
              {galleries.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={normalizeImageUrl(item.image)}
                      alt={item.title}
                      style={{ width: "100px", borderRadius: "4px" }}
                    />
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(item.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleOpenDeleteModal(item.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {galleries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Tidak ada data gallery.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus gambar gallery ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} color="primary">
            Batal
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
