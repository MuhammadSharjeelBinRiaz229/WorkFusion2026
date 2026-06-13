"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, Briefcase, Search, FileText, MessageSquare, User, 
  MapPin, CheckCircle, Clock, XCircle, Send, Plus, Trash2, LogOut, Check, Lock,
  LayoutGrid, Link, Star, Globe, Mail, Phone, Eye, ExternalLink, Pencil, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../../../components/ThemeToggle";

const CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Faisalabad", "Peshawar", "Multan", "Sialkot"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 25
    }
  }
};

export default function SeekerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("matches"); // matches, explore, applications, messages, profile, security
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Recommendations state
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recPage, setRecPage] = useState(1);
  const [recLimit, setRecLimit] = useState(5);

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
  const [profileResume, setProfileResume] = useState("");
  const [profilePortfolioWebsite, setProfilePortfolioWebsite] = useState("");
  const [profilePreferredJobTypes, setProfilePreferredJobTypes] = useState([]);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [portfolioRole, setPortfolioRole] = useState("");
  const [portfolioImages, setPortfolioImages] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [profileHourlyRate, setProfileHourlyRate] = useState(0);
  const [profileMode, setProfileMode] = useState("preview"); // preview, edit
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [editingPortfolioIdx, setEditingPortfolioIdx] = useState(null);

  // Security password update states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);

  // Employer Profile Expansion form states
  const [showAddEmployer, setShowAddEmployer] = useState(false);
  const [companyBio, setCompanyBio] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyCity, setCompanyCity] = useState("Islamabad");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPic, setCompanyPic] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyEmployeesCount, setCompanyEmployeesCount] = useState("1 - 10");
  const [companyGoogleMapsLink, setCompanyGoogleMapsLink] = useState("");
  const [addEmpLoading, setAddEmpLoading] = useState(false);
  const [addEmpError, setAddEmpError] = useState("");

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
    setProfilePicture(parsedUser.profilePicture || "");
    setPortfolioList(parsedUser.portfolio || []);
    setProfileResume(parsedUser.resume || "");
    setProfilePortfolioWebsite(parsedUser.portfolioWebsite || "");
    setProfilePreferredJobTypes(parsedUser.preferredJobTypes || []);
    setProfileHourlyRate(parsedUser.hourlyRate || 0);

    // Load visited jobs
    const savedVisited = localStorage.getItem("visitedJobs");
    if (savedVisited) {
      setVisitedJobs(JSON.parse(savedVisited));
    }
  }, [router]);

  // API Request helper with auto token refresh
  const apiRequest = useCallback(async (endpoint, options = {}) => {
    let token = localStorage.getItem("accessToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    let res = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers,
    });
    if (res.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${apiUrl}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });
          if (refreshRes.ok) {
            const refreshResult = await refreshRes.json();
            if (refreshResult.success && refreshResult.data.accessToken) {
              const newAccessToken = refreshResult.data.accessToken;
              localStorage.setItem("accessToken", newAccessToken);
              const retryHeaders = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${newAccessToken}`,
                ...options.headers,
              };
              res = await fetch(`${apiUrl}${endpoint}`, {
                ...options,
                headers: retryHeaders,
              });
            }
          }
        } catch (err) {
          console.error("Token refresh failed:", err);
        }
      }
    }
    return res;
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
            localStorage.setItem("user", JSON.stringify(result.data));
            setUser(result.data);
          }
        });

      // Load user reviews dynamically
      const userId = user?.id || user?._id;
      if (userId) {
        setReviewsLoading(true);
        apiRequest(`/reviews/user/${userId}`)
          .then((res) => res.json())
          .then((result) => {
            if (result.success) {
              setReviews(result.data.reviews || []);
            }
          })
          .catch((err) => console.error("Failed to load reviews:", err))
          .finally(() => setReviewsLoading(false));
      }
    }
  }, [activeTab, user, fetchRecommendations, fetchExploreJobs, fetchApplications, fetchChats, apiRequest]);

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
      profilePicture: profilePicture,
      resume: profileResume,
      portfolioWebsite: profilePortfolioWebsite,
      preferredJobTypes: profilePreferredJobTypes,
      hourlyRate: Number(profileHourlyRate),
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

  const handleAddEmployerProfile = async (e) => {
    e.preventDefault();
    setAddEmpError("");
    setAddEmpLoading(true);

    try {
      const res = await apiRequest("/auth/add-profile", {
        method: "POST",
        body: JSON.stringify({
          role: "Employer",
          bio: companyBio,
          phone: companyPhone,
          city: companyCity,
          address: companyAddress,
          profilePicture: companyPic || profilePicture,
          companyName,
          employeesCount: companyEmployeesCount,
          googleMapsLink: companyGoogleMapsLink,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to add Employer profile");
      }

      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      router.push("/dashboard/employer");
    } catch (err) {
      setAddEmpError(err.message || "Failed to add Employer profile");
    } finally {
      setAddEmpLoading(false);
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

  // Add portfolio project
  const handleAddPortfolio = () => {
    if (!portfolioTitle || !portfolioDesc) return;
    const newProject = {
      title: portfolioTitle,
      description: portfolioDesc,
      technologies: portfolioTech.split(",").map((t) => t.trim()).filter((t) => t.length > 0),
      role: portfolioRole,
      images: portfolioImages,
    };
    setPortfolioList((prev) => [...prev, newProject]);
    setPortfolioTitle("");
    setPortfolioDesc("");
    setPortfolioTech("");
    setPortfolioRole("");
    setPortfolioImages([]);
  };

  // Populate form to edit project
  const handleEditPortfolioClick = (idx) => {
    const proj = portfolioList[idx];
    setEditingPortfolioIdx(idx);
    setPortfolioTitle(proj.title);
    setPortfolioDesc(proj.description);
    setPortfolioTech(proj.technologies ? proj.technologies.join(", ") : "");
    setPortfolioRole(proj.role || "");
    setPortfolioImages(proj.images || []);
  };

  // Update existing portfolio project
  const handleUpdatePortfolio = () => {
    if (editingPortfolioIdx === null || !portfolioTitle || !portfolioDesc) return;
    const updatedProject = {
      title: portfolioTitle,
      description: portfolioDesc,
      technologies: portfolioTech.split(",").map((t) => t.trim()).filter((t) => t.length > 0),
      role: portfolioRole,
      images: portfolioImages,
    };
    setPortfolioList((prev) => {
      const copy = [...prev];
      copy[editingPortfolioIdx] = updatedProject;
      return copy;
    });
    setEditingPortfolioIdx(null);
    setPortfolioTitle("");
    setPortfolioDesc("");
    setPortfolioTech("");
    setPortfolioRole("");
    setPortfolioImages([]);
  };

  // Cancel editing
  const handleCancelEditPortfolio = () => {
    setEditingPortfolioIdx(null);
    setPortfolioTitle("");
    setPortfolioDesc("");
    setPortfolioTech("");
    setPortfolioRole("");
    setPortfolioImages([]);
  };

  // Delete portfolio project
  const handleDeletePortfolio = (idx) => {
    setPortfolioList((prev) => prev.filter((_, i) => i !== idx));
    if (editingPortfolioIdx === idx) {
      setEditingPortfolioIdx(null);
      setPortfolioTitle("");
      setPortfolioDesc("");
      setPortfolioTech("");
      setPortfolioRole("");
      setPortfolioImages([]);
    } else if (editingPortfolioIdx !== null && editingPortfolioIdx > idx) {
      setEditingPortfolioIdx((prev) => prev - 1);
    }
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
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white transition-colors duration-300 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/5 flex-col p-6 gap-6 justify-between shrink-0">
        <div className="flex flex-col gap-8">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg">
              W
            </div>
            <span className="font-extrabold text-xl">
              Work<span className="text-blue-500 font-medium">Fusion</span>
            </span>
          </div>

          {/* User Bio Summary */}
          {user && (
            <div className="p-4 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 flex flex-col gap-2.5">
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{user.fullName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold self-start uppercase">
                {user.role}
              </span>
              <div className="w-full space-y-1 mt-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>Profile Strength</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{user.profileCompletion}%</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full" style={{ width: `${user.profileCompletion}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5 relative">
            {[
              { id: "matches", label: "AI Match Feed", icon: <Sparkles size={18} /> },
              { id: "explore", label: "Explore Jobs", icon: <Search size={18} /> },
              { id: "applications", label: "Applications", icon: <FileText size={18} /> },
              { id: "messages", label: "Interview Chats", icon: <MessageSquare size={18} /> },
              { id: "profile", label: "My Profile", icon: <User size={18} /> },
              { id: "security", label: "Security", icon: <Lock size={18} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
                  activeTab === item.id 
                    ? "text-zinc-900 dark:text-white font-bold" 
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="activeTabBgSeeker" 
                    className="absolute inset-0 bg-zinc-100 dark:bg-white/5 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.icon} {item.label}
              </button>
            ))}
            {user?.roles && user.roles.includes("Employer") && (
              <button
                onClick={() => handleSwitchRole("Employer")}
                className="w-full px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold text-blue-400 hover:bg-blue-500/10 border border-blue-500/20 bg-blue-500/5 transition-all mt-4"
              >
                <Briefcase size={18} /> Switch to Employer
              </button>
            )}
          </nav>

        </div>

        {/* Theme Toggle */}
        <div className="mb-2">
          <ThemeToggle />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Mobile Sticky Top Header */}
      <header className="md:hidden w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg">
            W
          </div>
          <span className="font-extrabold text-lg">
            Work<span className="text-blue-500 font-medium">Fusion</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Slide-over Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            {/* Sliding Panel */}
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-zinc-950 p-6 flex flex-col justify-between z-50 md:hidden shadow-2xl border-r border-zinc-200 dark:border-white/5"
            >
              <div className="flex flex-col gap-8">
                
                {/* Header inside drawer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg">
                      W
                    </div>
                    <span className="font-extrabold text-lg">
                      Work<span className="text-blue-500 font-medium">Fusion</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Profile summary inside drawer */}
                {user && (
                  <div className="p-4 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 flex flex-col gap-2.5">
                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{user.fullName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold self-start uppercase">
                      {user.role}
                    </span>
                    <div className="w-full space-y-1 mt-1.5">
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>Profile Strength</span>
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{user.profileCompletion}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full" style={{ width: `${user.profileCompletion}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation links inside drawer */}
                <nav className="flex flex-col gap-1.5 relative">
                  {[
                    { id: "matches", label: "AI Match Feed", icon: <Sparkles size={18} /> },
                    { id: "explore", label: "Explore Jobs", icon: <Search size={18} /> },
                    { id: "applications", label: "Applications", icon: <FileText size={18} /> },
                    { id: "messages", label: "Interview Chats", icon: <MessageSquare size={18} /> },
                    { id: "profile", label: "My Profile", icon: <User size={18} /> },
                    { id: "security", label: "Security", icon: <Lock size={18} /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`relative w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${
                        activeTab === item.id 
                          ? "text-zinc-900 dark:text-white font-bold" 
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      {activeTab === item.id && (
                        <motion.div 
                          layoutId="activeTabBgSeekerMobile" 
                          className="absolute inset-0 bg-zinc-100 dark:bg-white/5 rounded-xl -z-10"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      {item.icon} {item.label}
                    </button>
                  ))}
                  {user?.roles && user.roles.includes("Employer") && (
                    <button
                      onClick={() => {
                        handleSwitchRole("Employer");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold text-blue-400 hover:bg-blue-500/10 border border-blue-500/20 bg-blue-500/5 transition-all mt-4"
                    >
                      <Briefcase size={18} /> Switch to Employer
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 relative overflow-y-auto max-h-screen">
        
        {/* ================= TAB: MATCHES ================= */}
        {activeTab === "matches" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-extrabold flex items-center gap-2">
                <Sparkles className="text-yellow-400" /> AI-Recommended Jobs
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Sourced and sorted descending by match score. Highest compatibility shown first.</p>
            </div>

            {recLoading ? (
              <span className="text-sm text-zinc-500">Calculating cosine similarity coefficients...</span>
            ) : recommendedJobs.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 text-sm">
                No active job recommendations found. Try adding more skills to your profile.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 gap-6"
                >
                  {paginatedRecommendations.map((rec) => (
                    <motion.div 
                      key={rec.job._id} 
                      variants={itemVariants}
                      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => handleJobCardClick(rec.job._id)}
                      className={`glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 cursor-pointer border ${visitedJobs.includes(rec.job._id) ? "border-zinc-700/60 bg-zinc-100/50 dark:bg-zinc-950/20" : "border-zinc-200 dark:border-white/5"}`}
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold">{rec.job.title}</h3>
                          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold font-sans">
                            {rec.score}% Match Rate
                          </span>
                          {visitedJobs.includes(rec.job._id) && (
                            <span className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5 text-[9px] font-bold tracking-wider uppercase font-sans">
                              Visited
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">{rec.job.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {rec.job.location}</span>
                          <span className="flex items-center gap-1"><Briefcase size={14} /> {rec.job.serviceType} • {rec.job.workType}</span>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-white/5">{rec.job.experienceLevel}</span>
                          {rec.job.timeline && (
                            <span className="px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-white/5">{rec.job.timeline}</span>
                          )}
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">Budget: PKR {rec.job.budget.toLocaleString()}{rec.job.workType === "Hourly" ? " / hr" : ""}</span>
                        </div>

                        {/* AI Explainable Reasons */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {rec.reason.map((res, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[10px] text-zinc-600 dark:text-zinc-400 font-semibold font-sans">
                              {res}
                            </span>
                          ))}
                        </div>

                        {/* Skill Gap Analysis */}
                        {rec.missingSkills && rec.missingSkills.length > 0 ? (
                          <div className="flex items-center gap-1.5 pt-1.5 text-[11px] font-sans">
                            <span className="text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wide">⚠️ Missing:</span>
                            <span className="text-zinc-500 dark:text-zinc-400 font-semibold">
                              {rec.missingSkills.join(", ")}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 pt-1.5 text-[11px] text-green-600 dark:text-green-400 font-semibold font-sans">
                            <span>✓ Perfect Skills Match</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end">
                        {applications.some((app) => app.jobId && (app.jobId._id ? app.jobId._id === rec.job._id : app.jobId === rec.job._id)) ? (
                          <span 
                            onClick={(e) => e.stopPropagation()}
                            className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-white/5 font-bold text-sm rounded-xl cursor-not-allowed select-none self-end md:self-center shrink-0"
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
                    </motion.div>
                  ))}
                </motion.div>

                {/* AI Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 mt-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <span>Show:</span>
                    <select
                      value={recLimit}
                      onChange={(e) => {
                        setRecLimit(Number(e.target.value));
                        setRecPage(1);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 outline-none text-xs text-zinc-700 dark:text-zinc-300"
                    >
                      <option value={5}>5 recommendations</option>
                      <option value={10}>10 recommendations</option>
                      <option value={20}>20 recommendations</option>
                      <option value={50}>50 recommendations</option>
                    </select>
                  </div>

                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    Page {recPage} of {Math.max(1, Math.ceil(recommendedJobs.length / recLimit))}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={recPage <= 1}
                      onClick={() => setRecPage((p) => Math.max(1, p - 1))}
                      className="px-3.5 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-100 dark:bg-white/5 transition-colors text-xs font-semibold"
                    >
                      Previous
                    </button>
                    <button
                      disabled={recPage >= Math.ceil(recommendedJobs.length / recLimit)}
                      onClick={() => setRecPage((p) => p + 1)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-100 dark:bg-white/5 transition-colors text-xs font-semibold"
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
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Search and filter active online and local opportunities</p>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="Search keywords, skills..."
                className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 focus:border-blue-500/50 outline-none text-sm w-full"
              />
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 outline-none text-sm text-zinc-600 dark:text-zinc-400 w-full"
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
                className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 outline-none text-sm text-zinc-600 dark:text-zinc-400 w-full"
              >
                <option value="">Any Service Type</option>
                <option value="Online">Online (Freelance)</option>
                <option value="Physical">Physical (Local)</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <select
                value={selectedWorkType}
                onChange={(e) => { setSelectedWorkType(e.target.value); setPage(1); }}
                className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 outline-none text-sm text-zinc-600 dark:text-zinc-400 w-full"
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
              <div className="p-8 text-center rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 text-sm">
                No matching jobs found on the listing board.
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 gap-6">
                  {jobs.map((job) => (
                    <div 
                      key={job._id} 
                      onClick={() => handleJobCardClick(job._id)}
                      className={`glass-card p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-6 cursor-pointer border ${visitedJobs.includes(job._id) ? "border-zinc-700/60 bg-zinc-100/50 dark:bg-zinc-950/20" : "border-zinc-200 dark:border-white/5"}`}
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          {visitedJobs.includes(job._id) && (
                            <span className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5 text-[9px] font-bold tracking-wider uppercase font-sans">
                              Visited
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-2 pt-1">
                          {job.requiredSkills.map((sk, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-xs text-zinc-600 dark:text-zinc-400 font-sans">
                              {sk}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-2">
                          <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                          <span className="flex items-center gap-1"><Briefcase size={14} /> {job.serviceType} • {job.workType}</span>
                          <span className="px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-white/5">{job.experienceLevel}</span>
                          {job.timeline && (
                            <span className="px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-white/5">{job.timeline}</span>
                          )}
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">PKR {job.budget.toLocaleString()}{job.workType === "Hourly" ? " / hr" : ""}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        {applications.some((app) => app.jobId && (app.jobId._id ? app.jobId._id === job._id : app.jobId === job._id)) ? (
                          <span 
                            onClick={(e) => e.stopPropagation()}
                            className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-white/5 font-bold text-sm rounded-xl cursor-not-allowed select-none"
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
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 mt-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <span>Show:</span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 outline-none text-xs text-zinc-700 dark:text-zinc-300"
                    >
                      <option value={10}>10 jobs</option>
                      <option value={20}>20 jobs</option>
                      <option value={50}>50 jobs</option>
                    </select>
                  </div>

                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    Page {page} of {Math.max(1, Math.ceil(totalJobs / limit))}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3.5 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-100 dark:bg-white/5 transition-colors text-xs font-semibold"
                    >
                      Previous
                    </button>
                    <button
                      disabled={page >= Math.ceil(totalJobs / limit)}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-zinc-100 dark:bg-white/5 transition-colors text-xs font-semibold"
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
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Review status progression and interview calls</p>
            </div>

            {appLoading ? (
              <span className="text-sm text-zinc-500">Loading pipelines...</span>
            ) : applications.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 text-sm">
                You haven't submitted any job applications yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => (
                  <div key={app._id} className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                        <span className="px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5 text-xs font-semibold flex items-center gap-1.5 font-sans">
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
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Communicate directly with hiring managers during the interview stage</p>
            </div>

            <div className="flex-1 flex flex-col md:flex-row gap-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden min-h-[500px]">
              
              {/* Chat list */}
              <div className="w-full md:w-80 border-r border-zinc-200 dark:border-white/5 overflow-y-auto max-h-[500px] md:max-h-full">
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
                        className={`p-4 text-left border-b border-zinc-200 dark:border-white/5 transition-all flex flex-col gap-1.5 ${activeChat?._id === ch._id ? "bg-zinc-100 dark:bg-white/5" : "hover:bg-zinc-100 dark:bg-white/5"}`}
                      >
                        <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{ch.jobId ? ch.jobId.title : "Interviews"}</span>
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
                    <div className="p-4 border-b border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-white/5">
                      <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{activeChat.jobId.title}</h4>
                      <p className="text-xs text-zinc-500">Employer: {activeChat.employerId.fullName}</p>
                    </div>

                    {/* Stream */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col bg-zinc-50 dark:bg-zinc-900/20 max-h-[300px] md:max-h-[400px]">
                      {msgLoading && messages.length === 0 ? (
                        <span className="text-xs text-zinc-500 self-center">Decrypting message thread...</span>
                      ) : (
                        messages.map((m) => {
                          const isMe = m.senderId === user.id;
                          return (
                            <div key={m._id} className={`max-w-[70%] p-3.5 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-blue-600 text-white self-end rounded-tr-none" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 self-start rounded-tl-none"}`}>
                              <p className="font-sans">{m.message}</p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Form Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-zinc-950 flex gap-3">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type interview message..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 outline-none text-sm text-zinc-800 dark:text-zinc-200"
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
          <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
            
            {/* Toggle Switch */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 dark:border-white/10 pb-4 mb-6">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">Service Seeker Profile</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Manage and preview your professional freelancer profile</p>
              </div>
              <div className="flex bg-zinc-100 dark:bg-zinc-900/80 p-1 rounded-xl border border-zinc-200 dark:border-white/5 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setProfileMode("preview")}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${profileMode === "preview" ? "bg-white text-black font-bold" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200"}`}
                >
                  <Eye size={14} /> Preview Profile
                </button>
                <button
                  type="button"
                  onClick={() => setProfileMode("edit")}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${profileMode === "edit" ? "bg-white text-black font-bold" : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200"}`}
                >
                  <User size={14} /> Edit Settings
                </button>
              </div>
            </div>

            {profileMessage && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm flex items-center gap-2">
                <Check size={18} />
                <span>{profileMessage}</span>
              </div>
            )}

            {/* PREVIEW MODE */}
            {profileMode === "preview" && user && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-100 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-blue-950/20 border border-zinc-200 dark:border-white/5 p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                    <div className="relative">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-blue-500" />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 text-xl font-bold">
                          {user.fullName ? user.fullName.split(" ").map(n=>n[0]).join("") : "U"}
                        </div>
                      )}
                      <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-zinc-950 rounded-full" title="Active now" />
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                        <h3 className="text-3xl font-extrabold tracking-tight">{user.fullName}</h3>
                        {user.isVerified && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider font-sans">
                            Verified
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 flex items-center justify-center md:justify-start gap-1">
                        <MapPin size={14} className="text-zinc-500" /> {user.city}, Pakistan
                      </p>

                      <h4 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">
                        {user.skills && user.skills.length > 0 ? user.skills.slice(0, 3).join(" | ") + " Specialist" : "Professional Freelancer"}
                      </h4>

                      {reviews.length > 0 && (
                        <div className="flex items-center justify-center md:justify-start gap-1.5 pt-0.5">
                          <div className="flex items-center gap-0.5 text-xs text-amber-400">
                            {Array.from({ length: 5 }).map((_, sIdx) => {
                              const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
                              return (
                                <Star 
                                  key={sIdx} 
                                  size={12} 
                                  fill={sIdx < Math.round(avg) ? "currentColor" : "none"} 
                                  className={sIdx < Math.round(avg) ? "text-amber-400" : "text-zinc-700"}
                                />
                              );
                            })}
                          </div>
                          <span className="text-xs text-zinc-700 dark:text-zinc-300 font-bold">
                            {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            ({reviews.length} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setProfileMode("edit")}
                    className="px-5 py-2.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-zinc-800 dark:border-white/5 transition-all self-center shrink-0"
                  >
                    Edit Profile Details
                  </button>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column (Sidebar) */}
                  <div className="space-y-6">
                    
                    {/* Rate & Work Type Card */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Hourly Rate & Contract</h4>
                      <div className="space-y-1">
                        <div className="text-3xl font-extrabold text-zinc-900 dark:text-white">PKR {user.hourlyRate ? user.hourlyRate.toLocaleString() : "0"}</div>
                        <div className="text-xs text-zinc-500">Standard hourly rate</div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-white/5">
                        <Briefcase size={14} className="text-zinc-500" />
                        <span>Preferred contract: <strong>{user.preferredWorkType || "Hourly"}</strong></span>
                      </div>
                      {reviews.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-white/5">
                          <Star size={14} className="text-amber-400 fill-amber-400" />
                          <span>Rating: <strong>{(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} / 5.0</strong> ({reviews.length} reviews)</span>
                        </div>
                      )}
                    </div>

                    {/* Profile strength progress */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Profile Strength</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                          <span>Completion Score</span>
                          <span className="font-bold text-zinc-800 dark:text-zinc-200">{user.profileCompletion || 0}%</span>
                        </div>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-200 dark:border-white/5">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full" style={{ width: `${user.profileCompletion || 0}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Availability Note */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-3">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Availability Status</h4>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed">{user.availability || "No availability specified"}</p>
                    </div>

                    {/* Contact details */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Contact Info</h4>
                      <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
                        {user.phone && (
                          <div className="flex items-center gap-2.5">
                            <Phone size={14} className="text-zinc-500" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2.5">
                          <Mail size={14} className="text-zinc-500" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-3">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Languages</h4>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {user.languages && user.languages.length > 0 ? (
                          user.languages.map((lang, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300">
                              {lang}
                            </span>
                          ))
                        ) : (
                          <>
                            <span className="px-2.5 py-1 bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300">Urdu (Native)</span>
                            <span className="px-2.5 py-1 bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300">English (Conversational)</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Education */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Education</h4>
                      {user.education && user.education.length > 0 ? (
                        <div className="space-y-4">
                          {user.education.map((edu, idx) => (
                            <div key={idx} className="space-y-1">
                              <h5 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{edu.degree}</h5>
                              <p className="text-xs text-zinc-500">{edu.school} • Class of {edu.year}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-500 italic">No education history added.</p>
                      )}
                    </div>

                    {/* Links & Documents */}
                    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Documents & Links</h4>
                      <div className="flex flex-col gap-2.5 pt-1">
                        {user.resume ? (
                          <a 
                            href={user.resume} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-teal-500/5 hover:bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold flex items-center justify-between transition-colors"
                          >
                            <span className="flex items-center gap-2"><FileText size={14} /> Professional Resume / CV</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <div className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 text-zinc-500 text-xs italic">
                            No resume uploaded
                          </div>
                        )}

                        {user.portfolioWebsite ? (
                          <a 
                            href={user.portfolioWebsite} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-between transition-colors"
                          >
                            <span className="flex items-center gap-2"><Globe size={14} /> Portfolio Website</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <div className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 text-zinc-500 text-xs italic">
                            No portfolio website link provided
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Right Column (Main Content) */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Bio / Description */}
                    <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Professional Overview</h4>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap">
                        {user.bio || "No professional overview bio provided. Click Edit Settings to add details."}
                      </p>
                    </div>

                    {/* Skills Chips */}
                    <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Core Skills & Expertise</h4>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {user.skills && user.skills.length > 0 ? (
                          user.skills.map((skill, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-xs text-zinc-700 dark:text-zinc-300 font-semibold font-sans">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-xs text-zinc-500 italic">No skills listed yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Portfolio Case Studies */}
                    <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-6">
                      <div className="flex justify-between items-center border-b border-zinc-200 dark:border-white/5 pb-4">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Portfolio Case Studies ({portfolioList.length})</h4>
                        <button
                          onClick={() => setShowPortfolioModal(true)}
                          className="text-xs font-bold text-teal-400 hover:text-teal-300"
                        >
                          Manage Portfolio
                        </button>
                      </div>

                      {portfolioList.length === 0 ? (
                        <div className="p-8 text-center rounded-xl bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-white/5 text-zinc-500 text-sm">
                          No portfolio case studies published.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {portfolioList.map((proj, idx) => (
                            <div key={idx} className="rounded-2xl border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/30 overflow-hidden flex flex-col justify-between hover:border-zinc-300 dark:hover:border-white/10 transition-colors">
                              <div>
                                {proj.images && proj.images.length > 0 ? (
                                  <img 
                                    src={proj.images[0]} 
                                    alt={proj.title} 
                                    className="w-full h-44 object-cover border-b border-zinc-200 dark:border-white/5" 
                                  />
                                ) : (
                                  <div className="w-full h-44 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-200 dark:border-white/5 flex flex-col items-center justify-center text-zinc-600 gap-2">
                                    <LayoutGrid size={24} />
                                    <span className="text-[10px] uppercase font-bold tracking-wider">No Project Image</span>
                                  </div>
                                )}
                                <div className="p-5 space-y-3">
                                  <div>
                                    <h5 className="font-bold text-lg text-zinc-800 dark:text-zinc-200">{proj.title}</h5>
                                    {proj.role && (
                                      <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider block mt-0.5">Role: {proj.role}</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans line-clamp-3">{proj.description}</p>
                                </div>
                              </div>

                              <div className="p-5 pt-0 space-y-4">
                                {proj.technologies && proj.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {proj.technologies.map((tech, tIdx) => (
                                      <span key={tIdx} className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-[9px] text-zinc-600 dark:text-zinc-400">
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="flex gap-2 pt-2 border-t border-zinc-200 dark:border-white/5">
                                  {proj.github && (
                                    <a 
                                      href={proj.github} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex-1 px-3 py-2 bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-bold text-center border border-zinc-200 dark:border-white/5 transition-colors"
                                    >
                                      GitHub Link
                                    </a>
                                  )}
                                  {proj.demo && (
                                    <a 
                                      href={proj.demo} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="flex-1 px-3 py-2 bg-white text-black hover:bg-zinc-200 rounded-lg text-xs font-bold text-center transition-colors"
                                    >
                                      Live Demo
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Work History & Reviews */}
                    <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-6">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Work History & Reviews ({reviews.length})</h4>
                      
                      {reviewsLoading ? (
                        <span className="text-xs text-zinc-500">Querying platform history...</span>
                      ) : reviews.length === 0 ? (
                        <div className="p-8 text-center rounded-xl bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-white/5 text-zinc-500 text-sm">
                          No completed contracts or reviews recorded on the platform yet.
                        </div>
                      ) : (
                        <div className="divide-y divide-white/5 space-y-6">
                          {reviews.map((rev, idx) => (
                            <div key={rev._id} className={`pt-6 ${idx === 0 ? "pt-0" : ""}`}>
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <h5 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{rev.jobId ? rev.jobId.title : "Completed Contract"}</h5>
                                  <div className="flex items-center gap-1 text-xs text-amber-400">
                                    {Array.from({ length: 5 }).map((_, sIdx) => (
                                      <Star 
                                        key={sIdx} 
                                        size={12} 
                                        fill={sIdx < rev.rating ? "currentColor" : "none"} 
                                        className={sIdx < rev.rating ? "text-amber-400" : "text-zinc-700"}
                                      />
                                    ))}
                                    <span className="font-bold ml-1">{rev.rating}.0</span>
                                  </div>
                                </div>
                                <span className="text-xs text-zinc-500">{new Date(rev.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 italic mt-3 font-sans leading-relaxed">
                                "{rev.comment}"
                              </p>
                              <div className="text-[10px] text-zinc-500 mt-2">
                                Review by Employer: <strong className="text-zinc-600 dark:text-zinc-400">{rev.reviewer?.fullName || "Acme Client"}</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* EDIT SETTINGS MODE */}
            {profileMode === "edit" && (
              <div className="animate-fadeIn">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  
                  {/* Profile Picture Upload Section */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover border border-zinc-200 dark:border-white/10" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 text-xs">No Image</div>
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
                          className="text-xs text-zinc-600 dark:text-zinc-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Disabled Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Full Name (Read-Only)</label>
                      <input
                        type="text"
                        disabled
                        value={user?.fullName || ""}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 text-sm text-zinc-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Email Address (Read-Only)</label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 text-sm text-zinc-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">City (Pakistan Location)</label>
                      <select
                        value={profileCity}
                        onChange={(e) => setProfileCity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm"
                      >
                        {CITIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Phone Number</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Years of Experience</label>
                      <input
                        type="number"
                        value={profileExperience}
                        onChange={(e) => setProfileExperience(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Availability Note</label>
                      <input
                        type="text"
                        value={profileAvailability}
                        onChange={(e) => setProfileAvailability(e.target.value)}
                        placeholder="e.g. Immediate full-time availability"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Standard Hourly Rate (PKR/hr)</label>
                      <input
                        type="number"
                        value={profileHourlyRate}
                        onChange={(e) => setProfileHourlyRate(Number(e.target.value))}
                        placeholder="e.g. 2500"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Skills (Comma-separated)</label>
                    <input
                      type="text"
                      value={profileSkills}
                      onChange={(e) => setProfileSkills(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Professional Bio</label>
                    <textarea
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none"
                    />
                  </div>

                  {/* Resume Link */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Resume Link</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-zinc-500"><Link size={16} /></span>
                      <input
                        type="text"
                        value={profileResume}
                        onChange={(e) => setProfileResume(e.target.value)}
                        placeholder="https://... (Drive, PDF, personal site)"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-white/20 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Portfolio Website Link */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Portfolio / Website</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-zinc-500"><Link size={16} /></span>
                      <input
                        type="text"
                        value={profilePortfolioWebsite}
                        onChange={(e) => setProfilePortfolioWebsite(e.target.value)}
                        placeholder="https://... (GitHub, Behance, personal site)"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-white/20 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Portfolio Projects Modal Toggle Card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-teal-400 shrink-0 mt-1 sm:mt-0">
                        <LayoutGrid size={22} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-zinc-800 dark:text-zinc-200">Portfolio Projects</h4>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg">
                          Case studies and work samples live in <strong className="text-zinc-800 dark:text-zinc-200">My Portfolio</strong> and sync to the server. You can attach up to five when you apply to a job.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPortfolioModal(true)}
                      className="px-5 py-2.5 bg-teal-500/10 hover:bg-teal-500/15 border border-teal-500/30 text-teal-300 font-bold text-xs rounded-xl transition-all shrink-0 self-start sm:self-center"
                    >
                      Open My Portfolio
                    </button>
                  </div>

                  {/* Preferred Job Types Chips */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Preferred Job Types</label>
                    <div className="flex flex-wrap gap-2.5">
                      {["Remote", "On-site", "Hybrid"].map((type) => {
                        const isSelected = profilePreferredJobTypes.includes(type);
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setProfilePreferredJobTypes(prev => prev.filter(t => t !== type));
                              } else {
                                setProfilePreferredJobTypes(prev => [...prev, type]);
                              }
                            }}
                            className={`px-4 py-2 text-xs font-bold rounded-full border transition-all ${
                              isSelected 
                                ? "bg-teal-500/10 text-teal-300 border-teal-500/40" 
                                : "bg-zinc-200 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-white/5 hover:bg-zinc-200 dark:bg-zinc-800"
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-6 py-3 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all glow-btn"
                  >
                    {profileLoading ? "Updating Profile..." : "Save Profile Details"}
                  </button>

                </form>

                {/* Add Employer Profile Section */}
                {!user?.roles?.includes("Employer") && (
                  <div className="mt-12 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-6">
                    <div>
                      <h3 className="text-xl font-bold">Add Employer Profile</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Want to post jobs and hire professionals? Register your Employer profile to enable hiring options on this account.</p>
                    </div>
                    
                    {!showAddEmployer ? (
                      <button
                        onClick={() => setShowAddEmployer(true)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all"
                      >
                        Add Employer Profile
                      </button>
                    ) : (
                      <form onSubmit={handleAddEmployerProfile} className="space-y-4 pt-4 border-t border-zinc-200 dark:border-white/5">
                        {addEmpError && (
                          <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 text-sm">
                            {addEmpError}
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Owner's Name (Read-Only)</label>
                            <input
                              type="text"
                              disabled
                              value={user?.fullName || ""}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-500 cursor-not-allowed"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Email Address (Read-Only)</label>
                            <input
                              type="email"
                              disabled
                              value={user?.email || ""}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-500 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Business Name</label>
                            <input
                              type="text"
                              required
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              placeholder="e.g. Acme Tech Solutions"
                              className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Number of Employees</label>
                            <select
                              value={companyEmployeesCount}
                              onChange={(e) => setCompanyEmployeesCount(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200"
                            >
                              <option value="1 - 10">1 - 10 employees</option>
                              <option value="10 - 50">10 - 50 employees</option>
                              <option value="50 - 100">50 - 100 employees</option>
                              <option value="100+">100+ employees</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Company Location (City)</label>
                            <select
                              value={companyCity}
                              onChange={(e) => setCompanyCity(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200"
                            >
                              {CITIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Contact Phone</label>
                            <input
                              type="text"
                              required
                              value={companyPhone}
                              onChange={(e) => setCompanyPhone(e.target.value)}
                              placeholder="+92-300-1234567"
                              className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Business Address</label>
                            <input
                              type="text"
                              required
                              value={companyAddress}
                              onChange={(e) => setCompanyAddress(e.target.value)}
                              placeholder="e.g. Sector F-6, Islamabad"
                              className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Google Maps Location Link</label>
                            <input
                              type="text"
                              value={companyGoogleMapsLink}
                              onChange={(e) => setCompanyGoogleMapsLink(e.target.value)}
                              placeholder="https://maps.google.com/..."
                              className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Company Description (Bio)</label>
                          <textarea
                            required
                            value={companyBio}
                            onChange={(e) => setCompanyBio(e.target.value)}
                            placeholder="Describe your company, industry, and scaling plans..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Company Logo / Profile Pic (Optional File Only)</label>
                          <div className="flex items-center gap-4">
                            {companyPic ? (
                              <img src={companyPic} alt="Company Logo" className="w-16 h-16 rounded-xl object-cover border border-zinc-200 dark:border-white/10" />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 text-xs">No Logo</div>
                            )}
                            <div className="flex-1 space-y-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => setCompanyPic(reader.result);
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="text-xs text-zinc-600 dark:text-zinc-400"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowAddEmployer(false)}
                            className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-sm rounded-xl border border-zinc-200 dark:border-white/5 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={addEmpLoading}
                            className="px-6 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50"
                          >
                            {addEmpLoading ? "Creating Employer..." : "Submit & Register Employer"}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: SECURITY ================= */}
        {activeTab === "security" && (
          <div className="flex flex-col gap-6 max-w-xl">
            <div>
              <h2 className="text-3xl font-extrabold">Security Settings</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Change your account password securely. Requires validation of your current password.</p>
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

            <form onSubmit={handleChangePassword} className="space-y-6 bg-zinc-100 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-white/5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none"
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

      </main>

      {/* ================= MODAL: APPLY FORM ================= */}
      {applyingJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-6 md:p-8 rounded-2xl space-y-6 relative">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Apply for Job Listing</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Submit proposal for: "{applyingJob.title}"</p>
            </div>

            {appError && (
              <div className="p-4 rounded-xl bg-red-500/10 dark:bg-red-950/30 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                {appError}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                  {applyingJob.workType === "Hourly" ? "Expected Hourly Rate Bid (PKR/hr)" : "My Bid / Expected Salary (PKR)"}
                </label>
                <input
                  type="number"
                  required
                  value={expectedSalary}
                  onChange={(e) => setExpectedSalary(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Estimated Time to Complete</label>
                <input
                  type="text"
                  required
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  placeholder="e.g. 2 weeks, 5 days, 1 month"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Job Proposal Details</label>
                <textarea
                  required
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  placeholder="Detail your experience in relation to the required skills. Highlight projects where you did similar work..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="px-5 py-2.5 bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-sm rounded-xl border border-zinc-200 dark:border-white/5 transition-all"
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

      {/* ================= MODAL: PORTFOLIO MANAGEMENT ================= */}
      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-6 md:p-8 rounded-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-white/5 pb-4">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">My Portfolio</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Manage up to 5 case studies and projects synced to your profile</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPortfolioModal(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-300 text-xs font-bold"
              >
                Close
              </button>
            </div>

            {/* List of Added Projects */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">Projects List ({portfolioList.length} / 5)</label>
              {portfolioList.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">No projects added yet. Use the form below to add one.</p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {portfolioList.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 flex justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div>
                          <h5 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{proj.title}</h5>
                          {proj.role && (
                            <span className="text-[10px] text-teal-400 font-semibold uppercase tracking-wider block mt-0.5">Role: {proj.role}</span>
                          )}
                        </div>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {proj.technologies.map((t, tIdx) => (
                              <span key={tIdx} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded text-[9px] text-zinc-600 dark:text-zinc-400">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">{proj.description}</p>
                        
                        {/* Project Images preview in the list */}
                        {proj.images && proj.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1.5">
                            {proj.images.map((img, imgIdx) => (
                              <img 
                                key={imgIdx} 
                                src={img} 
                                alt={`project-img-${imgIdx}`} 
                                className="w-20 h-16 rounded object-cover border border-zinc-200 dark:border-white/5" 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-start">
                        <button
                          type="button"
                          onClick={() => handleEditPortfolioClick(idx)}
                          className={`p-2 rounded-xl transition-all border ${
                            editingPortfolioIdx === idx 
                              ? "bg-teal-500/25 text-teal-400 border-teal-500/50" 
                              : "bg-zinc-200 dark:bg-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-white/5"
                          }`}
                          title="Edit Project"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePortfolio(idx)}
                          className="p-2 rounded-xl bg-zinc-200 dark:bg-zinc-900 hover:bg-red-500/10 text-zinc-600 dark:text-zinc-400 hover:text-red-400 border border-zinc-200 dark:border-white/5 hover:border-red-500/20 transition-all"
                          title="Delete Project"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form to Add / Edit Project */}
            {(portfolioList.length < 5 || editingPortfolioIdx !== null) && (
              <div className="pt-6 border-t border-zinc-200 dark:border-white/5 space-y-4">
                <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  {editingPortfolioIdx !== null ? "Edit Project Details" : "Add New Project"}
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Project Title</label>
                    <input
                      type="text"
                      value={portfolioTitle}
                      onChange={(e) => setPortfolioTitle(e.target.value)}
                      placeholder="e.g. E-Commerce Platform"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Technologies (Comma-separated)</label>
                    <input
                      type="text"
                      value={portfolioTech}
                      onChange={(e) => setPortfolioTech(e.target.value)}
                      placeholder="React, Node.js, MongoDB"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">My Role in Project (Optional)</label>
                    <input
                      type="text"
                      value={portfolioRole}
                      onChange={(e) => setPortfolioRole(e.target.value)}
                      placeholder="e.g. Lead Fullstack Developer"
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Attach Project Images (Multiple)</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        files.forEach((file) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPortfolioImages((prev) => [...prev, reader.result]);
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                      className="text-xs text-zinc-600 dark:text-zinc-400 block mt-1"
                    />
                    {portfolioImages.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {portfolioImages.map((img, idx) => (
                          <div key={idx} className="relative w-14 h-14 rounded overflow-hidden border border-zinc-200 dark:border-white/10 group">
                            <img src={img} alt="preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setPortfolioImages((prev) => prev.filter((_, i) => i !== idx))}
                              className="absolute inset-0 bg-black/60 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Project Description</label>
                  <textarea
                    value={portfolioDesc}
                    onChange={(e) => setPortfolioDesc(e.target.value)}
                    placeholder="Provide a detailed description of the project, including scope, role, and details."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
                  />
                </div>
                
                {editingPortfolioIdx !== null ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUpdatePortfolio}
                      className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEditPortfolio}
                      className="px-4 py-2.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      Cancel Edit
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddPortfolio}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Plus size={14} /> Add Project Item
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-white/5">
              <button
                type="button"
                onClick={() => setShowPortfolioModal(false)}
                className="px-5 py-2 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
