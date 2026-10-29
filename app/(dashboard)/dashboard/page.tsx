"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatBdCurrency } from "@/lib/utils";
import { CustomSelect, CustomDatePicker } from "@/components/ui";
import {
  TrendingUp,
  Receipt,
  Wallet,
  ShoppingBag,
  ArrowUpRight,
  ShoppingCart,
  PlusCircle,
  Truck,
  Users,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  RotateCcw,
  Percent,
  Building2,
} from "lucide-react";

interface RecentOrder {
  id: number;
  order_no: string;
  customer_name: string;
  sub_total: number;
  paid_amount: number;
  due_amount: number;
  invoice_date?: string | null;
  created_at: string;
}

interface DashboardStats {
  todaySales: number;
  todayInvoicesCount: number;
  todayPaid: number;
  todayExpense: number;
  profit: number;
  returnAmount: number;
  discountAmount: number;
  totalCustomerDue: number;
  totalSupplierDue: number;
  totalProducts: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalOrders: number;
  recentOrders: RecentOrder[];
}

const PERIOD_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "last_week", label: "Last Week" },
  { value: "last_month", label: "Last Month" },
  { value: "date_wise", label: "Date Wise" },
];

export default function DashboardPage() {
  const [period, setPeriod] = useState<string>("today");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    todayInvoicesCount: 0,
    todayPaid: 0,
    todayExpense: 0,
    profit: 0,
    returnAmount: 0,
    discountAmount: 0,
    totalCustomerDue: 0,
    totalSupplierDue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    totalOrders: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("period", period);
      if (period === "date_wise") {
        if (fromDate) params.set("start_date", fromDate);
        if (toDate) params.set("end_date", toDate);
      }

      const res = await fetch(`/api/dashboard/stats?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.status === "success") {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  }, [period, fromDate, toDate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    const handleFocus = () => {
      fetchStats();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchStats]);

  const {
    todaySales,
    todayPaid,
    todayExpense,
    profit,
    returnAmount,
    discountAmount,
    totalCustomerDue,
    totalSupplierDue,
    totalProducts,
    totalCustomers,
    totalSuppliers,
    recentOrders,
  } = stats;

  return (
    <div className="space-y-4">
      {/* Top Header Banner Card with Filter Dropdown & Quick Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] px-4 py-3.5 sm:px-5 sm:py-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center shadow-2xs shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight leading-none m-0">
              Overview Dashboard
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              Real-time sales, collections, expenses, dues &amp; business metrics
            </p>
          </div>
        </div>

        {/* Filter Controls & Quick Launch Buttons */}
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <div className="w-[148px]">
            <CustomSelect
              value={period}
              onChange={(val) => setPeriod(String(val))}
              options={PERIOD_OPTIONS}
              placeholder="Today"
              className="[&_button]:!min-h-[38px] [&_button]:!h-[38px] [&_button]:!py-1"
            />
          </div>

          {period === "date_wise" && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-[145px]">
                <CustomDatePicker
                  value={fromDate}
                  onChange={setFromDate}
                  placeholder="From Date"
                />
              </div>
              <span className="text-xs font-semibold text-slate-400">to</span>
              <div className="w-[145px]">
                <CustomDatePicker
                  value={toDate}
                  onChange={setToDate}
                  placeholder="To Date"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={fetchStats}
            title="Refresh Live Metrics"
            disabled={loading}
            className="h-[38px] w-[38px] rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 text-slate-600 dark:text-slate-300 ${loading ? "animate-spin text-rose-600" : ""
                }`}
            />
          </button>

          <Link
            href="/pos"
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white font-bold text-xs flex items-center gap-2 shadow-xs hover:shadow-sm transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>POS Terminal</span>
          </Link>

          <Link
            href="/products"
            className="h-[38px] px-3.5 rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-rose-600 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <PlusCircle className="w-4 h-4 text-rose-600" />
            <span>Products</span>
          </Link>
        </div>
      </div>

      {/* Row 1: Primary Financial Banner Cards (4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* INCOME */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Income
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
            {formatBdCurrency(todaySales)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-sky-600 dark:text-sky-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Total Sales Revenue</span>
          </div>
        </div>

        {/* CASH COLLECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cash Collection
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
            {formatBdCurrency(todayPaid)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-teal-600 dark:text-teal-400 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Paid at Counter &amp; Dues</span>
          </div>
        </div>

        {/* EXPENSE */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Expense
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
            {formatBdCurrency(todayExpense)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-600 dark:text-amber-400 font-bold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Operating Expenses</span>
          </div>
        </div>

        {/* PROFIT */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Profit
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-xl sm:text-2xl font-black ${profit < 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-slate-800 dark:text-white"
              }`}
          >
            {formatBdCurrency(profit)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-cyan-600 dark:text-cyan-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Net Business Profit</span>
          </div>
        </div>
      </div>

      {/* Row 2: Compact Financial Cards (Height matched to compact strip cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* RECEIVABLE DUE */}
        <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border-[1.5px] border-[#cbd5e1] dark:border-[#334155] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none">
                Receivable Due
              </span>
              <div className="text-sm sm:text-base font-black text-slate-800 dark:text-white leading-tight mt-1 truncate">
                {formatBdCurrency(totalCustomerDue)}
              </div>
            </div>
          </div>

        </div>

        {/* PAYABLE DUE */}
        <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border-[1.5px] border-[#cbd5e1] dark:border-[#334155] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none">
                Payable Due
              </span>
              <div className="text-sm sm:text-base font-black text-slate-800 dark:text-white leading-tight mt-1 truncate">
                {formatBdCurrency(totalSupplierDue)}
              </div>
            </div>
          </div>

        </div>

        {/* RETURN */}
        <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border-[1.5px] border-[#cbd5e1] dark:border-[#334155] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none">
                Return
              </span>
              <div className="text-sm sm:text-base font-black text-slate-800 dark:text-white leading-tight mt-1 truncate">
                {formatBdCurrency(returnAmount)}
              </div>
            </div>
          </div>

        </div>

        {/* DISCOUNT */}
        <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border-[1.5px] border-[#cbd5e1] dark:border-[#334155] flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 leading-none">
                Discount
              </span>
              <div className="text-sm sm:text-base font-black text-slate-800 dark:text-white leading-tight mt-1 truncate">
                {formatBdCurrency(discountAmount)}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Row 3: Modern Non-Card Segmented Metric Ribbon (No individual card boxes) */}
      <div className="relative rounded-2xl bg-gradient-to-r from-rose-500/[0.06] via-slate-500/[0.04] to-indigo-500/[0.06] dark:from-rose-500/[0.12] dark:via-slate-800/40 dark:to-indigo-500/[0.12] border border-slate-200/80 dark:border-slate-800/90 px-2 py-1.5 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-slate-800">
          {/* Total Products */}
          <Link
            href="/products"
            className="group flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-white/60 dark:hover:bg-slate-800/40 sm:rounded-l-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-500/12 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 ring-4 ring-rose-500/5 flex items-center justify-center transition-transform group-hover:scale-105">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Total Products
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">
                  Active Catalog Items
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tabular-nums">
                {totalProducts}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-rose-600 transition-all" />
            </div>
          </Link>

          {/* Total Customers */}
          <Link
            href="/customers"
            className="group flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-white/60 dark:hover:bg-slate-800/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-500/12 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 ring-4 ring-teal-500/5 flex items-center justify-center transition-transform group-hover:scale-105">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  Total Customers
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">
                  Registered Client Profiles
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tabular-nums">
                {totalCustomers}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-teal-600 transition-all" />
            </div>
          </Link>

          {/* Total Suppliers */}
          <Link
            href="/suppliers"
            className="group flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-white/60 dark:hover:bg-slate-800/40 sm:rounded-r-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500/12 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-500/5 flex items-center justify-center transition-transform group-hover:scale-105">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Total Suppliers
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">
                  Verified Brand Vendors
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tabular-nums">
                {totalSuppliers}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-indigo-600 transition-all" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Orders Section (Strict Marss Corp Master Table Layout) */}
      <div className="card bg-white dark:bg-slate-900 rounded-2xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center font-bold">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white leading-none m-0">
                Recent Invoices (Latest First)
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Real-time transactions ordered descending by ID
              </p>
            </div>
          </div>

          <Link
            href="/invoices"
            className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1"
          >
            <span>View All Invoices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Desktop View Table (hidden on mobile, visible on desktop >= 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                <th className="p-[10px] text-center w-[45px]">SL</th>
                <th className="p-[10px]">Order No</th>
                <th className="p-[10px]">Customer</th>
                <th className="p-[10px] text-right">Sub Total</th>
                <th className="p-[10px] text-right">Paid Amount</th>
                <th className="p-[10px] text-right">Due Amount</th>
                <th className="p-[10px] text-center">Status</th>
                <th className="p-[10px] text-center">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-medium">
                    {loading
                      ? "Loading transactions..."
                      : "No orders recorded yet. Launch the POS terminal to start ringing sales!"}
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, idx) => {
                  const due = Number(order.due_amount || 0);
                  const status =
                    due <= 0
                      ? "PAID"
                      : order.paid_amount && Number(order.paid_amount) > 0
                        ? "PARTIAL"
                        : "DUE";

                  return (
                    <tr
                      key={Number(order.id)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <td className="p-[10px] text-center font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="p-[10px] font-bold text-slate-900 dark:text-white">
                        {order.order_no || `ORD-${order.id}`}
                      </td>
                      <td className="p-[10px] font-medium">
                        {order.customer_name || "Walking Customer"}
                      </td>
                      <td className="p-[10px] text-right font-bold text-slate-800 dark:text-white">
                        {formatBdCurrency(order.sub_total)}
                      </td>
                      <td className="p-[10px] text-right font-bold text-teal-600 dark:text-teal-400">
                        {formatBdCurrency(order.paid_amount)}
                      </td>
                      <td className="p-[10px] text-right font-bold text-rose-600 dark:text-rose-400">
                        {formatBdCurrency(order.due_amount)}
                      </td>
                      <td className="p-[10px] text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${status === "PAID"
                              ? "bg-teal-600 text-white"
                              : status === "PARTIAL"
                                ? "bg-amber-500 text-white"
                                : "bg-rose-500 text-white"
                            }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="p-[10px] text-center text-slate-400 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("en-GB")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card List (< 768px, matching Marss Corp 2-col financial grid) */}
        <div className="block md:hidden p-3 space-y-3">
          {recentOrders.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs font-medium">
              {loading ? "Loading transactions..." : "No orders recorded yet."}
            </div>
          ) : (
            recentOrders.map((order) => {
              const due = Number(order.due_amount || 0);
              const status =
                due <= 0
                  ? "PAID"
                  : order.paid_amount && Number(order.paid_amount) > 0
                    ? "PARTIAL"
                    : "DUE";

              return (
                <div
                  key={Number(order.id)}
                  className="rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] p-3.5 bg-white dark:bg-slate-800/60 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-800 dark:text-white">
                      {order.order_no || `ORD-${order.id}`}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${status === "PAID"
                          ? "bg-teal-600 text-white"
                          : status === "PARTIAL"
                            ? "bg-amber-500 text-white"
                            : "bg-rose-500 text-white"
                        }`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                    {order.customer_name || "Walking Customer"}
                  </p>

                  {/* 2-Column Financial Grid (Strict Rule 8.5) */}
                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-slate-700/60 pt-2.5">
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80">
                      <span className="text-slate-400 text-[11px]">Total:</span>
                      <span className="font-bold text-slate-800 dark:text-white">
                        {formatBdCurrency(order.sub_total)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80">
                      <span className="text-slate-400 text-[11px]">Due:</span>
                      <span className="font-bold text-rose-600">
                        {formatBdCurrency(order.due_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
