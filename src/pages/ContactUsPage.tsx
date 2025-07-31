import { BsInstagram, BsPhone, BsTiktok } from "react-icons/bs";
import ContactForm from "../components/ContactForm";
import Navbar from "../components/Navbar";
import { MdEmail } from "react-icons/md";
import { Link } from "react-router-dom";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex flex-col font-serif text-[#9B7745] bg-[#FAF1E9]">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow px-6 md:px-20 py-16 mt-10">
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl">
          <h1 className="text-4xl font-semibold mb-6 text-center">
            Contact Us
          </h1>
          <p className="text-gray-600 text-center mb-10">
            Reach out to us for inquiries, bookings, or just to say hello. We’re
            here to help make your special moments unforgettable.
          </p>
          <ContactForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white rounded-t-[6rem] px-10 pt-20 pb-10">
        <div className="flex flex-wrap justify-between gap-10 max-w-7xl mx-auto">
          {/* Logo */}
          <img src="assets/logo.svg" alt="Logo" draggable={false} />

          {/* Contact */}
          <div className="text-sm text-gray-800">
            <h4 className="font-semibold uppercase mb-3 text-gray-900">
              Contact
            </h4>
            <ul className="space-y-1">
              <a target="_blank" href="https://wa.me/6281617775709">
                <li className="flex items-center gap-2">
                  <span>
                    <BsPhone />
                  </span>{" "}
                  +62 816-1777-5709
                </li>
              </a>
              <a target="_blank" href="https://instagram.com/chizdecor">
                <li className="flex items-center gap-2">
                  <span>
                    <BsInstagram />
                  </span>{" "}
                  @chizdecor
                </li>
              </a>
              <a target="_blank" href="mailto:chizdecor@gmail.com">
                <li className="flex items-center gap-2">
                  <span>
                    <MdEmail />
                  </span>{" "}
                  chizdecor@gmail.com
                </li>
              </a>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center mt-16 text-sm text-gray-600">
          <div className="flex justify-center gap-6 text-xl mb-2">
            <a target="_blank" href="https://instagram.com/chizdecor">
              <span>
                <BsInstagram />
              </span>
            </a>
            <a target="_blank" href="https://tiktok.com/@chizdecor">
              <span>
                <BsTiktok />
              </span>
            </a>
          </div>
          <p>FOLLOW US</p>
          <p className="mt-2">
            © 2025 | <Link to="/about">About Us</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
