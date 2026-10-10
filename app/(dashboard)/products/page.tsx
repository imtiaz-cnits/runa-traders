"use client";

import { useState, useEffect } from "react";
import { formatBdCurrency } from "@/lib/utils";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  Printer,
  FileSpreadsheet,
  Copy,
  Boxes,
  Barcode,
  Layers,
  Sparkles,
} from "lucide-react";
import { POPULAR_TILE_SIZES, TILE_GRADES, SURFACE_FINISHES } from "@/lib/tiles-calculator";
import { CustomSelect } from "@/components/ui/custom-select";

interface ProductItem {
  id: number;
  name: string;
  product_name: string;
  primary_code: string;
  display_codes: string;
  all_codes: string[];
  cost_price: number;
  sell_price: number;
  quantity: number;
  tile_size?: string | null;
  sqft_per_box?: number | null;
  pcs_per_box?: number | null;
  grade?: string | null;
  surface_finish?: string | null;
  status: string;
  category: string;
  brand: string;
  unit: string;
  brand_id: number;
  category_id: number;
  unit_id?: number | null;
}

interface OptionItem {
  id: number;
  name?: string;
  category_name?: string;
  unit_name?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<OptionItem[]>([]);
  const [brands, setBrands] = useState<OptionItem[]>([]);
  const [units, setUnits] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState("15");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    product_name: "",
    product_code: "",
    cost_price: "",
    sell_price: "",
    quantity: "0",
    tile_size: "",
    sqft_per_box: "",
    pcs_per_box: "",
    grade: "",
    surface_finish: "",
    brand_id: "",
    category_id: "",
    unit_id: "",
    status: "active",
  });

  async function loadData() {
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes, unitRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/brands"),
        fetch("/api/units"),
      ]);

      const [prods, cats, brs, unts] = await Promise.all([
        prodRes.json(),
        catRes.json(),
        brandRes.json(),
        unitRes.json(),
      ]);

      if (prods.status === "success") setProducts(prods.data || []);
      if (cats.status === "success") setCategories(cats.data || []);
      if (brs.status === "success") setBrands(brs.data || []);
      if (unts.status === "success") setUnits(unts.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleOpenCreate() {
    setEditingProduct(null);
    setFormData({
      product_name: "",
      product_code: "",
      cost_price: "",
      sell_price: "",
      quantity: "0",
      tile_size: "",
      sqft_per_box: "",
      pcs_per_box: "",
      grade: "",
      surface_finish: "",
      brand_id: brands[0]?.id ? String(brands[0].id) : "",
      category_id: categories[0]?.id ? String(categories[0].id) : "",
      unit_id: units[0]?.id ? String(units[0].id) : "",
      status: "active",
    });
    setError("");
    setModalOpen(true);
  }

  function handleOpenEdit(p: ProductItem) {
    setEditingProduct(p);
    setFormData({
      product_name: p.product_name,
      product_code: p.all_codes.join(", "),
      cost_price: String(p.cost_price),
      sell_price: String(p.sell_price),
      quantity: String(p.quantity),
      tile_size: p.tile_size || "",
      sqft_per_box: p.sqft_per_box ? String(p.sqft_per_box) : "",
      pcs_per_box: p.pcs_per_box ? String(p.pcs_per_box) : "",
      grade: p.grade || "",
      surface_finish: p.surface_finish || "",
      brand_id: String(p.brand_id),
      category_id: String(p.category_id),
      unit_id: p.unit_id ? String(p.unit_id) : "",
      status: p.status,
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const parsedCodes = formData.product_code
        ? formData.product_code.split(",").map((c) => c.trim()).filter(Boolean)
        : [];

      const selectedCat = categories.find((c) => String(c.id) === String(formData.category_id));
      const isTile = Boolean(
        selectedCat?.category_name &&
        (selectedCat.category_name.toLowerCase().includes("tile") ||
         selectedCat.category_name.toLowerCase().includes("টাইল"))
      );

      const payload = {
        ...formData,
        product_code: parsedCodes,
        cost_price: Number(formData.cost_price || 0),
        sell_price: Number(formData.sell_price || 0),
        quantity: Number(formData.quantity || 0),
        brand_id: Number(formData.brand_id),
        category_id: Number(formData.category_id),
        unit_id: formData.unit_id ? Number(formData.unit_id) : null,
        tile_size: isTile ? (formData.tile_size || null) : null,
        sqft_per_box: isTile ? (formData.sqft_per_box || null) : null,
        pcs_per_box: isTile ? (formData.pcs_per_box || null) : null,
        grade: isTile ? (formData.grade || null) : null,
        surface_finish: isTile ? (formData.surface_finish || null) : null,
      };

      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.status !== "success") {
        setError(data.message || "Failed to save product");
        setSubmitting(false);
        return;
      }

      setModalOpen(false);
      // Post-Creation Reset Rule: Reset pagination & refresh
      loadData();
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      loadData();
    } catch {
      alert("Failed to delete product");
    }
  }

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.product_name.toLowerCase().includes(q) ||
      p.display_codes.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q)
    );
  });

  const displayedProducts = filteredProducts.slice(0, Number(entries));

  return (
    <div className="space-y-4">
      {/* Top Header & Export Controls (Rule 5.1 & 5.2) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-slate-800 shadow-xs shrink-0">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-none m-0 p-0">
              Product Inventory List
            </h1>
          </div>
        </div>

        {/* Action Controls & Export Buttons (Rule 5.2) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Copy, Excel, Print */}
          <button
            title="Copy"
            className="w-[38px] h-[38px] rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            title="Excel / CSV"
            className="w-[38px] h-[38px] rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button
            onClick={() => window.print()}
            title="Print"
            className="w-[38px] h-[38px] rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Add Product Button */}
          <button
            onClick={handleOpenCreate}
            className="h-[38px] px-4 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Main Table Card (Rule 5.1) */}
      <div className="card bg-white dark:bg-slate-900 rounded-2xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden">
        {/* Controls & Filter Bar (Rule 5.3) */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="w-full md:w-80 h-[38px] flex items-center px-3 bg-white dark:bg-slate-800/90 rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-600/20 transition-all shadow-xs">
            <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name, barcode, model..."
              className="w-full bg-transparent border-none outline-none text-xs text-slate-800 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Show Entries Selector (Rule 5.3) */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="w-[120px]">
              <CustomSelect
                value={entries}
                onChange={(val) => setEntries(String(val))}
                options={[
                  { value: "15", label: "Show: 15" },
                  { value: "50", label: "Show: 50" },
                  { value: "100", label: "Show: 100" },
                  { value: "200", label: "Show: 200" },
                ]}
                className="[&_button]:!min-h-[38px] [&_button]:!py-1"
              />
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Total <strong>{filteredProducts.length}</strong> Products
            </span>
          </div>
        </div>

        {/* Desktop View Table (hidden on mobile, visible on desktop >= 768px, Rule 5.4) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header-brand bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] text-white text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                <th className="p-[10px] text-center w-[45px] rounded-tl-xl">SL</th>
                <th className="p-[10px]">Product Name</th>
                <th className="p-[10px]">Barcodes</th>
                <th className="p-[10px]">Category</th>
                <th className="p-[10px]">Brand</th>
                <th className="p-[10px] text-right">Cost Price</th>
                <th className="p-[10px] text-right">Sell Price</th>
                <th className="p-[10px] text-center">Stock</th>
                <th className="p-[10px] text-center">Status</th>
                <th className="p-[10px] text-center w-[85px] rounded-tr-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 font-medium">
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2 text-rose-600" />
                    Loading products...
                  </td>
                </tr>
              ) : displayedProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-400 font-medium">
                    No products found. Click "Add Product" to create your first item.
                  </td>
                </tr>
              ) : (
                displayedProducts.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <td className="p-[10px] text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="p-[10px]">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{p.product_name}</span>
                      </div>
                      {(p.tile_size || p.grade || p.sqft_per_box || p.surface_finish) && (
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          {p.tile_size && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-900/50">
                              📐 {p.tile_size}
                            </span>
                          )}
                          {p.sqft_per_box && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              📦 {p.sqft_per_box} Sft/Box {p.pcs_per_box ? `(${p.pcs_per_box} pcs)` : ""}
                            </span>
                          )}
                          {p.grade && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              ★ {p.grade}
                            </span>
                          )}
                          {p.surface_finish && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                              ✨ {p.surface_finish}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-[10px] font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex flex-wrap gap-1">
                        {p.all_codes.slice(0, 2).map((c, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          >
                            {c}
                          </span>
                        ))}
                        {p.all_codes.length > 2 && (
                          <span className="text-slate-400 text-[10px]">+{p.all_codes.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-[10px] text-slate-700 dark:text-slate-300 font-medium">
                      {p.category}
                    </td>
                    <td className="p-[10px] text-slate-700 dark:text-slate-300">
                      {p.brand}
                    </td>
                    <td className="p-[10px] text-right font-medium text-slate-600 dark:text-slate-300">
                      {formatBdCurrency(p.cost_price)}
                    </td>
                    <td className="p-[10px] text-right font-bold text-rose-700 dark:text-rose-400">
                      {formatBdCurrency(p.sell_price)}
                    </td>
                    <td className="p-[10px] text-center font-bold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] ${
                          p.quantity <= 0
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-bold"
                            : p.quantity <= 5
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold"
                            : "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}
                      >
                        {p.quantity} {p.unit}
                      </span>
                    </td>
                    <td className="p-[10px] text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          p.status === "active" ? "bg-rose-600 text-white" : "bg-slate-400 text-white"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-[10px] text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          title="Edit"
                          className="w-7 h-7 rounded-lg border-[1.5px] border-[#cbd5e1] dark:border-[#334155] bg-white dark:bg-slate-800 text-purple-600 hover:bg-purple-50 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          title="Delete"
                          className="w-7 h-7 rounded-lg border-[1.5px] border-[#cbd5e1] dark:border-[#334155] bg-white dark:bg-slate-800 text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View Card List (< 768px, Rule 5.5) */}
        <div className="block md:hidden p-3 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">Loading products...</div>
          ) : displayedProducts.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">No products found.</div>
          ) : (
            displayedProducts.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] p-3.5 bg-white dark:bg-slate-800/60 shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5">
                    <span>{p.product_name}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-50 text-rose-700">
                    Stock: {p.quantity} {p.unit}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mb-1">
                  {p.category} &bull; {p.brand} &bull; Code: {p.primary_code}
                </p>

                {(p.tile_size || p.grade || p.sqft_per_box) && (
                  <div className="flex flex-wrap items-center gap-1 mb-2">
                    {p.tile_size && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                        📐 {p.tile_size}
                      </span>
                    )}
                    {p.sqft_per_box && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        📦 {p.sqft_per_box} Sft/Box
                      </span>
                    )}
                    {p.grade && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        ★ {p.grade}
                      </span>
                    )}
                  </div>
                )}

                {/* 2-Column Financial Grid (Strict Rule 8.5) */}
                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 dark:border-slate-700/60 pt-2.5 mt-2">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80">
                    <span className="text-slate-400 text-[11px]">Cost:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formatBdCurrency(p.cost_price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80">
                    <span className="text-slate-400 text-[11px]">Sell:</span>
                    <span className="font-bold text-rose-700">
                      {formatBdCurrency(p.sell_price)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="px-3 py-1 rounded-lg border border-purple-200 text-purple-600 text-xs font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 rounded-lg border border-rose-200 text-rose-600 text-xs font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal (Strict Rule 6.1 - 6.4) */}
      {modalOpen && (() => {
        const selectedCategory = categories.find((c) => String(c.id) === String(formData.category_id));
        const isTilesCategory = Boolean(
          selectedCategory?.category_name &&
          (selectedCategory.category_name.toLowerCase().includes("tile") ||
           selectedCategory.category_name.toLowerCase().includes("টাইল"))
        );

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4">
            {/* Unified Container: border-radius: 16px, max-height 92vh, max-w-4xl for spacious view */}
            <div className="w-full max-w-3xl sm:max-w-4xl bg-white dark:bg-slate-900 rounded-[16px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
              {/* Sticky Header: Cool Crimson / Ruby Red Gradient, Circular Red Close #dc2626 */}
              <div className="modal-header-brand bg-gradient-to-r from-[#881337] via-[#991b1b] to-[#b91c1c] px-6 py-4 flex items-center justify-between shrink-0 shadow-xs">
                <h3 className="text-base font-bold text-white tracking-tight m-0">
                  {editingProduct ? "Edit Product Details" : "Add New Product Item"}
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-[28px] h-[28px] rounded-full bg-[#dc2626] hover:bg-red-700 text-white flex items-center justify-center shadow-xs cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form wrapping scrollable body and fixed footer cleanly */}
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Scrollable Body: scrollbar stops cleanly above footer */}
                <div className="flex-1 min-h-0 overflow-y-auto p-5 sm:p-6 space-y-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  {/* Product Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.product_name}
                      onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                      placeholder="e.g. Fresh Ceramics 60x60 Floor Tiles"
                      className="w-full h-[42px] px-3.5 rounded-xl bg-white dark:bg-slate-800/90 text-xs text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600"
                    />
                  </div>

                  {/* Category & Brand Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Category *
                      </label>
                      <CustomSelect
                        options={categories.map((c) => ({ value: c.id, label: c.category_name || "" }))}
                        value={formData.category_id}
                        onChange={(val) => {
                          const newCatId = String(val);
                          const catObj = categories.find((c) => String(c.id) === newCatId);
                          const isTile = Boolean(
                            catObj?.category_name &&
                            (catObj.category_name.toLowerCase().includes("tile") ||
                             catObj.category_name.toLowerCase().includes("টাইল"))
                          );

                          let newUnitId = formData.unit_id;
                          if (isTile && !newUnitId) {
                            const boxUnit = units.find((u) => u.unit_name?.toLowerCase() === "box");
                            if (boxUnit) newUnitId = String(boxUnit.id);
                          }

                          setFormData({
                            ...formData,
                            category_id: newCatId,
                            unit_id: newUnitId,
                          });
                        }}
                        placeholder="Select Category"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Brand *
                      </label>
                      <CustomSelect
                        options={brands.map((b) => ({ value: b.id, label: b.name || "" }))}
                        value={formData.brand_id}
                        onChange={(val) => setFormData({ ...formData, brand_id: String(val) })}
                        placeholder="Select Brand"
                      />
                    </div>
                  </div>

                  {/* Prices & Stock */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Cost Price (৳)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.cost_price}
                        onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
                        placeholder="0.00"
                        className="w-full h-[42px] px-3.5 rounded-xl bg-white dark:bg-slate-800/90 text-xs text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Selling Price (৳) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.sell_price}
                        onChange={(e) => setFormData({ ...formData, sell_price: e.target.value })}
                        placeholder="0.00"
                        className="w-full h-[42px] px-3.5 rounded-xl bg-white dark:bg-slate-800/90 text-xs text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Initial Stock Qty
                      </label>
                      <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="0"
                        className="w-full h-[42px] px-3.5 rounded-xl bg-white dark:bg-slate-800/90 text-xs text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600"
                      />
                    </div>
                  </div>

                  {/* Unit & Barcode */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Unit of Measurement
                      </label>
                      <CustomSelect
                        options={units.map((u) => ({ value: u.id, label: u.unit_name || "" }))}
                        value={formData.unit_id}
                        onChange={(val) => setFormData({ ...formData, unit_id: String(val) })}
                        placeholder="Select Unit"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Product Code / Barcodes
                      </label>
                      <div className="relative">
                        <Barcode className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          value={formData.product_code}
                          onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                          placeholder="e.g. PRD-0001, 8934521093"
                          className="w-full h-[42px] pl-9 pr-3 rounded-xl bg-white dark:bg-slate-800/90 text-xs text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Separate multiple barcodes with commas. Leave blank to auto-generate.
                      </p>
                    </div>
                  </div>

                  {/* Tiles Specifications & Packaging Section - STRICTLY VISIBLE ONLY FOR TILES */}
                  {isTilesCategory && (
                    <div className="border border-rose-200 dark:border-rose-950/70 rounded-2xl p-4 bg-gradient-to-br from-rose-50/50 via-white to-slate-50/50 dark:from-rose-950/20 dark:via-slate-900 dark:to-slate-900/60 space-y-3.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                            <Layers className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-800 dark:text-white leading-tight">
                              Tiles Specifications & Packaging Calculator
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              For Tiles items: Size, Box to Sq.Ft conversion, Grade & Surface Finish
                            </p>
                          </div>
                        </div>
                        {formData.tile_size && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                            Tiles Mode Active
                          </span>
                        )}
                      </div>

                      {/* Popular Size Pills */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                          Tile Dimensions / Size (Quick Pick)
                        </label>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {POPULAR_TILE_SIZES.map((size) => (
                            <button
                              key={size.value}
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  tile_size: size.value,
                                  sqft_per_box: size.defaultSqftPerBox ? String(size.defaultSqftPerBox) : formData.sqft_per_box,
                                  pcs_per_box: size.defaultPcsPerBox ? String(size.defaultPcsPerBox) : formData.pcs_per_box,
                                });
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                                formData.tile_size === size.value
                                  ? "bg-rose-600 text-white border-rose-700 shadow-xs"
                                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#cbd5e1] dark:border-[#334155] hover:border-rose-400"
                              }`}
                            >
                              {size.label}
                            </button>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={formData.tile_size}
                          onChange={(e) => setFormData({ ...formData, tile_size: e.target.value })}
                          placeholder="Or enter custom size (e.g. 24x24 or 60x60 cm)"
                          className="w-full h-[38px] px-3 rounded-xl bg-white dark:bg-slate-800/90 text-xs text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600 font-medium"
                        />
                      </div>

                      {/* Box Packaging & Conversion Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Sq.Ft per Box (বক্সে মোট স্কয়ার ফিট)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.sqft_per_box}
                            onChange={(e) => setFormData({ ...formData, sqft_per_box: e.target.value })}
                            placeholder="e.g. 16.0 or 14.4"
                            className="w-full h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-800/90 text-xs font-bold text-rose-700 dark:text-rose-400 border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600"
                          />
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Required for live POS Box ⇄ Sq.Ft billing conversion.
                          </p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Pieces per Box (বক্সে মোট পিস)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formData.pcs_per_box}
                            onChange={(e) => setFormData({ ...formData, pcs_per_box: e.target.value })}
                            placeholder="e.g. 4 or 6"
                            className="w-full h-[40px] px-3.5 rounded-xl bg-white dark:bg-slate-800/90 text-xs font-bold text-slate-800 dark:text-white border-[1.5px] border-[#cbd5e1] dark:border-[#334155] focus:outline-none focus:border-rose-600"
                          />
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Useful for loose piece calculations.
                          </p>
                        </div>
                      </div>

                      {/* Grade & Surface Finish */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Tiles Grade / Quality
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {TILE_GRADES.map((g) => (
                              <button
                                key={g.value}
                                type="button"
                                onClick={() => setFormData({ ...formData, grade: formData.grade === g.value ? "" : g.value })}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                                  formData.grade === g.value
                                    ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-[#cbd5e1] dark:border-[#334155] hover:border-emerald-400"
                                }`}
                              >
                                {g.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Surface Finish
                          </label>
                          <CustomSelect
                            options={SURFACE_FINISHES.map((f) => ({ value: f, label: f }))}
                            value={formData.surface_finish}
                            onChange={(val) => setFormData({ ...formData, surface_finish: String(val) })}
                            placeholder="Select Surface Finish (Optional)"
                          />
                        </div>
                      </div>

                      {/* Live Packaging Badge */}
                      {formData.sqft_per_box && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
                          <span>📦 1 Box = {formData.sqft_per_box} Sq.Ft {formData.pcs_per_box ? `(${formData.pcs_per_box} Pcs)` : ""}</span>
                          {formData.sell_price && Number(formData.sqft_per_box) > 0 && (
                            <span className="text-[11px] font-black">
                              Rate: ৳{(Number(formData.sell_price) / Number(formData.sqft_per_box)).toFixed(2)} / Sq.Ft
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Modal Footer (Rule 6.4) - Fixed at bottom outside the scroll area, zero content bleed! */}
                <div className="shrink-0 bg-slate-50 dark:bg-slate-900/95 px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 z-10 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#dc2626] hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#dc2626] hover:from-[#7f1d1d] hover:to-[#b91c1c] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-70 shadow-sm"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{editingProduct ? "Update Product" : "Save Product"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
