import { Mail, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import { BsInstagram, BsTiktok } from "react-icons/bs";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-32 px-4">
          <div className="text-secondary text-3xl">About Us</div>
          <div className="max-w-3xl mx-auto text-lg text-gray-700">
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
        </div>
      </div>

      <div className="bg-secondary text-white py-10 px-6 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
          {/* Kontak Pojok Kiri */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Contacts</h2>
            <div className="flex items-center gap-2">
              <a
                className="flex gap-3"
                href="https://api.whatsapp.com/send/?phone=6281697779709"
                target="_blank"
              >
                <Phone className="w-5 h-5" />
                <span>+62 816-9777-9709</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                className="flex gap-3"
                href="https://www.instagram.com/chizdecor/"
                target="_blank"
              >
                <BsInstagram className="w-6 h-6" />
                <span>@chizdecor</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a className="flex gap-3" href="mailto:chizdecor@gmail.com">
                <Mail className="w-5 h-5" />
                <span>chizdecor@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Social Media + Copyright di Tengah Bawah */}
          <div className="text-center space-y-3">
            <p className="uppercase tracking-wide">Follow Us</p>
            <div className="flex justify-center gap-4">
              <a href="https://www.instagram.com/chizdecor/">
                <BsInstagram className="w-6 h-6" />
              </a>
              <a href="https://www.tiktok.com/@chizdecor" target="_blank">
                <BsTiktok className="w-6 h-6" />
              </a>
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
