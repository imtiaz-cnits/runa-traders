"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Layers,
  Tag,
  Boxes,
  Truck,
  Users,
  Receipt,
  RotateCcw,
  Wallet,
  FileSpreadsheet,
  Shield,
  Barcode,
  ChevronDown,
  X,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isProductActive = pathname.startsWith("/products") || pathname.startsWith("/categories") || pathname.startsWith("/brands") || pathname.startsWith("/units") || pathname.startsWith("/inventory") || pathname.startsWith("/barcode");
  const isPurchaseActive = pathname.startsWith("/purchase") || pathname.startsWith("/supplier");
  const isSalesActive = pathname.startsWith("/invoices") || pathname.startsWith("/customer-dues") || pathname.startsWith("/returns") || pathname.startsWith("/challans");
  const isExpenseActive = pathname.startsWith("/expense") || pathname.startsWith("/staff");
  const isReportActive = pathname.startsWith("/report");

  const [productOpen, setProductOpen] = useState(true);
  const [purchaseOpen, setPurchaseOpen] = useState(isPurchaseActive);
  const [salesOpen, setSalesOpen] = useState(isSalesActive);
  const [expenseOpen, setExpenseOpen] = useState(isExpenseActive);
  const [reportOpen, setReportOpen] = useState(isReportActive);

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-[215px] bg-gradient-to-b from-[#7f1d1d] via-[#991b1b] to-[#881337] text-white flex flex-col transition-transform duration-200 ease-in-out border-r border-white/10 shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-[60px] px-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center font-black text-sm text-white shadow-sm">
              RT
            </div>
            <div>
              <h1 className="text-sm font-black tracking-wider text-white leading-none">
                RUNA TRADERS
              </h1>
              <p className="text-[10px] text-rose-200/80 tracking-tight mt-0.5 font-medium">
                Retail Shop POS
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-rose-200 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 text-xs">
          {/* Main Dashboard */}
          <Link
            href="/dashboard"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold transition-all ${
              isActive("/dashboard")
                ? "bg-white text-rose-950 shadow-md font-bold"
                : "text-rose-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </Link>

          {/* POS Quick Button */}
          <Link
            href="/pos"
            className={`flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-all ${
              isActive("/pos")
                ? "bg-white text-rose-950 shadow-md"
                : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4" />
              <span>Point of Sale</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-white text-rose-900 font-black">
              POS
            </span>
          </Link>

          {/* Category: Product Catalog */}
          <div className="pt-2">
            <button
              onClick={() => setProductOpen(!productOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-rose-200/80 hover:text-white font-semibold rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 shrink-0" />
                <span>Inventory</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  productOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {productOpen && (
              <div className="pl-6 pr-1 space-y-0.5 mt-0.5">
                <Link
                  href="/inventory"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/inventory")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Stock Overview
                </Link>
                <Link
                  href="/products"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/products")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Product List
                </Link>
                <Link
                  href="/categories"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/categories")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Categories
                </Link>
                <Link
                  href="/brands"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/brands")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Brands
                </Link>
                <Link
                  href="/units"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/units")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Units
                </Link>
                <Link
                  href="/barcode-print"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/barcode-print")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Barcode Print
                </Link>
              </div>
            )}
          </div>

          {/* Sales & Invoicing */}
          <div>
            <button
              onClick={() => setSalesOpen(!salesOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-rose-200/80 hover:text-white font-semibold rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                <Receipt className="w-4 h-4 shrink-0" />
                <span>Sales & Invoices</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  salesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {salesOpen && (
              <div className="pl-6 pr-1 space-y-0.5 mt-0.5">
                <Link
                  href="/invoices"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/invoices")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Invoices List
                </Link>
                <Link
                  href="/challans"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/challans")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Challan List
                </Link>
                <Link
                  href="/customer-dues"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/customer-dues")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Due Collections
                </Link>
                <Link
                  href="/returns"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/returns")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Sales Return
                </Link>
              </div>
            )}
          </div>

          {/* Purchases & Suppliers */}
          <div>
            <button
              onClick={() => setPurchaseOpen(!purchaseOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-rose-200/80 hover:text-white font-semibold rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 shrink-0" />
                <span>Purchases</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  purchaseOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {purchaseOpen && (
              <div className="pl-6 pr-1 space-y-0.5 mt-0.5">
                <Link
                  href="/purchases"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/purchases")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Purchase List
                </Link>
                <Link
                  href="/suppliers"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/suppliers")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Suppliers
                </Link>
                <Link
                  href="/supplier-dues"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/supplier-dues")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Supplier Due Pay
                </Link>
              </div>
            )}
          </div>

          {/* Customers */}
          <Link
            href="/customers"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold transition-all ${
              isActive("/customers")
                ? "bg-white text-emerald-900 shadow-md font-bold"
                : "text-emerald-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Customers</span>
          </Link>

          {/* Expenses & Staff */}
          <div>
            <button
              onClick={() => setExpenseOpen(!expenseOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-rose-200/80 hover:text-white font-semibold rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="w-4 h-4 shrink-0" />
                <span>Expenses & Staff</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  expenseOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {expenseOpen && (
              <div className="pl-6 pr-1 space-y-0.5 mt-0.5">
                <Link
                  href="/expenses"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/expenses")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Daily Expenses
                </Link>
                <Link
                  href="/expense-types"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/expense-types")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Expense Categories
                </Link>
                <Link
                  href="/staff"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/staff")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Staff & Payroll
                </Link>
              </div>
            )}
          </div>

          {/* Reports */}
          <div>
            <button
              onClick={() => setReportOpen(!reportOpen)}
              className="w-full flex items-center justify-between px-3 py-2 text-rose-200/80 hover:text-white font-semibold rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                <span>Reports</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  reportOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {reportOpen && (
              <div className="pl-6 pr-1 space-y-0.5 mt-0.5">
                <Link
                  href="/reports/sales"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/reports/sales")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Sales Report
                </Link>
                <Link
                  href="/reports/daily-ledger"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/reports/daily-ledger")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Daily Ledger
                </Link>
                <Link
                  href="/reports/income-expense"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/reports/income-expense")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Income & Expense
                </Link>
                <Link
                  href="/reports/stock-out"
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors ${
                    isActive("/reports/stock-out")
                      ? "text-white font-bold bg-white/15"
                      : "text-rose-100/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Stock-Out Report
                </Link>
              </div>
            )}
          </div>

          {/* User Role Settings */}
          <Link
            href="/users"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold transition-all ${
              isActive("/users")
                ? "bg-white text-rose-950 shadow-md font-bold"
                : "text-rose-100 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>User Roles</span>
          </Link>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 text-[10px] text-rose-200/70 text-center font-medium">
          RUNA TRADERS &bull; POS v2.0
        </div>
      </aside>
    </>
  );
}
