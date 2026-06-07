"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Briefcase, MapPin, Sparkles, CheckCircle, Clock, 
  XCircle, Send, Star, User, DollarSign, Calendar
} from "lucide-react";

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [user, setUser] = useState(null);
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [jobError, setJobError] = useState("");
  
  // Applications & Apply status check
  const [hasApplied, setHasApplied] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  
  // Apply form state
  const [proposalText, setProposalText] = useState("");
  const [expectedSalary, setExpectedSalary] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [appError, setAppError] = useState("");
  const [appSubmitLoading, setAppSubmitLoading] = useState(false);
  const [appSuccessMessage, setAppSuccessMessage] = useState("");

  // API Request helper
  const apiRequest = useCallback(async (endpoint, options = {}) => {
    const token = localStorage.getItem("accessToken");
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    return fetch(`http://localhost:5000/api/v1${endpoint}`, {
      ...options,
      headers,
    });
  }, []);

  // Fetch job details and check application status
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(savedUser));

    const loadJobDetails = async () => {
      try {
        setJobLoading(true);
        const res = await apiRequest(`/jobs/${id}`);
        const result = await res.json();
        if (result.success) {
          setJob(result.data);
          setExpectedSalary(result.data.budget);
        } else {
          setJobError(result.message || "Failed to load job details");
        }
      } catch (err) {
        setJobError("Connection to server failed");
      } finally {
        setJobLoading(false);
      }
    };

    const checkAppliedStatus = async () => {
      try {
        setAppLoading(true);
        const res = await apiRequest("/applications?page=1&limit=100");
        const result = await res.json();
        if (result.success) {
          const matched = result.data.applications.some(
            (app) => app.jobId && (app.jobId._id ? app.jobId._id === id : app.jobId === id)
          );
          setHasApplied(matched);
        }
      } catch (err) {
        console.error("Failed to check application status", err);
      } finally {
        setAppLoading(false);
      }
    };

    if (id) {
      loadJobDetails();
      checkAppliedStatus();
    }
  }, [id, router, apiRequest]);

  // Submit job application
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setAppError("");
    setAppSuccessMessage("");
    setAppSubmitLoading(true);

    try {
      const res = await apiRequest("/applications", {
        method: "POST",
        body: JSON.stringify({
          jobId: id,
          proposal: proposalText,
          expectedSalary: Number(expectedSalary),
          availability: "Immediate Start",
          estimatedTime,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setAppSuccessMessage("Application submitted successfully!");
        setHasApplied(true);
        setProposalText("");
        setEstimatedTime("");
      } else {
        setAppError(result.message || "Failed to submit proposal");
      }
    } catch (err) {
      setAppError("Server connection failed");
    } finally {
      setAppSubmitLoading(false);
    }
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <span className="text-zinc-500 text-sm">Loading job specifications...</span>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center gap-4">
        <span className="text-red-400 text-sm">{jobError || "Job not found"}</span>
        <Link href="/dashboard/seeker" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs hover:bg-white/10 transition-colors">
          Go back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col">
      <main className="max-w-6xl mx-auto px-6 py-10 w-full flex-1 flex flex-col gap-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <Link 
            href="/dashboard/seeker" 
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm font-semibold"
          >
            <ArrowLeft size={16} /> Back to Job Feed
          </Link>
          <span className="text-zinc-500 text-xs font-medium">Job Reference: {job._id}</span>
        </div>

        {/* Job Main Details & Form Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Details (Left Side, 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header info card */}
            <div className="glass-card p-8 rounded-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider font-sans">
                  {job.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${job.status === "Open" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-zinc-800 text-zinc-500"}`}>
                  {job.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-zinc-500 border-t border-white/5 mt-4">
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Briefcase size={14} /> {job.serviceType} • {job.workType}</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold border border-white/5">{job.experienceLevel}</span>
                {job.timeline && (
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold border border-white/5">{job.timeline}</span>
                )}
                <span className="flex items-center gap-1.5 text-green-400">
                  <DollarSign size={14} /> PKR {job.budget.toLocaleString()}{job.workType === "Hourly" ? " / hr" : ""}
                </span>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-zinc-200">Position Guidelines & Expectations</h3>
              <div className="p-6 rounded-2xl bg-zinc-950/60 border border-white/5">
                <p className="text-zinc-300 leading-relaxed font-sans whitespace-pre-line text-sm md:text-base">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Required Skills */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-zinc-200">Required Competencies</h3>
              <div className="flex flex-wrap gap-2.5">
                {job.requiredSkills.map((sk, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-300 font-semibold font-sans">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Employer info */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg text-zinc-200">Hiring Organization</h3>
              <div className="p-6 rounded-2xl bg-zinc-950/40 border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-zinc-200">{job.employerId?.fullName || "Employer Manager"}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                    <span>Base: {job.employerId?.city || job.location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                      <Star size={12} className="fill-amber-400 text-amber-400" /> {job.employerId?.rating || "5.0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Apply Form Panel (Right Side, 1 Column) */}
          <div className="space-y-6">
            <div className="p-6 md:p-8 rounded-3xl bg-zinc-950 border border-white/10 space-y-6">
              <div>
                <h3 className="text-xl font-bold">Proposal Submission</h3>
                <p className="text-xs text-zinc-400 mt-1">Submit your bid and proposal to start interview scheduling</p>
              </div>

              {appLoading ? (
                <span className="text-xs text-zinc-500 block">Validating client application status...</span>
              ) : hasApplied ? (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span>You have already applied for this job listing.</span>
                </div>
              ) : (
                <>
                  {appError && (
                    <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-medium">
                      {appError}
                    </div>
                  )}

                  {appSuccessMessage && (
                    <div className="p-4 rounded-xl bg-green-500/15 border border-green-500/20 text-green-400 text-xs font-medium">
                      {appSuccessMessage}
                    </div>
                  )}

                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                        {job.workType === "Hourly" ? "Expected Hourly Rate Bid (PKR/hr)" : "Expected Budget Bid (PKR)"}
                      </label>
                      <input
                        type="number"
                        required
                        value={expectedSalary}
                        onChange={(e) => setExpectedSalary(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                      />
                      <span className="text-[10px] text-zinc-500 block">
                        Client Budget: PKR {job.budget.toLocaleString()}{job.workType === "Hourly" ? " / hr" : ""}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Estimated Time to Complete</label>
                      <input
                        type="text"
                        required
                        value={estimatedTime}
                        onChange={(e) => setEstimatedTime(e.target.value)}
                        placeholder="e.g. 2 weeks, 5 days, 1 month"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Proposal Details</label>
                      <textarea
                        required
                        value={proposalText}
                        onChange={(e) => setProposalText(e.target.value)}
                        placeholder="Explain your relevant skills and outline how you plan to complete this job..."
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={appSubmitLoading}
                      className="w-full py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send size={14} />
                      {appSubmitLoading ? "Submitting..." : "Send Job Proposal"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
