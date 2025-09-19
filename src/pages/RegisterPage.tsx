import { Eye, EyeOff, Mail, Lock, Phone, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const navigate = useNavigate();

  const isValidPhone = (input: string): boolean => {
    const regex = /^\+(\d{1,3})?\d{8,}$/;
    return regex.test(input);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedPhone = phone.startsWith("+") ? phone : "+" + phone;

    if (!isValidPhone(formattedPhone)) {
      setLoading(false);
      setShowErrorModal(true);
      return;
    }

    try {
      await registerUser(name, email, formattedPhone, password);
      setSuccessMessage("Registrasi berhasil! Silakan login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      error.response?.data?.message || error.message;
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <img
        src={`${import.meta.env.BASE_URL}assets/hero.png`}
        alt="Hero"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <form onSubmit={handleRegister} className="w-full max-w-md text-center space-y-6">
          <img
            src={`${import.meta.env.BASE_URL}assets/logo_2.svg`}
            alt="Logo"
            draggable={false}
            className="mx-auto h-12"
          />

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-2xl">
            <h1 className="text-white text-3xl font-bold">Sign Up</h1>
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-4 rounded relative mb-4 animate-fade-in-down">
                {successMessage}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-left text-white text-lg font-medium">
                  Name
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 h-5 w-5" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-md"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-left text-white text-lg font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 h-5 w-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-md"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="block text-left text-white text-lg font-medium">
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 h-5 w-5" />
                  <input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-md"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-left text-white text-lg font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200 h-5 w-5" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-md"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-zinc-50 to-gray-400 hover:from-zinc-200 hover:to-gray-700 py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg mt-4"
              >
                <span className="flex items-center justify-center space-x-2 text-black font-semibold">
                  <span>{loading ? "Processing..." : "Sign Up"}</span>
                </span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <span className="text-blue-200">Already have an account? </span>
              <Link to="/login" className="text-white font-semibold hover:text-blue-200 transition-colors">
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </div>

      {showErrorModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowErrorModal(false)} />
          <div
            role="dialog"
            aria-modal="true"
            className="relative bg-white/10 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl w-full max-w-sm mx-4 p-6 text-center"
          >
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute right-3 top-3 text-white/80 hover:text-white transition-colors"
              aria-label="Tutup"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/20 border border-white/30">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-white text-2xl font-semibold">Registrasi Gagal</h2>
            <p className="text-blue-100 mt-2">Data yang didaftarkan sudah pernah digunakan.</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-6 w-full bg-gradient-to-r from-zinc-50 to-gray-400 hover:from-zinc-200 hover:to-gray-700 py-3 px-4 rounded-lg transition-all duration-200 text-black font-semibold"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
