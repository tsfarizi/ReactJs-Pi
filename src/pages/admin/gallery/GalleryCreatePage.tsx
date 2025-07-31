import { useState } from "react";

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
import Header from "../../../components/admin/Header";
import { createGalleryDecoration } from "../../../services/galleryService";
import { tokens } from "../../../theme";
import api from "../../../services/api";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useNavigate } from "react-router-dom";

export default function GalleryCreatePage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImageToBE = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "gallery"); // pakai folder 'gallery' sesuai BE

    const res = await api.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.url; // API upload di BE balikin url di field 'url'
  };

  const handleSubmit = async () => {
    if (!title || !imageFile) {
      toast.error("Judul dan gambar wajib diisi!");
      return;
    }

    try {
      setLoading(true);

      // Upload gambar ke BE dulu
      const uploadedImageUrl = await uploadImageToBE(imageFile);

      console.log("✅ Uploaded image URL:", uploadedImageUrl);

      // Kirim data ke API gallery pakai URL dari BE
      await createGalleryDecoration({
        title,
        image: uploadedImageUrl,
      });

      navigate("/admin/galleries", {
        state: {
          message: "Gallery berhasil ditambahkan!",
          type: "success",
        },
      });
    } catch {
      // console.error("❌ Gagal menambahkan gallery:", error);
      toast.error("Gagal menambahkan gallery.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Add Gallery" subtitle="Upload a new gallery image" />

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
            Tambah Gallery
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
                  "Save"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
