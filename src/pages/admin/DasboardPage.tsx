import { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/admin/Header";
import EmailIcon from "@mui/icons-material/EventNote";
import PointOfSaleIcon from "@mui/icons-material/HomeMax";
import PersonAddIcon from "@mui/icons-material/PhotoLibrary";
import TrafficIcon from "@mui/icons-material/HomeWorkOutlined";
import { tokens } from "../../theme";
import StatBox from "../../components/admin/StatBox";
import { getAllBookings } from "../../services/bookingService";
import { getAllAdminDecorations } from "../../services/decorationService";
import { getAllGalleryDecorations } from "../../services/galleryService";
import { getAllProjectDecorations } from "../../services/projectDecorationService";

// Ganti import ini sesuai path service API kamu
// ubah ke path file API kamu

export default function AdminDashboardPage() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [bookingCount, setBookingCount] = useState<number | null>(null);
  const [decorationCount, setDecorationCount] = useState<number | null>(null);
  const [galleryCount, setGalleryCount] = useState<number | null>(null);
  const [projectCount, setProjectCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [bookings, decorations, galleries, projects] = await Promise.all([
          getAllBookings(),
          getAllAdminDecorations(),
          getAllGalleryDecorations(),
          getAllProjectDecorations(),
        ]);

        setBookingCount(bookings.data.length);
        setDecorationCount(decorations.data.length);
        setGalleryCount(galleries.data.length);
        setProjectCount(projects.data.length);
      } catch (error) {
        console.error("❌ Failed to fetch dashboard data:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Admin Dashboard"
          subtitle="Welcome to the admin dashboard!"
        />
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: colors.primary[400] }}
        >
          <StatBox
            title={
              bookingCount !== null ? bookingCount.toString() : "Loading..."
            }
            subtitle="Total Bookings"
            progress="0.75"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: colors.primary[400] }}
        >
          <StatBox
            title={
              decorationCount !== null
                ? decorationCount.toString()
                : "Loading..."
            }
            subtitle="Total Decorations"
            progress="0.50"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: colors.primary[400] }}
        >
          <StatBox
            title={
              galleryCount !== null ? galleryCount.toString() : "Loading..."
            }
            subtitle="Gallery Items"
            progress="0.30"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 3"
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: colors.primary[400] }}
        >
          <StatBox
            title={
              projectCount !== null ? projectCount.toString() : "Loading..."
            }
            subtitle="Project Decorations"
            progress="0.80"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
      </Box>
    </Box>
  );
}
