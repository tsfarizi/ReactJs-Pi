import { Eye, EyeOff, Mail, Lock, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
      toast.error("Nomor telepon tidak valid. Gunakan format +628123456789");
      setLoading(false);
      return;
    }

    try {
      await registerUser(name, email, formattedPhone, password);
      setSuccessMessage("Registrasi berhasil! Silakan login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000); // biarkan user baca pesan 2 detik
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || error.message;
      toast.error("Registrasi gagal: " + msg);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Hero Image */}
      <img
        src="/assets/hero.png"
        alt="Hero"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md text-center space-y-6"
        >
          {/* Logo */}
          <img
            src="/assets/logo_2.svg"
            alt="Logo"
            draggable={false}
            className="mx-auto h-12"
          />

          {/* Form Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/50 shadow-2xl">
            <h1 className="text-white text-3xl font-bold">Sign Up</h1>
            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-4 rounded relative mb-4 animate-fade-in-down">
                {successMessage}
              </div>
            )}

            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="block text-left text-white text-lg font-medium"
                >
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

              {/* Email Field */}
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-left text-white text-lg font-medium"
                >
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

              {/* Phone Field */}
              <div className="space-y-1">
                <label
                  htmlFor="phone"
                  className="block text-left text-white text-lg font-medium"
                >
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

              {/* Password Field */}
              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-left text-white text-lg font-medium"
                >
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
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
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

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <span className="text-blue-200">Already have an account? </span>
              <a
                href="/login"
                className="text-white font-semibold hover:text-blue-200 transition-colors"
              >
                Sign in
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
