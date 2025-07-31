import { Outlet } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import SidebarLayout from "./SidebarLayout";
import Topbar from "./Topbar";

import AuthGuard from "../AuthGuard";
import { ColorModeContext, useMode } from "../../theme";

export default function AdminLayout() {
  const [theme, colorMode] = useMode();

  return (
    <AuthGuard adminOnly>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="flex min-h-screen">
            <SidebarLayout />
            <main className="flex-1 bg-gray-100 dark:bg-gray-900">
              <Topbar />
              <div className="p-6">
                <Outlet />
              </div>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthGuard>
  );
}
