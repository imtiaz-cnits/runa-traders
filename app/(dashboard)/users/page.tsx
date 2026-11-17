"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Plus,
  Users as UsersIcon,
  Search,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
  Edit2,
  Trash2,
  Crown,
  Receipt,
  Calculator,
  Sliders,
  Check,
  Camera,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Pagination, DeleteConfirmModal } from "@/components/ui";
import {
  PERMISSION_MODULES,
  ModuleDef,
  getAllPermissionsObject,
  ROLE_PRESETS,
  ALL_SYSTEM_ROLES,
  isSuperAdminRole,
  isAdminOrSuperAdmin,
  formatRoleLabel,
} from "@/lib/permissions";

interface UserItem {
  id: number;
  name: string;
  email: string | null;
  mobile: string;
  role: string;
  status: string;
  created_at: string;
  img_url?: string | null;
  permissions?: Record<string, boolean> | null;
}

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string>("admin");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");

  // Delete Confirm Modal State
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "staff",
    status: "approved",
    img_url: "",
    permissions: { ...ROLE_PRESETS.staff },
  });

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json().catch(() => null);
      if (res.ok && data?.status === "success" && Array.isArray(data.data)) {
        setUsers(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    try {
      const r = (localStorage.getItem("role") || "").toLowerCase();
      if (r && !isAdminOrSuperAdmin(r)) {
        window.location.replace("/profile");
        return;
      }
      if (r) setCurrentUserRole(r);
      const uStr = localStorage.getItem("user");
      if (uStr) {
        const u = JSON.parse(uStr);
        if (u?.id) setCurrentUserId(Number(u.id));
      }
    } catch {}

    // Refresh authoritative caller role/id from session
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((res) => {
        if (res?.status === "success" && res.data) {
          const meRole = String(res.data.role || "").toLowerCase();
          try {
            localStorage.setItem("role", res.data.role);
          } catch {}
          if (!isAdminOrSuperAdmin(meRole)) {
            window.location.replace("/profile");
            return;
          }
          setCurrentUserRole(meRole);
          setCurrentUserId(Number(res.data.id));
          loadUsers();
        }
      })
      .catch(() => {});
  }, []);

  const isCallerSuperAdmin = isSuperAdminRole(currentUserRole);

  const canEditUserRow = (user: UserItem) => {
    return isCallerSuperAdmin || !isAdminOrSuperAdmin(user.role);
  };

  const canDeleteUserRow = (user: UserItem) => {
    if (user.id === 1 || (currentUserId !== null && user.id === currentUserId)) {
      return false;
    }
    return isCallerSuperAdmin || !isAdminOrSuperAdmin(user.role);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      password: "",
      role: "staff",
      status: "approved",
      img_url: "",
      permissions: { ...ROLE_PRESETS.staff },
    });
    setSelectedUser(null);
    setError("");
  };

  const handleOpenAdd = () => {
    resetForm();
    setModalOpen(true);
  };

  const handleOpenEdit = (user: UserItem) => {
    if (!canEditUserRow(user)) {
      toast.error("Only Super Admin can edit Admin or Super Admin accounts!");
      return;
    }
    setSelectedUser(user);
    setError("");
    const roleLower = user.role.toLowerCase();
    const roleKey = (ALL_SYSTEM_ROLES as readonly string[]).includes(roleLower)
      ? roleLower
      : "staff";
    setFormData({
      name: user.name,
      email: user.email || "",
      mobile: user.mobile,
      password: "",
      role: roleKey,
      status: user.status,
      img_url: user.img_url || "",
      permissions: user.permissions
        ? { ...ROLE_PRESETS[roleKey], ...user.permissions }
        : { ...(ROLE_PRESETS[roleKey] || ROLE_PRESETS.staff) },
    });
    setModalOpen(true);
  };

  const handleRoleChange = (newRole: string) => {
    const preset = ROLE_PRESETS[newRole] || ROLE_PRESETS.staff;
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      permissions: { ...preset },
    }));
  };

  const handleSelectAll = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: getAllPermissionsObject(true),
    }));
  };

  const handleDeselectAll = () => {
    setFormData((prev) => ({
      ...prev,
      permissions: getAllPermissionsObject(false),
    }));
  };

  const toggleModule = (mod: ModuleDef) => {
    setFormData((prev) => {
      const isCurrentlyChecked = Boolean(prev.permissions[mod.key]);
      const nextVal = !isCurrentlyChecked;
      const updated = { ...prev.permissions, [mod.key]: nextVal };
      if (mod.submenus) {
        mod.submenus.forEach((sub) => {
          updated[sub.key] = nextVal;
        });
      }
      return { ...prev, permissions: updated };
    });
  };

  const toggleSubmenu = (parentKey: string, subKey: string) => {
    setFormData((prev) => {
      const nextVal = !Boolean(prev.permissions[subKey]);
      const updated = { ...prev.permissions, [subKey]: nextVal };
      if (nextVal) {
        updated[parentKey] = true;
      }
      return { ...prev, permissions: updated };
    });
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    try {
      setUploadingAvatar(true);
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await fetch("/api/users/profile/avatar", {
        method: "POST",
        body: fd,
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.img_url) {
        setFormData((prev) => ({ ...prev, img_url: data.img_url }));
        toast.success("User avatar photo uploaded!");
      } else {
        toast.error(data?.message || "Failed to upload avatar");
      }
    } catch {
      toast.error("Error uploading avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteUser = (user: UserItem) => {
    if (user.id === 1 || (currentUserId !== null && user.id === currentUserId)) {
      toast.error("Primary account or currently logged-in account cannot be deleted!");
      return;
    }
    if (!isCallerSuperAdmin && isAdminOrSuperAdmin(user.role)) {
      toast.error("Only Super Admin can delete Admin or Super Admin accounts!");
      return;
    }
    setDeleteError(null);
    setUserToDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.status === "success") {
        toast.success("User account deleted successfully!");
        setUserToDelete(null);
        setCurrentPage(1);
        loadUsers();
      } else {
        setDeleteError(data?.message || `Failed to delete user account (Status ${res.status})`);
      }
    } catch (err: any) {
      setDeleteError(err?.message || "Communication error deleting user account");
    } finally {
      setIsDeleting(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const url = selectedUser ? `/api/users/${selectedUser.id}` : "/api/users";
      const method = selectedUser ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.status !== "success") {
        setError(data?.message || `Failed to ${selectedUser ? "update" : "create"} user`);
        setSubmitting(false);
        return;
      }

      setModalOpen(false);
      toast.success(selectedUser ? "User updated successfully!" : "User created successfully!");
      resetForm();
      setCurrentPage(1);
      loadUsers();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  // Dynamic KPI Stats calculated from actual DB records
  const totalUsers = users.length;
  const superAdminCount = users.filter((u) => isSuperAdminRole(u.role)).length;
  const adminOnlyCount = users.filter((u) => u.role.toLowerCase() === "admin").length;
  const adminCount = superAdminCount + adminOnlyCount;
  const managerCount = users.filter(
    (u) => u.role.toLowerCase() === "manager"
  ).length;
  const staffCount = users.filter(
    (u) =>
      u.role.toLowerCase() === "staff" ||
      u.role.toLowerCase() === "cashier" ||
      u.role.toLowerCase() === "accountant"
  ).length;

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      u.mobile.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      formatRoleLabel(u.role).toLowerCase().includes(q)
    );
  });

  const startIndex = (currentPage - 1) * pageSize;
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "super_admin":
        return "bg-gradient-to-r from-amber-500 to-rose-600 text-white border-amber-400/50 shadow-2xs";
      case "admin":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900";
      case "manager":
        return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-900";
      case "staff":
      case "cashier":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const renderPermissionBadge = (user: UserItem) => {
    const role = user.role.toLowerCase();
    if (role === "admin" || role === "super_admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>All Modules</span>
        </span>
      );
    }

    const perms = user.permissions;
    if (!perms) {
      if (role === "manager") {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>All Modules</span>
          </span>
        );
      }
      if (role === "cashier") {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>POS Only</span>
          </span>
        );
      }
      if (role === "staff" || role === "accountant") {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-600 text-white shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>Accounts Only</span>
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500 text-white">
          <span>Standard</span>
        </span>
      );
    }

    const activeKeys = Object.entries(perms)
      .filter(([_, v]) => Boolean(v))
      .map(([k]) => k);

    if (activeKeys.length >= 6) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>All Modules</span>
        </span>
      );
    }
    if (activeKeys.length === 1 && activeKeys[0] === "pos") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>POS Only</span>
        </span>
      );
    }
    if (
      !activeKeys.includes("pos") &&
      (activeKeys.includes("purchases") ||
        activeKeys.includes("expenses") ||
        activeKeys.includes("reports"))
    ) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-600 text-white shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          <span>Accounts Only</span>
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {activeKeys.map((k) => (
          <span
            key={k}
            className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
          >
            {k}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 font-sans">
      {/* 1. Page Header matching MARSS CORPORATION Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-slate-800 shadow-xs shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight leading-none m-0 p-0">
              User Role & Permission Management
            </h1>
            <p className="text-xs text-slate-500 mt-1 mb-0">
              Configure module-based ON/OFF toggle permissions for system users
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleOpenAdd}
          className="h-[38px] px-4 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* 2. Metrics Summary Cards matching MARSS CORPORATION Screenshot 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Users */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 shadow-xs hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              TOTAL SYSTEM USERS
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <UsersIcon className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 m-0">
            {totalUsers}
          </h2>
        </div>

        {/* Admin / Super Admin */}
        <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/40 shadow-xs hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400">
              SUPER ADMIN / ADMIN
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-300 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-sky-700 dark:text-sky-300 m-0">
              {adminCount}
            </h2>
            <span className="text-[10px] font-semibold text-sky-700/80 dark:text-sky-400">
              {superAdminCount} Super &bull; {adminOnlyCount} Admin
            </span>
          </div>
        </div>

        {/* Manager */}
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 shadow-xs hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              STORE MANAGER
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-300 m-0">
            {managerCount}
          </h2>
        </div>

        {/* Staff */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 shadow-xs hover:-translate-y-0.5 transition-transform">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              STAFF / OPERATOR
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300 m-0">
            {staffCount}
          </h2>
        </div>
      </div>

      {/* 3. User Table Box Container matching MARSS Screenshot 1 */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white m-0">
              System Users & Permissions List
            </h3>
          </div>

          <div className="w-full sm:w-80 h-[38px] flex items-center px-3 bg-slate-50 dark:bg-[#1e293b] rounded-xl border border-[#cbd5e1] dark:border-[#334155] focus-within:ring-2 focus-within:ring-emerald-600/30 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search user..."
              className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold whitespace-nowrap uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 text-center w-12">SL</th>
                <th className="py-3 px-4">User Info</th>
                <th className="py-3 px-3">Mobile Number</th>
                <th className="py-3 px-3 text-center">Role</th>
                <th className="py-3 px-3">Active Module Permissions</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-center w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Loading user list...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                    No system users found.
                  </td>
                </tr>
              ) : (
                displayedUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="py-3 px-4 text-center font-bold text-slate-400">
                      {startIndex + idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {user.img_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={user.img_url}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200 dark:border-slate-700">
                            <User className="w-4 h-4 text-slate-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-xs">
                            {user.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {user.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold font-mono text-slate-800 dark:text-slate-200">
                      {user.mobile}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadge(
                          user.role
                        )}`}
                      >
                        {isSuperAdminRole(user.role) ? (
                          <>
                            <Crown className="w-3.5 h-3.5 text-amber-100" />
                            <span>Super Admin</span>
                          </>
                        ) : user.role.toLowerCase() === "admin" ? (
                          <>
                            <Shield className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                            <span>Admin</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3.5 h-3.5 text-slate-500" />
                            <span>{formatRoleLabel(user.role)}</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {renderPermissionBadge(user)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${user.status === "approved"
                          ? "text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                          : "text-amber-700 bg-amber-50 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                          }`}
                      >
                        {user.status === "approved" ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {canEditUserRow(user) ? (
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(user)}
                            className="w-7 h-7 rounded-lg border-[1.5px] border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit User & Permissions"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="w-7 h-7 rounded-lg border-[1.5px] border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 flex items-center justify-center cursor-not-allowed"
                            title="Only Super Admin can edit Admin or Super Admin accounts"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {canDeleteUserRow(user) ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            className="w-7 h-7 rounded-lg border-[1.5px] border-rose-200 dark:border-rose-900/60 bg-rose-50/60 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="w-7 h-7 rounded-lg border-[1.5px] border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-300 dark:text-slate-600 flex items-center justify-center cursor-not-allowed"
                            title={
                              user.id === 1 || user.id === currentUserId
                                ? "Protected account cannot be deleted"
                                : "Only Super Admin can delete Admin or Super Admin accounts"
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {displayedUsers.map((user) => (
            <div key={user.id} className="p-3.5 space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  {user.img_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.img_url}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{user.mobile}</div>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getRoleBadge(
                    user.role
                  )}`}
                >
                  {isSuperAdminRole(user.role) && <Crown className="w-3 h-3 text-amber-100" />}
                  <span>{formatRoleLabel(user.role)}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">Permissions:</span>
                <div>{renderPermissionBadge(user)}</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                {canEditUserRow(user) ? (
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(user)}
                    className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold cursor-pointer"
                  >
                    Edit
                  </button>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-[11px] font-semibold">
                    Super Admin Protected
                  </span>
                )}
                {canDeleteUserRow(user) && (
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(user)}
                    className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold cursor-pointer"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsers.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSizeOptions={[20, 50, 100, 200]}
          />
        </div>
      </div>

      {/* 4. Role Permission Matrix Info Box */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] p-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-3 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>Module Permission Guidelines (Live Module Access)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-rose-700 dark:text-rose-400 block mb-1">
              👑 Super Admin & Admin
            </span>
            <p className="text-[11px] text-slate-500 m-0 leading-relaxed">
              Super Admin manages Admin/Super Admin roles & hierarchy; Admin oversees store modules.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-sky-700 dark:text-sky-400 block mb-1">
              💼 Store Manager
            </span>
            <p className="text-[11px] text-slate-500 m-0 leading-relaxed">
              Operational control: POS, Products, Purchases, Customers & Reports ON.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
              🧾 Cashier / POS
            </span>
            <p className="text-[11px] text-slate-500 m-0 leading-relaxed">
              Counter billing: POS Billing & Sales Returns ON. Backoffice disabled.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-purple-700 dark:text-purple-400 block mb-1">
              📊 Accountant / Staff
            </span>
            <p className="text-[11px] text-slate-500 m-0 leading-relaxed">
              Financial auditing: Customer/Supplier Due, Daily Ledger & Reports ON.
            </p>
          </div>
        </div>
      </div>

      {/* 5. CREATE / EDIT USER MODAL (Matching User Role Spec Images 1 & 2) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-white dark:bg-[#0f172a] rounded-[16px] shadow-2xl overflow-hidden border border-[#cbd5e1] dark:border-[#334155] max-h-[90vh] flex flex-col">
            {/* Sticky Header */}
            <div className="bg-[#15803d] px-5 py-3.5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-white" />
                <h3 className="text-sm font-bold tracking-wide m-0 text-white">
                  {selectedUser
                    ? "Edit User & Permissions (ব্যবহারকারী ও পারমিশন সম্পাদনা)"
                    : "Create New User & Permissions (নতুন ব্যবহারকারী ও পারমিশন তৈরি)"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-[28px] h-[28px] rounded-full bg-[#dc2626] hover:bg-red-700 text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Personal Information (Matching Image 1) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Left: Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name (পূর্ণ নাম) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Md. Rafiqul Islam (যেমন: মোঃ রফিকুল ইসলাম)"
                    className="w-full h-[42px] px-3 text-xs bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Right: Mobile */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mobile Number (মোবাইল নম্বর) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full h-[42px] px-3 text-xs bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-slate-900 dark:text-slate-100 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Left: Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address (ইমেইল - ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@gmail.com"
                    className="w-full h-[42px] px-3 text-xs bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Right: Password */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password (পাসওয়ার্ড){" "}
                    {selectedUser ? (
                      "(Leave blank to keep unchanged / অপরিবর্তিত রাখতে খালি রাখুন)"
                    ) : (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    type="password"
                    required={!selectedUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full h-[42px] px-3 text-xs bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                {/* Left: System Role */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    System Role (পদবী / রোল) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full h-[42px] px-3 text-xs bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {isCallerSuperAdmin && (
                      <option value="super_admin">👑 Super Admin (সুপার অ্যাডমিন)</option>
                    )}
                    <option value="admin">🛡️ Admin (অ্যাডমিন)</option>
                    <option value="manager">🧑‍💼 Manager (ম্যানেজার)</option>
                    <option value="staff">👤 Staff (স্টাফ)</option>
                  </select>
                </div>

                {/* Right: Account Status */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Account Status (স্ট্যাটাস) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-[42px] px-3 text-xs bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="approved">Approved / Active (সক্রিয়)</option>
                    <option value="pending">Pending Approval (পেন্ডিং)</option>
                  </select>
                </div>

                {/* Optional Avatar Photo */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Profile Photo (প্রোফাইল ছবি - ঐচ্ছিক)
                  </label>
                  <div className="flex items-center gap-3">
                    {formData.img_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.img_url}
                        alt="Preview"
                        className="w-10 h-10 rounded-full object-cover border border-slate-300"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <label className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{uploadingAvatar ? "Uploading... (আপলোড হচ্ছে...)" : "Upload Photo (ছবি আপলোড করুন)"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFile}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                    </label>
                    {formData.img_url && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, img_url: "" })}
                        className="text-xs text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove (মুছে ফেলুন)
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Menu Access Permissions (Matching Image 2) */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wide m-0">
                      Sidebar Module Access Permissions (সাইডবার মেনু অ্যাক্সেস পারমিশন)
                    </h4>
                    <p className="text-[11px] text-slate-400 m-0 mt-0.5">
                      Control menu and submenu permissions using checkboxes (প্রত্যেকটি মেনু ও সাবমেনুর পারমিশন চেকবক্স দিয়ে নিয়ন্ত্রণ করুন)
                    </p>
                  </div>

                  {/* Top Right Action Buttons: সব নির্বাচন & সব বাতিল */}
                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-[#166534] dark:text-emerald-300 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      Select All (সব নির্বাচন)
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      Deselect All (সব বাতিল)
                    </button>
                  </div>
                </div>

                {/* Hierarchical Module Cards Matching Image 2 */}
                <div className="space-y-3">
                  {PERMISSION_MODULES.map((mod) => {
                    const isParentChecked = Boolean(formData.permissions[mod.key]);
                    return (
                      <div
                        key={mod.key}
                        className={`rounded-2xl border transition-all ${isParentChecked
                          ? "border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900/70 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
                          } p-3.5`}
                      >
                        {/* Parent Row */}
                        <div
                          onClick={() => toggleModule(mod)}
                          className="flex items-start justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isParentChecked
                                ? "bg-[#16a34a] text-white"
                                : "border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                }`}
                            >
                              {isParentChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                {mod.label}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {mod.desc}
                              </div>
                            </div>
                          </div>

                          {mod.submenus && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                              {mod.submenus.length} Submenus ({mod.submenus.length} টি সাবমেনু)
                            </span>
                          )}
                        </div>

                        {/* Nested Submenu Box if Available (Matching Image 2) */}
                        {mod.submenus && (
                          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 pl-4 sm:pl-7">
                            {mod.submenus.map((sub) => {
                              const isSubChecked = Boolean(formData.permissions[sub.key]);
                              return (
                                <div
                                  key={sub.key}
                                  onClick={() => toggleSubmenu(mod.key, sub.key)}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${isSubChecked
                                    ? "border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20"
                                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40"
                                    }`}
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div
                                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${isSubChecked
                                        ? "bg-[#16a34a] text-white"
                                        : "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                                        }`}
                                    >
                                      {isSubChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                        {sub.label}
                                      </div>
                                      <div className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight">
                                        {sub.desc}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-[40px] px-6 rounded-xl bg-[#dc2626] hover:bg-red-700 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  Cancel (বাতিল)
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-[40px] px-6 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  {submitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>✓ Save User (ব্যবহারকারী সংরক্ষণ)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE USER CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={Boolean(userToDelete)}
        title="Delete User Account"
        itemName={userToDelete ? `${userToDelete.name} (${userToDelete.mobile})` : ""}
        description="Are you sure you want to delete this user account? All assigned permissions and authentication access will be permanently revoked."
        loading={isDeleting}
        error={deleteError}
        onConfirm={confirmDeleteUser}
        onClose={() => {
          setUserToDelete(null);
          setDeleteError(null);
        }}
      />
    </div>
  );
}
