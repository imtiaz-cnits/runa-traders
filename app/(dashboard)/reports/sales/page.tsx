"use client";

import { useEffect, useState } from "react";
import {
  FileSpreadsheet,
  Search,
  Calendar,
  Printer,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Loader2,
  DollarSign,
  ArrowUpRight,
  Filter,
  RotateCcw,
} from "lucide-react";
import { formatBdCurrency } from "@/lib/utils";
import { CustomDatePicker } from "@/components/ui/date-picker";
import { Pagination } from "@/components/ui";
import { FreshWatermark } from "@/components/common/fresh-watermark";

interface SalesOrder {
  id: number;
  order_no: string;
  customer_id: number | null;
  customer_name: string;
  customer_mobile: string;
  items_count: number;
  sub_total: number;
  discount_amount: number;
  delivery_charge: number;
  net_amount: number;
  cost_amount: number;
  profit_amount: number;
  paid_amount: number;
  due_amount: number;
  return_amount: number;
  date: string;
}

interface Summary {
  total_orders: number;
  total_sales_amount: number;
  total_cost_amount: number;
  total_gross_profit: number;
  total_paid_amount: number;
  total_due_amount: number;
  total_discount_amount: number;
  total_return_amount: number;
}

export default function SalesReportPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Auth
  const getTodayStr = () => new Date().toISOString().split("T")[0];
  const [activePreset, setActivePreset] = useState<string>("today");
  const [startDate, setStartDate] = useState(getTodayStr());
  const [endDate, setEndDate] = useState(getTodayStr());
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    try {
      const r = (localStorage.getItem("role") || "").toLowerCase();
      setIsAdmin(r === "admin" || r === "super_admin" || r === "");
    } catch {
      // ignore
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      let url = `/api/reports/sales?search=${encodeURIComponent(search)}`;
      if (startDate) url += `&start_date=${startDate}`;
      if (endDate) url += `&end_date=${endDate}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "success") {
        setOrders(data.data);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, startDate, endDate]);

  const setPreset = (preset: "today" | "yesterday" | "7days" | "month" | "reset") => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    if (preset === "today" || preset === "reset") {
      setActivePreset("today");
      setStartDate(todayStr);
      setEndDate(todayStr);
      if (preset === "reset") setSearch("");
    } else if (preset === "yesterday") {
      setActivePreset("yesterday");
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yStr = y.toISOString().split("T")[0];
      setStartDate(yStr);
      setEndDate(yStr);
    } else if (preset === "7days") {
      setActivePreset("7days");
      const past = new Date();
      past.setDate(past.getDate() - 7);
      setStartDate(past.toISOString().split("T")[0]);
      setEndDate(todayStr);
    } else if (preset === "month") {
      setActivePreset("month");
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      setStartDate(firstDay);
      setEndDate(todayStr);
    }
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const displayedOrders = orders.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4 font-sans relative print:space-y-2 print:flex print:flex-col print:justify-between print:min-h-[calc(297mm-48px)]">
      {/* Fresh Ceramics Watermark centered in width & height */}
      <FreshWatermark />
      {/* Print-Only Company Statement Header (Matching Invoice Layout: Left, Center, Right) */}
      <div className="hidden print:flex justify-between items-start pb-2 mb-2 border-b border-[#cbd5e1] dark:border-[#334155] print:border-[#cbd5e1] text-black">
        {/* Left: Brand Logo & Name */}
        <div className="flex items-start gap-2 shrink-0">
          <div className="w-8 h-8 rounded border-2 border-black flex items-center justify-center font-black text-base text-black bg-white shrink-0">
            RT
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-wide text-black m-0 leading-tight">
              RUNA TRADERS
            </h1>
            <div className="text-[10px] font-bold text-black border-t border-black pt-0.5 mt-0.5 leading-tight">
              All Kinds of Tiles, Sanitary &<br />Fittings Supplier
            </div>
          </div>
        </div>

        {/* Center: Report Title & Period */}
        <div className="text-center px-2 flex-1">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-black m-0 leading-tight">
            Sales &amp; Gross Profit Statement
          </h2>
          <div className="text-[10.5px] font-bold text-slate-800 mt-0.5">
            বিক্রয় ও মোট লাভ-লোকসান বিবরণী
          </div>
          <div className="text-[9px] text-slate-600 mt-0.5 font-medium">
            {startDate || endDate
              ? `Period: ${startDate || "Start"} to ${endDate || "Today"}`
              : "Period: All Recorded Sales"}{" "}
            &bull; Date: {new Date().toLocaleDateString("en-GB")}
          </div>
        </div>

        {/* Right: Office Info */}
        <div className="text-right text-[10px] text-black leading-tight shrink-0 max-w-[220px]">
          <div><strong>Office:</strong> Success Super Market,</div>
          <div>Sadar Police Fari, Ataikula Road, Pabna.</div>
          <div><strong>Mobile:</strong> 01975-703216, 01715-842083</div>
          <div><strong>E-mail:</strong> runatraders2018@gmail.com</div>
        </div>
      </div>

      {/* 1. Header & Quick Actions (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-rose-100 dark:border-slate-800 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white m-0 leading-tight">
              Sales &amp; Gross Profit Report
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
              Detailed breakdown of revenue, COGS, profit margin, cash collected, and dues
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="h-[38px] px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto border border-[#cbd5e1] dark:border-[#334155]"
        >
          <Printer className="w-4 h-4" />
          <span>Print Statement</span>
        </button>
      </div>

      {/* 2. Four Financial Summary Cards (1 col mobile, 2 col sm, 4 col lg, 2 Columns in Print) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-2 gap-2.5 sm:gap-3 print:gap-2">
        <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-[#cbd5e1] dark:border-[#334155] print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
          <div>
            <div className="text-slate-500 dark:text-slate-400 print:text-slate-700 text-xs print:text-[10px] font-bold">
              Total Sales Revenue
            </div>
            <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">
              {summary?.total_orders || 0} invoices generated
            </div>
          </div>
          <div className="text-xl print:text-sm font-black text-slate-900 dark:text-white print:text-black mt-1 print:mt-0 print:text-right shrink-0">
            {formatBdCurrency(summary?.total_sales_amount || 0)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-[#cbd5e1] dark:border-[#334155] print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
          <div>
            <div className="text-slate-500 dark:text-slate-400 print:text-slate-700 text-xs print:text-[10px] font-bold">
              Cash Collected
            </div>
            <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">
              Paid at counter / POS
            </div>
          </div>
          <div className="text-xl print:text-sm font-black text-emerald-600 dark:text-emerald-400 print:text-black mt-1 print:mt-0 print:text-right shrink-0">
            {formatBdCurrency(summary?.total_paid_amount || 0)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-[#cbd5e1] dark:border-[#334155] print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
          <div>
            <div className="text-slate-500 dark:text-slate-400 print:text-slate-700 text-xs print:text-[10px] font-bold">
              Customer Due (Receivable)
            </div>
            <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">
              Pending customer dues
            </div>
          </div>
          <div className="text-xl print:text-sm font-black text-amber-600 dark:text-amber-400 print:text-black mt-1 print:mt-0 print:text-right shrink-0">
            {formatBdCurrency(summary?.total_due_amount || 0)}
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-[#cbd5e1] dark:border-[#334155] print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
            <div>
              <div className="text-slate-500 dark:text-slate-400 print:text-slate-700 text-xs print:text-[10px] font-bold">
                Estimated Gross Profit
              </div>
              <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">
                Sales less buying cost & returns
              </div>
            </div>
            <div className="text-xl print:text-sm font-black text-emerald-700 dark:text-emerald-300 print:text-black mt-1 print:mt-0 print:text-right shrink-0">
              {formatBdCurrency(summary?.total_gross_profit || 0)}
            </div>
          </div>
        )}
      </div>

      {/* 3. Date Filters & Presets (Hidden in Print) */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-3 rounded-2xl border border-[#cbd5e1] dark:border-[#334155]">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search invoice or customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-[38px] pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-[135px]">
              <CustomDatePicker
                value={startDate}
                onChange={(d) => {
                  setStartDate(d);
                  setActivePreset("");
                  setCurrentPage(1);
                }}
                placeholder="From Date"
              />
            </div>
            <span className="text-xs text-slate-400">to</span>
            <div className="w-[135px]">
              <CustomDatePicker
                value={endDate}
                onChange={(d) => {
                  setEndDate(d);
                  setActivePreset("");
                  setCurrentPage(1);
                }}
                placeholder="To Date"
              />
            </div>
          </div>

          {/* Quick presets (Horizontal swipeable on mobile with scrollbar) */}
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-thin pb-1 sm:pb-0 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setPreset("today")}
              className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activePreset === "today"
                  ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setPreset("yesterday")}
              className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activePreset === "yesterday"
                  ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setPreset("7days")}
              className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activePreset === "7days"
                  ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setPreset("month")}
              className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                activePreset === "month"
                  ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              This Month
            </button>
            {(activePreset !== "today" || search || startDate !== getTodayStr() || endDate !== getTodayStr()) && (
              <button
                onClick={() => setPreset("reset")}
                className="h-[38px] px-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs shrink-0 whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Desktop Table (Always Visible in Print) */}
      <div className="hidden md:block print:block print:w-full bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden print:border-none print:shadow-none print:rounded-none">
        <div className="overflow-x-auto print:overflow-visible">
          <table id="sales-report-table" className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="table-header-brand bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white font-bold whitespace-nowrap">
                <th className="py-3 px-3 text-center w-[50px]">SL</th>
                <th className="py-3 px-4">Invoice / Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-3 text-center">Items</th>
                <th className="py-3 px-3 text-right">Cost Price (৳)</th>
                <th className="py-3 px-3 text-right">Selling Total (৳)</th>
                <th className="py-3 px-3 text-right">Paid (৳)</th>
                <th className="py-3 px-3 text-right">Due (৳)</th>
                {isAdmin && <th className="py-3 px-4 text-right">Profit (৳)</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="py-10 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Loading sales report...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 9 : 8} className="py-10 text-center text-slate-400 font-bold">
                    No sales invoices found for the specified period.
                  </td>
                </tr>
              ) : (
                displayedOrders.map((o, idx) => (
                  <tr
                    key={o.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-bold text-slate-500">
                      {startIndex + idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-100">
                        {o.order_no}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {o.date}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-100">
                        {o.customer_name}
                      </div>
                      {o.customer_mobile && (
                        <div className="text-[10px] text-slate-400">
                          {o.customer_mobile}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300">
                      {o.items_count}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-600 dark:text-slate-400">
                      {formatBdCurrency(o.cost_amount)}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900 dark:text-white">
                      {formatBdCurrency(o.net_amount)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatBdCurrency(o.paid_amount)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-rose-600 dark:text-rose-400">
                      {formatBdCurrency(o.due_amount)}
                    </td>
                    {isAdmin && (
                      <td className="py-3 px-4 text-right font-black text-emerald-700 dark:text-emerald-300">
                        {formatBdCurrency(o.profit_amount)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination (Hidden in Print) */}
        <div className="print:hidden">
          <Pagination
            currentPage={currentPage}
            totalItems={orders.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSizeOptions={[20, 50, 100, 200, 500]}
          />
        </div>
      </div>

      {/* 5. Mobile Cards View (Strictly Hidden in Print) */}
      <div className="block md:hidden print:hidden space-y-2.5">
        {displayedOrders.map((o) => (
          <div
            key={o.id}
            className="bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-xs text-slate-800 dark:text-white">
                  {o.order_no}
                </span>
                <p className="text-[11px] text-slate-500">{o.customer_name}</p>
              </div>
              <span className="font-black text-xs text-slate-900 dark:text-white">
                {formatBdCurrency(o.net_amount)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs py-1.5 border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <div>
                <div className="text-[10px] text-slate-400">Paid</div>
                <div className="font-bold text-emerald-600">{formatBdCurrency(o.paid_amount)}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Due</div>
                <div className="font-bold text-rose-600">{formatBdCurrency(o.due_amount)}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Profit</div>
                <div className="font-bold text-emerald-700">{formatBdCurrency(o.profit_amount)}</div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-right">
              Date: {o.date} &bull; {o.items_count} items
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] overflow-hidden">
          <Pagination
            currentPage={currentPage}
            totalItems={orders.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
            pageSizeOptions={[20, 50, 100, 200, 500]}
          />
        </div>
      </div>

      {/* Print Signature & Page Number */}
      <div className="print-signatures hidden print:flex justify-between items-end pt-8 pb-1 print:mt-auto text-xs font-semibold text-black">
        <div className="w-36 text-center border-t border-black pt-1">Prepared By</div>
        <div className="w-36 text-center border-t border-black pt-1">Authorized Signature</div>
      </div>
      <div className="print-page-number" />

      {/* Print Media Styling */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 20px 20px 28px 20px;
            @bottom-right {
              content: counter(page);
              font-family: 'Valley Sans', sans-serif;
              font-size: 10px;
              font-weight: 700;
              color: #000000;
              vertical-align: top;
              padding-right: 5px;
            }
          }
          html,
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          header,
          aside,
          nav,
          footer,
          [data-sidebar],
          .no-print {
            display: none !important;
          }
          .print-page-number {
            display: none !important;
          }
          .print-signatures {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          #sales-report-table {
            width: 100% !important;
            max-width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
          }
          #sales-report-table thead {
            display: table-header-group !important;
          }
          #sales-report-table thead tr {
            white-space: normal !important;
            background: #881337 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #sales-report-table th,
          #sales-report-table td {
            padding: 5px 3px !important;
            font-size: 8.5px !important;
            line-height: 1.2 !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          #sales-report-table th:nth-child(1),
          #sales-report-table td:nth-child(1) {
            width: 5% !important;
            text-align: center !important;
          }
          #sales-report-table th:nth-child(2),
          #sales-report-table td:nth-child(2) {
            width: 17% !important;
          }
          #sales-report-table th:nth-child(3),
          #sales-report-table td:nth-child(3) {
            width: 18% !important;
          }
          #sales-report-table th:nth-child(4),
          #sales-report-table td:nth-child(4) {
            width: 6% !important;
            text-align: center !important;
          }
          #sales-report-table th:nth-child(5),
          #sales-report-table td:nth-child(5) {
            width: 11% !important;
            text-align: right !important;
          }
          #sales-report-table th:nth-child(6),
          #sales-report-table td:nth-child(6) {
            width: 12% !important;
            text-align: right !important;
          }
          #sales-report-table th:nth-child(7),
          #sales-report-table td:nth-child(7) {
            width: 10% !important;
            text-align: right !important;
          }
          #sales-report-table th:nth-child(8),
          #sales-report-table td:nth-child(8) {
            width: 10% !important;
            text-align: right !important;
          }
          #sales-report-table th:nth-child(9),
          #sales-report-table td:nth-child(9) {
            width: 11% !important;
            text-align: right !important;
          }
          #sales-report-table tbody tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
