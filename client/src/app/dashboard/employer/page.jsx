"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, Briefcase, FileText, MessageSquare, Star, Sparkles,
  MapPin, CheckCircle, Clock, XCircle, Send, LogOut, Check, ChevronRight
} from "lucide-react";

const CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Faisalabad", "Peshawar", "Multan", "Sialkot"];

export default function EmployerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("postings"); // postings, createJob, applicants, messages, reviews
  const [user, setUser] = useState(null);

  // Job postings state
  const [postings, setPostings] = useState([]);
  const [postingsLoading, setPostingsLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // Job Creation state
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobCategory, setJobCategory] = useState("Web Development");
  const [jobSkills, setJobSkills] = useState("");
  const [jobExp, setJobExp] = useState(0);
  const [jobBudget, setJobBudget] = useState(0);
  const [jobLocation, setJobLocation] = useState("Islamabad");
  const [jobServiceType, setJobServiceType] = useState("Online");
  const [jobWorkType, setJobWorkType] = useState("Project");
  const [jobExperienceLevel, setJobExperienceLevel] = useState("Intermediate");
  const [jobTimeline, setJobTimeline] = useState("");
  const [jobCreateLoading, setJobCreateLoading] = useState(false);
  const [jobCreateMessage, setJobCreateMessage] = useState("");

  // Applicants state
  const [applicants, setApplicants] = useState([]);
  const [appLoading, setAppLoading] = useState(false);
  
  // AI candidate recommendations (including missing skills)
  const [candidateRecommendations, setCandidateRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  // Chats state
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  // Reviews & Rating submission state
  const [reviewingApp, setReviewingApp] = useState(null);
  const [ratingVal, setRatingVal] = useState(5);
  const [commentVal, setCommentVal] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // Load user details
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
  }, [router]);

  // API Helper
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

  // Fetch Employer's Job Postings
  const fetchPostings = useCallback(async () => {
    if (!user) return;
    setPostingsLoading(true);
    try {
      const res = await apiRequest(`/jobs?employerId=${user.id}`);
      const result = await res.json();
      if (result.success) {
        setPostings(result.data.jobs);
        if (result.data.jobs.length > 0 && !selectedJob) {
          setSelectedJob(result.data.jobs[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load postings", err);
    } finally {
      setPostingsLoading(false);
    }
  }, [user, selectedJob, apiRequest]);

  // Fetch Applicants & AI candidates for selected job
  const fetchApplicantsAndAI = useCallback(async (jobId) => {
    setAppLoading(true);
    setAiLoading(true);
    try {
      // 1. Fetch real applicants
      const appRes = await apiRequest(`/applications?jobId=${jobId}`);
      const appResult = await appRes.json();
      if (appResult.success) {
        setApplicants(appResult.data.applications);
      }

      // 2. Fetch AI candidate recommendations (including missing skills and match scores)
      const aiRes = await apiRequest(`/jobs/recommendations/candidates/${jobId}`);
      const aiResult = await aiRes.json();
      if (aiResult.success) {
        setCandidateRecommendations(aiResult.data);
      }
    } catch (err) {
      console.error("Failed to load applicants/AI details", err);
    } finally {
      setAppLoading(false);
      setAiLoading(false);
    }
  }, [apiRequest]);

  // Fetch Chats
  const fetchChats = useCallback(async () => {
    setChatLoading(true);
    try {
      const res = await apiRequest("/chats");
      const result = await res.json();
      if (result.success) {
        setChats(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch chats", err);
    } finally {
      setChatLoading(false);
    }
  }, [apiRequest]);

  // Fetch Messages for active chat
  const fetchMessages = useCallback(async (chatId) => {
    setMsgLoading(true);
    try {
      const res = await apiRequest(`/chats/${chatId}/messages?page=1&limit=100`);
      const result = await res.json();
      if (result.success) {
        setMessages(result.data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setMsgLoading(false);
    }
  }, [apiRequest]);

  // Trigger loading based on tab
  useEffect(() => {
    if (!user) return;
    if (activeTab === "postings") {
      fetchPostings();
    } else if (activeTab === "messages") {
      fetchChats();
    }
  }, [activeTab, user, fetchPostings, fetchChats]);

  // Select a different job posting
  useEffect(() => {
    if (selectedJob && activeTab === "applicants") {
      fetchApplicantsAndAI(selectedJob._id);
    }
  }, [selectedJob, activeTab, fetchApplicantsAndAI]);

  // Job Submission
  const handleCreateJob = async (e) => {
    e.preventDefault();
    setJobCreateLoading(true);
    setJobCreateMessage("");

    const requiredSkills = jobSkills
      ? jobSkills.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
      : [];

    const payload = {
      title: jobTitle,
      description: jobDesc,
      category: jobCategory,
      requiredSkills,
      experienceRequired: Number(jobExp),
      experienceLevel: jobExperienceLevel,
      ...(jobTimeline ? { timeline: jobTimeline } : {}),
      budget: Number(jobBudget),
      location: jobLocation,
      serviceType: jobServiceType,
      workType: jobWorkType,
      remoteAllowed: jobServiceType === "Online",
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days default
    };

    try {
      const res = await apiRequest("/jobs", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setJobCreateMessage("Job listing published successfully!");
        setJobTitle("");
        setJobDesc("");
        setJobSkills("");
        setJobExp(0);
        setJobBudget(0);
        setJobExperienceLevel("Intermediate");
        setJobTimeline("");
      } else {
        setJobCreateMessage(result.message || "Failed to publish job listing");
      }
    } catch (err) {
      setJobCreateMessage("Failed to publish job");
    } finally {
      setJobCreateLoading(false);
    }
  };

  // Update application status
  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      const res = await apiRequest(`/applications/${appId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (result.success) {
        alert(`Status updated successfully to: ${newStatus}`);
        if (selectedJob) {
          fetchApplicantsAndAI(selectedJob._id);
        }
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // Submit Review Form
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      const res = await apiRequest("/reviews", {
        method: "POST",
        body: JSON.stringify({
          jobId: reviewingApp.jobId._id,
          receiverId: reviewingApp.seekerId._id,
          rating: Number(ratingVal),
          comment: commentVal,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Review submitted successfully!");
        setReviewingApp(null);
        setCommentVal("");
        if (selectedJob) {
          fetchApplicantsAndAI(selectedJob._id);
        }
      } else {
        alert(result.message || "Failed to submit review. Check contract Completed status.");
      }
    } catch (err) {
      alert("Failed to submit review");
    } finally {
      setReviewLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeChat) return;

    try {
      const res = await apiRequest("/chats/message", {
        method: "POST",
        body: JSON.stringify({
          chatId: activeChat._id,
          message: chatMessage,
          type: "Text",
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessages((prev) => [...prev, result.data]);
        setChatMessage("");
        fetchChats();
      } else {
        alert(result.message || "Failed to send message. Messaging may be locked.");
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-white/5 flex flex-col p-6 gap-6 justify-between">
        <div className="flex flex-col gap-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold text-lg">
              W
            </div>
            <span className="font-extrabold text-xl">
              Work<span className="text-blue-500 font-medium">Fusion</span>
            </span>
          </div>

          {/* User Bio */}
          {user && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2.5">
              <span className="text-sm font-bold text-zinc-300">{user.fullName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold self-start uppercase">
                {user.role}
              </span>
            </div>
          )}

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("postings")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "postings" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <Briefcase size={18} /> My Postings
            </button>
            <button
              onClick={() => setActiveTab("createJob")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "createJob" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <Plus size={18} /> Post a Job
            </button>
            <button
              onClick={() => {
                setActiveTab("applicants");
                if (postings.length > 0 && !selectedJob) {
                  setSelectedJob(postings[0]);
                }
              }}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "applicants" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <FileText size={18} /> Applicants
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "messages" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <MessageSquare size={18} /> Interview Chats
            </button>
          </nav>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 relative overflow-y-auto max-h-screen">
        
        {/* ================= TAB: POSTINGS ================= */}
        {activeTab === "postings" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-extrabold">Job Postings</h2>
                <p className="text-sm text-zinc-400 mt-1">Manage all published online and physical job ads</p>
              </div>
              <button
                onClick={() => setActiveTab("createJob")}
                className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 font-bold text-sm rounded-xl transition-all flex items-center gap-1.5"
              >
                <Plus size={16} /> Publish New Job
              </button>
            </div>

            {postingsLoading ? (
              <span className="text-sm text-zinc-500">Retrieving job records...</span>
            ) : postings.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white/5 border border-white/5 text-zinc-500 text-sm">
                No job postings found. Post a job to start receiving applications.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {postings.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => {
                      setSelectedJob(job);
                      setActiveTab("applicants");
                    }}
                    className="glass-card p-6 rounded-2xl cursor-pointer flex flex-col justify-between h-56"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs text-zinc-500 font-semibold uppercase">{job.category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${job.status === "Open" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-zinc-800 text-zinc-500"}`}>
                          {job.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mt-2 line-clamp-1">{job.title}</h3>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{job.description}</p>
                    </div>

                    <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <MapPin size={12} /> {job.location}
                      </div>
                      <span className="font-bold text-xs text-blue-400 flex items-center gap-0.5">
                        Review Applicants <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: CREATE JOB ================= */}
        {activeTab === "createJob" && (
          <div className="flex flex-col gap-6 max-w-3xl">
            <div>
              <h2 className="text-3xl font-extrabold">Post a Job Listing</h2>
              <p className="text-sm text-zinc-400 mt-1">Specify skills, budget, and location (supports online and physical tasks)</p>
            </div>

            {jobCreateMessage && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex items-center gap-2">
                <Check size={18} />
                <span>{jobCreateMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior MERN Developer Needed"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Job Category</label>
                  <select
                    value={jobCategory}
                    onChange={(e) => setJobCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="UI/UX & Web Design">UI/UX & Web Design</option>
                    <option value="AC & Fridge Services">AC & Fridge Services</option>
                    <option value="Electrical Wiring & Repair">Electrical Wiring & Repair</option>
                    <option value="Sanitary & Plumbing Installation">Sanitary & Plumbing Installation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Service Type</label>
                  <select
                    value={jobServiceType}
                    onChange={(e) => setJobServiceType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm"
                  >
                    <option value="Online">Online (Digital)</option>
                    <option value="Physical">Physical (Local)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Work Contract Type</label>
                  <select
                    value={jobWorkType}
                    onChange={(e) => setJobWorkType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm"
                  >
                    <option value="Project">Project-Based</option>
                    <option value="Hourly">Hourly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Full-Time">Full-Time</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">City (Location)</label>
                  <select
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Required Experience Level</label>
                  <select
                    value={jobExperienceLevel}
                    onChange={(e) => setJobExperienceLevel(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Project Timeline (Optional)</label>
                  <select
                    value={jobTimeline}
                    onChange={(e) => setJobTimeline(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-400"
                  >
                    <option value="">Not Specified</option>
                    <option value="Less than 1 month">Less than 1 month</option>
                    <option value="1 - 3 months">1 - 3 months</option>
                    <option value="3 - 6 months">3 - 6 months</option>
                    <option value="More than 6 months">More than 6 months</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={jobSkills}
                    onChange={(e) => setJobSkills(e.target.value)}
                    placeholder="React, Node.js, TypeScript"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Exp. Required (y)</label>
                    <input
                      type="number"
                      required
                      value={jobExp}
                      onChange={(e) => setJobExp(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                      {jobWorkType === "Hourly" ? "Hourly Rate (PKR/hr)" : "Budget (PKR)"}
                    </label>
                    <input
                      type="number"
                      required
                      value={jobBudget}
                      onChange={(e) => setJobBudget(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Job Description</label>
                <textarea
                  required
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  rows={6}
                  placeholder="Detail the project guidelines, expectations, deliverables, and requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={jobCreateLoading}
                className="px-6 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all glow-btn"
              >
                {jobCreateLoading ? "Publishing listing..." : "Publish Job Posting"}
              </button>

            </form>
          </div>
        )}

        {/* ================= TAB: APPLICANTS ================= */}
        {activeTab === "applicants" && (
          <div className="flex flex-col gap-6">
            
            {/* Header select */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-extrabold">Applicant Directory</h2>
                <p className="text-sm text-zinc-400 mt-1">Review applicant profiles, AI scores, and manage interview statuses</p>
              </div>

              {postings.length > 0 && (
                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-zinc-500 uppercase">Active Posting:</label>
                  <select
                    value={selectedJob?._id || ""}
                    onChange={(e) => {
                      const found = postings.find((j) => j._id === e.target.value);
                      if (found) setSelectedJob(found);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 text-xs outline-none font-semibold text-zinc-300"
                  >
                    {postings.map((job) => (
                      <option key={job._id} value={job._id}>{job.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {selectedJob ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Real Applicants List (Left Column, spanned 2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="font-bold text-lg text-zinc-300">Submitted Proposals ({applicants.length})</h3>

                  {appLoading ? (
                    <span className="text-xs text-zinc-500">Loading applicant directory...</span>
                  ) : applicants.length === 0 ? (
                    <div className="p-8 text-center rounded-xl bg-white/5 border border-white/5 text-zinc-500 text-sm">
                      No applications submitted yet for this posting.
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {applicants.map((app) => (
                        <div key={app._id} className="p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-4">
                          
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-white/5 pb-4">
                            <div>
                              <h4 className="font-bold text-lg text-zinc-200">{app.seekerId.fullName}</h4>
                              <p className="text-xs text-zinc-500">
                                City: {app.seekerId.city} • Bid: PKR {app.expectedSalary.toLocaleString()}{selectedJob?.workType === "Hourly" ? " / hr" : ""} • Delivery: {app.estimatedTime || "Not specified"}
                              </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold font-sans">
                                {app.matchScore}% Match
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase font-sans">
                                {app.status}
                              </span>
                            </div>
                          </div>

                          {/* Proposal */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Candidate Proposal</label>
                            <p className="text-sm text-zinc-300 leading-relaxed font-sans">{app.proposal}</p>
                          </div>

                          {/* Candidate details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                            <div className="space-y-1">
                              <span className="text-zinc-500 font-bold block uppercase tracking-wider text-[9px]">Candidate Skills</span>
                              <p className="text-zinc-300">{app.seekerId.skills.join(", ")}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-zinc-500 font-bold block uppercase tracking-wider text-[9px]">Experience</span>
                              <p className="text-zinc-300">{app.seekerId.experience} years</p>
                            </div>
                          </div>

                          {/* Action Bar */}
                          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5 justify-end">
                            {app.status === "Applied" && (
                              <button
                                onClick={() => handleStatusUpdate(app._id, "Interview")}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all"
                              >
                                Move to Interview
                              </button>
                            )}
                            {app.status === "Interview" && (
                              <button
                                onClick={() => handleStatusUpdate(app._id, "Accepted")}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-all"
                              >
                                Offer Accept
                              </button>
                            )}
                            {app.status === "Accepted" && (
                              <button
                                onClick={() => handleStatusUpdate(app._id, "Hired")}
                                className="px-4 py-2 bg-green-500 text-black font-bold text-xs rounded-xl transition-all"
                              >
                                Hire / Start Contract
                              </button>
                            )}
                            {app.status === "Hired" && (
                              <button
                                onClick={() => handleStatusUpdate(app._id, "Completed")}
                                className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl transition-all"
                              >
                                Mark Completed
                              </button>
                            )}
                            {app.status === "Completed" && (
                              <button
                                onClick={() => setReviewingApp(app)}
                                className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                              >
                                <Star size={12} /> Leave Review
                              </button>
                            )}
                            {app.status !== "Completed" && app.status !== "Rejected" && (
                              <button
                                onClick={() => handleStatusUpdate(app._id, "Rejected")}
                                className="px-4 py-2 bg-zinc-900 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 font-bold text-xs rounded-xl border border-white/5 transition-all"
                              >
                                Reject
                              </button>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Candidate Matching Recommendations (Right Column) */}
                <div className="space-y-6">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="text-yellow-400 shrink-0" size={18} />
                    <h3 className="font-bold text-lg text-zinc-300">AI Matching Recommendations</h3>
                  </div>

                  {aiLoading ? (
                    <span className="text-xs text-zinc-500 block">Parsing TF-IDF similarity vectors...</span>
                  ) : candidateRecommendations.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-500 rounded-xl bg-white/5 border border-white/5">
                      No matching candidate suggestions calculated.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {candidateRecommendations.map((rec, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-zinc-950 border border-white/5 space-y-3">
                          <div className="flex justify-between items-center gap-2">
                            <span className="font-bold text-sm text-zinc-200">{rec.candidate.fullName}</span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold font-sans">
                              {rec.score}% Match
                            </span>
                          </div>

                          <p className="text-xs text-zinc-400 line-clamp-2">{rec.candidate.bio}</p>

                          {/* Skill Gap Analysis Box - EMPLOYER ACCESS GRANTED */}
                          {rec.missingSkills && rec.missingSkills.length > 0 && (
                            <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/15 text-[10px] space-y-1">
                              <span className="font-bold text-red-400 uppercase block tracking-wide">Missing Core Skills:</span>
                              <span className="text-zinc-400 font-medium font-sans">❌ {rec.missingSkills.join(", ")}</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1">
                            {rec.reason.map((res, rIdx) => (
                              <span key={rIdx} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-zinc-500 font-sans">
                                {res}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-sm text-zinc-500">
                Create a job posting to view applicants
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: MESSAGES ================= */}
        {activeTab === "messages" && (
          <div className="flex flex-col gap-6 h-[80vh]">
            <div>
              <h2 className="text-3xl font-extrabold">Interview Channels</h2>
              <p className="text-sm text-zinc-400 mt-1">Direct communication with candidates under Interview status</p>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-6 bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden min-h-[500px]">
              
              {/* Chat list */}
              <div className="w-full md:w-80 border-r border-white/5 overflow-y-auto max-h-[500px] md:max-h-full">
                {chatLoading ? (
                  <span className="p-4 text-xs text-zinc-500 block">Querying secure channels...</span>
                ) : chats.length === 0 ? (
                  <div className="p-6 text-zinc-500 text-xs text-center">
                    No active interview channels. Secure chat unlocks automatically when an application status changes to "Interview".
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {chats.map((ch) => (
                      <button
                        key={ch._id}
                        onClick={() => {
                          setActiveChat(ch);
                          fetchMessages(ch._id);
                        }}
                        className={`p-4 text-left border-b border-white/5 transition-all flex flex-col gap-1.5 ${activeChat?._id === ch._id ? "bg-white/5" : "hover:bg-white/5"}`}
                      >
                        <span className="font-bold text-sm text-zinc-300">{ch.jobId ? ch.jobId.title : "Interviews"}</span>
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <span>Candidate: {ch.seekerId.fullName}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Message frame */}
              <div className="flex-1 flex flex-col justify-between max-h-[500px] md:max-h-full min-h-[400px]">
                {activeChat ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-white/5 bg-white/5">
                      <h4 className="font-bold text-sm text-zinc-300">{activeChat.jobId.title}</h4>
                      <p className="text-xs text-zinc-500">Candidate: {activeChat.seekerId.fullName}</p>
                    </div>

                    {/* Stream */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col bg-zinc-900/20 max-h-[300px] md:max-h-[400px]">
                      {msgLoading && messages.length === 0 ? (
                        <span className="text-xs text-zinc-500 self-center">Decrypting message thread...</span>
                      ) : (
                        messages.map((m) => {
                          const isMe = m.senderId === user.id;
                          return (
                            <div key={m._id} className={`max-w-[70%] p-3.5 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-blue-600 text-white self-end rounded-tr-none" : "bg-zinc-800 text-zinc-300 self-start rounded-tl-none"}`}>
                              <p className="font-sans">{m.message}</p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Form Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-zinc-950 flex gap-3">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type interview message..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 outline-none text-sm text-zinc-200"
                      />
                      <button
                        type="submit"
                        className="p-3 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                    Select an interview thread to begin messaging
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ================= MODAL: LEAVE REVIEW ================= */}
      {reviewingApp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-2xl space-y-6 relative">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Write Contract Review</h3>
              <p className="text-sm text-zinc-400 mt-1">Review candidate: "{reviewingApp.seekerId.fullName}"</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Rating (1 to 5 Stars)</label>
                <select
                  value={ratingVal}
                  onChange={(e) => setRatingVal(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                >
                  <option value="5">★★★★★ (5 Stars - Excellent)</option>
                  <option value="4">★★★★☆ (4 Stars - Good)</option>
                  <option value="3">★★★☆☆ (3 Stars - Satisfactory)</option>
                  <option value="2">★★☆☆☆ (2 Stars - Poor)</option>
                  <option value="1">★☆☆☆☆ (1 Star - Unacceptable)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Review Comment</label>
                <textarea
                  required
                  value={commentVal}
                  onChange={(e) => setCommentVal(e.target.value)}
                  placeholder="Detail the candidate's performance, communication, speed, and skill level..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setReviewingApp(null)}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-sm rounded-xl border border-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="px-6 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50"
                >
                  {reviewLoading ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
