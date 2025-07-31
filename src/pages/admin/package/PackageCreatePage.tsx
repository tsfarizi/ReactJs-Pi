import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  useTheme,
  Fade,
  Paper,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import Header from "../../../components/admin/Header";
import { tokens } from "../../../theme";
import { createDecoration } from "../../../services/decorationService";
import { useNavigate } from "react-router-dom";

export default function PackagePageAdmin() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title || !description || !basePrice || !category) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    const payload = {
      title,
      description,
      base_price: Number(basePrice),
      category,
    };

    try {
      setLoading(true);
      await createDecoration(payload);
      navigate("/admin/packages", {
        state: {
          message: "Paket dekorasi berhasil ditambahkan!",
          type: "success",
        },
      });
    } catch {
      // console.error("❌ Gagal menambahkan paket:", error);
      toast.error("Gagal menambahkan paket dekorasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Header title="Add Package" subtitle="Create a new decoration package" />

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
            Tambah Paket Dekorasi
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
                {loading ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
