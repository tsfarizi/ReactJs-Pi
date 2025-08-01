import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Mail, Phone } from "lucide-react";
import { BsInstagram, BsTiktok } from "react-icons/bs";
import GalleryScroll from "../components/GalleryScroll";
import ProjectDecorationGrid from "../components/ProjectDecorationGrid";

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen">
        <img
          src={`${import.meta.env.BASE_URL}assets/hero.png`}
          alt="Hero"
          draggable={false}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-4">
          <img src={`${import.meta.env.BASE_URL}assets/logo_2.svg`} alt="Logo" draggable={false} />
          <div className="text-white text-2xl font-semibold">
            Wujudkan Acara Wedding Impianmu!
          </div>
          <a
            href="#gallery-section"
            className="px-5 py-1 rounded-full bg-primary text-secondary font-bold"
          >
            EXPLORE
          </a>
        </div>

        {/* Social Media & Contact - Bottom Left */}
        <div className="absolute bottom-6 left-6 hidden sm:flex flex-col text-white space-y-2">
          <h2 className="text-xl font-semibold">Contacts</h2>
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/6281697779709"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3"
            >
              <Phone className="w-5 h-5" />
              <span>+62 816-9777-9709</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://instagram.com/chizdecor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3"
            >
              <BsInstagram className="w-5 h-5" />
              <span>@chizdecor</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <a href="mailto:chizdecor@gmail.com" className="flex gap-3">
              <Mail className="w-5 h-5" />
              <span>chizdecor@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Follow Us - Bottom Center */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center space-y-2 text-white">
          <p className="uppercase tracking-wide">Follow Us</p>
          <div className="flex justify-center gap-4">
            <a
              href="https://instagram.com/chizdecor"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsInstagram className="w-6 h-6" />
            </a>
            <a
              href="https://tiktok.com/@chizdecor"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsTiktok className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <main className="bg-white">
        {/* About Us Section */}
        <section className="flex flex-col items-center justify-center text-center space-y-4 py-32 px-4 max-w-5xl mx-auto">
          <div className="text-secondary text-3xl">About Us</div>
          <div className="text-lg text-gray-700">
            Weddings have proven to be a large and expansive creative industry
            in Indonesia, born from the idea that wedding preparations are among
            the most important moments in a person's life. With a mission to
            connect individuals who are ready to marry with their special day,
            Chiz Décor is here as a wedding decoration service provider, ready
            to help realize your special moments with beautiful and unique
            touches. Not only wedding decorations, Chiz Décor also offers
            decoration services for engagement events and traditional
            pre-wedding ceremonies such as pengajian and siraman, ensuring every
            precious moment feels even more memorable.
          </div>
        </section>
      </main>

      {/* Gallery Decoration Section */}
      <section className="py-24 bg-gray-50" id="gallery-section">
        <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-5xl mx-auto">
          <div className="text-secondary text-3xl">Gallery Decoration</div>
          <GalleryScroll />
        </div>
      </section>

      {/* Wedding Decoration Section */}
      <section className="py-24">
        <div className="flex flex-col items-center justify-center text-center space-y-10 max-w-5xl mx-auto">
          <div className="text-secondary text-3xl">Project Decoration</div>
          <ProjectDecorationGrid />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t">
        <p>
          © 2025 |{" "}
          <Link to="/about" className="hover:underline">
            About Us
          </Link>{" "}
          |{" "}
          <Link to="/contact" className="hover:underline">
            Contact Us
          </Link>
        </p>
      </footer>
    </>
  );
}
