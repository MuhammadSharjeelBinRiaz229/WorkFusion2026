"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Briefcase, MapPin, Sparkles, ShieldCheck, ArrowRight, UserPlus, LogIn, 
  Code, Wrench, Star, ArrowUpRight, Zap, CheckCircle2, Search, Cpu, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";

// Live Mock Data
const FEATURED_JOBS = [
  {
    id: "job-1",
    title: "Senior React Architect",
    company: "TechNova Solutions",
    category: "Digital",
    skills: ["React", "Next.js", "TypeScript", "TailwindCSS"],
    location: "Remote",
    budget: "PKR 180k - 250k / mo",
    rating: 4.9,
  },
  {
    id: "job-2",
    title: "AC Installation & Wiring Expert",
    company: "BlueCold HVAC",
    category: "Physical",
    skills: ["HVAC Repair", "Wiring", "Troubleshooting"],
    location: "Rawalpindi",
    budget: "PKR 15k - 25k / job",
    rating: 4.8,
  },
  {
    id: "job-3",
    title: "Lead Product Designer (UI/UX)",
    company: "CreativeLabs Studio",
    category: "Digital",
    skills: ["Figma", "Design Systems", "UX Research"],
    location: "Lahore",
    budget: "PKR 140k - 190k / mo",
    rating: 5.0,
  },
  {
    id: "job-4",
    title: "Expert Home Plumbing Technician",
    company: "QuickFix Maintenance",
    category: "Physical",
    skills: ["Piping", "Drainage", "Installation"],
    location: "Islamabad",
    budget: "PKR 8k - 15k / job",
    rating: 4.7,
  },
  {
    id: "job-5",
    title: "Python AI & ML Engineer",
    company: "AlphaAI Research",
    category: "Digital",
    skills: ["Python", "PyTorch", "NLP", "Scikit-Learn"],
    location: "Islamabad",
    budget: "PKR 220k - 300k / mo",
    rating: 4.9,
  }
];

const TOP_TALENTS = [
  {
    id: "talent-1",
    name: "Ahmed Ali",
    role: "Full Stack Engineer",
    category: "Digital",
    skills: ["React", "Node.js", "MongoDB", "Express.js"],
    location: "Islamabad",
    hourlyRate: "PKR 2,500/hr",
    completed: 42,
    rating: 5.0,
    avatar: "AA"
  },
  {
    id: "talent-2",
    name: "Sajid Khan",
    role: "Electrician & Technician",
    category: "Physical",
    skills: ["Wiring", "AC Maintenance", "Fault Auditing"],
    location: "Rawalpindi",
    hourlyRate: "PKR 1,200/hr",
    completed: 89,
    rating: 4.9,
    avatar: "SK"
  },
  {
    id: "talent-3",
    name: "Zainab Shah",
    role: "Lead Designer",
    category: "Digital",
    skills: ["Figma", "Interaction Design", "Wireframing"],
    location: "Lahore",
    hourlyRate: "PKR 2,200/hr",
    completed: 27,
    rating: 4.8,
    avatar: "ZS"
  },
  {
    id: "talent-4",
    name: "Kamran Mehmood",
    role: "Home Renovation Expert",
    category: "Physical",
    skills: ["Masonry", "Painting", "Piping Repair"],
    location: "Islamabad",
    hourlyRate: "PKR 1,500/hr",
    completed: 56,
    rating: 4.7,
    avatar: "KM"
  }
];

const PIPELINE_STEPS = [
  {
    title: "1. Post Listings",
    subtitle: "Define Skills & Location",
    desc: "Employers publish digital freelancing ads or local physical service requirements with explicit budget thresholds and target locations.",
    preview: {
      type: "form",
      title: "Job Requirements Form",
      badge: "Employer",
      details: [
        { label: "Role Title", value: "Senior Frontend Developer" },
        { label: "Category", value: "Digital Freelancing" },
        { label: "Skills", value: "React, TypeScript, TailwindCSS" },
        { label: "Work Type", value: "Remote / Islamabad" }
      ]
    }
  },
  {
    title: "2. Weighted Matching",
    subtitle: "AI Skill & Location scoring",
    desc: "Our Python recommendation backend scores profiles based on skills similarity and local commute radius, producing an explainable rating.",
    preview: {
      type: "match",
      title: "WorkFusion AI Match Score",
      badge: "AI Score: 96%",
      details: [
        { text: "Skills Match (React, TypeScript) (+60%)", status: "match" },
        { text: "Adjacent Commute (Rawalpindi) (+20%)", status: "match" },
        { text: "Feedback rating 4.9 (+16%)", status: "match" }
      ]
    }
  },
  {
    title: "3. Chat Interlock",
    subtitle: "Locked Messaging till Interview",
    desc: "To prevent spam and enforce structured hiring, direct messaging remains locked until the employer reviews the bid and triggers the interview state.",
    preview: {
      type: "chat",
      title: "Hiring Chat Interface",
      badge: "Interview Stage Only",
      details: [
        { sender: "System", text: "Applicant selected for Interview. Chat Enabled." },
        { sender: "Employer", text: "Hi! Loved your React portfolio. Are you free to call?" },
        { sender: "Seeker", text: "Hi! Yes, I can join a call today." }
      ]
    }
  },
  {
    title: "4. Escrow & Reviews",
    subtitle: "Verified Ratings Only",
    desc: "Reviews and ratings are strictly allowed only after contracts are successfully completed and marked resolved by the employer.",
    preview: {
      type: "review",
      title: "Verified Review Form",
      badge: "Completed Contracts Only",
      details: [
        { label: "Rating Stars", value: "⭐⭐⭐⭐⭐ (5.0)" },
        { label: "Client Comment", value: "Exceptional delivery! Highly recommended MERN developer." }
      ]
    }
  }
];

export default function LandingPage() {
  // Stats Counters
  const [stats, setStats] = useState({ freelancers: 0, jobs: 0, accuracy: 0, contracts: 0 });
  
  // Interactive Feed Filters
  const [feedType, setFeedType] = useState("jobs"); // jobs, talents
  const [categoryFilter, setCategoryFilter] = useState("All"); // All, Digital, Physical
  const [searchVal, setSearchVal] = useState("");

  // Process timeline active step
  const [activeStep, setActiveStep] = useState(0);

  // Animate stats counter on mount
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const intervalTime = duration / steps;
    let stepCount = 0;

    const interval = setInterval(() => {
      stepCount++;
      setStats({
        freelancers: Math.floor((12800 / steps) * stepCount),
        jobs: Math.floor((480 / steps) * stepCount),
        accuracy: Math.min(98, Math.floor((98.4 / steps) * stepCount)),
        contracts: Math.floor((6400 / steps) * stepCount),
      });

      if (stepCount >= steps) {
        setStats({
          freelancers: 12800,
          jobs: 480,
          accuracy: 98.4,
          contracts: 6400,
        });
        clearInterval(interval);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  // Filter logic
  const filteredJobs = FEATURED_JOBS.filter(job => {
    const matchesCat = categoryFilter === "All" || job.category === categoryFilter;
    const matchesSearch = searchVal === "" || 
      job.title.toLowerCase().includes(searchVal.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(searchVal.toLowerCase())) ||
      job.company.toLowerCase().includes(searchVal.toLowerCase()) ||
      job.location.toLowerCase().includes(searchVal.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredTalents = TOP_TALENTS.filter(talent => {
    const matchesCat = categoryFilter === "All" || talent.category === categoryFilter;
    const matchesSearch = searchVal === "" || 
      talent.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      talent.skills.some(s => s.toLowerCase().includes(searchVal.toLowerCase())) ||
      talent.role.toLowerCase().includes(searchVal.toLowerCase()) ||
      talent.location.toLowerCase().includes(searchVal.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* Background Floating Orbs */}
      <motion.div 
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 80, 0],
          scale: [1, 1.15, 0.9, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-15%] left-[-10%] w-[60%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[140px] -z-10" 
      />
      <motion.div 
        animate={{
          x: [0, -90, 50, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.85, 1.1, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/10 blur-[130px] -z-10" 
      />

      {/* Navigation Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-200 dark:border-white/5 relative z-10"
      >
        <div className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xl font-sans tracking-tighter"
          >
            W
          </motion.div>
          <span className="font-extrabold text-2xl tracking-tight font-sans">
            Work<span className="text-blue-500 font-medium font-sans">Fusion</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 font-medium text-sm">
            <LogIn size={16} /> Login
          </Link>
          <Link href="/register" className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-black font-semibold text-sm rounded-xl dark:hover:bg-zinc-200 transition-colors flex items-center gap-1.5 glow-btn">
            <UserPlus size={16} /> Register <ArrowRight size={14} />
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center justify-center text-center relative z-10">
        
        {/* Sparkle Tag */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 text-xs font-semibold mb-8 backdrop-blur-md shadow-sm"
        >
          <Sparkles size={14} className="text-blue-500 dark:text-blue-400 animate-pulse" />
          <span>Pakistan's Premier Hybrid Job Marketplace</span>
        </motion.div>

        {/* Main Title with Staggered Fade-in */}
        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-[1.1] font-sans"
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
            }}
            className="block text-zinc-800 dark:text-zinc-100 font-sans"
          >
            One Platform For
          </motion.span>
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
            }}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 drop-shadow-sm font-sans"
          >
            Every Professional Skill
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-8 font-light leading-relaxed"
        >
          Unifying online freelancing and localized physical services in one AI-powered workspace. Get matched instantly with explainable intelligent matching scores.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16 relative z-20"
        >
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group hover:scale-[1.03]">
            Get Started As Candidate <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-white font-bold rounded-xl border border-zinc-300 dark:border-white/10 transition-all flex items-center justify-center gap-2 hover:scale-[1.03]">
            Hire Skills
          </Link>
        </motion.div>

        {/* Dynamic Live Counters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-3xl bg-white/50 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-white/5 backdrop-blur-md shadow-lg mb-16"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-blue-500 font-sans">
              {stats.freelancers.toLocaleString()}+
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mt-1">Verified Talents</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-indigo-500 font-sans">
              {stats.jobs.toLocaleString()}+
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mt-1">Active Gigs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-violet-500 font-sans">
              {stats.accuracy}%
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mt-1">AI Recommendation Match Accuracy</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-black text-emerald-500 font-sans">
              {stats.contracts.toLocaleString()}+
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mt-1">Completed Contracts</span>
          </div>
        </motion.div>

        {/* ─── DYNAMIC SEARCH & EXPLORE FEED ─── */}
        <section className="w-full flex flex-col gap-8 mb-24 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black font-sans tracking-tight">Explore the Live Marketplace</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">See active physical and digital job listings updated in real time</p>
            </div>

            {/* Selector buttons */}
            <div className="flex bg-zinc-200/80 dark:bg-zinc-900 border border-zinc-300 dark:border-white/5 p-1 rounded-xl self-start">
              <button
                onClick={() => setFeedType("jobs")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  feedType === "jobs" ? "bg-white text-black dark:bg-zinc-800 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800"
                }`}
              >
                Featured Gigs
              </button>
              <button
                onClick={() => setFeedType("talents")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  feedType === "talents" ? "bg-white text-black dark:bg-zinc-800 dark:text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800"
                }`}
              >
                Top Rated Experts
              </button>
            </div>
          </div>

          {/* Search bar + Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 relative">
              <Search className="absolute left-4 top-3.5 text-zinc-400" size={18} />
              <input
                type="text"
                placeholder={feedType === "jobs" ? "Search jobs by title, skills, location (e.g. React, Rawalpindi)" : "Search talents by name, skills, role (e.g. Electrician, Figma)"}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            
            {/* Category selection */}
            <div className="md:col-span-4 flex gap-2">
              {["All", "Digital", "Physical"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl border transition-all ${
                    categoryFilter === cat 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/10"
                  }`}
                >
                  {cat === "All" ? "All Sectors" : cat === "Digital" ? "Digital (Remote)" : "Physical (On-site)"}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout of results with animations */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <AnimatePresence mode="popLayout">
              {feedType === "jobs" ? (
                filteredJobs.length === 0 ? (
                  <motion.div key="no-jobs" layout className="col-span-full py-12 text-center text-zinc-500">No gigs matched your search criteria.</motion.div>
                ) : (
                  filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card p-6 rounded-2xl flex flex-col justify-between h-64 border border-zinc-200/60 dark:border-white/5 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-indigo-500/0 rounded-bl-full pointer-events-none" />
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            job.category === "Digital" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}>
                            {job.category === "Digital" ? "Digital Freelancing" : "Physical Service"}
                          </span>
                          <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                            <MapPin size={12} /> {job.location}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-lg line-clamp-1">{job.title}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">{job.company}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-4">
                          {job.skills.map((s) => (
                            <span key={s} className="text-[9px] px-2 py-0.5 rounded bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-100 dark:border-white/5">
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{job.budget}</span>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                          <Star size={12} fill="currentColor" /> {job.rating}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )
              ) : (
                filteredTalents.length === 0 ? (
                  <motion.div key="no-talents" layout className="col-span-full py-12 text-center text-zinc-500">No professionals matched your search criteria.</motion.div>
                ) : (
                  filteredTalents.map((talent) => (
                    <motion.div
                      key={talent.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card p-6 rounded-2xl flex flex-col justify-between h-64 border border-zinc-200/60 dark:border-white/5 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-violet-500/0 rounded-bl-full pointer-events-none" />
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            talent.category === "Digital" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}>
                            {talent.category === "Digital" ? "Digital Profile" : "Physical Expert"}
                          </span>
                          <span className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                            <MapPin size={12} /> {talent.location}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-bold flex items-center justify-center text-zinc-800 dark:text-zinc-300 border border-zinc-300/50 dark:border-white/5">
                            {talent.avatar}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm leading-tight">{talent.name}</h4>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{talent.role}</p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-4">
                          {talent.skills.map((s) => (
                            <span key={s} className="text-[9px] px-2 py-0.5 rounded bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-zinc-100 dark:border-white/5">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Completed: <b className="text-zinc-700 dark:text-zinc-300">{talent.completed} jobs</b></span>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                          <Star size={12} fill="currentColor" /> {talent.rating}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* ─── INTERACTIVE WORKFLOW PIPELINE DEMO ─── */}
        <section className="w-full flex flex-col gap-8 mb-24 text-left border-t border-zinc-200 dark:border-white/5 pt-16">
          <div>
            <h2 className="text-3xl font-black font-sans tracking-tight">The WorkFusion Architecture</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Click through our pipeline to see how the system ensures verified hiring</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Timeline selector (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {PIPELINE_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`p-4 text-left rounded-2xl border transition-all flex flex-col gap-1.5 ${
                      isActive 
                        ? "bg-blue-500/10 border-blue-500 ring-1 ring-blue-500/40" 
                        : "bg-white/50 dark:bg-zinc-900/30 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10"
                    }`}
                  >
                    <h4 className={`text-sm font-bold ${isActive ? "text-blue-500" : "text-zinc-800 dark:text-zinc-200"}`}>{step.title}</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-tight">{step.subtitle}</p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-light mt-1">{step.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Pipeline Visual Board (7 cols) */}
            <div className="lg:col-span-7 w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 p-6 md:p-8 rounded-2xl shadow-xl min-h-[360px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-indigo-500/0 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-4">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Live Component Preview</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500 font-semibold">{PIPELINE_STEPS[activeStep].preview.badge}</span>
              </div>

              {/* Dynamic Content Preview Box based on step */}
              <div className="flex-1 flex items-center justify-center py-6 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="w-full max-w-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-white/5 p-6 rounded-2xl shadow-inner flex flex-col gap-4"
                  >
                    <div className="flex items-center gap-2 border-b border-zinc-200/50 dark:border-white/5 pb-2">
                      <Cpu size={14} className="text-blue-500 animate-pulse" />
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{PIPELINE_STEPS[activeStep].preview.title}</span>
                    </div>

                    {/* RENDER FORM MOCKUP */}
                    {PIPELINE_STEPS[activeStep].preview.type === "form" && (
                      <div className="space-y-2">
                        {PIPELINE_STEPS[activeStep].preview.details.map((field) => (
                          <div key={field.label} className="text-xs">
                            <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">{field.label}</span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-medium">{field.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* RENDER MATCH DETAILS MOCKUP */}
                    {PIPELINE_STEPS[activeStep].preview.type === "match" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold">
                          <CheckCircle2 size={14} /> Candidates matched with commute radius & skills profile.
                        </div>
                        <div className="space-y-2">
                          {PIPELINE_STEPS[activeStep].preview.details.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                              <span className="text-zinc-600 dark:text-zinc-400 leading-tight font-light">{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* RENDER CHAT INTERLOCK MOCKUP */}
                    {PIPELINE_STEPS[activeStep].preview.type === "chat" && (
                      <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                        {PIPELINE_STEPS[activeStep].preview.details.map((msg, i) => (
                          <div key={i} className={`flex flex-col gap-0.5 text-xs ${msg.sender === "Employer" ? "items-end" : msg.sender === "System" ? "items-center" : "items-start"}`}>
                            {msg.sender !== "System" && <span className="text-[9px] text-zinc-400 font-bold uppercase">{msg.sender}</span>}
                            <span className={`px-3 py-1.5 rounded-xl max-w-[85%] font-light leading-tight ${
                              msg.sender === "System" 
                                ? "bg-blue-500/10 text-blue-400 text-[10px] font-semibold text-center border border-blue-500/15" 
                                : msg.sender === "Employer" 
                                ? "bg-blue-600 text-white" 
                                : "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                            }`}>
                              {msg.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* RENDER REVIEW VERIFIED MOCKUP */}
                    {PIPELINE_STEPS[activeStep].preview.type === "review" && (
                      <div className="space-y-3">
                        {PIPELINE_STEPS[activeStep].preview.details.map((field) => (
                          <div key={field.label} className="text-xs">
                            <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">{field.label}</span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed font-light">{field.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center border-t border-zinc-100 dark:border-white/5 pt-4">
                Interactive walkthrough demonstrating system modules (Jobs &bull; Matching &bull; Chats &bull; Reviews)
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 border-t border-zinc-200 dark:border-white/5 pt-16">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center p-4"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-200/50 dark:bg-white/5 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 border border-zinc-300 dark:border-white/5 shadow-sm">
              <Sparkles size={20} />
            </div>
            <h4 className="font-extrabold text-base mb-1">Explainable AI</h4>
            <p className="text-xs text-zinc-500">Know exactly why you match</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center p-4"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-200/50 dark:bg-white/5 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 border border-zinc-300 dark:border-white/5 shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-extrabold text-base mb-1">Secure Interlocks</h4>
            <p className="text-xs text-zinc-500">Chats locked till Interview stage</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center p-4"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-200/50 dark:bg-white/5 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 border border-zinc-300 dark:border-white/5 shadow-sm">
              <MapPin size={20} />
            </div>
            <h4 className="font-extrabold text-base mb-1">Twin-City Support</h4>
            <p className="text-xs text-zinc-500">Islamabad & Rawalpindi commutes</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center p-4"
          >
            <div className="w-12 h-12 rounded-full bg-zinc-200/50 dark:bg-white/5 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 border border-zinc-300 dark:border-white/5 shadow-sm">
              <Briefcase size={20} />
            </div>
            <h4 className="font-extrabold text-base mb-1">Zero Placeholders</h4>
            <p className="text-xs text-zinc-500">Production-ready marketplace</p>
          </motion.div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-white/5 py-10 text-center text-zinc-500 dark:text-zinc-600 text-sm relative z-10 bg-zinc-100/80 dark:bg-[#09090b]/80 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs">
              W
            </div>
            <span className="font-bold text-sm tracking-tight text-zinc-800 dark:text-zinc-300">
              WorkFusion
            </span>
          </div>
          <span>&copy; 2026 WorkFusion Pakistan. Engineered for Excellence.</span>
          <div className="flex gap-6 text-zinc-600 dark:text-zinc-400 font-medium">
            <Link href="/login" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Register</Link>
            <a href="#" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
