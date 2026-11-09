"use client";

import { useEffect, useState } from "react";
import {
  PackageX,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Search,
  Printer,
  Plus,
  Loader2,
  Flame,
  Layers,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { formatBdCurrency } from "@/lib/utils";
import { Pagination } from "@/components/ui";
import { FreshWatermark } from "@/components/common/fresh-watermark";

interface ProductItem {
  id: number;
  product_name: string;
  product_code: string | null;
  category: string;
  brand: string;
  unit: string;
  stock: number;
  product_cost: number;
  price: number;
  status: "out_of_stock" | "low_stock" | "healthy";
}

interface FastMover {
  id: number;
  name: string;
  total_sold_qty: number;
  total_revenue: number;
  current_stock: number;
}

interface Summary {
  total_products: number;
  out_of_stock_count: number;
  low_stock_count: number;
  healthy_stock_count: number;
  estimated_restock_cost: number;
}

export default function StockOutReportPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [fastMovers, setFastMovers] = useState<FastMover[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState<"critical" | "out_of_stock" | "low_stock" | "all">("critical");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const loadData = async () => {
    try {
      setLoading(true);
      const url = `/api/reports/stock-out?filter=${activeTab}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === "success") {
        setProducts(data.data);
        setFastMovers(data.fast_movers);
        setSummary(data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    loadData();
  }, [activeTab, search]);

  const outOfStockCount = summary?.out_of_stock_count ?? 0;
  const lowStockCount = summary?.low_stock_count ?? 0;
  const criticalCount = outOfStockCount + lowStockCount;
  const allCatalogCount = summary?.total_products ?? 0;

  const startIndex = (currentPage - 1) * pageSize;
  const displayedProducts = products.slice(startIndex, startIndex + pageSize);

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
            Stock-Out Warning Report
          </h2>
          <div className="text-[10.5px] font-bold text-slate-800 mt-0.5">
            মজুদ ঘাটতি ও লো-স্টক সতর্কতা বিবরণী
          </div>
          <div className="text-[9.5px] text-black mt-0.5 font-medium">
            Filter: {activeTab === "critical" ? "All Critical (≤ 5)" : activeTab === "out_of_stock" ? "Out of Stock (0)" : activeTab === "low_stock" ? "Low Stock (1-5)" : "All Catalog"}{" "}
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

      {/* 1. Header & Actions (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50 flex items-center justify-center shrink-0">
            <PackageX className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white m-0 leading-tight">
              Stock-Out &amp; Low Inventory Warning Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
              Immediate restocking alerts, depleted inventory lists, and fast-moving demand
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <Link
            href="/purchases"
            className="h-[38px] px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Purchase Order</span>
            <span className="sm:hidden">Create</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="h-[38px] px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#cbd5e1] dark:border-[#334155] shrink-0 whitespace-nowrap"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Report</span>
            <span className="sm:hidden">Print</span>
          </button>
        </div>
      </div>

      {/* 2. Four KPI Warning Cards (1 col mobile, 2 col sm, 4 col lg, 2 Columns in Print) */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-2 gap-2.5 sm:gap-3 print:gap-2">
          <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-rose-200 dark:border-rose-900/50 print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
            <div>
              <div className="text-rose-600 print:text-slate-700 text-xs print:text-[10px] font-bold">
                Out of Stock (Zero Stock)
              </div>
              <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">Completely depleted</div>
            </div>
            <div className="text-xl print:text-sm font-black text-rose-600 print:text-black mt-1 print:mt-0 print:text-right shrink-0">
              {summary.out_of_stock_count} Items
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-amber-200 dark:border-amber-900/50 print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
            <div>
              <div className="text-amber-600 print:text-slate-700 text-xs print:text-[10px] font-bold">
                Low Stock Warning (≤ 5 pcs)
              </div>
              <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">Reorder recommended</div>
            </div>
            <div className="text-xl print:text-sm font-black text-amber-600 print:text-black mt-1 print:mt-0 print:text-right shrink-0">
              {summary.low_stock_count} Items
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-[#cbd5e1] dark:border-[#334155] print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
            <div>
              <div className="text-slate-500 dark:text-slate-400 print:text-slate-700 text-xs print:text-[10px] font-bold">
                Healthy Inventory
              </div>
              <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">Sufficient stock available</div>
            </div>
            <div className="text-xl print:text-sm font-black text-emerald-600 print:text-black mt-1 print:mt-0 print:text-right shrink-0">
              {summary.healthy_stock_count} Items
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] p-3.5 print:p-2.5 print:py-1.5 rounded-2xl print:rounded-lg border border-[#cbd5e1] dark:border-[#334155] print:border-[#cbd5e1] shadow-xs print:flex print:items-center print:justify-between">
            <div>
              <div className="text-slate-500 dark:text-slate-400 print:text-slate-700 text-xs print:text-[10px] font-bold">
                Estimated Restock Cost
              </div>
              <div className="text-[11px] print:text-[8.5px] text-slate-400 print:text-slate-500 mt-0.5 print:mt-0">To replenish critical items</div>
            </div>
            <div className="text-xl print:text-sm font-black text-slate-900 dark:text-white print:text-black mt-1 print:mt-0 print:text-right shrink-0">
              {formatBdCurrency(summary.estimated_restock_cost)}
            </div>
          </div>
        </div>
      )}

      {/* 3. Fast Movers Showcase Bar (Hidden in Print) */}
      {fastMovers.length > 0 && (
        <div className="print:hidden bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Top Fast Moving Products (Customer Demand Leaderboard)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {fastMovers.slice(0, 5).map((fm, idx) => (
              <div
                key={fm.id}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center font-black text-[10px]">
                    #{idx + 1}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      fm.current_stock <= 0
                        ? "bg-rose-100 text-rose-700"
                        : fm.current_stock <= 5
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    Stock: {fm.current_stock}
                  </span>
                </div>
                <div className="font-bold text-slate-800 dark:text-slate-100 truncate" title={fm.name}>
                  {fm.name}
                </div>
                <div className="text-[11px] text-slate-400">
                  Sold: <strong className="text-slate-700 dark:text-slate-200">{fm.total_sold_qty}</strong> pcs
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Filter Tabs & Search Controls (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0f172a] p-3 rounded-2xl border border-[#cbd5e1] dark:border-[#334155]">
        {/* Tabs (Horizontal swipeable on mobile with scrollbar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-thin pb-1 sm:pb-0 w-full sm:w-auto shrink-0">
          <button
            onClick={() => {
              setActiveTab("critical");
              setCurrentPage(1);
            }}
            className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === "critical"
                ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
            }`}
          >
            All Critical ({criticalCount})
          </button>
          <button
            onClick={() => {
              setActiveTab("out_of_stock");
              setCurrentPage(1);
            }}
            className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === "out_of_stock"
                ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
          <button
            onClick={() => {
              setActiveTab("low_stock");
              setCurrentPage(1);
            }}
            className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === "low_stock"
                ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`h-[38px] px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
              activeTab === "all"
                ? "bg-gradient-to-r from-[#991b1b] to-[#dc2626] text-white shadow-xs"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
            }`}
          >
            All Catalog ({allCatalogCount})
          </button>
          {(activeTab !== "critical" || search) && (
            <button
              onClick={() => {
                setActiveTab("critical");
                setSearch("");
                setCurrentPage(1);
              }}
              className="h-[38px] px-3 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs shrink-0 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Search product name, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[38px] pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-[#1e293b] border border-[#cbd5e1] dark:border-[#334155] text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-600 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* 5. Desktop Critical Inventory Table (Always Visible in Print) */}
      <div className="hidden md:block print:block print:w-full bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden print:border-none print:shadow-none print:rounded-none">
        <div className="overflow-x-auto print:overflow-visible">
          <table id="stock-out-table" className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="table-header-brand bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white font-bold whitespace-nowrap">
                <th className="py-3 px-4 w-12 text-center">SL</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-3">Category &amp; Brand</th>
                <th className="py-3 px-3 text-right">Cost Price (৳)</th>
                <th className="py-3 px-3 text-right">Selling Price (৳)</th>
                <th className="py-3 px-4 text-center">Current Stock</th>
                <th className="py-3 px-4 text-center w-28">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-600" />
                    <span>Loading inventory items...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 font-bold">
                    No products found under this filter criteria.
                  </td>
                </tr>
              ) : (
                displayedProducts.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-center text-slate-400 font-mono">
                      {startIndex + idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">
                      <div>{p.product_name}</div>
                      {p.product_code && (
                        <div className="text-[10px] text-slate-400 font-mono">
                          Code: {p.product_code}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {p.category}
                      </span>
                      <span className="text-[11px] text-slate-400 block">{p.brand}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-600 dark:text-slate-400">
                      {formatBdCurrency(p.product_cost)}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900 dark:text-white">
                      {formatBdCurrency(p.price)}
                    </td>
                    <td className="py-3 px-4 text-center font-black text-sm">
                      <span
                        className={
                          p.stock <= 0
                            ? "text-rose-600"
                            : p.stock <= 5
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }
                      >
                        {p.stock} {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          p.status === "out_of_stock"
                            ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                            : p.status === "low_stock"
                            ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                            : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        }`}
                      >
                        {p.status === "out_of_stock"
                          ? "Out of Stock"
                          : p.status === "low_stock"
                          ? "Low Stock"
                          : "Healthy"}
                      </span>
                    </td>
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
            totalItems={products.length}
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

      {/* 6. Mobile Cards View (Strictly Hidden in Print) */}
      <div className="block md:hidden print:hidden space-y-2.5">
        {displayedProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-[#0f172a] p-3.5 rounded-2xl border border-[#cbd5e1] dark:border-[#334155] shadow-xs space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-xs text-slate-800 dark:text-white">
                  {p.product_name}
                </span>
                <p className="text-[11px] text-slate-500">
                  {p.category} &bull; {p.brand}
                </p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                  p.status === "out_of_stock"
                    ? "bg-rose-100 text-rose-700"
                    : p.status === "low_stock"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {p.status.replace("_", " ")}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">
                Stock:{" "}
                <strong
                  className={
                    p.stock <= 0
                      ? "text-rose-600 font-black"
                      : p.stock <= 5
                      ? "text-amber-600 font-black"
                      : "text-emerald-600 font-black"
                  }
                >
                  {p.stock} {p.unit}
                </strong>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                Price: {formatBdCurrency(p.price)}
              </span>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-[#cbd5e1] dark:border-[#334155] overflow-hidden">
          <Pagination
            currentPage={currentPage}
            totalItems={products.length}
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
          #stock-out-table {
            width: 100% !important;
            max-width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
          }
          #stock-out-table thead {
            display: table-header-group !important;
          }
          #stock-out-table thead tr {
            white-space: normal !important;
            background: #881337 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #stock-out-table th,
          #stock-out-table td {
            padding: 5px 4px !important;
            font-size: 8.5px !important;
            line-height: 1.2 !important;
            word-break: break-word !important;
            overflow-wrap: break-word !important;
          }
          #stock-out-table th:nth-child(1),
          #stock-out-table td:nth-child(1) {
            width: 6% !important;
            text-align: center !important;
          }
          #stock-out-table th:nth-child(2),
          #stock-out-table td:nth-child(2) {
            width: 28% !important;
          }
          #stock-out-table th:nth-child(3),
          #stock-out-table td:nth-child(3) {
            width: 20% !important;
          }
          #stock-out-table th:nth-child(4),
          #stock-out-table td:nth-child(4) {
            width: 12% !important;
            text-align: right !important;
          }
          #stock-out-table th:nth-child(5),
          #stock-out-table td:nth-child(5) {
            width: 12% !important;
            text-align: right !important;
          }
          #stock-out-table th:nth-child(6),
          #stock-out-table td:nth-child(6) {
            width: 10% !important;
            text-align: center !important;
          }
          #stock-out-table th:nth-child(7),
          #stock-out-table td:nth-child(7) {
            width: 12% !important;
            text-align: center !important;
          }
          #stock-out-table tbody tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
