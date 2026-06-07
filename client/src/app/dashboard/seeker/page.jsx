"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Briefcase, Search, FileText, MessageSquare, User, 
  MapPin, CheckCircle, Clock, XCircle, Send, Plus, Trash2, LogOut, Check
} from "lucide-react";

const CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Faisalabad", "Peshawar", "Multan", "Sialkot"];

export default function SeekerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("matches"); // matches, explore, applications, messages, profile
  const [user, setUser] = useState(null);
  
  // Recommendations state
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recPage, setRecPage] = useState(1);
  const [recLimit, setRecLimit] = useState(10);

  // Explore jobs state
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalJobs, setTotalJobs] = useState(0);
  const [visitedJobs, setVisitedJobs] = useState([]);
  const [exploreLoading, setExploreLoading] = useState(false);

  // Applications state
  const [applications, setApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(false);

  // Chats state
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);

  // Profile Form state
  const [profileBio, setProfileBio] = useState("");
  const [profileSkills, setProfileSkills] = useState("");
  const [profileCity, setProfileCity] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileExperience, setProfileExperience] = useState(0);
  const [profileAvailability, setProfileAvailability] = useState("");
  const [portfolioTitle, setPortfolioTitle] = useState("");
  const [portfolioDesc, setPortfolioDesc] = useState("");
  const [portfolioTech, setPortfolioTech] = useState("");
  const [portfolioList, setPortfolioList] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // Modal application state
  const [applyingJob, setApplyingJob] = useState(null);
  const [proposalText, setProposalText] = useState("");
  const [expectedSalary, setExpectedSalary] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState("");
  const [appError, setAppError] = useState("");
  const [appSubmitLoading, setAppSubmitLoading] = useState(false);

  // Load user details
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);
    
    // Load initial profile values
    setProfileBio(parsedUser.bio || "");
    setProfileSkills(parsedUser.skills ? parsedUser.skills.join(", ") : "");
    setProfileCity(parsedUser.city || "");
    setProfilePhone(parsedUser.phone || "");
    setProfileExperience(parsedUser.experience || 0);
    setProfileAvailability(parsedUser.availability || "");

    // Load visited jobs
    const savedVisited = localStorage.getItem("visitedJobs");
    if (savedVisited) {
      setVisitedJobs(JSON.parse(savedVisited));
    }
  }, [router]);

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

  // Fetch Recommended Jobs (AI matching)
  const fetchRecommendations = useCallback(async () => {
    if (!user) return;
    setRecLoading(true);
    try {
      const res = await apiRequest("/jobs/recommendations");
      const result = await res.json();
      if (result.success) {
        setRecommendedJobs(result.data);
      }
    } catch (err) {
      console.error("Failed to load AI matches", err);
    } finally {
      setRecLoading(false);
    }
  }, [user, apiRequest]);

  // Fetch Explore Jobs list
  const fetchExploreJobs = useCallback(async () => {
    setExploreLoading(true);
    try {
      let query = `?page=${page}&limit=${limit}`;
      if (searchQuery) query += `&search=${encodeURIComponent(searchQuery)}`;
      if (selectedCategory) query += `&category=${encodeURIComponent(selectedCategory)}`;
      if (selectedServiceType) query += `&serviceType=${encodeURIComponent(selectedServiceType)}`;
      if (selectedLocation) query += `&location=${encodeURIComponent(selectedLocation)}`;
      if (selectedWorkType) query += `&workType=${encodeURIComponent(selectedWorkType)}`;

      const res = await apiRequest(`/jobs${query}`);
      const result = await res.json();
      if (result.success) {
        setJobs(result.data.jobs);
        setTotalJobs(result.data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch jobs list", err);
    } finally {
      setExploreLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedServiceType, selectedLocation, selectedWorkType, page, limit, apiRequest]);

  // Fetch Applications status
  const fetchApplications = useCallback(async () => {
    setAppLoading(true);
    try {
      const res = await apiRequest("/applications?page=1&limit=100");
      const result = await res.json();
      if (result.success) {
        setApplications(result.data.applications);
      }
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setAppLoading(false);
    }
  }, [apiRequest]);

  // Load applications on user state change to help display "Applied" state properly
  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user, fetchApplications]);

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

  // Reset pages on active tab change
  useEffect(() => {
    setPage(1);
    setRecPage(1);
  }, [activeTab]);

  // Trigger loading based on active tab selection
  useEffect(() => {
    if (!user) return;
    if (activeTab === "matches") {
      fetchRecommendations();
    } else if (activeTab === "explore") {
      fetchExploreJobs();
    } else if (activeTab === "applications") {
      fetchApplications();
    } else if (activeTab === "messages") {
      fetchChats();
    } else if (activeTab === "profile") {
      // Load detailed profile
      apiRequest("/auth/profile")
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            setPortfolioList(result.data.portfolio || []);
          }
        });
    }
  }, [activeTab, user, fetchRecommendations, fetchExploreJobs, fetchApplications, fetchChats, apiRequest]);

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
        // Refresh chat list to update order/seen state
        fetchChats();
      } else {
        alert(result.message || "Failed to send message. Messaging may be locked.");
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage("");

    const skills = profileSkills
      ? profileSkills.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
      : [];

    const payload = {
      bio: profileBio,
      skills,
      city: profileCity,
      phone: profilePhone,
      experience: Number(profileExperience),
      availability: profileAvailability,
      portfolio: portfolioList,
    };

    try {
      const res = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setProfileMessage("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(result.data));
        setUser(result.data);
      } else {
        setProfileMessage(result.message || "Failed to update profile");
      }
    } catch (err) {
      setProfileMessage("Failed to connect to server");
    } finally {
      setProfileLoading(false);
    }
  };

  // Add portfolio project
  const handleAddPortfolio = () => {
    if (!portfolioTitle || !portfolioDesc) return;
    const newProject = {
      title: portfolioTitle,
      description: portfolioDesc,
      technologies: portfolioTech.split(",").map((t) => t.trim()).filter((t) => t.length > 0),
    };
    setPortfolioList((prev) => [...prev, newProject]);
    setPortfolioTitle("");
    setPortfolioDesc("");
    setPortfolioTech("");
  };

  // Delete portfolio project
  const handleDeletePortfolio = (idx) => {
    setPortfolioList((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit job application
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setAppError("");
    setAppSubmitLoading(true);

    try {
      const res = await apiRequest("/applications", {
        method: "POST",
        body: JSON.stringify({
          jobId: applyingJob._id,
          proposal: proposalText,
          expectedSalary: Number(expectedSalary),
          availability: "Immediate Start",
          estimatedTime,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Application submitted successfully!");
        setApplyingJob(null);
        setProposalText("");
        setExpectedSalary(0);
        setEstimatedTime("");
        // Refresh Explore tab and user applications list
        fetchExploreJobs();
        fetchApplications();
      } else {
        setAppError(result.message || "Failed to apply.");
      }
    } catch (err) {
      setAppError("Server connection failed");
    } finally {
      setAppSubmitLoading(false);
    }
  };

  const handleJobCardClick = (jobId) => {
    const updatedVisited = [...new Set([...visitedJobs, jobId])];
    setVisitedJobs(updatedVisited);
    localStorage.setItem("visitedJobs", JSON.stringify(updatedVisited));
    router.push(`/jobs/${jobId}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  // Client-side pagination slice for AI Match Feed
  const startIndex = (recPage - 1) * recLimit;
  const paginatedRecommendations = recommendedJobs.slice(startIndex, startIndex + recLimit);

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

          {/* User Bio Summary */}
          {user && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-2.5">
              <span className="text-sm font-bold text-zinc-300">{user.fullName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold self-start uppercase">
                {user.role}
              </span>
              <div className="w-full space-y-1 mt-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Profile Strength</span>
                  <span className="font-semibold text-zinc-300">{user.profileCompletion}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full" style={{ width: `${user.profileCompletion}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("matches")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "matches" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <Sparkles size={18} /> AI Match Feed
            </button>
            <button
              onClick={() => setActiveTab("explore")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "explore" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <Search size={18} /> Explore Jobs
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "applications" ? "bg-white text-black font-semibold" : "text-zinc-400 hover:bg-white/5"}`}
            >
              <FileText size={18} /> Applications
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
        
        {/* ================= TAB: MATCHES ================= */}
        {activeTab === "matches" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-extrabold flex items-center gap-2">
                <Sparkles className="text-yellow-400" /> AI-Recommended Jobs
              </h2>
              <p className="text-sm text-zinc-400 mt-1">Sourced and sorted descending by match score. Highest compatibility shown first.</p>
            </div>

            {recLoading ? (
              <span className="text-sm text-zinc-500">Calculating cosine similarity coefficients...</span>
            ) : recommendedJobs.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white/5 border border-white/5 text-zinc-500 text-sm">
                No active job recommendations found. Try adding more skills to your profile.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6">
                  {paginatedRecommendations.map((rec) => (
                    <div 
                      key={rec.job._id} 
                      onClick={() => handleJobCardClick(rec.job._id)}
                      className={`glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 cursor-pointer border ${visitedJobs.includes(rec.job._id) ? "border-zinc-700/60 bg-zinc-950/20" : "border-white/5"}`}
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold">{rec.job.title}</h3>
                          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold font-sans">
                            {rec.score}% Match Rate
                          </span>
                          {visitedJobs.includes(rec.job._id) && (
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-white/5 text-[9px] font-bold tracking-wider uppercase font-sans">
                              Visited
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">{rec.job.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {rec.job.location}</span>
                          <span className="flex items-center gap-1"><Briefcase size={14} /> {rec.job.serviceType} • {rec.job.workType}</span>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-semibold border border-white/5">{rec.job.experienceLevel}</span>
                          {rec.job.timeline && (
                            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-semibold border border-white/5">{rec.job.timeline}</span>
                          )}
                          <span className="font-semibold text-zinc-300">Budget: PKR {rec.job.budget.toLocaleString()}{rec.job.workType === "Hourly" ? " / hr" : ""}</span>
                        </div>

                        {/* AI Explainable Reasons */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {rec.reason.map((res, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-400 font-semibold font-sans">
                              {res}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        {applications.some((app) => app.jobId && (app.jobId._id ? app.jobId._id === rec.job._id : app.jobId === rec.job._id)) ? (
                          <span 
                            onClick={(e) => e.stopPropagation()}
                            className="px-5 py-2.5 bg-zinc-900 text-zinc-500 border border-white/5 font-bold text-sm rounded-xl cursor-not-allowed select-none self-end md:self-center shrink-0"
                          >
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setApplyingJob(rec.job);
                              setExpectedSalary(rec.job.budget);
                              setAppError("");
                              setProposalText("");
                            }}
                            className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 font-bold text-sm rounded-xl transition-all self-end md:self-center shrink-0"
                          >
                            Apply Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-white/5 mt-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <span>Show:</span>
                    <select
                      value={recLimit}
                      onChange={(e) => {
                        setRecLimit(Number(e.target.value));
                        setRecPage(1);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 outline-none text-xs text-zinc-300"
                    >
                      <option value={10}>10 recommendations</option>
                      <option value={20}>20 recommendations</option>
                      <option value={50}>50 recommendations</option>
                    </select>
                  </div>

                  <span className="text-xs text-zinc-400">
                    Page {recPage} of {Math.max(1, Math.ceil(recommendedJobs.length / recLimit))}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={recPage <= 1}
                      onClick={() => setRecPage((p) => Math.max(1, p - 1))}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-colors text-xs font-semibold"
                    >
                      Previous
                    </button>
                    <button
                      disabled={recPage >= Math.ceil(recommendedJobs.length / recLimit)}
                      onClick={() => setRecPage((p) => p + 1)}
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

        {/* ================= TAB: EXPLORE ================= */}
        {activeTab === "explore" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-extrabold">Explore Job Board</h2>
              <p className="text-sm text-zinc-400 mt-1">Search and filter active online and local opportunities</p>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 rounded-xl bg-zinc-950 border border-white/5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search keywords, skills..."
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 focus:border-blue-500/50 outline-none text-sm w-full"
              />
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 outline-none text-sm text-zinc-400 w-full"
              >
                <option value="">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="UI/UX & Web Design">UI/UX & Web Design</option>
                <option value="AC & Fridge Services">AC & Fridge Services</option>
                <option value="Electrical Wiring & Repair">Electrical Wiring & Repair</option>
              </select>
              <select
                value={selectedServiceType}
                onChange={(e) => { setSelectedServiceType(e.target.value); setPage(1); }}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 outline-none text-sm text-zinc-400 w-full"
              >
                <option value="">Any Service Type</option>
                <option value="Online">Online (Freelance)</option>
                <option value="Physical">Physical (Local)</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <select
                value={selectedWorkType}
                onChange={(e) => { setSelectedWorkType(e.target.value); setPage(1); }}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 outline-none text-sm text-zinc-400 w-full"
              >
                <option value="">Any Contract Type</option>
                <option value="Project">Project-Based</option>
                <option value="Hourly">Hourly Rate</option>
                <option value="Monthly">Monthly Retainer</option>
                <option value="Full-Time">Full-Time Job</option>
              </select>
              <button
                onClick={fetchExploreJobs}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all w-full"
              >
                Filter Board
              </button>
            </div>

            {exploreLoading ? (
              <span className="text-sm text-zinc-500">Querying listings...</span>
            ) : jobs.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white/5 border border-white/5 text-zinc-500 text-sm">
                No matching jobs found on the listing board.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6">
                  {jobs.map((job) => (
                    <div 
                      key={job._id} 
                      onClick={() => handleJobCardClick(job._id)}
                      className={`glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 cursor-pointer border ${visitedJobs.includes(job._id) ? "border-zinc-700/60 bg-zinc-950/20" : "border-white/5"}`}
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          {visitedJobs.includes(job._id) && (
                            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 border border-white/5 text-[9px] font-bold tracking-wider uppercase font-sans">
                              Visited
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-2 pt-1">
                          {job.requiredSkills.map((sk, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-zinc-900 border border-white/5 text-xs text-zinc-400 font-sans">
                              {sk}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                          <span className="flex items-center gap-1"><Briefcase size={14} /> {job.serviceType} • {job.workType}</span>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-semibold border border-white/5">{job.experienceLevel}</span>
                          {job.timeline && (
                            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-semibold border border-white/5">{job.timeline}</span>
                          )}
                          <span className="font-semibold text-zinc-300">PKR {job.budget.toLocaleString()}{job.workType === "Hourly" ? " / hr" : ""}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        {applications.some((app) => app.jobId && (app.jobId._id ? app.jobId._id === job._id : app.jobId === job._id)) ? (
                          <span 
                            onClick={(e) => e.stopPropagation()}
                            className="px-5 py-2.5 bg-zinc-900 text-zinc-500 border border-white/5 font-bold text-sm rounded-xl cursor-not-allowed select-none"
                          >
                            Applied
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setApplyingJob(job);
                              setExpectedSalary(job.budget);
                              setAppError("");
                              setProposalText("");
                            }}
                            className="px-5 py-2.5 bg-white text-black hover:bg-zinc-200 font-bold text-sm rounded-xl transition-all shrink-0"
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-white/5 mt-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <span>Show:</span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-white/10 outline-none text-xs text-zinc-300"
                    >
                      <option value={10}>10 jobs</option>
                      <option value={20}>20 jobs</option>
                      <option value={50}>50 jobs</option>
                    </select>
                  </div>

                  <span className="text-xs text-zinc-400">
                    Page {page} of {Math.max(1, Math.ceil(totalJobs / limit))}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-white/5 transition-colors text-xs font-semibold"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page >= Math.ceil(totalJobs / limit)}
                      onClick={() => setPage((p) => p + 1)}
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

        {/* ================= TAB: APPLICATIONS ================= */}
        {activeTab === "applications" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-extrabold">My Submitted Applications</h2>
              <p className="text-sm text-zinc-400 mt-1">Review status progression and interview calls</p>
            </div>

            {appLoading ? (
              <span className="text-sm text-zinc-500">Loading pipelines...</span>
            ) : applications.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white/5 border border-white/5 text-zinc-500 text-sm">
                You haven't submitted any job applications yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => (
                  <div key={app._id} className="p-5 rounded-2xl bg-zinc-950 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg">{app.jobId ? app.jobId.title : "Deleted Job"}</h4>
                      <p className="text-xs text-zinc-500">
                        Submitted on: {new Date(app.createdAt).toLocaleDateString()} • Expected: PKR {app.expectedSalary?.toLocaleString()}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {app.status === "Interview" && (
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center gap-1.5 font-sans">
                          <Clock size={12} /> Interview Scheduled
                        </span>
                      )}
                      {app.status === "Applied" && (
                        <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-white/5 text-xs font-semibold flex items-center gap-1.5 font-sans">
                          <Clock size={12} /> Applied
                        </span>
                      )}
                      {app.status === "Pending" && (
                        <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 text-xs font-semibold flex items-center gap-1.5 font-sans">
                          <Clock size={12} /> Pending
                        </span>
                      )}
                      {app.status === "Reviewed" && (
                        <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 font-sans">
                          <Clock size={12} /> Under Review
                        </span>
                      )}
                      {app.status === "Accepted" && (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold flex items-center gap-1.5 font-sans">
                          <CheckCircle size={12} /> Offer Extended
                        </span>
                      )}
                      {app.status === "Hired" && (
                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-semibold flex items-center gap-1.5 font-sans">
                          <CheckCircle size={12} /> Active Contract
                        </span>
                      )}
                      {app.status === "Completed" && (
                        <span className="px-3 py-1 rounded-full bg-green-500 text-black border border-green-500 text-xs font-semibold flex items-center gap-1.5 font-sans">
                          <CheckCircle size={12} /> Completed
                        </span>
                      )}
                      {app.status === "Rejected" && (
                        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold flex items-center gap-1.5 font-sans">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: MESSAGES ================= */}
        {activeTab === "messages" && (
          <div className="flex flex-col gap-6 h-[80vh]">
            <div>
              <h2 className="text-3xl font-extrabold">Interview Channels</h2>
              <p className="text-sm text-zinc-400 mt-1">Communicate directly with hiring managers during the interview stage</p>
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
                          <span>With: {ch.employerId.fullName}</span>
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
                      <p className="text-xs text-zinc-500">Employer: {activeChat.employerId.fullName}</p>
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
              <h2 className="text-3xl font-extrabold">Service Seeker Profile</h2>
              <p className="text-sm text-zinc-400 mt-1">Keep your skills and portfolio updated to improve your match score</p>
            </div>

            {profileMessage && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex items-center gap-2">
                <Check size={18} />
                <span>{profileMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">City (Pakistan Location)</label>
                  <select
                    value={profileCity}
                    onChange={(e) => setProfileCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Phone Number</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Years of Experience</label>
                  <input
                    type="number"
                    value={profileExperience}
                    onChange={(e) => setProfileExperience(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Availability Note</label>
                  <input
                    type="text"
                    value={profileAvailability}
                    onChange={(e) => setProfileAvailability(e.target.value)}
                    placeholder="e.g. Immediate full-time availability"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={profileSkills}
                  onChange={(e) => setProfileSkills(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Professional Bio</label>
                <textarea
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                />
              </div>

              {/* Portfolio Add Control */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-white/5 space-y-4">
                <h3 className="font-bold text-lg">Add Portfolio Project</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={portfolioTitle}
                    onChange={(e) => setPortfolioTitle(e.target.value)}
                    placeholder="Project Title"
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm"
                  />
                  <input
                    type="text"
                    value={portfolioTech}
                    onChange={(e) => setPortfolioTech(e.target.value)}
                    placeholder="Technologies (comma separated)"
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm"
                  />
                </div>
                <textarea
                  value={portfolioDesc}
                  onChange={(e) => setPortfolioDesc(e.target.value)}
                  placeholder="Provide a detailed description of the project, including scope, role, and details. The AI vectorizer will parse this description to match jobs."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddPortfolio}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Project Item
                </button>

                {/* Portfolio List */}
                {portfolioList.length > 0 && (
                  <div className="pt-4 border-t border-white/5 space-y-2.5">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Added Projects</label>
                    <div className="grid grid-cols-1 gap-3">
                      {portfolioList.map((proj, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-between gap-4">
                          <div>
                            <h5 className="font-bold text-sm text-zinc-200">{proj.title}</h5>
                            <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{proj.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeletePortfolio(idx)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

      </main>

      {/* ================= MODAL: APPLY FORM ================= */}
      {applyingJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-white/10 p-6 md:p-8 rounded-2xl space-y-6 relative">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Apply for Job Listing</h3>
              <p className="text-sm text-zinc-400 mt-1">Submit proposal for: "{applyingJob.title}"</p>
            </div>

            {appError && (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm">
                {appError}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                  {applyingJob.workType === "Hourly" ? "Expected Hourly Rate Bid (PKR/hr)" : "My Bid / Expected Salary (PKR)"}
                </label>
                <input
                  type="number"
                  required
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200"
                />
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
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Job Proposal Details</label>
                <textarea
                  required
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  placeholder="Detail your experience in relation to the required skills. Highlight projects where you did similar work..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-sm text-zinc-200 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-sm rounded-xl border border-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={appSubmitLoading}
                  className="px-6 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50"
                >
                  {appSubmitLoading ? "Submitting..." : "Submit Proposal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
