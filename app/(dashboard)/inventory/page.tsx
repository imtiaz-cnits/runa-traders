"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Boxes,
  SlidersHorizontal,
  Edit2,
  X,
  Loader2,
  Layers,
  Sparkles,
} from "lucide-react";
import { formatBdCurrency } from "@/lib/utils";
import { CustomSelect } from "@/components/ui/custom-select";
import { Pagination } from "@/components/ui";

interface InventoryItem {
  id: number;
  name: string;
  primary_code: string;
  category: string;
  brand: string;
  unit: string;
  tile_size?: string | null;
  sqft_per_box?: number | null;
  grade?: string | null;
  quantity: number;
  cost_price: number;
  sell_price: number;
  total_cost_value: number;
  total_retail_value: number;
  stock_status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface Summary {
  total_products: number;
  total_stock_units: number;
  total_cost_valuation: number;
  total_retail_valuation: number;
  potential_profit: number;
  low_stock_count: number;
  out_of_stock_count: number;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "low" | "out">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Stock Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newQty, setNewQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("Physical Recount");
  const [adjusting, setAdjusting] = useState(false);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const url = `/api/inventory?search=${encodeURIComponent(search)}${
        statusFilter !== "all" ? `&filter=${statusFilter}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "success") {
        setItems(data.data);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [search, statusFilter]);

  const handleOpenAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setNewQty(String(item.quantity));
    setAdjustReason("Physical Recount");
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || newQty === "") return;

    try {
      setAdjusting(true);
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedItem.id,
          new_quantity: parseFloat(newQty),
          reason: adjustReason,
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        setIsAdjustModalOpen(false);
        setSelectedItem(null);
        setCurrentPage(1);
        loadInventory();
      } else {
        alert(data.message || "Failed to adjust stock");
      }
    } catch (err) {
      alert("Communication error");
    } finally {
      setAdjusting(false);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const displayedItems = items.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-4">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-rose-100 dark:border-slate-800 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white m-0 leading-tight">
              Stock & Inventory Engine
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
              Live stock levels, inventory valuation, margin potential, and adjustments
            </p>
          </div>
        </div>

        {/* Status Pills */}
        {summary && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStatusFilter("low")}
              className={`h-[36px] px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === "low"
                  ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                  : "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/40 hover:bg-amber-100"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Low Stock:</span>
              <span className="font-black">{summary.low_stock_count}</span>
            </button>

            <button
              onClick={() => setStatusFilter("out")}
              className={`h-[36px] px-3 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === "out"
                  ? "bg-rose-600 text-white border-rose-700 shadow-xs"
                  : "bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-900/40 hover:bg-rose-100"
              }`}
            >
              <span>Out of Stock:</span>
              <span className="font-black">{summary.out_of_stock_count}</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Valuation KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Stock Units */}
          <div className="bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
              <span>Total Units in Stock</span>
              <Boxes className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {summary.total_stock_units} <span className="text-xs font-normal">Pcs</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Across {summary.total_products} unique SKUs
            </div>
          </div>

          {/* Cost Valuation */}
          <div className="bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
              <span>Stock Cost Value</span>
              <DollarSign className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl font-black text-sky-700 dark:text-sky-400 mt-1">
              {formatBdCurrency(summary.total_cost_valuation)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Total capital invested</div>
          </div>

          {/* Retail Valuation */}
          <div className="bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
              <span>Retail Selling Value</span>
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
              {formatBdCurrency(summary.total_retail_valuation)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Expected sales revenue</div>
          </div>

          {/* Potential Gross Profit */}
          <div className="bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold">
              <span>Potential Margin</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xl font-black text-purple-700 dark:text-purple-400 mt-1">
              {formatBdCurrency(summary.potential_profit)}
            </div>
            <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
              +
              {summary.total_cost_valuation > 0
                ? (
                    (summary.potential_profit / summary.total_cost_valuation) *
                    100
                  ).toFixed(1)
                : 0}
              % Markup
            </div>
          </div>
        </div>
      )}

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-3 rounded-2xl border border-[#cbd5e1] dark:border-[#334155]">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search product name, barcode, category, or brand..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-[38px] pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className={`h-[32px] px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === "all"
                ? "bg-emerald-700 text-white shadow-xs"
                : "bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            All Stock Items
          </button>
          <button
            onClick={() => {
              setStatusFilter("low");
              setCurrentPage(1);
            }}
            className={`h-[32px] px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === "low"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Low Stock (&le; 5)
          </button>
          <button
            onClick={() => {
              setStatusFilter("out");
              setCurrentPage(1);
            }}
            className={`h-[32px] px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === "out"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Out of Stock
          </button>
        </div>
      </div>

      {/* 4. Desktop Table (Strict Marss Corp Rule: Solid Emerald Header #15803d) */}
      <div className="hidden md:block bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="table-header-brand bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white font-bold whitespace-nowrap">
                <th className="py-3 px-4">Product Name / Variant</th>
                <th className="py-3 px-3">Barcode</th>
                <th className="py-3 px-3">Category & Brand</th>
                <th className="py-3 px-3 text-center">Stock Level</th>
                <th className="py-3 px-3 text-right">Cost (৳)</th>
                <th className="py-3 px-3 text-right">Sell (৳)</th>
                <th className="py-3 px-3 text-right">Total Cost Value</th>
                <th className="py-3 px-4 text-center w-24">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                    <span>Loading inventory status...</span>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400 font-bold">
                    No items matching filter.
                  </td>
                </tr>
              ) : (
                displayedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                        {item.name}
                      </div>
                      {(item.tile_size || item.sqft_per_box) && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {item.tile_size && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                              📐 {item.tile_size}
                            </span>
                          )}
                          {item.sqft_per_box && (
                            <span className="text-[9px] font-medium text-slate-500">
                              📦 {item.sqft_per_box} Sft/Box
                            </span>
                          )}
                          {item.grade && (
                            <span className="text-[9px] font-bold text-emerald-600">
                              ★ {item.grade}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {item.primary_code || "—"}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-700 dark:text-slate-200">
                        {item.category}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.brand}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-black ${
                          item.quantity <= 0
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                            : item.quantity <= 5
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        }`}
                      >
                        {item.quantity} {item.unit}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-600 dark:text-slate-300">
                      {item.cost_price.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                      {item.sell_price.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-sky-700 dark:text-sky-400">
                      {formatBdCurrency(item.total_cost_value)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenAdjust(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
                        title="Adjust Stock Quantity"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Adjust</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={items.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(newSize) => {
            setPageSize(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[20, 50, 100, 200, 500]}
        />
      </div>

      {/* 5. Mobile Card View */}
      <div className="block md:hidden space-y-2.5">
        {displayedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</h3>
                <p className="text-[10px] text-slate-400">
                  {item.category} &bull; {item.brand}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black ${
                  item.quantity <= 0
                    ? "bg-rose-100 text-rose-700"
                    : item.quantity <= 5
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {item.quantity} {item.unit}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-[#1e293b] p-2 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 block">Cost / Sell:</span>
                <span className="font-bold">
                  ৳{item.cost_price} / ৳{item.sell_price}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total Value:</span>
                <span className="font-black text-sky-700 dark:text-sky-400">
                  {formatBdCurrency(item.total_cost_value)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenAdjust(item)}
              className="w-full h-[32px] rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Adjust Stock Qty</span>
            </button>
          </div>
        ))}

        {/* Mobile Pagination */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] overflow-hidden">
          <Pagination
            currentPage={currentPage}
            totalItems={items.length}
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

      {/* 6. STOCK ADJUSTMENT MODAL */}
      {isAdjustModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-[#0f172a] rounded-[16px] shadow-2xl overflow-hidden border border-[#cbd5e1] dark:border-[#334155] max-h-[90vh] flex flex-col">
            <div className="modal-header-brand bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] px-5 py-3.5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-white" />
                <h3 className="text-sm font-bold tracking-wide uppercase m-0 text-white">
                  Adjust Stock Quantity
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="w-[28px] h-[28px] rounded-full bg-[#dc2626] hover:bg-red-700 text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="p-5 space-y-3.5 flex-1 overflow-y-auto">
              {/* Product Info */}
              <div className="bg-slate-50 dark:bg-[#1e293b] p-3 rounded-xl border border-[#cbd5e1] dark:border-[#334155] space-y-1 text-xs">
                <div className="font-bold text-slate-800 dark:text-white text-xs">
                  {selectedItem.name}
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Current Registered Stock:</span>
                  <strong className="font-bold text-emerald-600">
                    {selectedItem.quantity} {selectedItem.unit}
                  </strong>
                </div>
              </div>

              {/* New Quantity */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Physical Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  className="w-full h-[42px] px-3 text-xs bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] rounded-xl text-slate-900 dark:text-slate-100 font-black text-emerald-600 text-base focus:outline-none focus:ring-2 focus:ring-rose-600"
                />
              </div>

              {/* Reason */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Adjustment Reason
                </label>
                <CustomSelect
                  value={adjustReason}
                  onChange={(val) => setAdjustReason(val)}
                  options={[
                    { value: "Physical Recount", label: "Physical Inventory Recount" },
                    { value: "Damaged / Broken", label: "Damaged / Broken Goods" },
                    { value: "Customer Return", label: "Customer Return / Cancellation" },
                    { value: "Supplier Replacement", label: "Supplier Replacement" },
                    { value: "Showroom Display / Sample", label: "Showroom Display / Sample" },
                  ]}
                  placeholder="Select Reason"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  disabled={adjusting}
                  className="h-[38px] px-4 rounded-xl bg-[#dc2626] hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting}
                  className="h-[38px] px-5 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {adjusting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Stock Update</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
