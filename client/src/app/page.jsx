"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Briefcase, MapPin, ShieldCheck, ArrowRight, UserPlus, LogIn, 
  Star, Search, Cpu, CheckCircle2
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
      title: "WorkFusion Match Score",
      badge: "Match Score: 96%",
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
  // Stats
  const [stats, setStats] = useState({ freelancers: 12800, jobs: 480, accuracy: 98.4, contracts: 6400 });
  
  // Interactive Feed Filters
  const [feedType, setFeedType] = useState("jobs"); // jobs, talents
  const [categoryFilter, setCategoryFilter] = useState("All"); // All, Digital, Physical
  const [searchVal, setSearchVal] = useState("");

  // Process timeline active step
  const [activeStep, setActiveStep] = useState(0);

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
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-200">
      
      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg tracking-tight">
            W
          </div>
          <span className="font-bold text-lg tracking-tight">
            Work<span className="text-zinc-500 font-medium">Fusion</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="text-xs font-semibold text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1">
            <LogIn size={14} /> Login
          </Link>
          <Link href="/register" className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 font-semibold text-xs rounded transition-colors flex items-center gap-1 border border-transparent dark:border-zinc-800">
            <UserPlus size={14} /> Register <ArrowRight size={12} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
        
        {/* Simple Top Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-zinc-200/50 dark:bg-zinc-900 border border-zinc-300/60 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold mb-6">
          <Briefcase size={12} className="text-zinc-500" />
          <span>Pakistan's Premier Hybrid Job Marketplace</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white max-w-3xl leading-tight mb-5 text-center">
          One Platform For Every Professional Skill
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-450 max-w-2xl mb-8 leading-relaxed text-center">
          Unifying online freelancing and localized physical services in one integrated workspace. Find talents and gigs matched by our verified skill and location ranking engine.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-16 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 font-semibold text-xs rounded transition-colors flex items-center justify-center gap-1.5 border border-transparent dark:border-zinc-800">
            Get Started As Candidate <ArrowRight size={14} />
          </Link>
          <Link href="/register" className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:hover:bg-zinc-850 dark:text-white font-semibold text-xs rounded border border-zinc-200 dark:border-zinc-800 transition-colors flex items-center justify-center gap-1.5">
            Hire Skills
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-6 p-6 rounded-xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-16">
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">{stats.freelancers.toLocaleString()}+</span>
            <span className="text-[10px] font-semibold text-zinc-550 mt-1 uppercase tracking-wider">Verified Talents</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">{stats.jobs.toLocaleString()}+</span>
            <span className="text-[10px] font-semibold text-zinc-550 mt-1 uppercase tracking-wider">Active Gigs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">{stats.accuracy}%</span>
            <span className="text-[10px] font-semibold text-zinc-550 mt-1 uppercase tracking-wider">Match Accuracy</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">{stats.contracts.toLocaleString()}+</span>
            <span className="text-[10px] font-semibold text-zinc-550 mt-1 uppercase tracking-wider">Completed Gigs</span>
          </div>
        </div>

        {/* Marketplace Explorer Feed */}
        <section className="w-full flex flex-col gap-6 mb-24 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Explore the Marketplace</h2>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-0.5">Active physical and digital job listings updated in real time</p>
            </div>

            <div className="flex bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded border border-zinc-250 dark:border-zinc-800 self-start">
              <button
                onClick={() => setFeedType("jobs")}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  feedType === "jobs" ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white" : "text-zinc-550 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-250"
                }`}
              >
                Featured Gigs
              </button>
              <button
                onClick={() => setFeedType("talents")}
                className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                  feedType === "talents" ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-white" : "text-zinc-550 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-250"
                }`}
              >
                Top Rated Experts
              </button>
            </div>
          </div>

          {/* Search bar + Filters */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-zinc-400" size={16} />
              <input
                type="text"
                placeholder={feedType === "jobs" ? "Search jobs by title, skills, location (e.g. React, Rawalpindi)" : "Search talents by name, skills, role (e.g. Electrician, Figma)"}
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 text-zinc-800 dark:text-zinc-100"
              />
            </div>
            
            <div className="flex gap-2 min-w-[320px]">
              {["All", "Digital", "Physical"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-lg border transition-colors ${
                    categoryFilter === cat 
                      ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-white" 
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                  }`}
                >
                  {cat === "All" ? "All Sectors" : cat === "Digital" ? "Digital" : "Physical"}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout of results */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <AnimatePresence mode="popLayout">
              {feedType === "jobs" ? (
                filteredJobs.length === 0 ? (
                  <motion.div key="no-jobs" layout className="col-span-full py-12 text-center text-zinc-500 text-xs">No gigs matched your search criteria.</motion.div>
                ) : (
                  filteredJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between h-56 transition-colors hover:border-zinc-350 dark:hover:border-zinc-700 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                            job.category === "Digital" ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-350" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-350"
                          }`}>
                            {job.category === "Digital" ? "Digital" : "Physical"}
                          </span>
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <MapPin size={12} /> {job.location}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-zinc-900 dark:text-white line-clamp-1">{job.title}</h4>
                        <p className="text-xs text-zinc-500 mt-0.5">{job.company}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {job.skills.map((s) => (
                            <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-700/30">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-250">{job.budget}</span>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                          <Star size={12} fill="currentColor" /> {job.rating}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )
              ) : (
                filteredTalents.length === 0 ? (
                  <motion.div key="no-talents" layout className="col-span-full py-12 text-center text-zinc-500 text-xs">No professionals matched your search criteria.</motion.div>
                ) : (
                  filteredTalents.map((talent) => (
                    <motion.div
                      key={talent.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 flex flex-col justify-between h-56 transition-colors hover:border-zinc-350 dark:hover:border-zinc-700 shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                            talent.category === "Digital" ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-350" : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-350"
                          }`}>
                            {talent.category === "Digital" ? "Digital" : "Physical"}
                          </span>
                          <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <MapPin size={12} /> {talent.location}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-bold flex items-center justify-center text-zinc-800 dark:text-zinc-250 border border-zinc-200 dark:border-zinc-700">
                            {talent.avatar}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-white leading-tight">{talent.name}</h4>
                            <p className="text-[10px] text-zinc-550">{talent.role}</p>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-3">
                          {talent.skills.map((s) => (
                            <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 border border-zinc-200/40 dark:border-zinc-700/30">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800">
                        <span className="text-xs text-zinc-500">Completed: <b className="text-zinc-800 dark:text-zinc-250 font-bold">{talent.completed} jobs</b></span>
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

        {/* System Architecture Workflow Demo */}
        <section className="w-full flex flex-col gap-6 mb-24 text-left border-t border-zinc-200 dark:border-zinc-800 pt-16">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">System Architecture & Pipeline</h2>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-0.5">Click through the pipeline stages to see how the system operates</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Timeline selector (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-2.5">
              {PIPELINE_STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`p-4 text-left rounded-xl border transition-colors ${
                      isActive 
                        ? "bg-zinc-100 dark:bg-zinc-900 border-zinc-400 dark:border-zinc-700 shadow-sm" 
                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                    }`}
                  >
                    <h4 className={`text-xs font-bold ${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-550 dark:text-zinc-400"}`}>{step.title}</h4>
                    <p className="text-xs text-zinc-800 dark:text-zinc-200 font-semibold mt-0.5 leading-tight">{step.subtitle}</p>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-normal">{step.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Pipeline Visual Board (7 cols) */}
            <div className="lg:col-span-7 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl min-h-[340px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Component Preview</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">{PIPELINE_STEPS[activeStep].preview.badge}</span>
              </div>

              {/* Dynamic Content Preview Box */}
              <div className="flex-1 flex items-center justify-center py-4 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-full max-w-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 p-5 rounded-lg flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                      <Cpu size={14} className="text-zinc-500" />
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{PIPELINE_STEPS[activeStep].preview.title}</span>
                    </div>

                    {/* RENDER FORM MOCKUP */}
                    {PIPELINE_STEPS[activeStep].preview.type === "form" && (
                      <div className="space-y-2">
                        {PIPELINE_STEPS[activeStep].preview.details.map((field) => (
                          <div key={field.label} className="text-xs">
                            <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">{field.label}</span>
                            <span className="text-zinc-850 dark:text-zinc-200 font-semibold">{field.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* RENDER MATCH DETAILS MOCKUP */}
                    {PIPELINE_STEPS[activeStep].preview.type === "match" && (
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-1.5 p-2 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold">
                          <CheckCircle2 size={13} className="text-zinc-500 shrink-0" />
                          <span>Matched with commute radius & skills profile.</span>
                        </div>
                        <div className="space-y-1.5">
                          {PIPELINE_STEPS[activeStep].preview.details.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <CheckCircle2 size={12} className="text-zinc-500 shrink-0" />
                              <span className="text-zinc-650 dark:text-zinc-350">{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* RENDER CHAT INTERLOCK MOCKUP */}
                    {PIPELINE_STEPS[activeStep].preview.type === "chat" && (
                      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                        {PIPELINE_STEPS[activeStep].preview.details.map((msg, i) => (
                          <div key={i} className={`flex flex-col gap-0.5 text-xs ${msg.sender === "Employer" ? "items-end" : msg.sender === "System" ? "items-center" : "items-start"}`}>
                            {msg.sender !== "System" && <span className="text-[9px] text-zinc-400 font-bold uppercase">{msg.sender}</span>}
                            <span className={`px-2.5 py-1.5 rounded-lg max-w-[85%] font-normal leading-tight ${
                              msg.sender === "System" 
                                ? "bg-zinc-100 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 text-[10px] font-semibold text-center border border-zinc-200 dark:border-zinc-800 w-full" 
                                : msg.sender === "Employer" 
                                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950" 
                                : "bg-zinc-250 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                            }`}>
                              {msg.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* RENDER REVIEW VERIFIED MOCKUP */}
                    {PIPELINE_STEPS[activeStep].preview.type === "review" && (
                      <div className="space-y-2">
                        {PIPELINE_STEPS[activeStep].preview.details.map((field) => (
                          <div key={field.label} className="text-xs">
                            <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">{field.label}</span>
                            <span className="text-zinc-800 dark:text-zinc-200 font-medium">{field.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="text-[10px] text-zinc-400 dark:text-zinc-550 text-center border-t border-zinc-100 dark:border-zinc-800 pt-3">
                Interactive walkthrough demonstrating system modules (Jobs &bull; Matching &bull; Chats &bull; Reviews)
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-12">
          <div className="flex flex-col items-start p-4">
            <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-800 dark:text-zinc-200 mb-3 border border-zinc-200 dark:border-zinc-800">
              <Cpu size={16} />
            </div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">Explainable Matching</h4>
            <p className="text-xs text-zinc-500 leading-normal">Clear breakdown of skills, availability, and reviews matching.</p>
          </div>

          <div className="flex flex-col items-start p-4">
            <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-800 dark:text-zinc-200 mb-3 border border-zinc-200 dark:border-zinc-800">
              <ShieldCheck size={16} />
            </div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">Secure Interlocks</h4>
            <p className="text-xs text-zinc-500 leading-normal">Messaging is only enabled once candidates reach the Interview stage.</p>
          </div>

          <div className="flex flex-col items-start p-4">
            <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-800 dark:text-zinc-200 mb-3 border border-zinc-200 dark:border-zinc-800">
              <MapPin size={16} />
            </div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">Commute Optimization</h4>
            <p className="text-xs text-zinc-500 leading-normal">Geographic matching tailored for commutes in Twin-Cities and beyond.</p>
          </div>

          <div className="flex flex-col items-start p-4">
            <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-800 dark:text-zinc-200 mb-3 border border-zinc-200 dark:border-zinc-800">
              <Briefcase size={16} />
            </div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-1">Verified Outcomes</h4>
            <p className="text-xs text-zinc-500 leading-normal">Reviews and contract releases are strictly gated by job resolution.</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-zinc-500 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-150 text-white dark:text-zinc-950 flex items-center justify-center font-bold text-xs">
              W
            </div>
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              WorkFusion
            </span>
          </div>
          <span>&copy; 2026 WorkFusion. Engineered for Excellence.</span>
          <div className="flex gap-4 text-zinc-500 font-medium">
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
