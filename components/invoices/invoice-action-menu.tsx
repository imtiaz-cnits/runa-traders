"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  Eye,
  Printer,
  Truck,
  RotateCcw,
  Wallet,
  Ban,
} from "lucide-react";
import { useRouter } from "next/navigation";

export interface InvoiceActionDetail {
  id: number;
  product_name: string;
  product_code?: string;
  tile_size?: string | null;
  sqft_per_box?: number | null;
  pcs_per_box?: number | null;
  grade?: string | null;
  category?: string | null;
  quantity: number;
  selling_price: number;
  unit: string;
  line_total: number;
  is_tiles?: boolean;
}

export interface InvoiceActionData {
  id: number;
  order_no: string;
  customer_name: string;
  customer_mobile: string;
  net_payable: number;
  paid_amount: number;
  due_amount: number;
  challan_status?: string;
  has_pending_tiles?: boolean;
  has_tiles?: boolean;
  has_challan?: boolean;
  challan_id?: number | null;
  challan_no?: string | null;
  details: InvoiceActionDetail[];
}

interface InvoiceActionMenuProps<T = any> {
  invoice: T;
  onPrintReceipt: (invoice: T) => void;
  onOpenChallan: (invoice: T) => void;
  onCollectDue: (invoice: T) => void;
  onCancelTiles?: (invoice: T) => void;
}

export function InvoiceActionMenu<T extends Record<string, any>>({
  invoice,
  onPrintReceipt,
  onOpenChallan,
  onCollectDue,
  onCancelTiles,
}: InvoiceActionMenuProps<T>) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: "bottom" | "top";
  }>({
    top: 0,
    left: 0,
    placement: "bottom",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if invoice has any tiles product items
  const hasTilesProducts = Boolean(
    Array.isArray(invoice.details) &&
      invoice.details.some((d) => {
        if (typeof d.is_tiles === "boolean") return d.is_tiles;
        return Boolean(
          d.tile_size ||
            d.sqft_per_box ||
            (d.pcs_per_box && d.pcs_per_box > 0) ||
            (d.product_name && d.product_name.toLowerCase().includes("tile")) ||
            (d.category && d.category.toLowerCase().includes("tile"))
        );
      })
  );

  const hasChallanEligible = Boolean(
    invoice.has_tiles ||
      invoice.has_pending_tiles ||
      invoice.has_challan ||
      (invoice.challan_status &&
        invoice.challan_status !== "NOT_REQUIRED" &&
        invoice.challan_status !== "CANCELLED")
  );

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuWidth = 195;
    const estimatedHeight = 185;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate left: align to right of trigger, keep within screen
    let left = rect.right - menuWidth;
    if (left < 8) left = 8;
    if (left + menuWidth > viewportWidth - 8) {
      left = viewportWidth - menuWidth - 8;
    }

    // Vertical placement
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    let placement: "bottom" | "top" = "bottom";
    let top = rect.bottom + 4;

    if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
      placement = "top";
      top = rect.top - estimatedHeight - 4;
    }

    setCoords({ top, left, placement });
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleScrollOrResize = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      if (
        rect.bottom < 0 ||
        rect.top > window.innerHeight ||
        rect.right < 0 ||
        rect.left > window.innerWidth
      ) {
        setIsOpen(false);
        return;
      }
      updatePosition();
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleAction = (callback: () => void) => {
    setIsOpen(false);
    callback();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!isOpen) {
            updatePosition();
          }
          setIsOpen(!isOpen);
        }}
        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
          isOpen
            ? "bg-rose-50 border-rose-400 text-rose-700 dark:bg-rose-950/40 dark:border-rose-700 dark:text-rose-300 shadow-xs"
            : "bg-slate-100 hover:bg-rose-50/50 hover:border-rose-500 hover:text-rose-600 border-[#cbd5e1] text-slate-700 dark:bg-[#1e293b] dark:border-[#334155] dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:border-rose-500 dark:hover:text-rose-400"
        }`}
        title="Actions Menu"
        aria-label="Actions Menu"
        aria-expanded={isOpen}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen &&
        mounted &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: "195px",
              zIndex: 9999,
            }}
            className="bg-white dark:bg-[#0f172a] border border-[#cbd5e1] dark:border-[#334155] rounded-xl shadow-xl p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-100 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Invoice order no tag (Compact single line) */}
            <div className="px-2 py-1 border-b border-slate-100 dark:border-slate-800/80 mb-0.5 flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Actions
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                {invoice.order_no}
              </span>
            </div>

            {/* 1. View Invoice Bill */}
            <button
              type="button"
              onClick={() => handleAction(() => router.push(`/invoices/${invoice.id}`))}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Eye className="w-3 h-3" />
              </div>
              <span className="flex-1">View Bill</span>
            </button>

            {/* 2. Print Thermal Cash Receipt */}
            <button
              type="button"
              onClick={() => handleAction(() => onPrintReceipt(invoice))}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Printer className="w-3 h-3" />
              </div>
              <span className="flex-1">Print Receipt</span>
            </button>

            {/* 3. Delivery Challan (Only if invoice has tiles/challan) */}
            {hasChallanEligible && (
              <button
                type="button"
                onClick={() => handleAction(() => onOpenChallan(invoice))}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                    invoice.has_pending_tiles
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 animate-pulse"
                      : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                  }`}
                >
                  <Truck className="w-3 h-3" />
                </div>
                <span className="flex-1 truncate">
                  {invoice.has_challan
                    ? "View Challan"
                    : invoice.has_pending_tiles
                    ? "Dispatch Challan"
                    : "Delivery Challan"}
                </span>
                {invoice.challan_no && (
                  <span className="text-[9px] text-slate-400 font-mono">
                    #{invoice.challan_no.replace(/^CHL-/, "")}
                  </span>
                )}
              </button>
            )}

            {/* 4. Sales Return */}
            <button
              type="button"
              onClick={() =>
                handleAction(() =>
                  router.push(
                    `/returns?tab=sales&order_no=${encodeURIComponent(invoice.order_no)}`
                  )
                )
              }
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
            >
              <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <RotateCcw className="w-3 h-3" />
              </div>
              <span className="flex-1">Sales Return</span>
            </button>

            {/* 5. Collect Due Payment (If Due > 0) */}
            {invoice.due_amount > 0 && (
              <button
                type="button"
                onClick={() => handleAction(() => onCollectDue(invoice))}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors text-left cursor-pointer"
              >
                <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <Wallet className="w-3 h-3" />
                </div>
                <span className="flex-1">Collect Due</span>
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                  ৳{invoice.due_amount.toLocaleString("en-IN")}
                </span>
              </button>
            )}

            {/* 6. Cancel Tiles Items - STRICTLY ONLY IF INVOICE HAS TILES PRODUCTS */}
            {hasTilesProducts && onCancelTiles && (
              <div className="pt-0.5 mt-0.5 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handleAction(() => onCancelTiles(invoice))}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Ban className="w-3 h-3" />
                  </div>
                  <span className="flex-1">Cancel Tiles</span>
                </button>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
