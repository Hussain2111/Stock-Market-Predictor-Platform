import React, { useState } from "react";
import { X, TrendingUp, Shield, User } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "./authService";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;

      if (isLogin) {
        // Use authService for login
        result = await authService.login(formData.email, formData.password);
      } else {
        // Use authService for registration
        result = await authService.register(
          formData.fullName,
          formData.email,
          formData.password
        );
      }

      if (result.success) {
        // Save user token to local storage for persistent login
        localStorage.setItem("authToken", result.token || "");
        localStorage.setItem("userId", result.userId || "");

        // Close the modal and refresh the page
        onClose();
        window.location.reload();
      } else {
        setError(result.error || result.message || "Authentication failed");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setError("An error occurred during authentication");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="bg-gradient-to-b from-[#111827] to-[#0c111b] rounded-xl w-full max-w-md relative overflow-hidden">
        {/* Visual accent - green line at top */}
        <div className="h-1 bg-emerald-500 w-full"></div>

        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center mb-6">
            {isLogin ? (
              <User className="w-6 h-6 text-emerald-500 mr-3" />
            ) : (
              <Shield className="w-6 h-6 text-emerald-500 mr-3" />
            )}
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none text-white"
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none text-white"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none text-white"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  {isLogin ? "Login" : "Create Account"}
                  <TrendingUp className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-sm text-white hover:text-emerald-400 transition-colors"
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Login"}
          </button>

          {/* Added benefits text */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-400">
              {isLogin
                ? "Login to access your personalized stock analysis dashboard, portfolio, and watchlist."
                : ""}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
