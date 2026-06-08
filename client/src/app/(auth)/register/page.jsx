"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, AlertCircle, ArrowRight } from "lucide-react";

const CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Faisalabad", "Peshawar", "Multan", "Sialkot"];

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Service Seeker");
  const [city, setCity] = useState("Islamabad");
  const [phone, setPhone] = useState("");
  const [cnic, setCnic] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate simple client-side device fingerprint
    const generateFingerprint = () => {
      const parts = [
        navigator.userAgent,
        navigator.language,
        window.screen.width + "x" + window.screen.height,
        window.screen.colorDepth,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || "unknown"
      ];
      const str = parts.join("###");
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(16);
    };
    setDeviceId(generateFingerprint());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const skills = skillsText
      ? skillsText.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
      : [];

    const payload = {
      fullName,
      email,
      password,
      role,
      city,
      phone,
      cnic,
      deviceId,
      skills,
    };

    try {
      const response = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create account");
      }

      // Save tokens & profile in localStorage
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      // Redirect depending on Role
      if (role === "Employer") {
        router.push("/dashboard/employer");
      } else {
        router.push("/dashboard/seeker");
      }
    } catch (err) {
      setError(err.message || "Failed to connect to authentication server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Glow background */}
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-900/10 blur-[130px] -z-10" />

      <div className="w-full max-w-lg glass-panel p-8 md:p-10 rounded-2xl relative z-10 border border-white/10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-lg font-sans">
              W
            </div>
            <span className="font-extrabold text-xl font-sans">
              Work<span className="text-blue-500 font-medium">Fusion</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Create Account</h2>
          <p className="text-sm text-zinc-400">Join Pakistan's leading hybrid marketplace</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm mb-6">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Muhammad Ali"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm placeholder:text-zinc-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ali@workfusion.com"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm placeholder:text-zinc-600"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">Phone Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92-300-1234567"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">CNIC (National Identity Card)</label>
            <input
              type="text"
              required
              value={cnic}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "");
                if (val.length > 13) val = val.slice(0, 13);
                let formatted = "";
                if (val.length > 0) {
                  formatted += val.slice(0, 5);
                }
                if (val.length > 5) {
                  formatted += "-" + val.slice(5, 12);
                }
                if (val.length > 12) {
                  formatted += "-" + val.slice(12, 13);
                }
                setCnic(formatted);
              }}
              placeholder="37405-1234567-1"
              className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm placeholder:text-zinc-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">User Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 focus:border-blue-500/50 outline-none text-sm"
              >
                <option value="Service Seeker">Service Seeker (Candidate)</option>
                <option value="Employer">Employer (Hiring Manager)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 focus:border-blue-500/50 outline-none text-sm"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {role === "Service Seeker" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">Your Skills (Comma Separated)</label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="React, Node.js, TypeScript, Figma"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all text-sm placeholder:text-zinc-600"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 glow-btn"
          >
            {loading ? "Registering..." : "Create Account"} <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-white/5">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Login here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
