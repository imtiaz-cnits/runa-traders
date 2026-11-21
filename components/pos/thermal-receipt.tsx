"use client";

import { formatBdCurrency } from "@/lib/utils";
import { formatTileOrItemQty } from "@/lib/tiles-calculator";
import { Printer, X, Truck, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { FreshWatermark } from "@/components/common/fresh-watermark";

interface ReceiptProps {
  receiptData: {
    id?: number;
    order_no: string;
    has_tiles?: boolean;
    challan_status?: string;
    invoice_date: string;
    customer: {
      customer_name: string;
      mobile: string;
      address_details?: string;
    };
    cashier?: string;
    sub_total: number;
    discount_amount: number;
    delivery_charge: number;
    return_adjustment_amount: number;
    paid_amount: number;
    due_amount: number;
    previous_due_amount: number;
    payment_method: string;
    transaction_id?: string | null;
    order_note?: string | null;
    details: Array<{
      product_name: string;
      quantity: number;
      price: number;
      total: number;
      tile_size?: string | null;
      sqft_per_box?: number | null;
      pcs_per_box?: number | null;
      grade?: string | null;
      category?: string | null;
      unit?: string | null;
    }>;
  };
  onClose: () => void;
  onOpenChallan?: (orderId: number) => void;
}

export function ThermalReceiptModal({ receiptData, onClose, onOpenChallan }: ReceiptProps) {
  function handlePrint() {
    window.print();
  }

  const grandTotal =
    receiptData.sub_total +
    receiptData.delivery_charge -
    (receiptData.discount_amount + receiptData.return_adjustment_amount);

  const totalDueWithPrevious = receiptData.due_amount + receiptData.previous_due_amount;

  // Strict check: Only show Challan action if invoice contains Tiles items
  const hasTiles =
    receiptData.has_tiles === true
      ? true
      : receiptData.has_tiles === false
      ? false
      : Boolean(
          (receiptData.challan_status && receiptData.challan_status !== "NOT_REQUIRED") ||
          receiptData.details?.some(
            (d) =>
              Boolean(d.tile_size) ||
              Boolean(d.sqft_per_box) ||
              (d.product_name && d.product_name.toLowerCase().includes("tile")) ||
              (d.category && d.category.toLowerCase().includes("tile"))
          )
        );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      {/* Modal Container: Wider modal (max-w-2xl) per user instruction */}
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col border border-slate-300 print:border-none print:shadow-none print:max-w-none print:m-0 print:p-0">
        {/* Modal Controls Header - Hidden on print */}
        <div className="print:hidden bg-gradient-to-r from-[#991b1b] to-[#dc2626] px-3.5 py-2.5 sm:px-5 sm:py-3.5 flex items-center justify-between text-white shrink-0 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold m-0 leading-tight truncate">
                Cash Sales Receipt / ইনভয়েস
              </h3>
              <p className="text-[9.5px] sm:text-[11px] text-rose-100/80 leading-none mt-0.5 truncate">
                Invoice No: {receiptData.order_no}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {receiptData.id && onOpenChallan && hasTiles && (
              <button
                onClick={() => onOpenChallan(receiptData.id!)}
                className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] sm:text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 sm:gap-1.5 shadow-2xs whitespace-nowrap"
                title="Generate Delivery Challan for Tiles"
              >
                <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Challan</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-white text-rose-900 hover:bg-rose-50 text-[11px] sm:text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 sm:gap-1.5 shadow-xs whitespace-nowrap"
            >
              <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Print A4</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-red-700 hover:bg-red-800 text-white flex items-center justify-center cursor-pointer transition-colors shadow-2xs shrink-0"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Printable Cash Receipt Container (Full Width A4) */}
        <div id="printable-invoice" className="relative flex-1 overflow-y-auto p-3 sm:p-6 sm:p-8 font-sans text-xs text-slate-800 thermal-sheet print:p-0">
          {/* Fresh Ceramics Watermark centered in width & height */}
          <FreshWatermark />

          <div className="relative z-10 space-y-3 sm:space-y-4">
          {/* Store Branding Header (Matching Standard Invoice Header) */}
          <div className="flex flex-col sm:flex-row print:flex-row justify-between items-center sm:items-start print:items-start gap-2 sm:gap-2 print:gap-0 pb-2 border-b-2 border-slate-900">
            {/* Brand Logo & Name */}
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 print:w-8 print:h-8 rounded-lg border-2 border-black flex items-center justify-center font-black text-base sm:text-lg print:text-base text-[#991b1b] bg-white shrink-0 shadow-xs">
                RT
              </div>
              <div className="flex flex-col text-left">
                <h1 className="text-base sm:text-xl print:text-xl font-black tracking-wide text-rose-900 m-0 leading-tight">
                  RUNA TRADERS
                </h1>
                <div className="text-[9.5px] sm:text-[10.5px] print:text-[10px] font-bold text-slate-700 border-t border-slate-900 pt-0.5 mt-0.5 leading-tight">
                  All Kinds of Tiles, Sanitary &<br />Fittings Supplier
                </div>
              </div>
            </div>

            {/* Middle Badge */}
            <div className="self-center">
              <span className="px-3 py-0.5 rounded bg-[#991b1b] text-white font-serif font-black text-xs sm:text-base print:text-base tracking-wider">
                Bill
              </span>
            </div>

            {/* Office Info */}
            <div className="text-center sm:text-right print:text-right text-[10px] sm:text-[11px] text-slate-800 leading-tight max-w-none sm:max-w-[240px]">
              <div><strong>Office:</strong> Success Super Market,</div>
              <div>Sadar Police Fari, Ataikula Road, Pabna.</div>
              <div><strong>Mobile:</strong> 01711-968720</div>
              <div><strong>E-mail:</strong> runatraders2018@gmail.com</div>
            </div>
          </div>

          {/* Invoice & Customer Meta Grid (Compact on mobile) */}
          <div className="bg-slate-50/70 print:bg-transparent p-2.5 sm:p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 sm:gap-4 text-[10.5px] sm:text-xs">
            <div className="space-y-0.5 sm:space-y-1 min-w-0">
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Customer Information
              </div>
              <p className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                {receiptData.customer.customer_name}
              </p>
              {receiptData.customer.mobile && (
                <div className="flex items-center gap-1 text-slate-600 text-[10px] sm:text-xs">
                  <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{receiptData.customer.mobile}</span>
                </div>
              )}
              {receiptData.customer.address_details && (
                <div className="flex items-start gap-1 text-slate-500 text-[9.5px] sm:text-xs leading-tight">
                  <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{receiptData.customer.address_details}</span>
                </div>
              )}
            </div>

            <div className="space-y-0.5 sm:space-y-1 text-right sm:text-left sm:pl-4 sm:border-l border-slate-200 text-[10px] sm:text-xs min-w-0">
              <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Invoice Details
              </div>
              <div className="flex items-baseline justify-end sm:justify-between gap-1 leading-tight">
                <span className="text-slate-500 text-[9px] sm:text-xs shrink-0">Invoice:</span>
                <strong className="font-mono font-bold text-rose-900 text-[10px] sm:text-xs truncate">{receiptData.order_no}</strong>
              </div>
              <div className="flex items-baseline justify-end sm:justify-between gap-1 leading-tight">
                <span className="text-slate-500 text-[9px] sm:text-xs shrink-0">Date:</span>
                <span className="font-medium text-[10px] sm:text-xs">{receiptData.invoice_date}</span>
              </div>
              <div className="flex items-baseline justify-end sm:justify-between gap-1 leading-tight">
                <span className="text-slate-500 text-[9px] sm:text-xs shrink-0">Payment:</span>
                <span className="font-bold uppercase text-slate-800 text-[10px] sm:text-xs">{receiptData.payment_method}</span>
              </div>
              {receiptData.cashier && (
                <div className="flex items-baseline justify-end sm:justify-between gap-1 text-slate-500 text-[9px] sm:text-[11px] leading-tight">
                  <span className="shrink-0">By:</span>
                  <span className="truncate max-w-[90px] sm:max-w-none">{receiptData.cashier}</span>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table (Compact padding & typography on mobile) */}
          <div className="py-2 sm:py-3">
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-[10.5px] sm:text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[9.5px] sm:text-[11px]">
                    <th className="py-1.5 px-1.5 sm:py-2.5 sm:px-3 w-7 sm:w-10 text-center">#</th>
                    <th className="py-1.5 px-2 sm:py-2.5 sm:px-3">Item Description</th>
                    <th className="py-1.5 px-1.5 sm:py-2.5 sm:px-3 text-center">Specs / Size</th>
                    <th className="py-1.5 px-1.5 sm:py-2.5 sm:px-3 text-center w-14 sm:w-16">Qty</th>
                    <th className="py-1.5 px-2 sm:py-2.5 sm:px-3 text-right w-18 sm:w-24">Rate (৳)</th>
                    <th className="py-1.5 px-2 sm:py-2.5 sm:px-3 text-right w-20 sm:w-28">Total (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {receiptData.details.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-1.5 px-1.5 sm:py-2 sm:px-3 text-center text-slate-500 font-mono text-[9.5px] sm:text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-1.5 px-2 sm:py-2 sm:px-3 font-semibold text-slate-900 leading-tight">
                        {item.product_name}
                      </td>
                      <td className="py-1.5 px-1.5 sm:py-2 sm:px-3 text-center text-slate-600 text-[9.5px] sm:text-[11px] leading-tight">
                        <span>{item.tile_size ? `Size: ${item.tile_size}` : "-"}</span>
                        {item.sqft_per_box ? (
                          <span className="text-slate-400 font-normal"> ({((Number(item.quantity) || 0) * (Number(item.sqft_per_box) || 0)).toFixed(1)} Sft)</span>
                        ) : null}
                        {item.grade ? (
                          <span className="text-amber-700 font-semibold"> [★{item.grade}]</span>
                        ) : null}
                      </td>
                      <td className="py-1.5 px-1.5 sm:py-2 sm:px-3 text-center font-bold font-mono whitespace-nowrap text-slate-900 text-[10px] sm:text-xs">
                        {formatTileOrItemQty(item.quantity, item)}
                      </td>
                      <td className="py-1.5 px-2 sm:py-2 sm:px-3 text-right font-mono text-[10px] sm:text-xs">
                        {item.price.toFixed(2)}
                      </td>
                      <td className="py-1.5 px-2 sm:py-2 sm:px-3 text-right font-bold font-mono text-slate-900 text-[10.5px] sm:text-xs">
                        {item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Notes / Terms */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
              <span className="font-bold text-slate-700">Terms & Conditions:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                <li>Please preserve this invoice for all warranty claims and returns.</li>
                <li>Sold items may be exchanged within 7 days in original packed condition.</li>
                {receiptData.order_note && (
                  <li className="font-semibold text-slate-900">Note: {receiptData.order_note}</li>
                )}
                {receiptData.transaction_id && (
                  <li className="font-mono text-slate-900">Trx ID: {receiptData.transaction_id}</li>
                )}
              </ul>
            </div>

            {/* Calculations Box */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold text-slate-900">{formatBdCurrency(receiptData.sub_total)}</span>
              </div>
              {receiptData.delivery_charge > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charge:</span>
                  <span className="font-mono">+{formatBdCurrency(receiptData.delivery_charge)}</span>
                </div>
              )}
              {receiptData.discount_amount > 0 && (
                <div className="flex justify-between text-rose-700 font-bold">
                  <span>Discount:</span>
                  <span className="font-mono">-{formatBdCurrency(receiptData.discount_amount)}</span>
                </div>
              )}
              {receiptData.return_adjustment_amount > 0 && (
                <div className="flex justify-between text-amber-800 font-bold">
                  <span>Exchange / Adjustment:</span>
                  <span className="font-mono">-{formatBdCurrency(receiptData.return_adjustment_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black pt-1.5 border-t border-slate-300 text-rose-950">
                <span>Net Payable:</span>
                <span className="font-mono text-rose-900">{formatBdCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-800 font-bold">
                <span>Paid ({receiptData.payment_method}):</span>
                <span className="font-mono">{formatBdCurrency(receiptData.paid_amount)}</span>
              </div>
              <div className="flex justify-between text-rose-800 font-bold">
                <span>Current Due:</span>
                <span className="font-mono">{formatBdCurrency(receiptData.due_amount)}</span>
              </div>
              {receiptData.previous_due_amount > 0 && (
                <div className="flex justify-between text-slate-500 pt-0.5 border-t border-dashed border-slate-200 text-[11px]">
                  <span>Previous Balance Due:</span>
                  <span className="font-mono font-medium">{formatBdCurrency(receiptData.previous_due_amount)}</span>
                </div>
              )}
              {totalDueWithPrevious > 0 && (
                <div className="flex justify-between text-xs font-black text-rose-900 pt-1 border-t-2 border-rose-300">
                  <span>Total Outstanding Due:</span>
                  <span className="font-mono">{formatBdCurrency(totalDueWithPrevious)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Signature Protocols */}
          <div className="pt-10 grid grid-cols-2 gap-8 text-center text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
            <div>
              <div className="border-t border-slate-400 pt-1.5 w-3/4 mx-auto font-bold text-slate-800">
                Customer Signature
              </div>
            </div>
            <div>
              <div className="border-t border-slate-400 pt-1.5 w-3/4 mx-auto font-bold text-slate-800">
                Authorized Signature / Cashier
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="text-center pt-5 text-[10px] text-slate-400 border-t border-slate-200 mt-4">
            Thank you for shopping with Runa Traders &bull; Software by: CodeNext IT
          </div>
          </div>
        </div>
      </div>

      {/* Media Print Style - Full Width A4 with 10px padding */}
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
          /* If challan is being printed, hide invoice completely */
          body:has(#printable-challan) .thermal-sheet,
          body:has(#printable-challan) #printable-invoice {
            display: none !important;
            visibility: hidden !important;
          }
          body * {
            visibility: hidden;
          }
          .thermal-sheet,
          .thermal-sheet * {
            visibility: visible;
          }
          .thermal-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10px !important;
            background: white !important;
            color: black !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </div>
  );
}
