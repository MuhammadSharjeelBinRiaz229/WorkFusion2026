"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Invalid credentials");
      }

      // Save tokens & profile in localStorage
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      // Redirect depending on Role
      const role = result.data.user.role;
      if (role === "Admin") {
        router.push("/dashboard/admin");
      } else if (role === "Employer") {
        router.push("/dashboard/employer");
      } else {
        router.push("/dashboard/seeker");
      }
    } catch (err) {
      setError(err.message || "Failed to establish server connection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center relative overflow-hidden px-4">
      {/* Glow effect */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-900/10 blur-[120px] -z-10" />

      <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-2xl relative z-10 border border-white/10 shadow-2xl">
        
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-lg font-sans">
              W
            </div>
            <span className="font-extrabold text-xl font-sans">
              Work<span className="text-blue-500 font-medium">Fusion</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h2>
          <p className="text-sm text-zinc-400">Log in to manage your professional matches</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm mb-6">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm placeholder:text-zinc-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">Password</label>
              <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm placeholder:text-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 glow-btn"
          >
            {loading ? "Authenticating..." : "Sign In"} <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center mt-8 pt-6 border-t border-white/5">
          <p className="text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
