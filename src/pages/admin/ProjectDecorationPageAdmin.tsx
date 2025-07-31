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
  getAllProjectDecorations,
  deleteProjectDecoration,
} from "../../services/projectDecorationService";
import type { ProjectDecoration } from "../../models/model";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProjectDecorationPageAdmin() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const [projects, setProjects] = useState<ProjectDecoration[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );

  const fetchProjects = async () => {
    try {
      const res = await getAllProjectDecorations();
      setProjects(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch projects:", error);
      toast.error("Gagal memuat data project decoration.");
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
      window.history.replaceState({}, document.title); // clear state agar tidak muncul lagi di refresh
    }
  }, [location.state]);

  const handleDelete = (id: string) => {
    setSelectedProjectId(id);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedProjectId) return;
    try {
      await deleteProjectDecoration(selectedProjectId);
      toast.success("Project decoration berhasil dihapus.");
      fetchProjects();
    } catch (error) {
      console.error("❌ Failed to delete project:", error);
      toast.error("Gagal menghapus project decoration.");
    } finally {
      setOpenDeleteModal(false);
      setSelectedProjectId(null);
    }
  };

  const normalizeImageUrl = (url: string) => {
    if (url.includes("/uploads/")) {
      return url.replace("/uploads/", "/wdstorage/");
    }
    return url;
  };

  useEffect(() => {
    fetchProjects();
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
        <Header
          title="Projects"
          subtitle="Manage your project decorations here"
        />
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
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Title
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Description
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Cover Image
                </TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>
                    {project.description.length > 100
                      ? project.description.slice(0, 100) + "..."
                      : project.description}
                  </TableCell>
                  <TableCell>
                    {project.cover_image ? (
                      <img
                        src={normalizeImageUrl(project.cover_image)}
                        alt={project.title}
                        style={{ width: "100px", borderRadius: "4px" }}
                      />
                    ) : (
                      <span>Tidak ada gambar</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() =>
                        navigate(
                          `/admin/project-decorations/${project.id}/edit`
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Tidak ada project decoration.
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
