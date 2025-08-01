import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import BotChat from "./BotChat";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary h-16 flex items-center px-10">
      <div className="flex justify-between w-full">
        <img
          src={`${import.meta.env.BASE_URL}assets/logo.svg`}
          className="h-12"
          alt="Logo"
        />
        <button
          className="md:hidden text-secondary focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Icon hamburger */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <ul className="hidden md:flex items-center gap-5 text-secondary font-bold">
          <li>
            <Link
              className="hover:bg-secondary hover:text-primary p-2 py-1"
              to="/"
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              className="hover:bg-secondary hover:text-primary p-2 py-1"
              to="/decorations"
            >
              Package
            </Link>
          </li>
          <li>
            <Link
              className="hover:bg-secondary hover:text-primary p-2 py-1"
              to="/booking"
            >
              Booking
            </Link>
          </li>
          {/* <li>
            <Link
              className="hover:bg-secondary hover:text-primary p-2 py-1"
              to="/tips"
            >
              Tips
            </Link>
          </li> */}
          <li>
            <Link
              className="hover:bg-secondary hover:text-primary p-2 py-1"
              to="/contact"
            >
              Contact Us
            </Link>
          </li>
          <li>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-blue-600 hover:text-blue-800">
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
      {/* Menu mobile */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-primary text-secondary font-bold">
          <ul className="flex flex-col items-center gap-5 py-4">
            <li>
              <Link
                className="hover:bg-secondary hover:text-primary p-2 py-1"
                to="/"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                className="hover:bg-secondary hover:text-primary p-2 py-1"
                to="/decorations"
              >
                Package
              </Link>
            </li>
            <li>
              <Link
                className="hover:bg-secondary hover:text-primary p-2 py-1"
                to="/booking"
              >
                Booking
              </Link>
            </li>
            {/* <li>
              <Link
                className="hover:bg-secondary hover:text-primary p-2 py-1"
                to="/tips"
              >
                Tips
              </Link>
            </li> */}
            <li>
              <Link
                className="hover:bg-secondary hover:text-primary p-2 py-1"
                to="/contact"
              >
                Contact Us
              </Link>
            </li>
            <li>
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login" className="text-blue-600 hover:text-blue-800">
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}

      {/* <BotChat /> */}
    </nav>
  );
}
