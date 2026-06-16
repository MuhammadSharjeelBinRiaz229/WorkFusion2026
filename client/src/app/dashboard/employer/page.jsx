"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Briefcase, FileText, MessageSquare, Star, Sparkles,
  MapPin, CheckCircle, Clock, XCircle, Send, LogOut, Check, ChevronRight, User, Lock,
  Search, Link, LayoutGrid, X, TrendingUp, Users, Award, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../../../components/ThemeToggle";
import BottomTabBar from "../../../components/BottomTabBar";

const CITIES = ["Islamabad", "Rawalpindi", "Lahore", "Karachi", "Faisalabad", "Peshawar", "Multan", "Sialkot"];

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideInLeft = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit:   { x: "-100%", opacity: 0, transition: { duration: 0.26, ease: [0.55, 0, 1, 0.45] } },
};

const overlayAnim = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
};

const modalSpring = {
  hidden:  { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { type: "spring", damping: 22, stiffness: 280 } },
  exit:    { opacity: 0, scale: 0.94, y: 12, transition: { duration: 0.18 } },
};

const tabContent = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18 } },
};

// ─── Nav items config ─────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "postings",   label: "My Postings",      icon: Briefcase },
  { id: "createJob",  label: "Post a Job",        icon: Plus },
  { id: "applicants", label: "Applicants",        icon: FileText },
  { id: "talents",    label: "Find Talent",       icon: Search },
  { id: "messages",   label: "Interview Chats",   icon: MessageSquare },
  { id: "profile",    label: "My Profile",        icon: User },
];

export default function EmployerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("postings");
  const [user, setUser] = useState(null);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);

  // Find Talent state
  const [talentQuery, setTalentQuery] = useState("");
  const [talentCity, setTalentCity] = useState("");
  const [talentPage, setTalentPage] = useState(1);
  const [talentLimit] = useState(10);
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
    if (!savedUser) { router.push("/login"); return; }
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

  // Close drawer on tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setAccountSheetOpen(false);
  };

  // API Helper with auto token refresh
  const apiRequest = useCallback(async (endpoint, options = {}) => {
    let token = localStorage.getItem("accessToken");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    let res = await fetch(`${apiUrl}${endpoint}`, { ...options, headers });
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
              res = await fetch(`${apiUrl}${endpoint}`, { ...options, headers: retryHeaders });
            }
          }
        } catch (err) {
          console.error("Token refresh failed:", err);
        }
      }
    }
    return res;
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
      const appRes = await apiRequest(`/applications?jobId=${jobId}`);
      const appResult = await appRes.json();
      if (appResult.success) setApplicants(appResult.data.applications);

      const aiRes = await apiRequest(`/jobs/recommendations/candidates/${jobId}`);
      const aiResult = await aiRes.json();
      if (aiResult.success) setCandidateRecommendations(aiResult.data);
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
      if (result.success) setChats(result.data);
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
      if (talentCity)  query += `&city=${encodeURIComponent(talentCity)}`;
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
      if (result.success) setMessages(result.data.messages);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setMsgLoading(false);
    }
  }, [apiRequest]);

  // Trigger loading based on tab
  useEffect(() => {
    if (!user) return;
    if (activeTab === "postings")  fetchPostings();
    else if (activeTab === "messages") fetchChats();
    else if (activeTab === "talents")  fetchTalents();
  }, [activeTab, user, fetchPostings, fetchChats, fetchTalents]);

  useEffect(() => {
    if (activeTab === "talents") fetchTalents();
  }, [talentPage, talentCity, activeTab, fetchTalents]);

  useEffect(() => {
    if (selectedJob && activeTab === "applicants") fetchApplicantsAndAI(selectedJob._id);
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
      title: jobTitle, description: jobDesc, category: jobCategory, requiredSkills,
      experienceRequired: Number(jobExp), experienceLevel: jobExperienceLevel,
      ...(jobTimeline ? { timeline: jobTimeline } : {}),
      budget: Number(jobBudget), location: jobLocation, serviceType: jobServiceType,
      workType: jobWorkType, remoteAllowed: jobServiceType === "Online",
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    };
    try {
      const res = await apiRequest("/jobs", { method: "POST", body: JSON.stringify(payload) });
      const result = await res.json();
      if (result.success) {
        setJobCreateMessage("Job listing published successfully!");
        setJobTitle(""); setJobDesc(""); setJobSkills(""); setJobExp(0); setJobBudget(0);
        setJobExperienceLevel("Intermediate"); setJobTimeline("");
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
        if (selectedJob) fetchApplicantsAndAI(selectedJob._id);
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
        if (selectedJob) fetchApplicantsAndAI(selectedJob._id);
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
        body: JSON.stringify({ chatId: activeChat._id, message: chatMessage, type: "Text" }),
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
    setProfileError(""); setProfileMessage(""); setProfileLoading(true);
    try {
      const res = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify({
          companyName: profileCompanyName, googleMapsLink: profileGoogleMapsLink,
          address: profileAddress, employeesCount: profileEmployeesCount,
          phone: profilePhone, bio: profileBio, profilePicture,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Failed to update profile");
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
    setSecurityError(""); setSecurityMessage(""); setSecurityLoading(true);
    try {
      const res = await apiRequest("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Failed to update password");
      setSecurityMessage("Password updated successfully!");
      setCurrentPassword(""); setNewPassword("");
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
      if (!res.ok || !result.success) throw new Error(result.message || "Failed to switch profiles");
      localStorage.setItem("accessToken", result.data.accessToken);
      localStorage.setItem("refreshToken", result.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      router.push(targetRole === "Employer" ? "/dashboard/employer" : "/dashboard/seeker");
    } catch (err) {
      alert(err.message || "Error switching profiles");
    }
  };

  // ─── Reusable Nav Sidebar Content ───────────────────────────────────────────
  const NavContent = ({ onClose }) => (
    <div className="flex flex-col gap-6 h-full justify-between">
      <div className="flex flex-col gap-6">
        {/* Logo */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg">
              W
            </div>
            <span className="font-extrabold text-xl">
              Work<span className="text-blue-500 font-medium">Fusion</span>
            </span>
          </div>
          {onClose ? (
            <button onClick={onClose} className="p-1 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors md:hidden">
              <X size={20} />
            </button>
          ) : (
            <ThemeToggle />
          )}
        </div>

        {/* User Bio — click to open Profile */}
        {user && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => handleTabChange("profile")}
            className="w-full p-4 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 flex flex-col gap-2.5 text-left hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="avatar" className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-white/10" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-sm text-zinc-600 dark:text-zinc-300">
                  {user.fullName?.charAt(0)}
                </div>
              )}
              <div>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block leading-tight group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{user.fullName}</span>
                <span className="text-[10px] text-zinc-500">{user.email}</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold self-start uppercase">
              {user.role}
            </span>
          </motion.button>
        )}

        {/* Nav Items */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <motion.button
                key={item.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                onClick={() => {
                  if (item.id === "applicants") {
                    if (postings.length > 0 && !selectedJob) setSelectedJob(postings[0]);
                  }
                  handleTabChange(item.id);
                }}
                className={`w-full px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-all relative overflow-hidden group ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-white/5"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="employer-active-pill"
                    className="absolute inset-0 rounded-xl z-[-1]"
                    transition={{ type: "spring", damping: 30, stiffness: 320 }}
                  />
                )}
              </motion.button>
            );
          })}

          {/* Switch Role */}
          {user?.roles && user.roles.includes("Service Seeker") && (
            <motion.button
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={NAV_ITEMS.length}
              onClick={() => handleSwitchRole("Service Seeker")}
              className="w-full px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 bg-amber-500/5 transition-all mt-4"
            >
              <Briefcase size={16} /> Switch to Seeker
            </motion.button>
          )}
        </nav>
      </div>

      {/* Logout */}
      <div className="pb-2">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white transition-colors duration-300">

      {/* ─── Mobile Header ──────────────────────────────────────────────── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-base">W</div>
          <span className="font-extrabold text-lg">Work<span className="text-blue-500 font-medium">Fusion</span></span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setAccountSheetOpen(true)}
            className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm transition-all hover:opacity-80"
            aria-label="Account menu"
          >
            {user ? user.fullName.charAt(0).toUpperCase() : "?"}
          </button>
        </div>
      </header>

      {/* ─── Account Sheet — right slide-over ───────────────────────────── */}
      <AnimatePresence>
        {accountSheetOpen && (
          <>
            <motion.div
              key="overlay"
              variants={overlayAnim}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setAccountSheetOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
              key="sheet"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-white/5 z-50 flex flex-col md:hidden shadow-2xl"
            >
              {/* Sheet header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-white/5">
                <span className="font-bold text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Account</span>
                <button
                  onClick={() => setAccountSheetOpen(false)}
                  className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* User card — tap to go to Profile */}
              {user && (
                <button
                  onClick={() => { setActiveTab("profile"); setAccountSheetOpen(false); }}
                  className="flex items-center gap-3 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all text-left border-b border-zinc-200 dark:border-white/5 w-full"
                >
                  <div className="w-11 h-11 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-base shrink-0">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{user.fullName}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{user.email}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 font-semibold uppercase mt-1 inline-block">{user.role}</span>
                  </div>
                  <ChevronRight size={16} className="text-zinc-400 shrink-0" />
                </button>
              )}

              {/* Secondary actions */}
              <div className="flex-1 px-3 py-3 space-y-1">
                <button
                  onClick={() => { setActiveTab("talents"); setAccountSheetOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "talents" ? "bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white font-semibold" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"}`}
                >
                  <Search size={18} /> Find Talent
                </button>
                {user?.roles && user.roles.includes("Service Seeker") && (
                  <button
                    onClick={() => { handleSwitchRole("Service Seeker"); setAccountSheetOpen(false); }}
                    className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border border-amber-500/20 bg-amber-500/5 transition-all mt-2"
                  >
                    <Briefcase size={18} /> Switch to Seeker
                  </button>
                )}
              </div>

              {/* Logout */}
              <div className="px-3 pb-6 pt-2 border-t border-zinc-200 dark:border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* ─── Desktop Sidebar ──────────────────────────────────────────── */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col bg-zinc-100 dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/5 p-5 gap-6 min-h-screen sticky top-0">
          <NavContent onClose={null} />
        </aside>

        {/* ─── Main Content Panel ───────────────────────────────────────── */}
        <main className="flex-1 pt-14 md:pt-0 px-4 md:px-8 lg:px-10 pb-24 md:pb-8 lg:pb-10 overflow-y-auto min-h-screen">


          <AnimatePresence mode="wait">

            {/* ═══════════════ TAB: POSTINGS ═══════════════ */}
            {activeTab === "postings" && (
              <motion.div key="postings" variants={tabContent} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
                <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold">Job Postings</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage all published online and physical job ads</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleTabChange("createJob")}
                    className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold text-sm rounded-xl transition-all flex items-center gap-1.5 self-start"
                  >
                    <Plus size={16} /> Publish New Job
                  </motion.button>
                </motion.div>

                {postingsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-48 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : postings.length === 0 ? (
                  <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible"
                    className="p-10 text-center rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 text-sm flex flex-col items-center gap-3">
                    <Briefcase size={36} className="text-zinc-300 dark:text-zinc-700" />
                    <p>No job postings found. Post a job to start receiving applications.</p>
                    <button onClick={() => handleTabChange("createJob")} className="px-4 py-2 text-xs font-bold bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl hover:opacity-90 transition-all">Post a Job</button>
                  </motion.div>
                ) : (
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {postings.map((job) => (
                      <motion.div
                        key={job._id}
                        variants={cardItem}
                        whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setSelectedJob(job); handleTabChange("applicants"); }}
                        className="glass-card p-6 rounded-2xl cursor-pointer flex flex-col justify-between h-52 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wide">{job.category}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${job.status === "Open" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"}`}>
                              {job.status}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold mt-2 line-clamp-1">{job.title}</h3>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">{job.description}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-zinc-200 dark:border-white/5 pt-4 mt-2">
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                            <MapPin size={12} /> {job.location}
                          </div>
                          <span className="font-bold text-xs text-blue-500 flex items-center gap-0.5">
                            Review Applicants <ChevronRight size={14} />
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ═══════════════ TAB: CREATE JOB ═══════════════ */}
            {activeTab === "createJob" && (
              <motion.div key="createJob" variants={tabContent} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6 max-w-3xl">
                <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
                  <h2 className="text-2xl md:text-3xl font-extrabold">Post a Job Listing</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Specify skills, budget, and location (supports online and physical tasks)</p>
                </motion.div>

                <AnimatePresence>
                  {jobCreateMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-2"
                    >
                      <Check size={18} /><span>{jobCreateMessage}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.form
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  onSubmit={handleCreateJob}
                  className="space-y-6"
                >
                  <motion.div variants={cardItem} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Job Title</label>
                      <input type="text" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Senior MERN Developer Needed"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Job Category</label>
                      <select value={jobCategory} onChange={(e) => setJobCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm outline-none">
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile App Development">Mobile App Development</option>
                        <option value="UI/UX & Web Design">UI/UX & Web Design</option>
                        <option value="AC & Fridge Services">AC & Fridge Services</option>
                        <option value="Electrical Wiring & Repair">Electrical Wiring & Repair</option>
                        <option value="Sanitary & Plumbing Installation">Sanitary & Plumbing Installation</option>
                      </select>
                    </div>
                  </motion.div>

                  <motion.div variants={cardItem} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Service Type</label>
                      <select value={jobServiceType} onChange={(e) => setJobServiceType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm outline-none">
                        <option value="Online">Online (Digital)</option>
                        <option value="Physical">Physical (Local)</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Contract Type</label>
                      <select value={jobWorkType} onChange={(e) => setJobWorkType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm outline-none">
                        <option value="Project">Project-Based</option>
                        <option value="Hourly">Hourly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Full-Time">Full-Time</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">City</label>
                      <select value={jobLocation} onChange={(e) => setJobLocation(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm outline-none">
                        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </motion.div>

                  <motion.div variants={cardItem} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Experience Level</label>
                      <select value={jobExperienceLevel} onChange={(e) => setJobExperienceLevel(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm outline-none">
                        <option value="Entry Level">Entry Level</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Project Timeline</label>
                      <select value={jobTimeline} onChange={(e) => setJobTimeline(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm outline-none">
                        <option value="">Not Specified</option>
                        <option value="Less than 1 month">Less than 1 month</option>
                        <option value="1 - 3 months">1 - 3 months</option>
                        <option value="3 - 6 months">3 - 6 months</option>
                        <option value="More than 6 months">More than 6 months</option>
                      </select>
                    </div>
                  </motion.div>

                  <motion.div variants={cardItem} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Required Skills (Comma separated)</label>
                      <input type="text" required value={jobSkills} onChange={(e) => setJobSkills(e.target.value)}
                        placeholder="React, Node.js, TypeScript"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Exp. (years)</label>
                        <input type="number" required value={jobExp} onChange={(e) => setJobExp(Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">{jobWorkType === "Hourly" ? "Hourly (PKR)" : "Budget (PKR)"}</label>
                        <input type="number" required value={jobBudget} onChange={(e) => setJobBudget(Number(e.target.value))}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={cardItem} className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Job Description</label>
                    <textarea required value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} rows={6}
                      placeholder="Detail the project guidelines, expectations, deliverables, and requirements..."
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500/50 transition-colors resize-none" />
                  </motion.div>

                  <motion.button
                    variants={cardItem}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={jobCreateLoading}
                    className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {jobCreateLoading ? (
                      <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" /> Publishing...</>
                    ) : "Publish Job Posting"}
                  </motion.button>
                </motion.form>
              </motion.div>
            )}

            {/* ═══════════════ TAB: APPLICANTS ═══════════════ */}
            {activeTab === "applicants" && (
              <motion.div key="applicants" variants={tabContent} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold">Applicant Directory</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Review applicant profiles, AI scores, and manage interview statuses</p>
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
                        className="px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 text-xs outline-none font-semibold text-zinc-700 dark:text-zinc-300"
                      >
                        {postings.map((job) => <option key={job._id} value={job._id}>{job.title}</option>)}
                      </select>
                    </div>
                  )}
                </div>

                {selectedJob ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Real Applicants List (2/3 cols) */}
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="font-bold text-base text-zinc-700 dark:text-zinc-300">Submitted Proposals ({applicants.length})</h3>
                      {appLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 animate-pulse" />
                          ))}
                        </div>
                      ) : applicants.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 text-sm flex flex-col items-center gap-2">
                          <Users size={32} className="text-zinc-300 dark:text-zinc-700" />
                          No applications submitted yet for this posting.
                        </div>
                      ) : (
                        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                          {applicants.map((app, idx) => (
                            <motion.div
                              key={app._id}
                              variants={cardItem}
                              whileHover={{ y: -2 }}
                              onClick={() => setSelectedProposalForPopup(app)}
                              className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-4 cursor-pointer transition-colors hover:border-zinc-300 dark:hover:border-white/10"
                            >
                              <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-zinc-200 dark:border-white/5 pb-4">
                                <div>
                                  <h4 className="font-bold text-base text-zinc-800 dark:text-zinc-200">{app.seekerId.fullName}</h4>
                                  <p className="text-xs text-zinc-500 mt-0.5">
                                    {app.seekerId.city} · Bid: PKR {app.expectedSalary.toLocaleString()}{selectedJob?.workType === "Hourly" ? "/hr" : ""} · {app.estimatedTime || "N/A"}
                                  </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 self-start">
                                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-bold">{app.matchScore}% Match</span>
                                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase">{app.status}</span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Proposal (Click for full details)</label>
                                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-2">{app.proposal}</p>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-xs">
                                <div className="flex items-center gap-1 text-amber-400">
                                  <Star size={13} fill="currentColor" className="shrink-0" />
                                  <span className="font-bold">{app.seekerId.rating || 5.0}</span>
                                  <span className="text-zinc-500">({app.seekerId.reviewCount || 0} reviews)</span>
                                </div>
                                <div className="text-zinc-500">
                                  Similar Jobs: <strong className="text-zinc-700 dark:text-zinc-300">{app.completedSimilarJobsCount || 0}</strong>
                                </div>
                              </div>

                              {/* Action Bar */}
                              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200 dark:border-white/5 justify-end" onClick={(e) => e.stopPropagation()}>
                                {app.status === "Applied" && (
                                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleStatusUpdate(app._id, "Interview")}
                                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all">Move to Interview</motion.button>
                                )}
                                {app.status === "Interview" && (
                                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleStatusUpdate(app._id, "Accepted")}
                                    className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-all">Offer Accept</motion.button>
                                )}
                                {app.status === "Accepted" && (
                                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleStatusUpdate(app._id, "Hired")}
                                    className="px-3.5 py-1.5 bg-green-500 text-black font-bold text-xs rounded-xl transition-all">Hire / Start Contract</motion.button>
                                )}
                                {app.status === "Hired" && (
                                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleStatusUpdate(app._id, "Completed")}
                                    className="px-3.5 py-1.5 bg-white dark:bg-zinc-100 text-black font-bold text-xs rounded-xl transition-all">Mark Completed</motion.button>
                                )}
                                {app.status === "Completed" && (
                                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setReviewingApp(app)}
                                    className="px-3.5 py-1.5 bg-amber-500 text-black font-bold text-xs rounded-xl transition-all flex items-center gap-1.5">
                                    <Star size={11} /> Leave Review
                                  </motion.button>
                                )}
                                {app.status !== "Completed" && app.status !== "Rejected" && (
                                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleStatusUpdate(app._id, "Rejected")}
                                    className="px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 font-bold text-xs rounded-xl border border-zinc-200 dark:border-white/5 transition-all">Reject</motion.button>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </div>

                    {/* AI Candidate Matching Recommendations (1/3 col) */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-1.5">
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}>
                          <Sparkles className="text-amber-400 shrink-0" size={17} />
                        </motion.div>
                        <h3 className="font-bold text-base text-zinc-700 dark:text-zinc-300">AI Matching Recommendations</h3>
                      </div>

                      {aiLoading ? (
                        <div className="space-y-3">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-28 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 animate-pulse" />
                          ))}
                        </div>
                      ) : candidateRecommendations.length === 0 ? (
                        <div className="p-6 text-center text-xs text-zinc-500 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
                          No matching candidate suggestions calculated.
                        </div>
                      ) : (
                        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
                          {candidateRecommendations.slice((aiPage - 1) * 5, aiPage * 5).map((rec, idx) => (
                            <motion.div key={idx} variants={cardItem} className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 space-y-3">
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{rec.candidate.fullName}</span>
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-bold">{rec.score}% Match</span>
                              </div>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{rec.candidate.bio}</p>

                              {/* Skill Gap Analysis */}
                              {rec.missingSkills && rec.missingSkills.length > 0 && (
                                <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/15 text-[10px] space-y-1">
                                  <span className="font-bold text-red-400 uppercase block tracking-wide flex items-center gap-1">
                                    <AlertCircle size={10} /> Missing Core Skills:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {rec.missingSkills.map((ms, msi) => (
                                      <span key={msi} className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/15 text-[9px] font-semibold">
                                        {ms}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-1">
                                {rec.reason.map((res, rIdx) => (
                                  <span key={rIdx} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-[9px] text-zinc-500">
                                    ✓ {res}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          ))}

                          {candidateRecommendations.length > 5 && (
                            <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-white/5">
                              <button disabled={aiPage <= 1} onClick={() => setAiPage((p) => Math.max(1, p - 1))}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold transition-colors">Prev</button>
                              <span className="text-[10px] text-zinc-500">Page {aiPage} of {Math.ceil(candidateRecommendations.length / 5)}</span>
                              <button disabled={aiPage >= Math.ceil(candidateRecommendations.length / 5)} onClick={() => setAiPage((p) => p + 1)}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold transition-colors">Next</button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-sm text-zinc-500">Create a job posting to view applicants</div>
                )}
              </motion.div>
            )}

            {/* ═══════════════ TAB: MESSAGES ═══════════════ */}
            {activeTab === "messages" && (
              <motion.div key="messages" variants={tabContent} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-5 h-[85vh]">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold">Interview Channels</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Direct communication with candidates under Interview status</p>
                </div>

                <div className="flex-1 flex flex-col md:flex-row gap-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden min-h-0">
                  {/* Chat list */}
                  <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-white/5 overflow-y-auto flex-shrink-0 max-h-48 md:max-h-full">
                    {chatLoading ? (
                      <span className="p-4 text-xs text-zinc-500 block">Querying secure channels...</span>
                    ) : chats.length === 0 ? (
                      <div className="p-6 text-zinc-500 text-xs text-center">
                        No active interview channels. Secure chat unlocks automatically when an application status changes to "Interview".
                      </div>
                    ) : (
                      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col">
                        {chats.map((ch) => (
                          <motion.button
                            key={ch._id}
                            variants={cardItem}
                            onClick={() => { setActiveChat(ch); fetchMessages(ch._id); }}
                            className={`p-4 text-left border-b border-zinc-200 dark:border-white/5 transition-all flex flex-col gap-1 ${activeChat?._id === ch._id ? "bg-zinc-100 dark:bg-white/5" : "hover:bg-zinc-50 dark:hover:bg-white/3"}`}
                          >
                            <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{ch.jobId ? ch.jobId.title : "Interview"}</span>
                            <span className="text-xs text-zinc-500">Candidate: {ch.seekerId.fullName}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Message frame */}
                  <div className="flex-1 flex flex-col min-h-0">
                    {activeChat ? (
                      <>
                        <div className="p-4 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/3 shrink-0">
                          <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{activeChat.jobId.title}</h4>
                          <p className="text-xs text-zinc-500">Candidate: {activeChat.seekerId.fullName}</p>
                        </div>
                        <div className="flex-1 p-5 overflow-y-auto space-y-3 flex flex-col">
                          {msgLoading && messages.length === 0 ? (
                            <span className="text-xs text-zinc-500 self-center">Decrypting message thread...</span>
                          ) : (
                            messages.map((m) => {
                              const isMe = m.senderId === user.id;
                              return (
                                <motion.div
                                  key={m._id}
                                  initial={{ opacity: 0, x: isMe ? 15 : -15 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className={`max-w-[72%] p-3.5 rounded-2xl text-sm leading-relaxed ${isMe ? "bg-blue-600 text-white self-end rounded-tr-none" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 self-start rounded-tl-none"}`}
                                >
                                  {m.message}
                                </motion.div>
                              );
                            })
                          )}
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950 flex gap-3 shrink-0">
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Type interview message..."
                            className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 outline-none text-sm text-zinc-800 dark:text-zinc-200 focus:border-blue-500/50 transition-colors"
                          />
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0"
                          >
                            <Send size={16} />
                          </motion.button>
                        </form>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm flex-col gap-2">
                        <MessageSquare size={36} className="text-zinc-200 dark:text-zinc-800" />
                        Select an interview thread to begin messaging
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════ TAB: PROFILE ═══════════════ */}
            {activeTab === "profile" && (
              <motion.div key="profile" variants={tabContent} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6 max-w-3xl">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold">Employer Profile</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Keep your business information updated to attract top professionals</p>
                </div>

                <AnimatePresence>
                  {profileMessage && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-2">
                      <Check size={18} /><span>{profileMessage}</span>
                    </motion.div>
                  )}
                  {profileError && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {profileError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.form
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  onSubmit={handleSaveProfile}
                  className="space-y-6"
                >
                  {/* Profile Picture */}
                  <motion.div variants={cardItem} className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Company Logo / Profile Pic</label>
                    <div className="flex items-center gap-4">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Company Logo Preview" className="w-20 h-20 rounded-xl object-cover border border-zinc-200 dark:border-white/10" />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 text-xs">No Logo</div>
                      )}
                      <input type="file" accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setProfilePicture(reader.result);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="text-xs text-zinc-500 dark:text-zinc-400" />
                    </div>
                  </motion.div>

                  <motion.div variants={cardItem} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Owner / Employer Name</label>
                      <input type="text" disabled value={user?.fullName || ""}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 text-sm text-zinc-500 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Email Address (Read-Only)</label>
                      <input type="email" disabled value={user?.email || ""}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 text-sm text-zinc-500 cursor-not-allowed" />
                    </div>
                  </motion.div>

                  <motion.div variants={cardItem} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Business / Company Name</label>
                      <input type="text" required value={profileCompanyName} onChange={(e) => setProfileCompanyName(e.target.value)}
                        placeholder="Acme Corporation"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Number of Employees</label>
                      <select value={profileEmployeesCount} onChange={(e) => setProfileEmployeesCount(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm">
                        <option value="1 - 10">1 - 10 employees</option>
                        <option value="10 - 50">10 - 50 employees</option>
                        <option value="50 - 100">50 - 100 employees</option>
                        <option value="100+">100+ employees</option>
                      </select>
                    </div>
                  </motion.div>

                  <motion.div variants={cardItem} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">City (Pakistan)</label>
                      <input type="text" disabled value={user?.city || ""}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/5 text-sm text-zinc-500 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Contact Phone Number</label>
                      <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                  </motion.div>

                  <motion.div variants={cardItem} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Business Address</label>
                      <input type="text" required value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)}
                        placeholder="e.g. Sector F-7, Islamabad"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Google Maps Link</label>
                      <input type="text" value={profileGoogleMapsLink} onChange={(e) => setProfileGoogleMapsLink(e.target.value)}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500/50 transition-colors" />
                    </div>
                  </motion.div>

                  <motion.div variants={cardItem} className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Company Bio / Description</label>
                    <textarea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none resize-none focus:border-blue-500/50 transition-colors" />
                  </motion.div>

                  <motion.button
                    variants={cardItem}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={profileLoading}
                    className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50"
                  >
                    {profileLoading ? "Updating Profile..." : "Save Profile Details"}
                  </motion.button>
                </motion.form>

                {/* ─── Security ───────────────────────────────── */}
                <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-white/5">
                  <div className="mb-6">
                    <h3 className="text-xl font-extrabold">Security</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Change your account password. Requires your current password for verification.</p>
                  </div>

                  <AnimatePresence>
                    {securityMessage && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm flex items-center gap-2 mb-4">
                        <Check size={18} /><span>{securityMessage}</span>
                      </motion.div>
                    )}
                    {securityError && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                        {securityError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.form
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    onSubmit={handleChangePassword}
                    className="space-y-6 bg-white dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200 dark:border-white/5 max-w-xl"
                  >
                    <motion.div variants={cardItem} className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Current Password</label>
                      <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500/50 transition-colors" />
                    </motion.div>
                    <motion.div variants={cardItem} className="space-y-2">
                      <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">New Password</label>
                      <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none focus:border-blue-500/50 transition-colors" />
                    </motion.div>
                    <motion.button
                      variants={cardItem}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={securityLoading}
                      className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50"
                    >
                      {securityLoading ? "Updating Password..." : "Update Password"}
                    </motion.button>
                  </motion.form>
                </div>
              </motion.div>
            )}

            {/* ═══════════════ TAB: TALENTS ═══════════════ */}
            {activeTab === "talents" && (
              <motion.div key="talents" variants={tabContent} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold">Find Talent</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Search and filter service seekers and freelance candidates by skill or city</p>
                </div>

                {/* Filters */}
                <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5">
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-zinc-400"><Search size={15} /></span>
                    <input
                      type="text"
                      value={talentQuery}
                      onChange={(e) => { setTalentQuery(e.target.value); setTalentPage(1); }}
                      placeholder="Keywords, skills, names..."
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 focus:border-blue-500/50 outline-none text-sm text-zinc-800 dark:text-zinc-200 transition-colors"
                    />
                  </div>
                  <select
                    value={talentCity}
                    onChange={(e) => { setTalentCity(e.target.value); setTalentPage(1); }}
                    className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 outline-none text-sm text-zinc-500 dark:text-zinc-400"
                  >
                    <option value="">All Cities</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={fetchTalents}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    Search Candidates
                  </motion.button>
                </motion.div>

                {talentsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-52 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : talents.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 text-sm flex flex-col items-center gap-2">
                    <Users size={36} className="text-zinc-300 dark:text-zinc-700" />
                    No matching talents found. Try checking your spelling or filters.
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {talents.map((talent) => (
                        <motion.div
                          key={talent._id}
                          variants={cardItem}
                          whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
                          className="glass-card p-5 rounded-2xl border border-zinc-200 dark:border-white/5 flex flex-col justify-between gap-4"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              {talent.profilePicture ? (
                                <img src={talent.profilePicture} alt={talent.fullName} className="w-12 h-12 rounded-full object-cover border border-zinc-200 dark:border-white/10 shrink-0" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 font-bold shrink-0">
                                  {talent.fullName.charAt(0)}
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-base text-zinc-800 dark:text-zinc-200">{talent.fullName}</h4>
                                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                                  <span className="flex items-center gap-1"><MapPin size={11} /> {talent.city}</span>
                                  {talent.hourlyRate > 0 && <span className="font-semibold text-blue-500">· PKR {talent.hourlyRate.toLocaleString()}/hr</span>}
                                </div>
                              </div>
                            </div>
                            {talent.bio && <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">{talent.bio}</p>}
                            {talent.skills && talent.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {talent.skills.map((s, idx) => (
                                  <span key={idx} className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-[10px] text-zinc-500">{s}</span>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-xs">
                              <div className="flex items-center gap-1 text-amber-400">
                                <Star size={13} fill="currentColor" />
                                <span className="font-bold">{talent.rating || 5.0}</span>
                                <span className="text-zinc-500">({talent.reviewCount || 0} reviews)</span>
                              </div>
                              <div className="text-zinc-500">Exp: <strong className="text-zinc-700 dark:text-zinc-300">{talent.experience || 0} yrs</strong></div>
                            </div>
                          </div>
                          <div className="border-t border-zinc-200 dark:border-white/5 pt-4 flex justify-between items-center">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-500 border border-teal-500/20 font-semibold uppercase">{talent.availability || "Available"}</span>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedProposalForPopup({
                                seekerId: talent,
                                proposal: "This is a direct profile inspection via the Find Talent directory.",
                                expectedSalary: talent.hourlyRate || 0,
                                estimatedTime: "N/A",
                                dummy: true,
                              })}
                              className="px-3.5 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90 text-xs font-bold rounded-lg transition-colors"
                            >
                              View Full Profile
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5">
                      <span className="text-xs text-zinc-500">
                        Showing {(talentPage - 1) * talentLimit + 1}–{Math.min(talentPage * talentLimit, totalTalents)} of {totalTalents} talents
                      </span>
                      <div className="flex items-center gap-2">
                        <button disabled={talentPage <= 1} onClick={() => setTalentPage((p) => Math.max(1, p - 1))}
                          className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold">Previous</button>
                        <button disabled={talentPage >= Math.ceil(totalTalents / talentLimit)} onClick={() => setTalentPage((p) => p + 1)}
                          className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold">Next</button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar
        tabs={[
          { id: "postings",   label: "Dashboard", icon: LayoutGrid },
          { id: "createJob",  label: "Post Job",  icon: Plus },
          { id: "applicants", label: "Applicants",icon: Users },
          { id: "messages",   label: "Chat",      icon: MessageSquare },
          { id: "profile",    label: "Profile",   icon: User },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* ═══════════════ MODAL: LEAVE REVIEW ═══════════════ */}
      <AnimatePresence>
        {reviewingApp && (
          <motion.div key="review-overlay" variants={overlayAnim} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div variants={modalSpring} initial="hidden" animate="visible" exit="exit"
              className="w-full max-w-lg bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-6 md:p-8 rounded-2xl space-y-6 relative">
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Write Contract Review</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Review candidate: "{reviewingApp.seekerId.fullName}"</p>
              </div>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Rating (1 to 5 Stars)</label>
                  <select value={ratingVal} onChange={(e) => setRatingVal(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm outline-none">
                    <option value={5}>★★★★★ — 5 Stars (Excellent)</option>
                    <option value={4}>★★★★☆ — 4 Stars (Good)</option>
                    <option value={3}>★★★☆☆ — 3 Stars (Average)</option>
                    <option value={2}>★★☆☆☆ — 2 Stars (Below Average)</option>
                    <option value={1}>★☆☆☆☆ — 1 Star (Poor)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Review Comment</label>
                  <textarea required value={commentVal} onChange={(e) => setCommentVal(e.target.value)} rows={4}
                    placeholder="Share your honest experience working with this candidate..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-800 dark:text-zinc-200 outline-none resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <motion.button whileTap={{ scale: 0.96 }} type="button" onClick={() => setReviewingApp(null)}
                    className="flex-1 px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 text-sm font-semibold text-zinc-500 hover:bg-zinc-200 dark:hover:bg-white/5 transition-all">
                    Cancel
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }} type="submit" disabled={reviewLoading}
                    className="flex-1 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-sm rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50">
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ MODAL: PROPOSAL DETAIL POPUP ═══════════════ */}
      <AnimatePresence>
        {selectedProposalForPopup && (
          <motion.div key="proposal-overlay" variants={overlayAnim} initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProposalForPopup(null)}>
            <motion.div variants={modalSpring} initial="hidden" animate="visible" exit="exit"
              className="w-full max-w-3xl bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 p-6 md:p-8 rounded-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>

              {/* Header */}
              <div className="flex justify-between items-start border-b border-zinc-200 dark:border-white/5 pb-5">
                <div className="flex items-center gap-4">
                  {selectedProposalForPopup.seekerId.profilePicture ? (
                    <img src={selectedProposalForPopup.seekerId.profilePicture} alt={selectedProposalForPopup.seekerId.fullName}
                      className="w-16 h-16 rounded-full object-cover border border-zinc-200 dark:border-white/10" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-zinc-500 font-bold text-lg">
                      {selectedProposalForPopup.seekerId.fullName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{selectedProposalForPopup.seekerId.fullName}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 mt-1">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {selectedProposalForPopup.seekerId.city}</span>
                      {selectedProposalForPopup.seekerId.hourlyRate > 0 && (
                        <span className="font-semibold text-blue-500">· PKR {selectedProposalForPopup.seekerId.hourlyRate.toLocaleString()}/hr</span>
                      )}
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => setSelectedProposalForPopup(null)}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-bold text-xs bg-zinc-200 dark:bg-white/5 hover:bg-zinc-300 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all">
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Proposal & Bio */}
                <div className="md:col-span-2 space-y-5">
                  <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Proposal Details</h4>
                    {!selectedProposalForPopup.dummy && (
                      <div className="grid grid-cols-2 gap-4 text-xs border-b border-zinc-200 dark:border-white/5 pb-3">
                        <div>
                          <span className="text-zinc-500 block">Bid Value</span>
                          <strong className="text-zinc-800 dark:text-zinc-200 text-sm">PKR {selectedProposalForPopup.expectedSalary?.toLocaleString()}{selectedJob?.workType === "Hourly" ? "/hr" : ""}</strong>
                        </div>
                        <div>
                          <span className="text-zinc-500 block">Est. Time</span>
                          <strong className="text-zinc-800 dark:text-zinc-200 text-sm">{selectedProposalForPopup.estimatedTime}</strong>
                        </div>
                      </div>
                    )}
                    <div className="space-y-1">
                      <span className="text-zinc-500 block text-xs">Proposal Statement</span>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{selectedProposalForPopup.proposal}</p>
                    </div>
                  </div>

                  {selectedProposalForPopup.seekerId.bio && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Biography</h4>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{selectedProposalForPopup.seekerId.bio}</p>
                    </div>
                  )}

                  {selectedProposalForPopup.seekerId.skills && selectedProposalForPopup.seekerId.skills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Candidate Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProposalForPopup.seekerId.skills.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-xs text-zinc-700 dark:text-zinc-300">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Links & Stats */}
                <div className="space-y-5">
                  <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 space-y-4">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Documents & Links</h4>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Resume / CV</span>
                      {selectedProposalForPopup.seekerId.resume ? (
                        <a href={selectedProposalForPopup.seekerId.resume} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-medium text-teal-500 hover:text-teal-400 transition-colors flex items-center gap-1.5 break-all">
                          <Link size={11} /> {selectedProposalForPopup.seekerId.resume}
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-500 italic">No resume uploaded</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Portfolio Website</span>
                      {selectedProposalForPopup.seekerId.portfolioWebsite ? (
                        <a href={selectedProposalForPopup.seekerId.portfolioWebsite} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-medium text-teal-500 hover:text-teal-400 transition-colors flex items-center gap-1.5 break-all">
                          <Link size={11} /> {selectedProposalForPopup.seekerId.portfolioWebsite}
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-500 italic">No website provided</span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/5 space-y-3 text-xs">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Professional Stats</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Rating</span>
                      <span className="font-bold text-amber-400">★ {selectedProposalForPopup.seekerId.rating || 5}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Reviews</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">{selectedProposalForPopup.seekerId.reviewCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500">Experience</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">{selectedProposalForPopup.seekerId.experience || 0} years</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Case Studies */}
              {selectedProposalForPopup.seekerId.portfolio && selectedProposalForPopup.seekerId.portfolio.length > 0 && (
                <div className="border-t border-zinc-200 dark:border-white/5 pt-6 space-y-4">
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                    <LayoutGrid size={15} /> Portfolio Case Studies ({selectedProposalForPopup.seekerId.portfolio.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {selectedProposalForPopup.seekerId.portfolio.map((proj, pIdx) => (
                      <div key={pIdx} className="p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/35 border border-zinc-200 dark:border-white/5 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h5 className="font-bold text-zinc-800 dark:text-zinc-200">{proj.title}</h5>
                          {proj.role && <span className="text-[10px] text-teal-500 font-bold uppercase tracking-wider block">Role: {proj.role}</span>}
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{proj.description}</p>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {proj.technologies.map((t, tIdx) => (
                                <span key={tIdx} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded text-[9px] text-zinc-500 font-semibold">{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        {proj.images && proj.images.length > 0 && (
                          <div>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase block pb-1">Project Screenshots</span>
                            <div className="flex flex-wrap gap-2">
                              {proj.images.map((img, imgIdx) => (
                                <img key={imgIdx} src={img} alt={`screenshot-${imgIdx}`}
                                  className="w-20 h-14 object-cover rounded border border-zinc-200 dark:border-white/10 hover:scale-105 transition-transform cursor-pointer" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
