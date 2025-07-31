import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GalleryOutlinedIcon from "@mui/icons-material/BrowseGalleryOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PackageOutlineIcon from "@mui/icons-material/AccountBoxOutlined";
import ProfileAdmin from "../../assets/person.png";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ProjectDecorationIcon from "@mui/icons-material/DesignServicesOutlined";

export default function SidebarLayout() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { title: "Dashboard", to: "/admin", icon: <HomeOutlinedIcon /> },
    { title: "Gallery", to: "/admin/galleries", icon: <GalleryOutlinedIcon /> },
    { title: "Bookings", to: "/admin/bookings", icon: <ReceiptOutlinedIcon /> },
    { title: "Packages", to: "/admin/packages", icon: <PackageOutlineIcon /> },
    {
      title: "Project Decorations",
      to: "/admin/project-decorations",
      icon: <ProjectDecorationIcon />,
    },
  ];

  return (
    <Box
      sx={{
        "& .pro-sidebar": {
          background: `${theme.palette.background.default} !important`,
        },
        "& .pro-sidebar-inner": {
          background: "transparent !important",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <Sidebar
        collapsed={isCollapsed}
        style={{ height: "100vh" }}
        backgroundColor={theme.palette.background.default}
      >
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* User Info */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-admin"
                  width="80px"
                  height="80px"
                  src={ProfileAdmin}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Admin
                </Typography>
              </Box>
            </Box>
          )}

          {/* Menu Items */}
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {menuItems.map((item) => (
              <MenuItem
                key={item.title}
                active={currentPath === item.to}
                icon={item.icon}
                style={{ color: colors.grey[100] }}
                component={<Link to={item.to} />}
              >
                <Typography>{item.title}</Typography>
              </MenuItem>
            ))}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
}
