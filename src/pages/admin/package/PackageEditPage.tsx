import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  useTheme,
  CircularProgress,
  Fade,
  Paper,
  Typography,
} from "@mui/material";

import { toast } from "react-toastify";
import Header from "../../../components/admin/Header";
import type { DecorationDetail } from "../../../models/model";
import {
  getDecorationById,
  updateDecoration,
} from "../../../services/decorationService";
import { tokens } from "../../../theme";

export default function PackageEditPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [decoration, setDecoration] = useState<DecorationDetail | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const res = await getDecorationById(id);
        setDecoration(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setBasePrice(res.data.base_price);
        setCategory(res.data.category);
      } catch {
        // console.error("❌ Gagal mengambil data dekorasi:", error);
        toast.error("Gagal mengambil data dekorasi.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!title || !description || !basePrice || !category) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      await updateDecoration(id!, {
        title,
        description,
        base_price: Number(basePrice),
        category,
      });
      navigate("/admin/packages", {
        state: {
          message: "Paket dekorasi berhasil diperbarui!",
          type: "success",
        },
      });
    } catch (error) {
      console.error("❌ Gagal memperbarui paket:", error);
      toast.error("Gagal memperbarui paket dekorasi.");
    } finally {
      setLoading(false);
    }
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

  if (!decoration) {
    return (
      <Box m="20px">
        <p>Data tidak ditemukan.</p>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header
        title="Edit Package"
        subtitle={`Editing package: ${decoration.title}`}
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
            Edit Paket Dekorasi
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

            <TextField
              label="Base Price (Rp)"
              variant="filled"
              fullWidth
              type="number"
              value={basePrice}
              onChange={(e) =>
                setBasePrice(e.target.value ? parseInt(e.target.value) : "")
              }
              required
              InputProps={{
                style: { background: colors.primary[400], borderRadius: 8 },
              }}
            />

            <TextField
              select
              label="Category"
              variant="filled"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              sx={{
                "& .MuiFilledInput-root": {
                  background: colors.primary[400],
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="wedding">Wedding</MenuItem>
              <MenuItem value="engagement">Engagement</MenuItem>
            </TextField>

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
                {loading ? "Saving..." : "Update"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
