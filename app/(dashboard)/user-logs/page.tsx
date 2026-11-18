"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  History,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  User,
  Shield,
  Crown,
  Lock,
  Layers,
  Calendar,
  Clock,
  Globe,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Activity,
  UserCheck,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Pagination, DeleteConfirmModal, CustomSelect } from "@/components/ui";

interface LogItem {
  id: number;
  user_id: number | null;
  user_name: string;
  user_email: string | null;
  user_role: string;
  action: string;
  module: string;
  description: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  img_url?: string | null;
}

interface FilterUser {
  id: number;
  name: string;
  email: string | null;
  role: string;
}

export default function UserLogsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState("all");
  const [availableUsers, setAvailableUsers] = useState<FilterUser[]>([]);

  // Auth & Roles
  const [userRole, setUserRole] = useState("staff");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Clear modal state
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [clearError, setClearError] = useState<string | null>(null);

  // Verify access: Admin or Super Admin only
  useEffect(() => {
    try {
      const r = (localStorage.getItem("role") || "").toLowerCase();
      setUserRole(r);
      const isSuper = r === "super_admin";
      setIsSuperAdmin(isSuper);

      if (r !== "admin" && r !== "super_admin") {
        setIsAuthorized(false);
        router.replace("/profile");
        return;
      }
      setIsAuthorized(true);
    } catch {
      setIsAuthorized(false);
      router.replace("/profile");
    }
  }, [router]);

  // Load Logs from API
  const fetchLogs = useCallback(
    async (pageToLoad = currentPage) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(pageToLoad));
        params.set("pageSize", String(pageSize));
        if (search.trim()) params.set("search", search.trim());
        if (selectedAction !== "all") params.set("action", selectedAction);
        if (selectedModule !== "all") params.set("module", selectedModule);
        if (selectedUserId !== "all") params.set("userId", selectedUserId);

        const res = await fetch(`/api/user-logs?${params.toString()}`);
        const data = await res.json().catch(() => null);

        if (res.ok && data?.status === "success" && data.data) {
          setLogs(data.data.logs || []);
          setTotalItems(data.data.total || 0);
          setTotalPages(data.data.totalPages || 1);
          if (Array.isArray(data.data.users)) {
            setAvailableUsers(data.data.users);
          }
        } else {
          toast.error(data?.message || "Failed to load user logs");
        }
      } catch (err: any) {
        toast.error("Communication error fetching logs");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize, search, selectedAction, selectedModule, selectedUserId, toast]
  );

  useEffect(() => {
    if (isAuthorized) {
      fetchLogs(currentPage);
    }
  }, [isAuthorized, currentPage, pageSize, selectedAction, selectedModule, selectedUserId, fetchLogs]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLogs(1);
  };

  // Clear All Logs (Super Admin only)
  const handleClearAll = async () => {
    setClearing(true);
    setClearError(null);
    try {
      const res = await fetch("/api/user-logs", { method: "DELETE" });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.status === "success") {
        toast.success("All user activity logs cleared successfully!");
        setIsClearModalOpen(false);
        setCurrentPage(1);
        fetchLogs(1);
      } else {
        setClearError(data?.message || "Failed to clear activity logs");
      }
    } catch (err: any) {
      setClearError(err?.message || "Communication error clearing logs");
    } finally {
      setClearing(false);
    }
  };

  // Helper formatters
  const formatDateTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return iso;
    }
  };

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    switch (act) {
      case "LOGIN":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
      case "LOGOUT":
        return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      case "CREATE":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800";
      case "UPDATE":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
      case "DELETE":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800";
      case "STOCK_ADJUST":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800";
      case "DUE_COLLECTION":
        return "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800";
      case "PASSWORD_CHANGE":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "super_admin":
        return "bg-gradient-to-r from-amber-500 to-rose-500 text-white border-transparent";
      case "admin":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900";
      case "manager":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900";
      case "staff":
      case "warehouse":
      case "cashier":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  if (isAuthorized === false) {
    return null;
  }

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
      </div>
    );
  }

  const loginCount = logs.filter((l) => l.action === "LOGIN").length;
  const changesCount = logs.filter((l) => ["CREATE", "UPDATE", "DELETE", "STOCK_ADJUST", "DUE_COLLECTION"].includes(l.action)).length;

  const userOptions = [
    { value: "all", label: "👤 All System Users" },
    ...availableUsers.map((u) => ({
      value: String(u.id),
      label: u.name,
      subLabel: u.role,
    })),
  ];

  const actionOptions = [
    { value: "all", label: "⚡ All Actions" },
    { value: "LOGIN", label: "LOGIN (User Session)" },
    { value: "LOGOUT", label: "LOGOUT (User Session)" },
    { value: "CREATE", label: "CREATE (New Record)" },
    { value: "UPDATE", label: "UPDATE (Edit Record)" },
    { value: "DELETE", label: "DELETE (Remove Record)" },
    { value: "STOCK_ADJUST", label: "STOCK ADJUST" },
    { value: "DUE_COLLECTION", label: "DUE COLLECTION" },
    { value: "PASSWORD_CHANGE", label: "PASSWORD CHANGE" },
  ];

  const moduleOptions = [
    { value: "all", label: "📦 All Modules" },
    { value: "Auth", label: "Auth & Sessions" },
    { value: "Users", label: "Users & Roles" },
    { value: "Profile", label: "User Profile" },
    { value: "POS / Sales", label: "POS / Sales" },
    { value: "Customers", label: "Customers & Dues" },
    { value: "Suppliers", label: "Suppliers & Dues" },
    { value: "Products", label: "Products Catalog" },
    { value: "Inventory", label: "Inventory Stock" },
    { value: "Purchases", label: "Purchases" },
    { value: "Expenses", label: "Expenses" },
    { value: "Challans", label: "Delivery Challans" },
    { value: "Settings", label: "Settings" },
  ];

  return (
    <div className="space-y-4 font-sans pb-10">
      {/* 1. Header with Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-slate-800 shadow-xs shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none m-0 p-0">
              User Activity Logs & History
            </h1>
            <p className="text-xs text-slate-500 mt-1 mb-0">
              Real-time audit trail of user logins, logouts, sales, and system changes
            </p>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchLogs(currentPage)}
            className="h-[38px] px-3.5 rounded-xl border border-[#cbd5e1] dark:border-[#334155] bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
            <span>Refresh</span>
          </button>

          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => {
                setClearError(null);
                setIsClearModalOpen(true);
              }}
              className="h-[38px] px-3.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              title="Clear All History (Super Admin Only)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Logs</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              TOTAL RECORDED LOGS
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 m-0">
            {totalItems}
          </h2>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400">
              PAGE LOGINS & SESSIONS
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-sky-700 dark:text-sky-300 m-0">
            {loginCount}
          </h2>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              DATA MODIFICATIONS
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-300 m-0">
            {changesCount}
          </h2>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400">
              REGISTERED USERS
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-rose-700 dark:text-rose-300 m-0">
            {availableUsers.length}
          </h2>
        </div>
      </div>

      {/* 3. Search & Filter Controls (Custom Project Standard Design) */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] p-3 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, action, description..."
              className="w-full h-[38px] pl-9 pr-3 text-xs bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-slate-800 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* User Filter Dropdown */}
          <div className="lg:col-span-3">
            <CustomSelect
              value={selectedUserId}
              onChange={(val) => {
                setSelectedUserId(String(val));
                setCurrentPage(1);
              }}
              options={userOptions}
              placeholder="All System Users"
              className="[&_button]:!min-h-[38px] [&_button]:!h-[38px] [&_button]:!py-1"
            />
          </div>

          {/* Action Filter Dropdown */}
          <div className="lg:col-span-2">
            <CustomSelect
              value={selectedAction}
              onChange={(val) => {
                setSelectedAction(String(val));
                setCurrentPage(1);
              }}
              options={actionOptions}
              placeholder="All Actions"
              className="[&_button]:!min-h-[38px] [&_button]:!h-[38px] [&_button]:!py-1"
            />
          </div>

          {/* Module Filter Dropdown */}
          <div className="lg:col-span-2">
            <CustomSelect
              value={selectedModule}
              onChange={(val) => {
                setSelectedModule(String(val));
                setCurrentPage(1);
              }}
              options={moduleOptions}
              placeholder="All Modules"
              className="[&_button]:!min-h-[38px] [&_button]:!h-[38px] [&_button]:!py-1"
            />
          </div>

          {/* Search Button */}
          <div className="lg:col-span-1">
            <button
              type="submit"
              className="w-full h-[38px] bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center cursor-pointer"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* 4. Table Container (Box-Type, Emerald Header, No IP column) */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#15803d] text-white text-[11px] font-bold uppercase tracking-wider border-b border-[#15803d]">
                <th className="py-3 px-3.5 w-12 text-center">#</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-3 text-center">Role</th>
                <th className="py-3 px-3 text-center">Action</th>
                <th className="py-3 px-3 text-center">Module</th>
                <th className="py-3 px-4 min-w-[280px]">Activity Description</th>
                <th className="py-3 px-4 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {loading && logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Loading activity logs...</span>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-600 dark:text-slate-300">No activity logs found</p>
                    <p className="text-[11px] mt-0.5">Logs will automatically appear here as users take actions.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3.5 text-center font-mono text-[11px] text-slate-400 font-bold">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>

                    {/* User Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {log.img_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={log.img_url}
                            alt={log.user_name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200 dark:border-slate-700">
                            {log.user_name ? log.user_name.charAt(0).toUpperCase() : "U"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                            {log.user_name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {log.user_email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getRoleBadge(
                          log.user_role
                        )}`}
                      >
                        {log.user_role.toLowerCase() === "super_admin" ? (
                          <>
                            <Crown className="w-3 h-3 text-white" />
                            <span>Super Admin</span>
                          </>
                        ) : log.user_role.toLowerCase() === "admin" ? (
                          <>
                            <Shield className="w-3 h-3 text-rose-600" />
                            <span>Admin</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 text-slate-500" />
                            <span className="capitalize">{log.user_role}</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Action Badge */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    {/* Module */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {log.module}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-medium">
                      <div className="leading-snug">{log.description}</div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards (No IP) */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {loading && logs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
              <span>Loading logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-10 text-center px-4">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-xs text-slate-700 dark:text-slate-300">No activity logs</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {log.img_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={log.img_url}
                        alt={log.user_name}
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {log.user_name ? log.user_name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {log.user_name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {log.user_email || log.user_role}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getActionBadge(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                </div>

                <div className="text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {log.description}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{log.module}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(log.created_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 5. Pagination */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSizeOptions={[20, 50, 100, 200]}
          />
        </div>
      </div>

      {/* 6. CLEAR ALL LOGS CONFIRMATION MODAL (Super Admin Only) */}
      <DeleteConfirmModal
        isOpen={isClearModalOpen}
        title="Clear All User Activity History"
        itemName="All Activity Logs"
        description="Are you absolutely sure you want to delete all user activity history logs? This audit trail will be permanently cleared from the database."
        loading={clearing}
        error={clearError}
        onConfirm={handleClearAll}
        onClose={() => {
          setIsClearModalOpen(false);
          setClearError(null);
        }}
      />
    </div>
  );
}
