"use client";

import { formatBdCurrency } from "@/lib/utils";
import { Printer, X } from "lucide-react";

interface ReceiptProps {
  receiptData: {
    id?: number;
    order_no: string;
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
      grade?: string | null;
    }>;
  };
  onClose: () => void;
}

export function ThermalReceiptModal({ receiptData, onClose }: ReceiptProps) {
  function handlePrint() {
    window.print();
  }

  const grandTotal =
    receiptData.sub_total +
    receiptData.delivery_charge -
    (receiptData.discount_amount + receiptData.return_adjustment_amount);

  const totalDueWithPrevious = receiptData.due_amount + receiptData.previous_due_amount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3">
      <div className="w-full max-w-sm bg-white text-black rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col border border-slate-300 print:border-none print:shadow-none print:max-w-none print:m-0 print:p-0">
        {/* Modal Controls Header - Hidden on print */}
        <div className="print:hidden bg-[#15803d] px-4 py-3 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4" />
            <h3 className="text-sm font-bold m-0">Thermal Cash Receipt (80mm)</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-xs font-bold transition-colors cursor-pointer"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[#dc2626] hover:bg-red-700 text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-black thermal-sheet print:p-0">
          {/* Store Branding */}
          <div className="text-center pb-2 border-b border-dashed border-black">
            <h2 className="text-base font-black tracking-wider uppercase m-0 leading-tight">
              RUNA TRADERS
            </h2>
            <p className="text-[10px] text-gray-700 mt-0.5">
              Tiles, Sanitary & Fittings
            </p>
            <p className="text-[10px] text-gray-700">Hotline: 01975-703216</p>
          </div>

          {/* Invoice Meta */}
          <div className="py-2 border-b border-dashed border-black space-y-0.5 text-[11px]">
            <div className="flex justify-between">
              <span>Invoice:</span>
              <strong className="font-bold">{receiptData.order_no}</strong>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{receiptData.invoice_date}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <strong className="truncate max-w-[170px]">{receiptData.customer.customer_name}</strong>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{receiptData.customer.mobile}</span>
            </div>
            {receiptData.cashier && (
              <div className="flex justify-between text-gray-600 text-[10px]">
                <span>Cashier:</span>
                <span>{receiptData.cashier}</span>
              </div>
            )}
          </div>

          {/* Cart Items Table */}
          <div className="py-2 border-b border-dashed border-black">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-gray-300 font-bold">
                  <th className="pb-1">Item</th>
                  <th className="pb-1 text-center w-10">Qty</th>
                  <th className="pb-1 text-right w-14">Price</th>
                  <th className="pb-1 text-right w-16">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                  {receiptData.details.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1 font-medium leading-tight">
                        <div>{item.product_name}</div>
                        {(item.tile_size || item.sqft_per_box) && (
                          <div className="text-[9px] text-gray-600 font-sans">
                            {item.tile_size ? `[${item.tile_size}] ` : ""}
                            {item.sqft_per_box ? `(${(item.quantity * item.sqft_per_box).toFixed(1)} Sft)` : ""}
                          </div>
                        )}
                      </td>
                      <td className="py-1 text-center font-bold">{item.quantity}</td>
                      <td className="py-1 text-right">{item.price.toFixed(2)}</td>
                      <td className="py-1 text-right font-bold">{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown */}
          <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatBdCurrency(receiptData.sub_total)}</span>
            </div>
            {receiptData.delivery_charge > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Delivery Charge:</span>
                <span>+{formatBdCurrency(receiptData.delivery_charge)}</span>
              </div>
            )}
            {receiptData.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-800 font-bold">
                <span>Discount:</span>
                <span>-{formatBdCurrency(receiptData.discount_amount)}</span>
              </div>
            )}
            {receiptData.return_adjustment_amount > 0 && (
              <div className="flex justify-between text-amber-800 font-bold">
                <span>Return Adjustment:</span>
                <span>-{formatBdCurrency(receiptData.return_adjustment_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-black pt-1 border-t border-black">
              <span>Net Payable:</span>
              <span>{formatBdCurrency(grandTotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-800 font-bold">
              <span>Paid ({receiptData.payment_method}):</span>
              <span>{formatBdCurrency(receiptData.paid_amount)}</span>
            </div>
            <div className="flex justify-between text-rose-800 font-bold">
              <span>Current Due:</span>
              <span>{formatBdCurrency(receiptData.due_amount)}</span>
            </div>
            {receiptData.previous_due_amount > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Previous Due:</span>
                <span>{formatBdCurrency(receiptData.previous_due_amount)}</span>
              </div>
            )}
            {totalDueWithPrevious > 0 && (
              <div className="flex justify-between text-xs font-black text-rose-900 pt-1 border-t border-dotted border-gray-400">
                <span>Total Due:</span>
                <span>{formatBdCurrency(totalDueWithPrevious)}</span>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-3 text-[10px] space-y-1">
            <p className="font-bold">Thank You For Shopping With Us!</p>
            <p className="text-gray-500">Goods sold can be returned within 7 days with invoice.</p>
            <p className="text-[9px] text-gray-400 font-sans mt-2">
              Software by CodeNext IT &bull; www.codenextit.com
            </p>
          </div>
        </div>
      </div>

      {/* Media Print Style */}
      <style jsx global>{`
        @media print {
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
            width: 80mm !important;
            margin: 0 !important;
            padding: 8px !important;
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
}
