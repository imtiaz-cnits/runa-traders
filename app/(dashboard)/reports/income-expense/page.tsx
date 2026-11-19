"use client";

import { useEffect, useState } from "react";
import {
  Scale,
  Calendar,
  Printer,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Loader2,
  TrendingUp,
  Tag,
  Truck,
  RotateCcw,
} from "lucide-react";
import { formatBdCurrency } from "@/lib/utils";
import { CustomDatePicker } from "@/components/ui/date-picker";
import { FreshWatermark } from "@/components/common/fresh-watermark";

interface StatementSummary {
  opening_balance: number;
  sales_collection: number;
  due_collection: number;
  total_inflow: number;
  supplier_payments: number;
  total_expenses: number;
  total_outflow: number;
  net_cash_flow: number;
  closing_balance: number;
}

interface ExpenseBreakdown {
  type_name: string;
  count: number;
  total_amount: number;
}

interface SupplierBreakdown {
  name: string;
  total_paid: number;
}

export default function IncomeExpensePage() {
  const [summary, setSummary] = useState<StatementSummary | null>(null);
  const [expenses, setExpenses] = useState<ExpenseBreakdown[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  const getTodayStr = () => new Date().toISOString().split("T")[0];
  const [activePreset, setActivePreset] = useState<string>("today");
  const [startDate, setStartDate] = useState(getTodayStr());
  const [endDate, setEndDate] = useState(getTodayStr());

  const loadData = async () => {
    try {
      setLoading(true);
      const url = `/api/reports/income-expense?start_date=${startDate}&end_date=${endDate}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "success") {
        setSummary(data.summary);
        setExpenses(data.expenses_breakdown);
        setSuppliers(data.supplier_payments_breakdown);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  const setPreset = (preset: "today" | "yesterday" | "7days" | "month" | "reset") => {
    const now = new Date();
    const tStr = now.toISOString().split("T")[0];
    if (preset === "today" || preset === "reset") {
      setActivePreset("today");
      setStartDate(tStr);
      setEndDate(tStr);
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
      setEndDate(tStr);
    } else if (preset === "month") {
      setActivePreset("month");
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
      setStartDate(firstDay);
      setEndDate(tStr);
    }
  };

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
            Income &amp; Expense Statement
          </h2>
          <div className="text-[10.5px] font-bold text-slate-800 mt-0.5">
            প্রাপ্তি-পরিশোধ বিবরণী
          </div>
          <div className="text-[9px] text-slate-600 mt-0.5 font-medium">
            Period: {startDate} to {endDate} &bull; Date: {new Date().toLocaleDateString("en-GB")}
          </div>
        </div>

        {/* Right: Office Info */}
        <div className="text-right text-[10px] text-black leading-tight shrink-0 max-w-[220px]">
          <div><strong>Office:</strong> Success Super Market,</div>
          <div>Sadar Police Fari, Ataikula Road, Pabna.</div>
          <div><strong>Mobile:</strong> 01711-968720</div>
          <div><strong>E-mail:</strong> runatraders2018@gmail.com</div>
        </div>
      </div>

      {/* 1. Header & Actions (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-rose-100 dark:border-slate-800 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white m-0 leading-tight">
              Income &amp; Expense Statement (প্রাপ্তি-পরিশোধ বিবরণী)
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
              Complete receipts &amp; payments accounting with categorized breakdown
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

      {/* 2. Top Summary KPI Row (1 col mobile, 2 col sm, 4 col lg, 2 Columns in Print) */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-2 gap-2.5 sm:gap-3 print:gap-2">
          <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-[#cbd5e1] dark:border-[#334155] print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
            <div>
              <div className="text-slate-500 dark:text-slate-400 print:text-slate-700 text-xs print:text-[10px] font-bold">
                Opening Balance
              </div>
              <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">Initial cash float</div>
            </div>
            <div className="text-xl print:text-sm font-black text-amber-600 dark:text-amber-400 print:text-black mt-1 print:mt-0 print:text-right shrink-0">
              {formatBdCurrency(summary.opening_balance)}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-[#cbd5e1] dark:border-[#334155] print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
            <div>
              <div className="text-slate-500 dark:text-slate-400 print:text-slate-700 text-xs print:text-[10px] font-bold">
                Total Receipts (জমা)
              </div>
              <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">Sales & customer dues</div>
            </div>
            <div className="text-xl print:text-sm font-black text-emerald-600 dark:text-emerald-400 print:text-black mt-1 print:mt-0 print:text-right shrink-0">
              +{formatBdCurrency(summary.total_inflow)}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-[#cbd5e1] dark:border-[#334155] print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
            <div>
              <div className="text-slate-500 dark:text-slate-400 print:text-slate-700 text-xs print:text-[10px] font-bold">
                Total Payments (খরচ)
              </div>
              <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">Overheads & suppliers</div>
            </div>
            <div className="text-xl print:text-sm font-black text-rose-600 dark:text-rose-400 print:text-black mt-1 print:mt-0 print:text-right shrink-0">
              -{formatBdCurrency(summary.total_outflow)}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-[#cbd5e1] dark:border-[#334155] print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
            <div>
              <div className="text-slate-500 dark:text-slate-400 print:text-slate-700 text-xs print:text-[10px] font-bold">
                Closing Balance
              </div>
              <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">
                Net: {formatBdCurrency(summary.net_cash_flow)}
              </div>
            </div>
            <div className="text-xl print:text-sm font-black text-slate-900 dark:text-white print:text-black mt-1 print:mt-0 print:text-right shrink-0">
              {formatBdCurrency(summary.closing_balance)}
            </div>
          </div>
        </div>
      )}

      {/* 3. Date Range Controls (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-3 rounded-2xl border border-[#cbd5e1] dark:border-[#334155]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="w-[135px]">
            <CustomDatePicker
              value={startDate}
              onChange={(d) => {
                setStartDate(d);
                setActivePreset("");
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
              }}
              placeholder="To Date"
            />
          </div>
        </div>

        {/* Quick presets (Horizontal swipeable on mobile with scrollbar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-thin pb-1 sm:pb-0 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setPreset("today")}
            className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${activePreset === "today"
                ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
          >
            Today
          </button>
          <button
            onClick={() => setPreset("yesterday")}
            className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${activePreset === "yesterday"
                ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
          >
            Yesterday
          </button>
          <button
            onClick={() => setPreset("7days")}
            className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${activePreset === "7days"
                ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPreset("month")}
            className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${activePreset === "month"
                ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              }`}
          >
            This Month
          </button>
          {(activePreset !== "today" || startDate !== getTodayStr() || endDate !== getTodayStr()) && (
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

      {/* 4. Two-Column Dual Financial Ledger (Receipts vs Payments - Always Visible in Print) */}
      <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 print:gap-3">
        {/* Left Card: Cash Receipts / Inflow */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden print:border-slate-300 print:shadow-none">
          <div className="modal-header-brand bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] px-4 py-3 flex items-center justify-between text-white font-bold text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-emerald-200" />
              <span>Cash Receipts / মোট প্রাপ্তি (জমা)</span>
            </div>
            <span>{formatBdCurrency(summary?.total_inflow || 0)}</span>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  Sales Cash Collections
                </div>
                <div className="text-[11px] text-slate-400">Counter and POS invoices</div>
              </div>
              <span className="font-black text-emerald-600 dark:text-emerald-400">
                {formatBdCurrency(summary?.sales_collection || 0)}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-100">
                  Customer Due Collections
                </div>
                <div className="text-[11px] text-slate-400">Past arrears recovered</div>
              </div>
              <span className="font-black text-emerald-600 dark:text-emerald-400">
                {formatBdCurrency(summary?.due_collection || 0)}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>Total Revenue Receipts</span>
              <span className="text-emerald-700 dark:text-emerald-300 text-sm font-black">
                {formatBdCurrency(summary?.total_inflow || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Card: Cash Payments / Outflow */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden print:border-slate-300 print:shadow-none">
          <div className="bg-rose-700 px-4 py-3 flex items-center justify-between text-white font-bold text-xs uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-rose-200" />
              <span>Cash Payments / মোট পরিশোধ (খরচ)</span>
            </div>
            <span>{formatBdCurrency(summary?.total_outflow || 0)}</span>
          </div>

          <div className="p-4 space-y-4">
            {/* Category wise expenses */}
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Operating Overheads Breakdown</span>
              </div>
              {expenses.length === 0 ? (
                <div className="text-xs text-slate-400 py-2">No operating expenses</div>
              ) : (
                <div className="space-y-1.5 max-h-48 print:max-h-none overflow-y-auto print:overflow-visible pr-1">
                  {expenses.map((exp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800"
                    >
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {exp.type_name} ({exp.count})
                      </span>
                      <span className="font-bold text-rose-600">
                        {formatBdCurrency(exp.total_amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Supplier Payments */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Supplier Due Payments</span>
              </div>
              {suppliers.length === 0 ? (
                <div className="text-xs text-slate-400 py-1">No supplier payments</div>
              ) : (
                <div className="space-y-1.5 max-h-36 print:max-h-none overflow-y-auto print:overflow-visible pr-1">
                  {suppliers.map((sup, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800"
                    >
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {sup.name}
                      </span>
                      <span className="font-bold text-rose-600">
                        {formatBdCurrency(sup.total_paid)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>Total Expenditure Payments</span>
              <span className="text-rose-600 text-sm font-black">
                {formatBdCurrency(summary?.total_outflow || 0)}
              </span>
            </div>
          </div>
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
        }
      `}</style>
    </div>
  );
}
