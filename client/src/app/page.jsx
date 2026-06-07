"use client";

import Link from "next/link";
import { Briefcase, MapPin, Sparkles, ShieldCheck, ArrowRight, UserPlus, LogIn, Code, Wrench, GraduationCap, Camera } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[150px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/10 blur-[120px] -z-10" />

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xl font-sans tracking-tighter">
            W
          </div>
          <span className="font-extrabold text-2xl tracking-tight font-sans">
            Work<span className="text-blue-500 font-medium font-sans">Fusion</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 hover:text-blue-400 transition-colors flex items-center gap-1.5 font-medium text-sm">
            <LogIn size={16} /> Login
          </Link>
          <Link href="/register" className="px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-1.5 glow-btn">
            <UserPlus size={16} /> Register <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Sparkle Tag */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-semibold mb-8 backdrop-blur-md">
          <Sparkles size={14} className="text-yellow-400 animate-pulse" />
          <span>Pakistan's Premier Hybrid Job Marketplace</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl leading-[1.1]">
          One Platform For <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">Every Professional Skill</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-12 font-light leading-relaxed">
          Unifying online freelancing and localized physical services in one AI-powered workspace. Get matched instantly with explainable intelligent matching scores.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group">
            Get Started As Candidate <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2">
            Hire Skills
          </Link>
        </div>

        {/* Platform Grid */}
        <div className="w-full grid md:grid-cols-2 gap-8 mt-10">
          
          {/* Card 1: Remote Freelancing */}
          <div className="glass-card p-10 rounded-2xl text-left flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center mb-6 border border-blue-500/15">
                <Code size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Digital Freelancing</h3>
              <p className="text-zinc-400 mb-6 font-light leading-relaxed">
                Connect with developers, copywriters, UI designers, and marketers across Pakistan. Work remotely and submit milestones with built-in review gates.
              </p>
            </div>
            <div className="flex items-center gap-2 text-blue-400 font-medium group-hover:gap-3 transition-all text-sm mt-4">
              Explore digital jobs <ArrowRight size={16} />
            </div>
          </div>

          {/* Card 2: Local Services */}
          <div className="glass-card p-10 rounded-2xl text-left flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 border border-amber-500/15">
                <Wrench size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4">On-Site Services</h3>
              <p className="text-zinc-400 mb-6 font-light leading-relaxed">
                Hire local AC technicians, plumbers, electricians, mechanics, and tutors. Filter candidates based on physical proximity and local reviews.
              </p>
            </div>
            <div className="flex items-center gap-2 text-amber-400 font-medium group-hover:gap-3 transition-all text-sm mt-4">
              Explore local gigs <ArrowRight size={16} />
            </div>
          </div>

        </div>

        {/* Feature Highlights */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 border-t border-white/5 pt-16">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-blue-400 mb-3 border border-white/5">
              <Sparkles size={18} />
            </div>
            <h4 className="font-bold text-base mb-1">Explainable AI</h4>
            <p className="text-xs text-zinc-500">Know exactly why you match</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-blue-400 mb-3 border border-white/5">
              <ShieldCheck size={18} />
            </div>
            <h4 className="font-bold text-base mb-1">Secure Interlocks</h4>
            <p className="text-xs text-zinc-500">Chats locked till Interview stage</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-blue-400 mb-3 border border-white/5">
              <MapPin size={18} />
            </div>
            <h4 className="font-bold text-base mb-1">Twin-City Support</h4>
            <p className="text-xs text-zinc-500">Islamabad & Rawalpindi commutes</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-blue-400 mb-3 border border-white/5">
              <Briefcase size={18} />
            </div>
            <h4 className="font-bold text-base mb-1">Zero Placeholders</h4>
            <p className="text-xs text-zinc-500">Production-grade marketplace</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-10 text-center text-zinc-600 text-sm relative z-10 bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-bold text-xs">
              W
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-300">
              WorkFusion
            </span>
          </div>
          <span>&copy; 2026 WorkFusion Pakistan. Engineered for Excellence.</span>
          <div className="flex gap-6 text-zinc-400">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
