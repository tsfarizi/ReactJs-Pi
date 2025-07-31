import { Routes, Route, Outlet } from "react-router-dom";

// Pages (Frontend)
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import GalleryPage from "./pages/GalleryPage";
import TipsPage from "./pages/TipsPage";
import ContactUsPage from "./pages/ContactUsPage";
import TipsDetailPage from "./pages/TipsDetailPage";
import DetailProjectDecoration from "./pages/DetailProjectDecoration";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DecorationList from "./pages/decoration/DecorationList";
import DecorationDetailPage from "./pages/decoration/DetailPackagePage";

// Booking Pages (Protected)
import BookingPage from "./pages/bookings/BookingPage";
import BookNowPage from "./pages/bookings/BookNowPage";
import InvoicePage from "./pages/InvoicePage";

// Admin Layout and Pages
import AdminLayout from "./components/admin/Layout";
import AdminDashboardPage from "./pages/admin/DasboardPage";

// Guards
import AuthGuard from "./components/AuthGuard";
import GalleryPageAdmin from "./pages/admin/GalleryPageAdmin";
import BookingPageAdmin from "./pages/admin/BookingPageAdmin";
import PackagePageAdmin from "./pages/admin/PackagePageAdmin";
import PackageEditPage from "./pages/admin/package/PackageEditPage";
import GalleryCreatePage from "./pages/admin/gallery/GalleryCreatePage";
import PackageCreatePage from "./pages/admin/package/PackageCreatePage";
import GalleryEditPage from "./pages/admin/gallery/GalleryEditPage";
import ProjectDecorationPageAdmin from "./pages/admin/ProjectDecorationPageAdmin";
import ProjectCreatePage from "./pages/admin/project/ProjectCreatePage";
import ProjectEditPage from "./pages/admin/project/ProjectEditPage";
import BookingDetailAdmin from "./pages/admin/BookingDetailAdmin";

function App() {
  return (
    <Routes>
      {/* Frontend Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route
        path="/project-decorations/:id"
        element={<DetailProjectDecoration />}
      />
      <Route path="/tips" element={<TipsPage />} />
      <Route path="/tips/:id" element={<TipsDetailPage />} />
      <Route path="/contact" element={<ContactUsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/decorations" element={<DecorationList />} />
      <Route path="/decorations/:id" element={<DecorationDetailPage />} />

      {/* Protected Routes */}
      <Route
        element={
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        }
      >
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/book-now/:id" element={<BookNowPage />} />
        <Route path="/invoice/:id" element={<InvoicePage />} />
      </Route>

      {/* Admin Routes (Protected with AuthGuard if needed) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        {/* Packages */}
        <Route path="packages" element={<PackagePageAdmin />} />
        <Route path="packages/add" element={<PackageCreatePage />} />
        <Route path="packages/:id/edit" element={<PackageEditPage />} />
        {/* Gallery */}
        <Route path="galleries" element={<GalleryPageAdmin />} />
        <Route path="galleries/add" element={<GalleryCreatePage />} />
        <Route path="galleries/:id/edit" element={<GalleryEditPage />} />

        {/* ProjectDecoraiton */}
        <Route
          path="project-decorations"
          element={<ProjectDecorationPageAdmin />}
        />
        <Route path="project-decorations/add" element={<ProjectCreatePage />} />
        <Route
          path="project-decorations/:id/edit"
          element={<ProjectEditPage />}
        />
        <Route path="bookings" element={<BookingPageAdmin />} />
        <Route path="bookings/:id" element={<BookingDetailAdmin />} />
      </Route>
    </Routes>
  );
}

export default App;
