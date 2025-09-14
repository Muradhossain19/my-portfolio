//src/app/(admin)/login/page.tsx

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { motion, Variants } from "framer-motion";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield,
} from "react-icons/fa";

export const metadata = {
  robots: "noindex, nofollow",
};

const AdminLoginPage = () => {
  const { login, user, loading } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-image.webp')",
        }}
      >
        <div className="absolute inset-0 bg-[#ECF0F3]/90 backdrop-blur-sm"></div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF004F]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FF004F]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#FF004F]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-36 h-36 bg-[#FF004F]/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Login Card */}
          <motion.div
            className="bg-[#ECF0F3]/20 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-[20px_20px_40px_rgba(209,217,230,0.8),-20px_-20px_40px_rgba(255,255,255,0.5)] border border-white/20"
            variants={itemVariants}
          >
            {/* Header */}
            <motion.div className="text-center mb-8" variants={itemVariants}>
              <div className="w-20 h-20 bg-[#ECF0F3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[inset_8px_8px_16px_#d1d9e6,inset_-8px_-8px_16px_#ffffff]">
                <FaUserShield className="w-8 h-8 text-[#FF004F]" />
              </div>
              <h1 className="text-3xl font-bold text-[#1f2125] mb-2">
                Admin Portal
              </h1>
              <p className="text-[#3c3e41] font-light">
                Sign in to access your dashboard
              </p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl text-red-700 text-sm font-medium"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {error}
              </motion.div>
            )}

            {/* Login Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={itemVariants}
            >
              {/* Email Field */}
              <div>
                <label className="block text-[#1f2125] font-semibold mb-3 text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-4 bg-[#ECF0F3]/50 backdrop-blur-sm rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]"
                    required
                    autoFocus
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41]/70 w-4 h-4" />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[#1f2125] font-semibold mb-3 text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-4 bg-[#ECF0F3]/50 backdrop-blur-sm rounded-xl border-none outline-none shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)] text-[#1f2125] placeholder-[#3c3e41]/70 font-light transition-all duration-300 focus:shadow-[inset_8px_8px_16px_rgba(209,217,230,0.8),inset_-8px_-8px_16px_rgba(255,255,255,0.8)]"
                    required
                  />
                  <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41]/70 w-4 h-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#3c3e41]/70 hover:text-[#FF004F] transition-colors duration-300"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4" />
                    ) : (
                      <FaEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-8 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
                  loading
                    ? "bg-[#3c3e41] cursor-not-allowed"
                    : "bg-[#FF004F] hover:bg-[#e6003d] shadow-[5px_5px_15px_rgba(209,217,230,0.8),-5px_-5px_15px_rgba(255,255,255,0.5)] hover:shadow-[8px_8px_20px_rgba(209,217,230,0.8),-8px_-8px_20px_rgba(255,255,255,0.5)] active:shadow-[inset_5px_5px_10px_rgba(209,217,230,0.8),inset_-5px_-5px_10px_rgba(255,255,255,0.8)]"
                }`}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FaUserShield className="w-4 h-4" />
                    Sign In to Dashboard
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Footer */}
            <motion.div className="mt-8 text-center" variants={itemVariants}>
              <p className="text-[#3c3e41]/70 text-sm">
                Secured by advanced encryption
              </p>
            </motion.div>
          </motion.div>

          {/* Additional Security Notice */}
          <motion.div className="mt-6 text-center" variants={itemVariants}>
            <p className="text-[#3c3e41]/60 text-xs leading-relaxed">
              This is a secure admin area. All login attempts are monitored and
              logged.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
