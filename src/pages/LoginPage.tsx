import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await loginUser(email, password);
      const token = result.data.token;
      const role = result.data.role;

      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const msg = error.response?.data?.message || error.message;
      toast.error("Login failed:" + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <img
        src="/assets/hero.png"
        alt="Hero"
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
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
            <h1 className="text-white text-3xl font-bold">Sign In</h1>

            <div className="space-y-4">
              {/* Field Email */}
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

              {/* Field Password */}
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
                className="w-full bg-gradient-to-r from-zinc-50 to-gray-400 hover:from-zinc-200 hover:to-gray-700 py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg mt-4 text-black font-semibold"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <span className="text-blue-200">Don't have an account? </span>
              <Link to="/register">
                <button className="text-white font-semibold hover:text-blue-200 transition-colors">
                  Sign up
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
