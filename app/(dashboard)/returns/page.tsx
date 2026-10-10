"use client";

import { useEffect, useState } from "react";
import {
  RotateCcw,
  Plus,
  Search,
  Calendar,
  DollarSign,
  PackageCheck,
  Receipt,
  X,
  Loader2,
  Printer,
} from "lucide-react";
import { formatBdCurrency } from "@/lib/utils";
import { CustomDatePicker } from "@/components/ui/date-picker";
import { CustomSelect } from "@/components/ui/custom-select";

interface ReturnRecord {
  id: number;
  order_id: number;
  order_no: string;
  customer_id: number;
  customer_name: string;
  customer_mobile: string;
  product_id: number | null;
  quantity: number;
  amount: number;
  date: string;
  created_at: string;
}

interface Summary {
  total_records: number;
  total_amount: number;
  total_quantity: number;
}

interface OrderOption {
  id: number;
  order_no: string;
  customer_name: string;
  paid_amount: number;
}

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRecord[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordersList, setOrdersList] = useState<OrderOption[]>([]);
  const [formData, setFormData] = useState({
    order_id: "",
    product_id: "",
    quantity: "1",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const url = search
        ? `/api/returns?search=${encodeURIComponent(search)}`
        : "/api/returns";
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "success") {
        setReturns(data.data);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrdersForReturn = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      if (data.status === "success") {
        const mapped = data.data.slice(0, 50).map((inv: any) => ({
          id: inv.id,
          order_no: inv.order_no,
          customer_name: inv.customer_name,
          paid_amount: inv.paid_amount,
        }));
        setOrdersList(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleOpenAdd = () => {
    loadOrdersForReturn();
    setFormData({
      order_id: "",
      product_id: "",
      quantity: "1",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.order_id || !formData.amount) {
      setErrorMsg("Please select an invoice and enter return amount!");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.status === "success") {
        setIsModalOpen(false);
        loadData();
      } else {
        setErrorMsg(data.message || "Failed to process return");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Communication error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-rose-100 dark:border-slate-800 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white m-0 leading-tight">
              Sales Return & Restock Register
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
              Manage product returns, refunds, and automatic stock restoration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleOpenAdd}
            className="h-[38px] px-3.5 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Process Return</span>
          </button>
        </div>
      </div>

      {/* 2. Top Summary KPI Row */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
              <span>Total Return Invoices</span>
              <Receipt className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {summary.total_records}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Vouchers processed</div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
              <span>Returned Items Quantity</span>
              <PackageCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-600 mt-1">
              {summary.total_quantity} Pcs
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Restocked to inventory</div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
              <span>Total Refund Value</span>
              <DollarSign className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {formatBdCurrency(summary.total_amount)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Refunded / adjusted</div>
          </div>
        </div>
      )}

      {/* 3. Search Bar */}
      <div className="bg-white dark:bg-[#0f172a] p-3 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search return by invoice, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[38px] pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800 dark:text-white">{returns.length}</strong> return records
        </div>
      </div>

      {/* 4. Desktop Table (Rule 5.3 & 5.4: Solid Emerald Header #15803d) */}
      <div className="hidden md:block bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="table-header-brand bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white font-bold whitespace-nowrap">
              <th className="py-3 px-4 w-12 text-center">SL</th>
              <th className="py-3 px-4">Return ID / Date</th>
              <th className="py-3 px-4">Original Invoice</th>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-3 text-center">Quantity Returned</th>
              <th className="py-3 px-4 text-right">Refund Amount (৳)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                  <span>Loading returns list...</span>
                </td>
              </tr>
            ) : returns.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400 font-bold">
                  No sales return records found.
                </td>
              </tr>
            ) : (
              returns.map((r, idx) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="py-3 px-4 text-center text-slate-400 font-mono">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800 dark:text-slate-100">
                      #RET-{r.id}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {r.date}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {r.order_no}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">
                    <div>{r.customer_name}</div>
                    {r.customer_mobile && (
                      <div className="text-[10px] text-slate-400 font-normal">
                        {r.customer_mobile}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-black text-amber-600">
                    {r.quantity} Pcs
                  </td>
                  <td className="py-3 px-4 text-right font-black text-rose-600 dark:text-rose-400">
                    {formatBdCurrency(r.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Mobile Cards View */}
      <div className="block md:hidden space-y-2.5">
        {returns.map((r) => (
          <div
            key={r.id}
            className="bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-xs text-slate-800 dark:text-white">
                  #RET-{r.id} &bull; {r.order_no}
                </span>
                <p className="text-[11px] text-slate-500">{r.customer_name}</p>
              </div>
              <span className="font-black text-xs text-rose-600">
                {formatBdCurrency(r.amount)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800 text-slate-400">
              <span>Date: {r.date}</span>
              <span>Restocked: <strong>{r.quantity} pcs</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* 6. Process Return Modal (Strict Rule 6.1 - 6.4) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-[16px] shadow-2xl overflow-hidden border border-[#cbd5e1] dark:border-[#334155] max-h-[90vh] flex flex-col">
            <div className="modal-header-brand bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] px-5 py-3.5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-white" />
                <h3 className="text-sm font-bold tracking-wide uppercase m-0 text-white">
                  Process Sales Return
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-[28px] h-[28px] rounded-full bg-[#dc2626] hover:bg-red-700 text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 flex-1 overflow-y-auto">
              {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Order Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Select Sales Invoice <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  options={ordersList.map((ord) => ({
                    value: ord.id,
                    label: `${ord.order_no} - ${ord.customer_name}`,
                    subLabel: `Paid: ৳ ${ord.paid_amount}`,
                  }))}
                  value={formData.order_id}
                  onChange={(val) => setFormData({ ...formData, order_id: String(val) })}
                  placeholder="Select Invoice..."
                />
              </div>

              {/* Quantity & Refund Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Return Quantity (Pcs) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full h-[42px] px-3 text-xs bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-slate-900 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-rose-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Refund / Credit Amount (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full h-[42px] px-3 text-base bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-rose-600 font-black focus:outline-none focus:ring-2 focus:ring-rose-600"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Return Date
                </label>
                <CustomDatePicker
                  value={formData.date}
                  onChange={(d) => setFormData({ ...formData, date: d })}
                />
              </div>

              {/* Note */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Reason / Condition Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Size mismatch, returned in sealed condition"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full p-3 text-xs bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-600 font-medium"
                />
              </div>

              {/* Sticky Footer: Cancel Red #dc2626, Save Emerald #15803d */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="h-[38px] px-4 rounded-xl bg-[#dc2626] hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Confirm Return & Restock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
