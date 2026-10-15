"use client";

import { useEffect, useState, useMemo } from "react";
import {
  RotateCcw,
  Plus,
  Search,
  Calendar,
  Clock,
  ShoppingCart,
  Truck,
  ArrowRight,
  CheckSquare,
  Check,
  X,
  Loader2,
  Barcode,
  Layers,
  Sparkles,
} from "lucide-react";
import { formatBdCurrency } from "@/lib/utils";
import { CustomSelect, Pagination } from "@/components/ui";
import { formatBoxAndPcs } from "@/lib/tiles-calculator";
import { useToast } from "@/components/ui/toast";

interface ReturnItem {
  id: number;
  type: "sales" | "purchase";
  record_no: string;
  order_id?: number;
  purchase_id?: number;
  party_name: string;
  party_mobile: string;
  product_id: number | null;
  product_name: string;
  product_code: string;
  tile_size?: string | null;
  pcs_per_box?: number | null;
  quantity: number;
  amount: number;
  discount_amount: number;
  due_amount: number;
  date: string;
  created_at: string | null;
}

interface SummaryData {
  total_records: number;
  total_amount: number;
  total_quantity: number;
}

interface SearchItemLine {
  detail_id: number;
  product_id: number;
  product_name: string;
  product_code: string;
  tile_size?: string | null;
  pcs_per_box?: number | null;
  grade?: string | null;
  purchased_quantity: number;
  already_returned_quantity: number;
  returnable_quantity: number;
  unit_price: number;
  total_selling_price?: number;
  subtotal?: number;
}

interface SearchRecordData {
  id: number;
  order_no?: string;
  purchase_no?: string;
  customer_id?: number;
  customer_name?: string;
  customer_mobile?: string;
  supplier_id?: number;
  supplier_name?: string;
  supplier_mobile?: string;
  invoice_date?: string;
  purchase_date?: string;
  sub_total?: number;
  grand_subtotal?: number;
  paid_amount: number;
  due_amount: number;
  discount_amount?: number;
  items: SearchItemLine[];
}

export default function ReturnsManagementPage() {
  const { toast } = useToast();

  // Mode Tab: 'sales' or 'purchase'
  const [activeTab, setActiveTab] = useState<"sales" | "purchase">("sales");

  // History List State
  const [returnsList, setReturnsList] = useState<ReturnItem[]>([]);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [historySearch, setHistorySearch] = useState("");
  const [quickSearchInput, setQuickSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Return Processing Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalSearching, setModalSearching] = useState(false);
  const [loadedRecord, setLoadedRecord] = useState<SearchRecordData | null>(null);

  // Modal Return Form State
  const [selectedItems, setSelectedItems] = useState<{ [detailId: number]: boolean }>({});
  const [returnQuantities, setReturnQuantities] = useState<{ [detailId: number]: number }>({});
  const [modalReturnDate, setModalReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [modalReturnNote, setModalReturnNote] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // 1. Fetch History List
  const fetchReturnList = async (tab: "sales" | "purchase") => {
    try {
      setLoading(true);
      const url = `/api/returns?type=${tab}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "success") {
        setReturnsList(data.data || []);
        setSummary(data.summary || null);
      } else {
        setReturnsList([]);
        setSummary(null);
      }
    } catch (err) {
      console.error("Error loading returns list:", err);
      toast.error("Failed to load return history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnList(activeTab);
  }, [activeTab]);

  // Handle Tab Switch
  const handleTabSwitch = (tab: "sales" | "purchase") => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setHistorySearch("");
    setQuickSearchInput("");
    setCurrentPage(1);
  };

  // 2. Open Modal & Load Record
  const openModalForRecord = async (prefillQuery: string = "") => {
    setLoadedRecord(null);
    setSelectedItems({});
    setReturnQuantities({});
    setModalReturnDate(new Date().toISOString().split("T")[0]);
    setModalReturnNote("");
    setModalSearchQuery(prefillQuery);
    setIsModalOpen(true);

    if (prefillQuery.trim()) {
      await searchRecordForReturn(prefillQuery.trim());
    }
  };

  // Search invoice/purchase
  const searchRecordForReturn = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) {
      toast.error(
        activeTab === "purchase"
          ? "Please enter a purchase memo number"
          : "Please enter an invoice number"
      );
      return;
    }

    setModalSearching(true);
    try {
      const url = `/api/returns/search?type=${activeTab}&query=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && data.status === "success" && data.data) {
        setLoadedRecord(data.data);

        // Pre-initialize selection & quantities
        const initSelect: { [key: number]: boolean } = {};
        const initQty: { [key: number]: number } = {};

        data.data.items.forEach((item: SearchItemLine) => {
          initSelect[item.detail_id] = false;
          initQty[item.detail_id] = item.returnable_quantity > 0 ? 1 : 0;
        });

        setSelectedItems(initSelect);
        setReturnQuantities(initQty);
      } else {
        setLoadedRecord(null);
        toast.error(data.message || (activeTab === "purchase" ? "Purchase record not found" : "Invoice not found"));
      }
    } catch (err: any) {
      console.error("Search error:", err);
      toast.error("Network error while searching record");
    } finally {
      setModalSearching(false);
    }
  };

  // Quick search from inline card
  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearchInput.trim()) {
      toast.error(
        activeTab === "purchase"
          ? "Please enter a purchase memo number"
          : "Please enter an invoice number"
      );
      return;
    }
    openModalForRecord(quickSearchInput.trim());
  };

  // Item Checkbox Toggle
  const toggleItemCheckbox = (detailId: number, maxQty: number) => {
    setSelectedItems((prev) => {
      const nextChecked = !prev[detailId];
      if (nextChecked && (!returnQuantities[detailId] || returnQuantities[detailId] <= 0)) {
        setReturnQuantities((qPrev) => ({ ...qPrev, [detailId]: Math.min(1, maxQty) }));
      }
      return { ...prev, [detailId]: nextChecked };
    });
  };

  // Select All Toggle
  const toggleSelectAll = (checked: boolean) => {
    if (!loadedRecord) return;
    const newSelect: { [key: number]: boolean } = {};
    const newQty: { [key: number]: number } = { ...returnQuantities };

    loadedRecord.items.forEach((item) => {
      if (item.returnable_quantity > 0) {
        newSelect[item.detail_id] = checked;
        if (checked && (!newQty[item.detail_id] || newQty[item.detail_id] <= 0)) {
          newQty[item.detail_id] = 1;
        }
      } else {
        newSelect[item.detail_id] = false;
      }
    });

    setSelectedItems(newSelect);
    setReturnQuantities(newQty);
  };

  // Quantity Change Handler
  const handleQuantityChange = (detailId: number, val: number, maxQty: number) => {
    const clamped = Math.max(1, Math.min(val, maxQty));
    setReturnQuantities((prev) => ({ ...prev, [detailId]: clamped }));
    // Auto-check if quantity > 0
    setSelectedItems((prev) => ({ ...prev, [detailId]: true }));
  };

  // Recalculate Grand Refund Total
  const grandRefundTotal = useMemo(() => {
    if (!loadedRecord) return 0;
    let total = 0;
    loadedRecord.items.forEach((item) => {
      if (selectedItems[item.detail_id]) {
        const qty = returnQuantities[item.detail_id] || 0;
        total += qty * (item.unit_price || 0);
      }
    });
    return Math.round(total * 100) / 100;
  }, [loadedRecord, selectedItems, returnQuantities]);

  // Submit Return Form
  const handleSubmitReturn = async () => {
    if (!loadedRecord) return;

    const returnedProducts: {
      order_detail_id?: number;
      purchase_order_detail_id?: number;
      product_id: number;
      quantity: number;
    }[] = [];

    loadedRecord.items.forEach((item) => {
      if (selectedItems[item.detail_id]) {
        const qty = returnQuantities[item.detail_id] || 0;
        if (qty > 0) {
          if (activeTab === "purchase") {
            returnedProducts.push({
              purchase_order_detail_id: item.detail_id,
              product_id: item.product_id,
              quantity: qty,
            });
          } else {
            returnedProducts.push({
              order_detail_id: item.detail_id,
              product_id: item.product_id,
              quantity: qty,
            });
          }
        }
      }
    });

    if (returnedProducts.length === 0) {
      toast.error("Please select at least one item with a return quantity greater than 0");
      return;
    }

    setSubmittingReturn(true);
    try {
      const payload: any = {
        type: activeTab,
        date: modalReturnDate,
        note: modalReturnNote,
        products: returnedProducts,
      };

      if (activeTab === "purchase") {
        payload.purchase_id = loadedRecord.id;
        payload.supplier_id = loadedRecord.supplier_id;
      } else {
        payload.order_id = loadedRecord.id;
        payload.customer_id = loadedRecord.customer_id;
      }

      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        toast.success(data.message || "Return processed successfully!");
        setIsModalOpen(false);
        setQuickSearchInput("");
        fetchReturnList(activeTab);
      } else {
        toast.error(data.message || "Failed to process return");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err?.message || "An error occurred while saving the return");
    } finally {
      setSubmittingReturn(false);
    }
  };

  // Filtered History
  const filteredHistory = useMemo(() => {
    if (!historySearch.trim()) return returnsList;
    const q = historySearch.toLowerCase();
    return returnsList.filter(
      (r) =>
        r.record_no.toLowerCase().includes(q) ||
        r.party_name.toLowerCase().includes(q) ||
        r.party_mobile.includes(q) ||
        r.product_name.toLowerCase().includes(q) ||
        r.product_code.toLowerCase().includes(q)
    );
  }, [returnsList, historySearch]);

  const startIndex = (currentPage - 1) * pageSize;
  const displayedHistory = filteredHistory.slice(startIndex, startIndex + pageSize);

  const isAllEligibleSelected =
    loadedRecord &&
    loadedRecord.items.filter((i) => i.returnable_quantity > 0).length > 0 &&
    loadedRecord.items
      .filter((i) => i.returnable_quantity > 0)
      .every((i) => selectedItems[i.detail_id]);

  return (
    <div className="space-y-4">
      {/* 1. Top Section: Page Title & Process Return Button (Fixed 38px, Rule 5.1) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-slate-800 shadow-2xs shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight leading-tight m-0">
              Return Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
              RUNA TRADERS - Sales & Purchase Return Management
            </p>
          </div>
        </div>

        {/* Primary Action Button (Fixed 38px) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => openModalForRecord("")}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] active:scale-[0.98] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === "purchase" ? "New Purchase Return" : "New Sales Return"}</span>
          </button>
        </div>
      </div>

      {/* 2. Mode Toggle Nav Tabs (38px height, MARSS reference layout) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleTabSwitch("sales")}
          className={`inline-flex items-center gap-2 px-4 h-[38px] min-h-[38px] text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
            activeTab === "sales"
              ? "bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#cbd5e1] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-700"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Sales Return</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabSwitch("purchase")}
          className={`inline-flex items-center gap-2 px-4 h-[38px] min-h-[38px] text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
            activeTab === "purchase"
              ? "bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white"
              : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#cbd5e1] dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-700"
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>Purchase Return</span>
        </button>
      </div>

      {/* 3. Quick Search Box (Fixed 38px, MARSS reference layout with brand red left border) */}
      <div
        className="rounded-2xl border border-[#cbd5e1] dark:border-[#334155] bg-rose-50/40 dark:bg-slate-900/40 p-4 shadow-xs"
        style={{ borderLeft: "4.5px solid #991b1b" }}
      >
        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
          <Search className="w-4 h-4 text-rose-600" />
          <span>
            {activeTab === "purchase"
              ? "Quick Purchase Memo Search & Process Return"
              : "Quick Invoice Search & Process Return"}
          </span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
          {activeTab === "purchase"
            ? "Search purchase memo number or supplier to process return to supplier:"
            : "Search invoice number to process sales return:"}
        </p>

        <form onSubmit={handleQuickSearchSubmit} className="flex flex-row items-stretch gap-2.5">
          <div className="flex-1 min-w-0 h-[38px] flex items-center px-3 bg-white dark:bg-slate-800/90 rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-600/20 shadow-xs transition-all">
            <input
              type="text"
              value={quickSearchInput}
              onChange={(e) => setQuickSearchInput(e.target.value)}
              placeholder={
                activeTab === "purchase"
                  ? "Enter purchase memo number (e.g. #PurID00001 or 1)..."
                  : "Enter invoice number (e.g. #InvID00001 or ORD-20261014-6701)..."
              }
              className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 h-[38px] rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] active:scale-[0.98] text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Search & Return</span>
          </button>
        </form>
      </div>

      {/* 4. History Controls Row: Title + Search & Entries */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* History Title & Count Badge */}
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight m-0 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>{activeTab === "purchase" ? "Purchase Return History" : "Sales Return History"}</span>
            </h3>
            <span className="font-bold text-rose-700 dark:text-rose-300 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/50 text-xs">
              {filteredHistory.length} Records
            </span>
          </div>

          {/* Search Bar + Show Entries */}
          <div className="flex items-center gap-2.5 w-full md:w-auto">
            {/* Filter Search */}
            <div className="flex-1 md:w-64 h-[38px] flex items-center px-3 bg-white dark:bg-slate-800/90 rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-600/20 shadow-xs transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={historySearch}
                onChange={(e) => {
                  setHistorySearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filter returns..."
                className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-white placeholder:text-slate-400"
              />
              {historySearch && (
                <button
                  type="button"
                  onClick={() => setHistorySearch("")}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Show Entries Selector */}
            <div className="w-[125px]">
              <CustomSelect
                value={String(pageSize)}
                onChange={(val) => {
                  setPageSize(Number(val));
                  setCurrentPage(1);
                }}
                options={[
                  { value: "15", label: "Show: 15" },
                  { value: "50", label: "Show: 50" },
                  { value: "100", label: "Show: 100" },
                  { value: "200", label: "Show: 200" },
                  { value: "500", label: "Show: 500" },
                ]}
                matchTriggerWidth={true}
                minPopoverWidth={125}
                className="[&_button]:!min-h-[38px] [&_button]:!h-[38px] [&_button]:!py-1"
              />
            </div>
          </div>
        </div>

        {/* 5. Desktop History Table (MARSS reference layout with solid brand header) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="table-header-brand bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white font-semibold uppercase tracking-wider whitespace-nowrap">
                <th className="p-3 text-center w-[45px]">SL</th>
                <th className="p-3 w-[120px]">Return Date</th>
                <th className="p-3 w-[150px]">
                  {activeTab === "purchase" ? "Purchase Memo No" : "Invoice No"}
                </th>
                <th className="p-3">
                  {activeTab === "purchase" ? "Supplier Name" : "Customer Name"}
                </th>
                <th className="p-3">Returned Product</th>
                <th className="p-3 text-center w-[110px]">Qty</th>
                <th className="p-3 text-right w-[150px]">Refund Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2 text-rose-600" />
                    Loading return records...
                  </td>
                </tr>
              ) : displayedHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    No return records found. Use the search box above to process a return.
                  </td>
                </tr>
              ) : (
                displayedHistory.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="p-3 text-center font-bold text-slate-400">
                      {startIndex + idx + 1}
                    </td>
                    <td className="p-3 font-medium whitespace-nowrap text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-rose-600" />
                        <span>{item.date || "N/A"}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800 dark:text-white">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {item.record_no}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-800 dark:text-white">
                      <div>{item.party_name}</div>
                      {item.party_mobile && (
                        <div className="text-[10px] text-slate-400 font-normal">{item.party_mobile}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800 dark:text-white">{item.product_name}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] font-mono text-slate-400">Code: {item.product_code}</span>
                        {item.tile_size && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                            📐 {item.tile_size}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-800 dark:text-white">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-xs">
                        {item.tile_size || item.pcs_per_box
                          ? formatBoxAndPcs(item.quantity, item.pcs_per_box)
                          : `${item.quantity} pcs`}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-rose-700 dark:text-rose-400 text-xs">
                      {formatBdCurrency(item.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredHistory.length > 0 && (
              <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold border-t-2 border-rose-200 dark:border-rose-900/50 text-xs">
                <tr>
                  <td colSpan={5} className="p-3 text-right text-slate-600 dark:text-slate-300">
                    Total Returned Refund Value:
                  </td>
                  <td className="p-3 text-center font-bold text-slate-900 dark:text-white">
                    {filteredHistory.reduce((acc, i) => acc + i.quantity, 0)} pcs
                  </td>
                  <td className="p-3 text-right font-black text-rose-700 dark:text-rose-400 text-sm">
                    {formatBdCurrency(filteredHistory.reduce((acc, i) => acc + i.amount, 0))}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* 6. Mobile Card List (< 768px) */}
        <div className="block md:hidden p-3 space-y-2.5">
          {loading ? (
            <div className="p-6 text-center text-slate-400 text-xs">Loading records...</div>
          ) : displayedHistory.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">No return records found.</div>
          ) : (
            displayedHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-[#cbd5e1] dark:border-[#334155] shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800">
                    {item.record_no}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-rose-600" />
                    {item.date}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-xs text-slate-800 dark:text-white">
                    {item.party_name}
                  </div>
                  <div className="text-[11px] text-slate-500">{item.product_name}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Qty: {item.quantity} pcs
                  </span>
                  <span className="font-black text-rose-700 dark:text-rose-400">
                    {formatBdCurrency(item.amount)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredHistory.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[15, 50, 100, 200, 500]}
        />
      </div>

      {/* 7. Return Processing Modal (Unified Architecture & MARSS Reference Workflow) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4">
          <div className="w-full max-w-3xl sm:max-w-4xl bg-white dark:bg-slate-900 rounded-[16px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            {/* Header: Brand Gradient & Circular Close Button */}
            <div className="bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] px-6 py-4 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center shrink-0">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight m-0">
                  {activeTab === "purchase" ? "Purchase Return Processing" : "Sales Return Processing"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#dc2626] hover:bg-red-700 text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Inner Search Box */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3.5 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {activeTab === "purchase" ? "Search Purchase Memo Number" : "Search Invoice Number"}
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[38px] flex items-center px-3 bg-white dark:bg-slate-700/60 rounded-xl border border-[#cbd5e1] dark:border-[#334155] focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-600/20 shadow-xs">
                    <input
                      type="text"
                      value={modalSearchQuery}
                      onChange={(e) => setModalSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          searchRecordForReturn(modalSearchQuery);
                        }
                      }}
                      placeholder={
                        activeTab === "purchase"
                          ? "e.g. #PurID00001 or 1"
                          : "e.g. #InvID00001 or ORD-20261014-6701"
                      }
                      className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => searchRecordForReturn(modalSearchQuery)}
                    disabled={modalSearching}
                    className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {modalSearching ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Invoice Summary Card */}
              {loadedRecord && (
                <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800 dark:text-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {activeTab === "purchase" ? "Purchase Memo No:" : "Invoice / Order No:"}
                      </span>
                      <h4 className="font-mono font-bold text-sm text-rose-700 dark:text-rose-400 mt-0.5">
                        {activeTab === "purchase" ? loadedRecord.purchase_no : loadedRecord.order_no}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-2">
                        {activeTab === "purchase" ? "Supplier Name:" : "Customer Name:"}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-white block">
                        {activeTab === "purchase"
                          ? `${loadedRecord.supplier_name} (${loadedRecord.supplier_mobile})`
                          : `${loadedRecord.customer_name} (${loadedRecord.customer_mobile})`}
                      </span>
                    </div>

                    <div className="sm:text-right space-y-1">
                      <div className="text-slate-500 dark:text-slate-400">
                        Date:{" "}
                        <strong className="text-slate-800 dark:text-white">
                          {activeTab === "purchase"
                            ? loadedRecord.purchase_date
                            : loadedRecord.invoice_date}
                        </strong>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">
                        Sub Total:{" "}
                        <strong className="text-slate-800 dark:text-white">
                          {formatBdCurrency(
                            activeTab === "purchase"
                              ? loadedRecord.grand_subtotal || 0
                              : loadedRecord.sub_total || 0
                          )}
                        </strong>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400">
                        Paid:{" "}
                        <strong className="text-emerald-600">
                          {formatBdCurrency(loadedRecord.paid_amount || 0)}
                        </strong>{" "}
                        | Due:{" "}
                        <strong className="text-rose-600 font-bold">
                          {formatBdCurrency(loadedRecord.due_amount || 0)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Items Return Table */}
              {loadedRecord && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <CheckSquare className="w-4 h-4 text-rose-600" />
                      <span>Select items to return:</span>
                    </h5>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Check item and enter quantity
                    </span>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white text-[11px] font-semibold uppercase tracking-wider">
                          <th className="p-2.5 text-center w-[40px]">
                            <input
                              type="checkbox"
                              checked={Boolean(isAllEligibleSelected)}
                              onChange={(e) => toggleSelectAll(e.target.checked)}
                              className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                              title="Select All Eligible Items"
                            />
                          </th>
                          <th className="p-2.5">Product Name</th>
                          <th className="p-2.5 text-center w-[100px]">Purchased</th>
                          <th className="p-2.5 text-right w-[110px]">Unit Price</th>
                          <th className="p-2.5 text-center w-[120px]">Return Qty</th>
                          <th className="p-2.5 text-right w-[120px] pr-4">Refund Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
                        {loadedRecord.items.map((item) => {
                          const isChecked = Boolean(selectedItems[item.detail_id]);
                          const returnQty = returnQuantities[item.detail_id] || 0;
                          const lineRefund = Math.round(returnQty * item.unit_price * 100) / 100;
                          const isEligible = item.returnable_quantity > 0;

                          return (
                            <tr
                              key={item.detail_id}
                              className={`transition-colors ${
                                isChecked
                                  ? "bg-rose-50/50 dark:bg-rose-950/30"
                                  : !isEligible
                                  ? "opacity-40 bg-slate-50 dark:bg-slate-800/20"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                              }`}
                            >
                              <td className="p-2.5 text-center">
                                <input
                                  type="checkbox"
                                  disabled={!isEligible}
                                  checked={isChecked}
                                  onChange={() =>
                                    toggleItemCheckbox(item.detail_id, item.returnable_quantity)
                                  }
                                  className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer disabled:cursor-not-allowed"
                                />
                              </td>
                              <td className="p-2.5">
                                <div className="font-bold text-slate-800 dark:text-white">
                                  {item.product_name}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[10px] text-slate-400">
                                    {item.product_code}
                                  </span>
                                  {item.tile_size && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                                      📐 {item.tile_size}
                                    </span>
                                  )}
                                  {item.already_returned_quantity > 0 && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                                      Returned: {item.already_returned_quantity}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-2.5 text-center font-bold text-slate-700 dark:text-slate-300">
                                <div>{item.purchased_quantity} pcs</div>
                                {item.returnable_quantity < item.purchased_quantity && (
                                  <div className="text-[10px] text-emerald-600">
                                    Eligible: {item.returnable_quantity}
                                  </div>
                                )}
                              </td>
                              <td className="p-2.5 text-right font-semibold text-slate-700 dark:text-slate-300">
                                {formatBdCurrency(item.unit_price)}
                              </td>
                              <td className="p-2.5 text-center">
                                <input
                                  type="number"
                                  min="1"
                                  max={item.returnable_quantity}
                                  disabled={!isChecked || !isEligible}
                                  value={isChecked ? returnQty : 0}
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      item.detail_id,
                                      parseInt(e.target.value) || 0,
                                      item.returnable_quantity
                                    )
                                  }
                                  className="w-20 h-[34px] px-2 text-center font-bold text-slate-800 dark:text-white bg-white dark:bg-slate-800 rounded-lg border border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600 disabled:opacity-40 disabled:cursor-not-allowed"
                                />
                              </td>
                              <td className="p-2.5 text-right pr-4 font-bold text-rose-700 dark:text-rose-400">
                                {isChecked ? formatBdCurrency(lineRefund) : "৳ 0.00"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold border-t border-slate-200 dark:border-slate-700">
                        <tr>
                          <td colSpan={5} className="p-2.5 text-right text-xs uppercase text-slate-500">
                            Total Refund Amount:
                          </td>
                          <td className="p-2.5 text-right pr-4 font-black text-rose-700 dark:text-rose-400 text-sm">
                            {formatBdCurrency(grandRefundTotal)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Return Date & Note (2 Columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Return Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={modalReturnDate}
                        onChange={(e) => setModalReturnDate(e.target.value)}
                        className="w-full h-[42px] px-3.5 rounded-xl bg-white dark:bg-slate-800/90 text-xs font-bold text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Return Reason / Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={modalReturnNote}
                        onChange={(e) => setModalReturnNote(e.target.value)}
                        placeholder="e.g. Customer returned extra tiles or broken goods..."
                        className="w-full h-[42px] px-3.5 rounded-xl bg-white dark:bg-slate-800/90 text-xs text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer: Red Cancel & Brand Gradient Process Return */}
            <div className="shrink-0 bg-slate-50 dark:bg-slate-900/95 px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-[38px] px-4 rounded-xl bg-[#dc2626] hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              {loadedRecord && (
                <button
                  type="button"
                  onClick={handleSubmitReturn}
                  disabled={submittingReturn || grandRefundTotal <= 0}
                  className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {submittingReturn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Return...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Process Return</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
