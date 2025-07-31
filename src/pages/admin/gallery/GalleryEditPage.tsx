import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  useTheme,
  CircularProgress,
  Avatar,
  Fade,
  Paper,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/admin/Header";
import {
  getAllGalleryDecorations,
  updateGalleryDecoration,
} from "../../../services/galleryService";
import { tokens } from "../../../theme";
import api from "../../../services/api";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function GalleryEditPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllGalleryDecorations();
        const galleryItem = res.data.find((item) => item.id === id);
        if (galleryItem) {
          setTitle(galleryItem.title);
          setImageUrl(galleryItem.image);
          setImagePreview(galleryItem.image);
        }
      } catch (error) {
        console.error("❌ Gagal mengambil data gallery:", error);
        toast.error("Gagal mengambil data gallery.");
        navigate("/admin/galleries");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImageToBE = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "gallery");

    const res = await api.post("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data.url;
  };

  const handleSubmit = async () => {
    if (!title) {
      toast.error("Judul wajib diisi!");
      return;
    }

    try {
      setLoading(true);

      let finalImageUrl = imageUrl;

      // Upload gambar baru jika ada
      if (imageFile) {
        finalImageUrl = await uploadImageToBE(imageFile);
      }

      // Update gallery
      await updateGalleryDecoration(id!, {
        title,
        image: finalImageUrl!,
      });

      navigate("/admin/galleries", {
        state: {
          message: "Gallery berhasil diperbarui!",
          type: "success",
        },
      });
    } catch {
      // console.error("❌ Gagal update gallery:", error);
      toast.error("Gagal update gallery.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Edit Gallery" subtitle="Update gallery image or title" />

      <Fade in>
        <Paper
          elevation={4}
          sx={{
            mt: 3,
            p: { xs: 2, sm: 4 },
            maxWidth: 600,
            mx: "auto",
            borderRadius: 4,
            background: `linear-gradient(135deg, ${colors.blueAccent[700]} 0%, ${colors.primary[400]} 100%)`,
            boxShadow: theme.shadows[8],
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            color={colors.grey[100]}
            mb={2}
            textAlign="center"
            letterSpacing={1}
          >
            Edit Gallery
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            gap="24px"
            component="form"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <TextField
              label="Title"
              variant="filled"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              InputProps={{
                style: { background: colors.primary[400], borderRadius: 8 },
              }}
            />

            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<AddPhotoAlternateIcon />}
                sx={{
                  borderRadius: 2,
                  borderColor: colors.blueAccent[400],
                  color: colors.blueAccent[200],
                  bgcolor: colors.primary[400],
                  "&:hover": { bgcolor: colors.primary[300] },
                  fontWeight: 600,
                }}
              >
                {imageFile || imagePreview ? "Ganti Gambar" : "Upload Gambar"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>

              {imagePreview && (
                <Avatar
                  src={imagePreview}
                  alt="Preview"
                  variant="rounded"
                  sx={{
                    width: 64,
                    height: 64,
                    boxShadow: 2,
                    border: `2px solid ${colors.blueAccent[400]}`,
                  }}
                />
              )}
            </Box>

            <Box display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  bgcolor: colors.blueAccent[500],
                  color: "#fff",
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  "&:hover": { bgcolor: colors.blueAccent[700] },
                }}
                onClick={handleSubmit}
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Update"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
