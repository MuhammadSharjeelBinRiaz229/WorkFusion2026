"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, Users, Briefcase, FileText, Settings, Sparkles, 
  CheckCircle, AlertTriangle, LogOut, Plus, RefreshCw, BarChart2, Check, X, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../../../components/ThemeToggle";
import BottomTabBar from "../../../components/BottomTabBar";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("analytics"); // analytics, moderation, categories
  const [user, setUser] = useState(null);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);

  // Analytics state
  const [metrics, setMetrics] = useState({
    totalEmployers: 0,
    totalSeekers: 0,
    totalJobs: 0,
    totalApplications: 0,
    averageMatchScore: 0,
  });
  const [categoriesDist, setCategoriesDist] = useState([]);
  const [logs, setLogs] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Category registration state
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catParent, setCatParent] = useState("");
  const [catList, setCatList] = useState([]);
  const [catMessage, setCatMessage] = useState("");
  const [catLoading, setCatLoading] = useState(false);

  // Moderation state
  const [modUsers, setModUsers] = useState([]);
  const [modJobs, setModJobs] = useState([]);
  const [modLoading, setModLoading] = useState(false);

  // Load user details
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/login");
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== "Admin") {
      router.push("/login"); // Force logout/login for unauthorized roles
      return;
    }
    setUser(parsedUser);
  }, [router]);

  // API Helper with auto token refresh
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

  // Fetch Analytics Metrics
  const fetchAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await apiRequest("/admin/analytics");
      const result = await res.json();
      if (result.success && result.data) {
        setMetrics(result.data.metrics);
        setCategoriesDist(result.data.categoryDistribution || []);
        setLogs(result.data.recentActivityLogs || []);
      }
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [apiRequest]);

  // Fetch Categories List
  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiRequest("/admin/categories");
      const result = await res.json();
      if (result.success) {
        setCatList(result.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  }, [apiRequest]);

  // Fetch Moderation users/jobs lists
  const fetchModerationLists = useCallback(async () => {
    setModLoading(true);
    try {
      const jobsRes = await apiRequest("/jobs?page=1&limit=50&status=Open");
      const jobsResult = await jobsRes.json();
      if (jobsResult.success) {
        setModJobs(jobsResult.data.jobs);
      }
    } catch (err) {
      console.error("Failed to fetch moderation lists", err);
    } finally {
      setModLoading(false);
    }
  }, [apiRequest]);

  // Trigger loads
  useEffect(() => {
    if (!user) return;
    if (activeTab === "analytics") {
      fetchAnalytics();
    } else if (activeTab === "categories") {
      fetchCategories();
    } else if (activeTab === "moderation") {
      fetchModerationLists();
    }
  }, [activeTab, user, fetchAnalytics, fetchCategories, fetchModerationLists]);

  // Moderation Job Updates
  const handleModerateJob = async (jobId, status) => {
    try {
      const res = await apiRequest(`/admin/jobs/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Job status updated successfully");
        fetchModerationLists();
      }
    } catch (err) {
      console.error("Moderation request failed", err);
    }
  };

  // Category creation
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCatLoading(true);
    setCatMessage("");

    try {
      const res = await apiRequest("/admin/categories", {
        method: "POST",
        body: JSON.stringify({
          name: catName,
          description: catDesc,
          parentCategory: catParent || undefined,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setCatMessage("Category created successfully!");
        setCatName("");
        setCatDesc("");
        setCatParent("");
        fetchCategories();
      } else {
        setCatMessage(result.message || "Failed to create category");
      }
    } catch (err) {
      setCatMessage("Server connection failed");
    } finally {
      setCatLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-white flex flex-col md:flex-row transition-colors duration-300">

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-base">W</div>
          <span className="font-extrabold text-lg">Work<span className="text-blue-500 font-medium">Fusion</span></span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setAccountSheetOpen(true)}
            className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm transition-all hover:opacity-80"
            aria-label="Account menu"
          >
            {user ? user.fullName.charAt(0).toUpperCase() : "A"}
          </button>
        </div>
      </header>

      {/* Account Sheet — right slide-over */}
      <AnimatePresence>
        {accountSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAccountSheetOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside
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

              {/* User card */}
              {user && (
                <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200 dark:border-white/5">
                  <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">{user.fullName}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">{user.email}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-semibold uppercase mt-1 inline-block">{user.role}</span>
                  </div>
                </div>
              )}

              {/* Logout */}
              <div className="mt-auto px-3 pb-6 pt-4 border-t border-zinc-200 dark:border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation — desktop only */}
      <aside className="hidden md:flex w-64 shrink-0 bg-zinc-100 dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/5 flex-col p-6 gap-6 justify-between transition-colors duration-300">
        <div className="flex flex-col gap-8">
          
          {/* Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg">
                W
              </div>
              <span className="font-extrabold text-xl">
                Work<span className="text-blue-500 font-medium">Fusion</span>
              </span>
            </div>
            <ThemeToggle />
          </div>

          {/* User Role */}
          {user && (
            <div className="p-4 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 flex flex-col gap-2.5">
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-300">{user.fullName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold self-start uppercase">
                {user.role}
              </span>
            </div>
          )}

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "analytics" ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"}`}
            >
              <BarChart2 size={18} /> Platform Analytics
            </button>
            <button
              onClick={() => setActiveTab("moderation")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "moderation" ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"}`}
            >
              <ShieldAlert size={18} /> Mod Dashboard
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium transition-all ${activeTab === "categories" ? "bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm" : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5"}`}
            >
              <Settings size={18} /> Category Manager
            </button>
          </nav>

        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Panel */}
        <main className="flex-1 px-4 md:px-10 pt-14 md:pt-10 pb-24 md:pb-10 relative overflow-y-auto max-h-screen bg-zinc-50 dark:bg-zinc-950/50 transition-colors duration-300">


        {/* ================= TAB: ANALYTICS ================= */}
        {activeTab === "analytics" && (
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-extrabold">System Overview</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Real-time usage metrics and active transactions</p>
              </div>
              <button
                onClick={fetchAnalytics}
                className="p-2.5 bg-zinc-200 hover:bg-zinc-300 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl border border-zinc-300 dark:border-white/5 text-zinc-800 dark:text-white transition-all flex items-center gap-1.5"
              >
                <RefreshCw size={14} className={analyticsLoading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

            {/* Metrics cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Employers</span>
                <h3 className="text-3xl font-bold mt-2 text-zinc-800 dark:text-white">{metrics.totalEmployers}</h3>
              </div>
              <div className="glass-card p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Service Seekers</span>
                <h3 className="text-3xl font-bold mt-2 text-zinc-800 dark:text-white">{metrics.totalSeekers}</h3>
              </div>
              <div className="glass-card p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Total Jobs</span>
                <h3 className="text-3xl font-bold mt-2 text-zinc-800 dark:text-white">{metrics.totalJobs}</h3>
              </div>
              <div className="glass-card p-6 rounded-2xl shadow-sm border border-zinc-200 dark:border-white/5">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Total Applications</span>
                <h3 className="text-3xl font-bold mt-2 text-zinc-800 dark:text-white">{metrics.totalApplications}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Activity logs (Col span 2) */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-bold text-lg text-zinc-700 dark:text-zinc-300">Recent Action Audits</h3>
                <div className="p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-2xl space-y-4 max-h-[400px] overflow-y-auto shadow-sm">
                  {logs.length === 0 ? (
                    <span className="text-xs text-zinc-500 block">No action audits recorded.</span>
                  ) : (
                    logs.map((l) => (
                      <div key={l._id} className="text-xs flex justify-between gap-4 border-b border-zinc-100 dark:border-white/5 pb-2.5 last:border-0 last:pb-0">
                        <div>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300">{l.action}</span>
                          <span className="text-zinc-500 dark:text-zinc-500 block">By: {l.userId ? `${l.userId.fullName} (${l.userId.role})` : "System"}</span>
                        </div>
                        <span className="text-zinc-400 dark:text-zinc-500">{new Date(l.createdAt).toLocaleTimeString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Category distribution */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-zinc-700 dark:text-zinc-300">Category Spread</h3>
                <div className="p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-2xl space-y-3 shadow-sm">
                  {categoriesDist.length === 0 ? (
                    <span className="text-xs text-zinc-500 block">No categories spread metrics.</span>
                  ) : (
                    categoriesDist.map((c, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-zinc-500 dark:text-zinc-400">{c._id}</span>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-700 dark:text-zinc-300 font-bold font-sans">{c.count} jobs</span>
                          <span className="text-zinc-500 dark:text-zinc-500">PKR {c.totalBudget?.toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= TAB: MODERATION ================= */}
        {activeTab === "moderation" && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-extrabold">Moderator Dashboard</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Review active listings and change job states directly</p>
            </div>

            {modLoading ? (
              <span className="text-sm text-zinc-500">Loading active records...</span>
            ) : modJobs.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 text-zinc-500 text-sm shadow-sm">
                No active listings found for moderation.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {modJobs.map((job) => (
                  <div key={job._id} className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                    <div>
                      <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">{job.title}</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Category: {job.category} • Location: {job.location}</p>
                    </div>

                    <div className="flex gap-2">
                      {job.status === "Open" && (
                        <button
                          onClick={() => handleModerateJob(job._id, "Paused")}
                          className="px-3.5 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                        >
                          Pause Job
                        </button>
                      )}
                      {job.status === "Paused" && (
                        <button
                          onClick={() => handleModerateJob(job._id, "Open")}
                          className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                        >
                          Reopen Job
                        </button>
                      )}
                      <button
                        onClick={() => handleModerateJob(job._id, "Closed")}
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                      >
                        Close Listing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB: CATEGORIES ================= */}
        {activeTab === "categories" && (
          <div className="flex flex-col gap-6 max-w-2xl">
            <div>
              <h2 className="text-3xl font-extrabold">Category Manager</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Configure parent categories and subcategories for job classification</p>
            </div>

            {catMessage && (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm flex items-center gap-2">
                <CheckCircle size={18} />
                <span>{catMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateCategory} className="space-y-4 p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 shadow-md">
              <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-200">Create New Category</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-semibold uppercase">Category Name</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Software Development"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm outline-none text-zinc-900 dark:text-zinc-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 font-semibold uppercase">Parent (Optional)</label>
                  <select
                    value={catParent}
                    onChange={(e) => setCatParent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm text-zinc-700 dark:text-zinc-400 outline-none"
                  >
                    <option value="">None (Make Primary Category)</option>
                    {catList.filter(c => !c.parentCategory).map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-500 font-semibold uppercase">Description</label>
                <textarea
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  rows={3}
                  placeholder="Summarize the professional domain scope..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm outline-none text-zinc-900 dark:text-zinc-200"
                />
              </div>

              <button
                type="submit"
                disabled={catLoading}
                className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-black font-bold text-sm rounded-xl dark:hover:bg-zinc-200 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={16} /> Register Category
              </button>
            </form>

            <div className="space-y-3">
              <h3 className="font-bold text-lg text-zinc-700 dark:text-zinc-300">Registered Sectors ({catList.length})</h3>
              <div className="p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-2xl divide-y divide-zinc-100 dark:divide-white/5 max-h-[300px] overflow-y-auto shadow-sm">
                {catList.map((c) => (
                  <div key={c._id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">{c.name}</span>
                      {c.parentCategory && (
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-500 ml-2 italic">Subcategory of: {c.parentCategory.name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Mobile Bottom Tab Bar */}
      <BottomTabBar
        tabs={[
          { id: "analytics",  label: "Analytics",  icon: BarChart2 },
          { id: "moderation", label: "Moderation", icon: ShieldAlert },
          { id: "categories", label: "Categories", icon: Settings },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

    </div>
  );
}
