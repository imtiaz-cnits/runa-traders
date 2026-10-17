"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { CustomDatePicker } from "@/components/ui/date-picker";
import { formatBoxAndPcs } from "@/lib/tiles-calculator";
import { useToast } from "@/components/ui/toast";

interface ReturnItem {
  id: number;
  type: "sales" | "purchase";
  record_no: string;
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
  purchase_no?: string;
  supplier_id?: number;
  supplier_name?: string;
  supplier_mobile?: string;
  purchase_date?: string;
  grand_subtotal?: number;
  paid_amount: number;
  due_amount: number;
  discount_amount?: number;
  items: SearchItemLine[];
}

function PurchaseReturnsManagementContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();

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
  const fetchReturnList = async () => {
    try {
      setLoading(true);
      const url = `/api/returns?type=purchase`;
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
      console.error("Error loading purchase returns list:", err);
      toast.error("Failed to load purchase return history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnList();
  }, []);

  // Handle URL Query Params
  useEffect(() => {
    const purchaseNoParam = searchParams.get("purchase_no");
    if (purchaseNoParam) {
      openModalForRecord(purchaseNoParam);
    }
  }, [searchParams]);

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

  // Search purchase
  const searchRecordForReturn = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) {
      toast.error("Please enter a purchase memo number");
      return;
    }

    setModalSearching(true);
    try {
      const url = `/api/returns/search?type=purchase&query=${encodeURIComponent(q)}`;
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
        toast.error(data.message || "Purchase record not found");
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
      toast.error("Please enter a purchase memo number");
      return;
    }
    openModalForRecord(quickSearchInput.trim());
  };

  // Toggle item selection
  const handleToggleSelect = (detailId: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [detailId]: !prev[detailId],
    }));
  };

  // Toggle all eligible items
  const handleSelectAll = (select: boolean) => {
    if (!loadedRecord) return;
    const newSelect: { [key: number]: boolean } = {};
    loadedRecord.items.forEach((item) => {
      if (item.returnable_quantity > 0) {
        newSelect[item.detail_id] = select;
      }
    });
    setSelectedItems(newSelect);
  };

  // Change return quantity
  const handleQuantityChange = (detailId: number, val: number, maxReturnable: number) => {
    const cleanVal = isNaN(val) ? 0 : Math.max(0, Math.min(val, maxReturnable));
    setReturnQuantities((prev) => ({
      ...prev,
      [detailId]: cleanVal,
    }));
  };

  // Calculate Subtotal & Due Adjustments in Modal
  const calculatedModalTotals = useMemo(() => {
    if (!loadedRecord) {
      return { returnSubtotal: 0, newPaid: 0, newDue: 0, selectedCount: 0 };
    }

    let returnSubtotal = 0;
    let selectedCount = 0;

    loadedRecord.items.forEach((item) => {
      if (selectedItems[item.detail_id]) {
        const qty = returnQuantities[item.detail_id] || 0;
        if (qty > 0) {
          selectedCount += 1;
          returnSubtotal += qty * item.unit_price;
        }
      }
    });

    const currentDue = Number(loadedRecord.due_amount || 0);
    const newDue = Math.max(0, currentDue - returnSubtotal);

    return {
      returnSubtotal,
      newDue,
      selectedCount,
    };
  }, [loadedRecord, selectedItems, returnQuantities]);

  // Submit Return Action
  const handleSubmitReturn = async () => {
    if (!loadedRecord) {
      toast.error("Please search and load a purchase first");
      return;
    }

    const selectedLines = loadedRecord.items.filter(
      (item) => selectedItems[item.detail_id] && (returnQuantities[item.detail_id] || 0) > 0
    );

    if (selectedLines.length === 0) {
      toast.error("Please select at least one item with a valid return quantity > 0");
      return;
    }

    for (const item of selectedLines) {
      const q = returnQuantities[item.detail_id] || 0;
      if (q > item.returnable_quantity) {
        toast.error(`Return quantity for ${item.product_name} exceeds max returnable (${item.returnable_quantity})`);
        return;
      }
    }

    try {
      setSubmittingReturn(true);

      const returnedProducts = selectedLines.map((item) => {
        const q = returnQuantities[item.detail_id];
        const lineTotal = q * item.unit_price;
        return {
          detail_id: item.detail_id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_code: item.product_code,
          unit_price: item.unit_price,
          quantity: q,
          line_total: lineTotal,
        };
      });

      const payload = {
        type: "purchase",
        purchase_id: loadedRecord.id,
        supplier_id: loadedRecord.supplier_id,
        return_date: modalReturnDate,
        note: modalReturnNote,
        total_amount: calculatedModalTotals.returnSubtotal,
        products: returnedProducts,
      };

      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        toast.success(data.message || "Purchase return processed successfully!");
        setIsModalOpen(false);
        setQuickSearchInput("");
        fetchReturnList();
      } else {
        toast.error(data.message || "Failed to process purchase return");
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
      {/* 1. Top Section: Page Title & Process Return Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-slate-800 shadow-2xs shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold text-slate-800 dark:text-white tracking-tight leading-tight m-0">
              Purchase Return Management
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
              RUNA TRADERS - Supplier Purchase Return &amp; Due Adjustment
            </p>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => openModalForRecord("")}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] active:scale-[0.98] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Purchase Return</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Search Box */}
      <div
        className="rounded-2xl border border-[#cbd5e1] dark:border-[#334155] bg-rose-50/40 dark:bg-slate-900/40 p-4 shadow-xs"
        style={{ borderLeft: "4.5px solid #991b1b" }}
      >
        <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
          <Search className="w-4 h-4 text-rose-600" />
          <span>Quick Purchase Memo Search &amp; Process Return</span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5">
          Search purchase memo number or supplier to process return to supplier:
        </p>

        <form onSubmit={handleQuickSearchSubmit} className="flex flex-row items-stretch gap-2.5">
          <div className="flex-1 min-w-0 h-[38px] flex items-center px-3 bg-white dark:bg-slate-800/90 rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-600/20 shadow-xs transition-all">
            <input
              type="text"
              value={quickSearchInput}
              onChange={(e) => setQuickSearchInput(e.target.value)}
              placeholder="Enter purchase memo number (e.g. #PurID00001 or 1)..."
              className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 h-[38px] rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] active:scale-[0.98] text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>Search &amp; Return</span>
          </button>
        </form>
      </div>

      {/* 3. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0f172a] border border-[#cbd5e1] dark:border-[#334155] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Return Items
            </div>
            <div className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
              {summary ? summary.total_records : returnsList.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">
            <RotateCcw className="w-5 h-5 text-rose-600" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0f172a] border border-[#cbd5e1] dark:border-[#334155] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Quantity Returned
            </div>
            <div className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
              {summary ? summary.total_quantity : returnsList.reduce((acc, i) => acc + i.quantity, 0)} pcs
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0f172a] border border-[#cbd5e1] dark:border-[#334155] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Refund / Adjusted
            </div>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-0.5">
              {formatBdCurrency(summary ? summary.total_amount : returnsList.reduce((acc, i) => acc + i.amount, 0))}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            ৳
          </div>
        </div>
      </div>

      {/* 4. History Table Card */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Show</span>
            <div className="w-20">
              <CustomSelect
                value={String(pageSize)}
                onChange={(val) => {
                  setPageSize(Number(val));
                  setCurrentPage(1);
                }}
                options={[
                  { label: "15", value: "15" },
                  { label: "50", value: "50" },
                  { label: "100", value: "100" },
                ]}
              />
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">entries</span>
          </div>

          <div className="w-full sm:w-72 h-[38px] flex items-center px-3 bg-white dark:bg-slate-800/90 rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus-within:border-rose-600 shadow-2xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={historySearch}
              onChange={(e) => {
                setHistorySearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter purchase returns..."
              className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="table-header-brand bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white font-semibold uppercase tracking-wider whitespace-nowrap">
                <th className="p-3 text-center w-[45px]">SL</th>
                <th className="p-3 w-[120px] whitespace-nowrap">Return Date</th>
                <th className="p-3 min-w-[170px] whitespace-nowrap">Purchase Memo</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Returned Product</th>
                <th className="p-3 text-center w-[110px]">Qty</th>
                <th className="p-3 text-right w-[150px]">Adjusted Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2 text-rose-600" />
                    Loading purchase return records...
                  </td>
                </tr>
              ) : displayedHistory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    No purchase return records found. Use the search box above to process a return.
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
                    <td className="p-3 font-mono font-bold text-slate-800 dark:text-white whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 whitespace-nowrap inline-block">
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
                    Total Return Adjusted Value:
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

        {/* Mobile Card List */}
        <div className="block md:hidden p-3 space-y-2.5">
          {loading ? (
            <div className="p-6 text-center text-slate-400 text-xs">Loading records...</div>
          ) : displayedHistory.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">No records found</div>
          ) : (
            displayedHistory.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center text-slate-500">
                      #{startIndex + idx + 1}
                    </span>
                    <span className="font-mono font-bold text-xs text-rose-600 dark:text-rose-400">
                      {item.record_no}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.date}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Supplier</span>
                    <span className="font-bold text-slate-800 dark:text-white">{item.party_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Adjusted Value</span>
                    <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                      {formatBdCurrency(item.amount)}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-700 dark:text-slate-300">{item.product_name}</div>
                    <div className="text-[10px] font-mono text-slate-400">Code: {item.product_code}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800 dark:text-white">
                      {item.tile_size || item.pcs_per_box
                        ? formatBoxAndPcs(item.quantity, item.pcs_per_box)
                        : `${item.quantity} pcs`}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Footer */}
        {filteredHistory.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredHistory.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* 5. PROCESS PURCHASE RETURN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f172a] w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Sticky Emerald/Red Header */}
            <div className="bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white px-5 py-3.5 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white m-0">
                    Process Purchase Return
                  </h3>
                  <p className="text-[11px] text-white/80 m-0">
                    Return purchased stock back to supplier &amp; adjust payable due
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Search Purchase Memo */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Search Purchase Memo Number
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-[42px] flex items-center px-3 bg-white dark:bg-slate-800/90 rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus-within:border-rose-600 shadow-2xs">
                    <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
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
                      placeholder="Enter Purchase Memo No (e.g. #PurID00001 or 1)..."
                      className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-white placeholder:text-slate-400 font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => searchRecordForReturn(modalSearchQuery)}
                    disabled={modalSearching}
                    className="h-[42px] px-5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    {modalSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Record Details Banner */}
              {loadedRecord && (
                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 dark:border-rose-900/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                        Purchase Memo:
                      </span>
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                        {loadedRecord.purchase_no}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-rose-600" />
                      <span>Date: {loadedRecord.purchase_date || "N/A"}</span>
                    </div>
                  </div>

                  {/* Supplier Info & Financials */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Supplier Name
                      </span>
                      <span className="font-bold text-slate-800 dark:text-white">
                        {loadedRecord.supplier_name || "N/A"}
                      </span>
                      {loadedRecord.supplier_mobile && (
                        <div className="text-[10px] text-slate-500 font-mono">
                          {loadedRecord.supplier_mobile}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Total Purchase
                      </span>
                      <span className="font-bold text-slate-800 dark:text-white">
                        {formatBdCurrency(loadedRecord.grand_subtotal || 0)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Paid Amount
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatBdCurrency(loadedRecord.paid_amount || 0)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">
                        Current Due
                      </span>
                      <span className="font-black text-rose-600 dark:text-rose-400">
                        {formatBdCurrency(loadedRecord.due_amount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Items Table for Return Selection */}
              {loadedRecord && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span>Select Products to Return</span>
                      <span className="text-[10px] font-normal text-slate-500">
                        (Check the box &amp; enter quantity)
                      </span>
                    </h5>

                    <button
                      type="button"
                      onClick={() => handleSelectAll(!isAllEligibleSelected)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1 cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>{isAllEligibleSelected ? "Deselect All" : "Select All Returnable"}</span>
                    </button>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                          <th className="p-2.5 text-center w-10">Select</th>
                          <th className="p-2.5">Product</th>
                          <th className="p-2.5 text-center">Purchased</th>
                          <th className="p-2.5 text-center">Already Returned</th>
                          <th className="p-2.5 text-center">Returnable</th>
                          <th className="p-2.5 text-center w-36">Return Qty</th>
                          <th className="p-2.5 text-right">Unit Price</th>
                          <th className="p-2.5 text-right">Refund Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loadedRecord.items.map((item) => {
                          const isEligible = item.returnable_quantity > 0;
                          const isSelected = !!selectedItems[item.detail_id];
                          const qty = returnQuantities[item.detail_id] || 0;
                          const lineRefund = qty * item.unit_price;

                          return (
                            <tr
                              key={item.detail_id}
                              className={`transition-colors ${
                                !isEligible
                                  ? "opacity-50 bg-slate-50 dark:bg-slate-900/40 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-rose-50/60 dark:bg-rose-950/30"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              }`}
                            >
                              <td className="p-2.5 text-center">
                                <input
                                  type="checkbox"
                                  disabled={!isEligible}
                                  checked={isSelected}
                                  onChange={() => handleToggleSelect(item.detail_id)}
                                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer disabled:cursor-not-allowed"
                                />
                              </td>
                              <td className="p-2.5">
                                <div className="font-bold text-slate-800 dark:text-white">
                                  {item.product_name}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[10px] font-mono text-slate-400">
                                    Code: {item.product_code}
                                  </span>
                                  {item.tile_size && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                      📐 {item.tile_size}
                                    </span>
                                  )}
                                  {item.grade && (
                                    <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                                      {item.grade}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-2.5 text-center font-bold text-slate-700 dark:text-slate-300">
                                {item.tile_size || item.pcs_per_box
                                  ? formatBoxAndPcs(item.purchased_quantity, item.pcs_per_box)
                                  : `${item.purchased_quantity} pcs`}
                              </td>
                              <td className="p-2.5 text-center text-slate-500">
                                {item.already_returned_quantity > 0 ? (
                                  <span className="text-rose-600 font-bold">
                                    {item.tile_size || item.pcs_per_box
                                      ? formatBoxAndPcs(item.already_returned_quantity, item.pcs_per_box)
                                      : `${item.already_returned_quantity} pcs`}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td className="p-2.5 text-center font-bold text-slate-800 dark:text-white">
                                {isEligible ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold">
                                    {item.tile_size || item.pcs_per_box
                                      ? formatBoxAndPcs(item.returnable_quantity, item.pcs_per_box)
                                      : `${item.returnable_quantity} pcs`}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">Fully Returned</span>
                                )}
                              </td>
                              <td className="p-2.5 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <input
                                    type="number"
                                    min="0"
                                    max={item.returnable_quantity}
                                    disabled={!isEligible || !isSelected}
                                    value={qty}
                                    onChange={(e) =>
                                      handleQuantityChange(
                                        item.detail_id,
                                        parseFloat(e.target.value),
                                        item.returnable_quantity
                                      )
                                    }
                                    className="w-20 h-8 px-2 text-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white disabled:opacity-40 disabled:bg-slate-100 dark:disabled:bg-slate-900"
                                  />
                                  <span className="text-[10px] text-slate-400">pcs</span>
                                </div>
                              </td>
                              <td className="p-2.5 text-right font-medium text-slate-700 dark:text-slate-300">
                                {formatBdCurrency(item.unit_price)}
                              </td>
                              <td className="p-2.5 text-right font-black text-rose-600 dark:text-rose-400">
                                {isSelected ? formatBdCurrency(lineRefund) : "৳ 0.00"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Return Form Metadata & Calculation Overview */}
              {loadedRecord && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Return Date <span className="text-rose-600">*</span>
                      </label>
                      <CustomDatePicker
                        value={modalReturnDate}
                        onChange={(val) => setModalReturnDate(val)}
                        placement="auto"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Return Reason / Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={modalReturnNote}
                        onChange={(e) => setModalReturnNote(e.target.value)}
                        placeholder="State reason for returning items back to supplier (damaged, excess order, etc.)..."
                        className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-xs text-slate-800 dark:text-white outline-none focus:border-rose-600"
                      />
                    </div>
                  </div>

                  {/* Financial Adjustment Summary Box */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <h6 className="font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                      <span>Adjustment Breakdown</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {calculatedModalTotals.selectedCount} item(s) selected
                      </span>
                    </h6>

                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Total Return Item Value:</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400 text-sm">
                        {formatBdCurrency(calculatedModalTotals.returnSubtotal)}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Supplier Payable Due (Before):</span>
                      <span className="font-bold text-slate-800 dark:text-white">
                        {formatBdCurrency(loadedRecord.due_amount || 0)}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-800 dark:text-white font-bold pt-1.5 border-t border-dashed border-slate-300 dark:border-slate-700">
                      <span>New Supplier Payable Due:</span>
                      <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                        {formatBdCurrency(calculatedModalTotals.newDue)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Modal Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 h-[42px] rounded-xl bg-[#dc2626] hover:bg-rose-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReturn}
                disabled={submittingReturn || !loadedRecord || calculatedModalTotals.selectedCount === 0}
                className="px-6 h-[42px] rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] active:scale-[0.98] text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submittingReturn ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>Confirm Purchase Return</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PurchaseReturnsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 text-sm">
          <Loader2 className="w-5 h-5 animate-spin inline mr-2 text-rose-600" />
          Loading Purchase Returns...
        </div>
      }
    >
      <PurchaseReturnsManagementContent />
    </Suspense>
  );
}
