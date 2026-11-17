"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle,
  Clock,
  Shield,
  RotateCcw,
} from "lucide-react";
import { CustomSelect, SelectOption } from "@/components/ui/custom-select";

interface CreatedAccountInfo {
  id: number;
  name: string;
  email: string | null;
  mobile: string;
  role: string;
  status: string;
}

const ROLE_OPTIONS: SelectOption[] = [
  { value: "staff", label: "Staff (স্টাফ)", subLabel: "POS, Inventory & Customers" },
  { value: "manager", label: "Manager (ম্যানেজার)", subLabel: "Operations & Reports" },
  { value: "admin", label: "Admin (অ্যাডমিন)", subLabel: "Full System Access" },
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("staff");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdUser, setCreatedUser] = useState<CreatedAccountInfo | null>(null);

  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Full name must be at least 2 characters.");
      return;
    }

    if (!/^[+\d\s-]{6,20}$/.test(mobile.trim())) {
      setError("Please enter a valid mobile number (6-20 digits).");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile.trim(),
          email: email.trim(),
          role,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.status !== "success") {
        setError(data?.message || "Registration failed. Please check your details.");
        setLoading(false);
        return;
      }

      setCreatedUser(data.data);
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  function handleResetForm() {
    setCreatedUser(null);
    setName("");
    setMobile("");
    setEmail("");
    setRole("staff");
    setPassword("");
    setConfirmPassword("");
    setError("");
  }

  return (
    <div className="min-h-screen flex w-full bg-slate-50 dark:bg-[#0b0f19]">
      {/* Left Hero Panel (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#881337] text-white p-12 flex-col justify-between">
        {/* Glow Blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
            <ShoppingBag className="w-6 h-6 text-rose-200" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white leading-none">
              RUNA TRADERS
            </h2>
            <p className="text-xs text-rose-200/85 mt-1 font-medium">
              Retail Shop Management & POS
            </p>
          </div>
        </div>

        {/* Middle Feature Content */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-rose-100 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-rose-200" />
            Authorized Team Onboarding
          </div>

          <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white mb-6">
            Register Your Staff or Management Account.
          </h1>

          <p className="text-rose-100/90 text-sm xl:text-base leading-relaxed max-w-lg mb-8 font-normal">
            Submit your account registration with your desired role. For shop security, every newly created account requires Administrator approval before accessing the POS and ERP dashboard.
          </p>

          <div className="space-y-3.5">
            <div className="flex items-center gap-3 text-sm text-rose-50">
              <div className="w-6 h-6 rounded-full bg-rose-500/30 border border-rose-400/40 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-rose-200" />
              </div>
              <span>Pre-configured Permissions for Staff, Manager & Admin Roles</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-rose-50">
              <div className="w-6 h-6 rounded-full bg-rose-500/30 border border-rose-400/40 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-rose-200" />
              </div>
              <span>Sign In with Either Registered Mobile Number or Email</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-rose-50">
              <div className="w-6 h-6 rounded-full bg-rose-500/30 border border-rose-400/40 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-rose-200" />
              </div>
              <span>Verified Approval Workflow via User Roles Management</span>
            </div>
          </div>
        </div>

        {/* Bottom Security Badge */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-rose-200/80">
          <ShieldCheck className="w-4 h-4 text-rose-300" />
          <span>Protected with Role-Based Access Control (RBAC) & Admin Approval</span>
        </div>
      </div>

      {/* Right Signup Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white flex items-center justify-center shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">
                RUNA TRADERS
              </h2>
              <p className="text-xs text-slate-500">Retail Shop Management</p>
            </div>
          </div>

          {!createdUser ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                  Create Account
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                  Register your details below. Account activation requires Admin approval.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Md. Rafiqul Islam"
                      className="w-full h-[42px] pl-10 pr-3.5 rounded-xl bg-white dark:bg-slate-800/90 text-sm text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition-all"
                    />
                  </div>
                </div>

                {/* Mobile & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Mobile Number <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={20}
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full h-[42px] pl-10 pr-3 rounded-xl bg-white dark:bg-slate-800/90 text-sm font-mono text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Email <span className="text-[10px] font-medium text-slate-400 normal-case">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        maxLength={50}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@gmail.com"
                        className="w-full h-[42px] pl-10 pr-3 rounded-xl bg-white dark:bg-slate-800/90 text-sm text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    <Shield className="w-3.5 h-3.5 text-rose-600" />
                    <span>Account Role</span>
                    <span className="text-rose-600">*</span>
                  </label>
                  <CustomSelect
                    options={ROLE_OPTIONS}
                    value={role}
                    onChange={(val) => setRole(String(val || "staff"))}
                    placeholder="Select role"
                    matchTriggerWidth
                    searchThreshold={10}
                    required
                  />
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Password <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 chars"
                        className="w-full h-[42px] pl-10 pr-10 rounded-xl bg-white dark:bg-slate-800/90 text-sm text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-600/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      Confirm Password <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className={`w-full h-[42px] pl-10 pr-10 rounded-xl bg-white dark:bg-slate-800/90 text-sm text-slate-800 dark:text-white border-[1.5px] focus:outline-none focus:ring-2 transition-all ${
                          passwordsMismatch
                            ? "border-rose-500 focus:border-rose-600 focus:ring-rose-600/20"
                            : "border-[#cbd5e1] dark:border-[#334155] focus:border-rose-600 focus:ring-rose-600/20"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {passwordsMismatch && (
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 -mt-1">
                    Passwords do not match yet.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[42px] mt-1 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Notice & Login redirect (intentionally no external links TO /signup elsewhere) */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Admin approval required
                </span>
                <Link
                  href="/login"
                  className="font-bold text-rose-700 dark:text-rose-400 hover:underline"
                >
                  Sign In Instead &rarr;
                </Link>
              </div>
            </>
          ) : (
            /* Success & Pending Admin Approval State */
            <div className="bg-white dark:bg-[#0f172a] rounded-2xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 mb-1.5">
                    Pending Admin Approval
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
                    Account Request Submitted
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Your account has been registered. Please ask an Administrator to change your status to{" "}
                    <strong className="text-slate-700 dark:text-slate-200">Approved</strong> from User List & Roles before signing in.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Name</span>
                  <span className="font-bold text-slate-800 dark:text-white">{createdUser.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Mobile</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-white">{createdUser.mobile}</span>
                </div>
                {createdUser.email && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Email</span>
                    <span className="font-medium text-slate-800 dark:text-white">{createdUser.email}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Requested Role</span>
                  <span className="font-bold uppercase text-rose-700 dark:text-rose-400">{createdUser.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 capitalize">{createdUser.status}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <Link
                  href="/login"
                  className="flex-1 h-[42px] rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Go to Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="h-[42px] px-4 rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Register Another</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
