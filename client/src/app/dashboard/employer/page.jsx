"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, Briefcase, FileText, MessageSquare, Star, Sparkles,
  MapPin, CheckCircle, Clock, XCircle, Send, LogOut, Check, ChevronRight, User, Lock,
  Search, Link, LayoutGrid
} from "lucide-react";

const CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Faisalabad", "Peshawar", "Multan", "Sialkot"];

export default function EmployerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("postings"); // postings, createJob, applicants, messages, profile, security, talents
  const [user, setUser] = useState(null);

  // Find Talent state
  const [talentQuery, setTalentQuery] = useState("");
  const [talentCity, setTalentCity] = useState("");
  const [talentPage, setTalentPage] = useState(1);
  const [talentLimit, setTalentLimit] = useState(10);
  const [talents, setTalents] = useState([]);
  const [totalTalents, setTotalTalents] = useState(0);
  const [talentsLoading, setTalentsLoading] = useState(false);

  // AI recommendations pagination state
  const [aiPage, setAiPage] = useState(1);

  // Proposal detail popup modal state
  const [selectedProposalForPopup, setSelectedProposalForPopup] = useState(null);

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

  // Employer Profile Form states
  const [profileCompanyName, setProfileCompanyName] = useState("");
  const [profileGoogleMapsLink, setProfileGoogleMapsLink] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profileEmployeesCount, setProfileEmployeesCount] = useState("1 - 10");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Security password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);

  // Load user details
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    setProfileCompanyName(parsedUser.companyName || "");
    setProfileGoogleMapsLink(parsedUser.googleMapsLink || "");
    setProfileAddress(parsedUser.address || "");
    setProfileEmployeesCount(parsedUser.employeesCount || "1 - 10");
    setProfilePhone(parsedUser.phone || "");
    setProfileBio(parsedUser.bio || "");
    setProfilePicture(parsedUser.profilePicture || "");
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

  // Fetch Talents for employer search
  const fetchTalents = useCallback(async () => {
    setTalentsLoading(true);
    try {
      let query = `?page=${talentPage}&limit=${talentLimit}`;
      if (talentQuery) query += `&query=${encodeURIComponent(talentQuery)}`;
      if (talentCity) query += `&city=${encodeURIComponent(talentCity)}`;

      const res = await apiRequest(`/auth/talents${query}`);
      const result = await res.json();
      if (result.success) {
        setTalents(result.data.talents || []);
        setTotalTalents(result.data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch talents list", err);
    } finally {
      setTalentsLoading(false);
    }
  }, [talentQuery, talentCity, talentPage, talentLimit, apiRequest]);

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
    } else if (activeTab === "talents") {
      fetchTalents();
    }
  }, [activeTab, user, fetchPostings, fetchChats, fetchTalents]);

  // Fetch talents when page or filter city changes
  useEffect(() => {
    if (activeTab === "talents") {
      fetchTalents();
    }
  }, [talentPage, talentCity, activeTab, fetchTalents]);

  // Select a different job posting
  useEffect(() => {
    if (selectedJob && activeTab === "applicants") {
      fetchApplicantsAndAI(selectedJob._id);
    }
    setAiPage(1);
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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileMessage("");
    setProfileLoading(true);

    try {
      const res = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          companyName: profileCompanyName,
          googleMapsLink: profileGoogleMapsLink,
          address: profileAddress,
          employeesCount: profileEmployeesCount,
          phone: profilePhone,
          bio: profileBio,
          profilePicture,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update profile");
      }

      setProfileMessage("Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(result.data));
      setUser(result.data);
    } catch (err) {
      setProfileError(err.message || "Error updating profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSecurityError("");
    setSecurityMessage("");
    setSecurityLoading(true);

    try {
      const res = await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update password");
      }
      setSecurityMessage("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setSecurityError(err.message || "Error updating password");
    } finally {
      setSecurityLoading(false);
    }
  };

  const handleSwitchRole = async (targetRole) => {
    try {
      const res = await apiRequest("/auth/switch-role", {
        method: "POST",
        body: JSON.stringify({ role: targetRole }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to switch profiles");
      }
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      
      if (targetRole === "Employer") {
        router.push("/dashboard/employer");
      } else {
        router.push("/dashboard/seeker");
      }
    } catch (err) {
      alert(err.message || "Error switching profiles");
    }
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
              onClick={() => setActiveTab("talents")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "talents" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <Search size={18} /> Find Talent
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "messages" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <MessageSquare size={18} /> Interview Chats
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "profile" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <User size={18} /> My Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "security" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <Lock size={18} /> Security
            </button>
            {user?.roles && user.roles.includes("Service Seeker") && (
              <button
                onClick={() => handleSwitchRole("Service Seeker")}
                className="w-full px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 bg-amber-500/5 transition-all mt-4"
              >
                <Briefcase size={18} /> Switch to Seeker
              </button>
            )}
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
                        <div 
                          key={app._id} 
                          onClick={() => setSelectedProposalForPopup(app)}
                          className="p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-4 cursor-pointer hover:border-white/10 transition-colors"
                        >
                          
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
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide font-sans">Candidate Proposal (Click card for details)</label>
                            <p className="text-sm text-zinc-300 leading-relaxed font-sans line-clamp-2">{app.proposal}</p>
                          </div>

                          {/* Candidate details */}
                          <div className="flex flex-wrap items-center gap-5 pt-2 text-xs">
                            <div className="flex items-center gap-1 text-amber-400">
                              <Star size={14} fill="currentColor" className="shrink-0" />
                              <span className="font-bold">{app.seekerId.rating || 5.0}</span>
                              <span className="text-zinc-500">({app.seekerId.reviewCount || 0} reviews)</span>
                            </div>
                            <div className="text-zinc-500">
                              Completed Similar Jobs: <strong className="text-zinc-300">{app.completedSimilarJobsCount || 0}</strong>
                            </div>
                          </div>

                          {/* Action Bar */}
                          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5 justify-end" onClick={(e) => e.stopPropagation()}>
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
                      {candidateRecommendations.slice((aiPage - 1) * 5, aiPage * 5).map((rec, idx) => (
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

                      {/* AI Recommendations Pagination Controls */}
                      {candidateRecommendations.length > 5 && (
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <button
                            disabled={aiPage <= 1}
                            onClick={() => setAiPage((p) => Math.max(1, p - 1))}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-colors text-xs font-semibold"
                          >
                            Prev
                          </button>
                          <span className="text-[10px] text-zinc-500">
                            Page {aiPage} of {Math.ceil(candidateRecommendations.length / 5)}
                          </span>
                          <button
                            disabled={aiPage >= Math.ceil(candidateRecommendations.length / 5)}
                            onClick={() => setAiPage((p) => p + 1)}
                            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-colors text-xs font-semibold"
                          >
                            Next
                          </button>
                        </div>
                      )}
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

        {/* ================= TAB: PROFILE ================= */}
        {activeTab === "profile" && (
          <div className="flex flex-col gap-6 max-w-3xl">
            <div>
              <h2 className="text-3xl font-extrabold">Employer Profile</h2>
              <p className="text-sm text-zinc-400 mt-1">Keep your business information updated to attract top professionals</p>
            </div>

            {profileMessage && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex items-center gap-2">
                <Check size={18} />
                <span>{profileMessage}</span>
              </div>
            )}

            {profileError && (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm">
                {profileError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {/* Profile Picture Upload Section (File Only) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Company Logo / Profile Pic</label>
                <div className="flex items-center gap-4">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Company Logo Preview" className="w-20 h-20 rounded-xl object-cover border border-white/10" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 text-xs">No Logo</div>
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setProfilePicture(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-zinc-400"
                    />
                  </div>
                </div>
              </div>

              {/* Disabled Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Owner / Employer Name</label>
                  <input
                    type="text"
                    disabled
                    value={user?.fullName || ""}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/5 text-sm text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Email Address (Read-Only)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/5 text-sm text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Business / Company Name</label>
                  <input
                    type="text"
                    required
                    value={profileCompanyName}
                    onChange={(e) => setProfileCompanyName(e.target.value)}
                    placeholder="Acme Corporation"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Number of Employees</label>
                  <select
                    value={profileEmployeesCount}
                    onChange={(e) => setProfileEmployeesCount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200"
                  >
                    <option value="1 - 10">1 - 10 employees</option>
                    <option value="10 - 50">10 - 50 employees</option>
                    <option value="50 - 100">50 - 100 employees</option>
                    <option value="100+">100+ employees</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">City (Pakistan Location)</label>
                  <select
                    value={user?.city || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/60 border border-white/5 text-sm text-zinc-500 cursor-not-allowed"
                  >
                    <option value={user?.city || ""}>{user?.city || ""}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Contact Phone Number</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Business Address</label>
                  <input
                    type="text"
                    required
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    placeholder="e.g. Sector F-7, Islamabad"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Google Maps Location Link</label>
                  <input
                    type="text"
                    value={profileGoogleMapsLink}
                    onChange={(e) => setProfileGoogleMapsLink(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Company Bio / Description</label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="px-6 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all glow-btn"
              >
                {profileLoading ? "Updating Profile..." : "Save Profile Details"}
              </button>

            </form>
          </div>
        )}

        {/* ================= TAB: SECURITY ================= */}
        {activeTab === "security" && (
          <div className="flex flex-col gap-6 max-w-xl">
            <div>
              <h2 className="text-3xl font-extrabold">Security Settings</h2>
              <p className="text-sm text-zinc-400 mt-1">Change your account password securely. Requires validation of your current password.</p>
            </div>

            {securityMessage && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                <Check size={18} />
                <span>{securityMessage}</span>
              </div>
            )}

            {securityError && (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm">
                {securityError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-6 bg-zinc-950 p-6 rounded-2xl border border-white/5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={securityLoading}
                className="px-6 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all glow-btn"
              >
                {securityLoading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB: TALENTS ================= */}
        {activeTab === "talents" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-extrabold">Find Talent</h2>
              <p className="text-sm text-zinc-400 mt-1">Search and filter service seekers and freelance candidates by skill or city</p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-zinc-950 border border-white/5">
              <div className="relative flex items-center">
                <span className="absolute left-4 text-zinc-500"><Search size={16} /></span>
                <input
                  type="text"
                  value={talentQuery}
                  onChange={(e) => { setTalentQuery(e.target.value); setTalentPage(1); }}
                  placeholder="Keywords, skills, names..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 focus:border-blue-500/50 outline-none text-sm text-zinc-200"
                />
              </div>

              <select
                value={talentCity}
                onChange={(e) => { setTalentCity(e.target.value); setTalentPage(1); }}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 outline-none text-sm text-zinc-400"
              >
                <option value="">All Cities</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <button
                onClick={fetchTalents}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all"
              >
                Search Candidates
              </button>
            </div>

            {talentsLoading ? (
              <span className="text-sm text-zinc-500 font-sans">Querying service seekers...</span>
            ) : talents.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white/5 border border-white/5 text-zinc-500 text-sm font-sans">
                No matching talents found. Try checking your spelling or filters.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {talents.map((talent) => (
                    <div
                      key={talent._id}
                      className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-4">
                          {talent.profilePicture ? (
                            <img
                              src={talent.profilePicture}
                              alt={talent.fullName}
                              className="w-14 h-14 rounded-full object-cover border border-white/10 shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 text-xs shrink-0 font-bold font-sans">
                              {talent.fullName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-lg text-zinc-200">{talent.fullName}</h4>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 font-sans">
                              <span className="flex items-center gap-1 text-zinc-500"><MapPin size={12} /> {talent.city}</span>
                              {talent.hourlyRate > 0 && (
                                <span className="font-semibold text-blue-400">• PKR {talent.hourlyRate.toLocaleString()} / hr</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {talent.bio && (
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">{talent.bio}</p>
                        )}

                        {talent.skills && talent.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {talent.skills.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[10px] text-zinc-400 font-sans">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs pt-1">
                          <div className="flex items-center gap-1 text-amber-400">
                            <Star size={14} fill="currentColor" />
                            <span className="font-bold font-sans">{talent.rating || 5.0}</span>
                            <span className="text-zinc-500 font-sans">({talent.reviewCount || 0} reviews)</span>
                          </div>
                          <div className="text-zinc-500 font-sans">
                            Exp: <strong className="text-zinc-300">{talent.experience || 0} yrs</strong>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4 flex justify-between items-center mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-semibold uppercase font-sans">
                          {talent.availability || "Available"}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedProposalForPopup({
                              seekerId: talent,
                              proposal: "This is a direct profile inspection via the Find Talent directory.",
                              expectedSalary: talent.hourlyRate || 0,
                              estimatedTime: "N/A",
                              dummy: true,
                            });
                          }}
                          className="px-3.5 py-1.5 bg-white text-black hover:bg-zinc-200 text-xs font-bold rounded-lg transition-colors"
                        >
                          View Full Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-white/5 mt-4">
                  <span className="text-xs text-zinc-400 font-sans">
                    Showing {(talentPage - 1) * talentLimit + 1} - {Math.min(talentPage * talentLimit, totalTalents)} of {totalTalents} talents
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={talentPage <= 1}
                      onClick={() => setTalentPage((p) => Math.max(1, p - 1))}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-colors text-xs font-semibold"
                    >
                      Previous
                    </button>
                    <button
                      disabled={talentPage >= Math.ceil(totalTalents / talentLimit)}
                      onClick={() => setTalentPage((p) => p + 1)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-colors text-xs font-semibold"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
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

      {/* ================= MODAL: PROPOSAL DETAIL POPUP ================= */}
      {selectedProposalForPopup && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/5 pb-5">
              <div className="flex items-center gap-4">
                {selectedProposalForPopup.seekerId.profilePicture ? (
                  <img
                    src={selectedProposalForPopup.seekerId.profilePicture}
                    alt={selectedProposalForPopup.seekerId.fullName}
                    className="w-16 h-16 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500 font-bold text-lg font-sans">
                    {selectedProposalForPopup.seekerId.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-zinc-100">{selectedProposalForPopup.seekerId.fullName}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 mt-1 font-sans">
                    <span className="flex items-center gap-1"><MapPin size={13} /> {selectedProposalForPopup.seekerId.city}</span>
                    {selectedProposalForPopup.seekerId.hourlyRate > 0 && (
                      <span className="font-semibold text-blue-400">• Standard Hourly Rate: PKR {selectedProposalForPopup.seekerId.hourlyRate.toLocaleString()} / hr</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProposalForPopup(null)}
                className="text-zinc-500 hover:text-zinc-300 font-bold text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Proposal Details & About */}
              <div className="md:col-span-2 space-y-5">
                
                {/* Proposal Bid Details */}
                <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide font-sans">Proposal Details</h4>
                  
                  {!selectedProposalForPopup.dummy && (
                    <div className="grid grid-cols-2 gap-4 text-xs border-b border-white/5 pb-3 font-sans">
                      <div>
                        <span className="text-zinc-500 block">Bid Value</span>
                        <strong className="text-zinc-200 text-sm">
                          PKR {selectedProposalForPopup.expectedSalary?.toLocaleString()}{selectedJob?.workType === "Hourly" ? " / hr" : ""}
                        </strong>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Estimated Time</span>
                        <strong className="text-zinc-200 text-sm">{selectedProposalForPopup.estimatedTime}</strong>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-zinc-500 block text-xs font-sans">Proposal Statement</span>
                    <p className="text-sm text-zinc-300 leading-relaxed font-sans whitespace-pre-wrap">
                      {selectedProposalForPopup.proposal}
                    </p>
                  </div>
                </div>

                {/* Biography */}
                {selectedProposalForPopup.seekerId.bio && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide font-sans">Biography</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                      {selectedProposalForPopup.seekerId.bio}
                    </p>
                  </div>
                )}

                {/* Skills */}
                {selectedProposalForPopup.seekerId.skills && selectedProposalForPopup.seekerId.skills.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide font-sans">Candidate Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProposalForPopup.seekerId.skills.map((s, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-full bg-zinc-900 border border-white/5 text-xs text-zinc-300 font-sans">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Contact Links & Info */}
              <div className="space-y-5">
                
                {/* Links Section */}
                <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide font-sans">Documents & Links</h4>
                  
                  {/* Resume Link */}
                  <div className="space-y-1 font-sans">
                    <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Resume / CV</span>
                    {selectedProposalForPopup.seekerId.resume ? (
                      <a
                        href={selectedProposalForPopup.seekerId.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5 break-all font-sans"
                      >
                        <Link size={12} /> {selectedProposalForPopup.seekerId.resume}
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-600 italic">No resume uploaded</span>
                    )}
                  </div>

                  {/* Portfolio Website Link */}
                  <div className="space-y-1 font-sans">
                    <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Portfolio Website</span>
                    {selectedProposalForPopup.seekerId.portfolioWebsite ? (
                      <a
                        href={selectedProposalForPopup.seekerId.portfolioWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1.5 break-all font-sans"
                      >
                        <Link size={12} /> {selectedProposalForPopup.seekerId.portfolioWebsite}
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-600 italic">No website provided</span>
                    )}
                  </div>
                </div>

                {/* Candidate Stats */}
                <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/5 space-y-3 text-xs font-sans">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Professional Stats</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Rating</span>
                    <span className="font-bold text-amber-400 flex items-center gap-0.5">
                      ★ {selectedProposalForPopup.seekerId.rating || 5}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Reviews</span>
                    <span className="font-bold text-zinc-300">{selectedProposalForPopup.seekerId.reviewCount || 0} reviews</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-500">Experience</span>
                    <span className="font-bold text-zinc-300">{selectedProposalForPopup.seekerId.experience || 0} years</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Portfolio Projects Section */}
            {selectedProposalForPopup.seekerId.portfolio && selectedProposalForPopup.seekerId.portfolio.length > 0 && (
              <div className="border-t border-white/5 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                  <LayoutGrid size={16} /> Portfolio Case Studies ({selectedProposalForPopup.seekerId.portfolio.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedProposalForPopup.seekerId.portfolio.map((proj, pIdx) => (
                    <div key={pIdx} className="p-5 rounded-xl bg-zinc-900/35 border border-white/5 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h5 className="font-bold text-zinc-200">{proj.title}</h5>
                        {proj.role && (
                          <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block font-sans">Role: {proj.role}</span>
                        )}
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">{proj.description}</p>
                        
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.technologies.map((t, tIdx) => (
                              <span key={tIdx} className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-zinc-400 font-semibold font-sans">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Case Study Image Gallery */}
                      {proj.images && proj.images.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[9px] font-bold text-zinc-500 uppercase block pb-1 font-sans">Project Screenshots</span>
                          <div className="flex flex-wrap gap-2">
                            {proj.images.map((img, imgIdx) => (
                              <img
                                key={imgIdx}
                                src={img}
                                alt={`case-study-screenshot-${imgIdx}`}
                                className="w-20 h-16 object-cover rounded border border-white/10 hover:scale-105 transition-transform cursor-pointer"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
