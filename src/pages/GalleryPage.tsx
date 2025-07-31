import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import GalleryScroll from "../components/GalleryScroll";
import ProjectDecorationGrid from "../components/ProjectDecorationGrid";

export default function GalleryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow pt-24">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="text-secondary text-3xl">Gallery Decoration</div>
          <GalleryScroll />
        </div>
      </div>

      <div className="flex-grow">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center space-y-10">
          <div className="text-secondary text-3xl">Wedding Decoration</div>
          <ProjectDecorationGrid />
        </div>
      </div>

      <div className="flex-grow">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center space-y-10">
          <div className="text-secondary text-3xl">Engagement Decoration</div>
          <ProjectDecorationGrid />
        </div>
      </div>

      <div className="bg-secondary text-white py-10 px-6 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
          {/* Kontak Pojok Kiri */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Contacts</h2>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+62 816-9777-9709</span>
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5" />
              <span>@chizdecor</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>chizdecor@gmail.com</span>
            </div>
          </div>

          {/* Social Media + Copyright di Tengah Bawah */}
          <div className="text-center space-y-3">
            <p className="uppercase tracking-wide">Follow Us</p>
            <div className="flex justify-center gap-4">
              <Instagram className="w-6 h-6" />
              <MessageCircle className="w-6 h-6" />
            </div>
            <p className="text-sm text-gray-400">
              © 2025 |{" "}
              <a href="#" className="hover:underline">
                About Us
              </a>{" "}
              |{" "}
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
