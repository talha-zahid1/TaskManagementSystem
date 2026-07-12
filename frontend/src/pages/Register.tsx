import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import { Layers, Mail, Lock, User, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validations
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/register/", {
        username,
        email,
        password,
      });

      const data = response.data;

      // Defensive Parsing: check for tokens first
      if (data && data.tokens) {
        login(data.tokens.access, data.tokens.refresh, username.trim());
        toast.success("Registered Successfully");
        navigate("/dashboard");
        return;
      }

      if (data && data.status === false) {
        const errorMsg = data.message || data["message "] || "Registration failed";
        toast.error(errorMsg);
        return;
      }

      if (data && data.status === undefined) {
        // Field error object
        setErrors(data);
        toast.error("Validation failed");
        return;
      }
      
      toast.error("Failed to complete registration");
    } catch (error: any) {
      console.error("Register error details:", error);
      const data = error.response?.data;

      // Defensive Check: If tokens is present regardless of HTTP status
      if (data && data.tokens) {
        login(data.tokens.access, data.tokens.refresh, username.trim());
        toast.success("Registered Successfully");
        navigate("/dashboard");
        return;
      }

      if (data) {
        if (data.status === false) {
          const errorMsg = data.message || data["message "] || "Registration failed";
          toast.error(errorMsg);
        } else if (data.status === undefined) {
          // Field validation error object
          setErrors(data);
          toast.error("Please fix the validation errors");
        } else {
          toast.error("An error occurred during registration");
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-[#0b0f19]">
      <div className="w-full max-w-md animate-slide-up">
        {/* Brand Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-3">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            Create account
          </h2>
          <p className="mt-2 text-zinc-400 text-sm">
            Get started with TaskFlow team planner
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className={`w-full pl-10 pr-4 py-2.5 bg-zinc-900 border ${
                    errors.username ? "border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-indigo-500"
                  } rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all`}
                  disabled={loading}
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">
                  {errors.username.join(", ")}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-zinc-900 border ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-indigo-500"
                  } rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all`}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">
                  {errors.email.join(", ")}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={`w-full pl-10 pr-4 py-2.5 bg-zinc-900 border ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-indigo-500"
                  } rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all`}
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">
                  {errors.password.join(", ")}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-500" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 focus:border-indigo-500 rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-900 text-center">
            <p className="text-zinc-400 text-xs">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
