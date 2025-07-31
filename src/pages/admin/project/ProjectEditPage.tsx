import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  useTheme,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
  Fade,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../components/admin/Header";
import { getAllDecorations } from "../../../services/decorationService";
import {
  getProjectDecorationById,
  updateProjectDecoration,
} from "../../../services/projectDecorationService";
import { tokens } from "../../../theme";
import api from "../../../services/api";
import type { Decoration } from "../../../models/model";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function ProjectEditPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { id } = useParams(); // Ambil ID project dari URL

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [decorationId, setDecorationId] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [decorations, setDecorations] = useState<Decoration[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [decorationsRes, projectRes] = await Promise.all([
          getAllDecorations(),
          getProjectDecorationById(id!),
        ]);
        setDecorations(decorationsRes.data);

        const project = projectRes.data;
        setTitle(project.title);
        setDescription(project.description);
        setDecorationId(project.decoration_id);

        if (project.images && project.images.length > 0) {
          // Mapping ke array URL absolut
          const mappedUrls = project.images.map(
            (img: string | { url: string }) => {
              const imageUrl = typeof img === "string" ? img : img.url; // jika array of object pakai .url, kalau array of string pakai img langsung
              return imageUrl.startsWith("http")
                ? imageUrl
                : `${process.env.REACT_APP_API_URL}${imageUrl}`;
            }
          );
          setImagePreviews(mappedUrls);
        }
      } catch (error) {
        console.error("❌ Failed to fetch data:", error);
        toast.error("Gagal memuat data project decoration.");
      }
    };
    fetchData();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const uploadImageToBE = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    const res = await api.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.url;
  };

  const handleUpdate = async () => {
    if (!title || !description || !decorationId) {
      toast.error("Title, description, dan dekorasi wajib diisi!");
      return;
    }

    try {
      setLoading(true);

      // Update data text ke BE
      await updateProjectDecoration(id!, { title, description });
      console.log("✅ Updated project text:", id);

      // Jika ada gambar baru, upload ke /uploads lalu attach ke project
      if (imageFiles.length > 0) {
        const selectedDecoration = decorations.find(
          (decoration) => decoration.id === decorationId
        );
        if (!selectedDecoration) throw new Error("Dekorasi tidak ditemukan.");

        let folderName = selectedDecoration.category || "default";
        folderName = folderName
          .trim()
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_-]/g, "");
        if (folderName.toLowerCase() === "engagement")
          folderName = "Engagement";
        else if (folderName.toLowerCase() === "wedding") folderName = "Wedding";
        else if (!["users", "gallery"].includes(folderName))
          folderName = "general";

        const uploadedUrls: string[] = [];
        for (const file of imageFiles) {
          const url = await uploadImageToBE(file, folderName);
          uploadedUrls.push(url);
        }

        await api.post(`/admin/project-decorations/${id}/images`, {
          images: uploadedUrls,
        });
      }

      navigate("/admin/project-decorations", {
        state: {
          message: "Project decoration berhasil diupdate!",
          type: "success",
        },
      });
    } catch (error) {
      console.error("❌ Gagal mengupdate project decoration:", error);
      toast.error("Gagal mengupdate project decoration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header
        title="Edit Project Decoration"
        subtitle="Update existing project decoration"
      />

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
            Edit Project Decoration
          </Typography>

          <Box
            display="flex"
            flexDirection="column"
            gap="24px"
            component="form"
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
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

            <TextField
              label="Description"
              variant="filled"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              InputProps={{
                style: { background: colors.primary[400], borderRadius: 8 },
              }}
            />

            <FormControl fullWidth required variant="filled">
              <InputLabel
                id="decoration-select-label"
                sx={{ background: colors.primary[400], px: 1 }}
              >
                Decoration
              </InputLabel>
              <Select
                labelId="decoration-select-label"
                value={decorationId}
                label="Decoration"
                onChange={(e) => setDecorationId(e.target.value)}
                sx={{
                  background: colors.primary[400],
                  borderRadius: 2,
                }}
              >
                {decorations.map((decoration) => (
                  <MenuItem key={decoration.id} value={decoration.id}>
                    {decoration.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                {imageFiles || imagePreviews ? "Ganti Gambar" : "Upload Gambar"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
              </Button>

              {imagePreviews.length > 0 && (
                <Box display="flex" gap={1} flexWrap="wrap">
                  {imagePreviews.map((src, idx) => (
                    <Avatar
                      key={idx}
                      src={src}
                      alt={`Preview ${idx}`}
                      variant="rounded"
                      sx={{
                        width: 64,
                        height: 64,
                        boxShadow: 2,
                        border: `2px solid ${colors.blueAccent[400]}`,
                      }}
                    />
                  ))}
                </Box>
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
                onClick={handleUpdate}
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
