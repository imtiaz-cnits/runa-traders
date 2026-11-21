import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Primitive Skeleton block with subtle pulse animation
 */
export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/90 dark:bg-slate-800/80 ${className}`}
      {...props}
    />
  );
}

/**
 * TableSkeleton: Renders multiple skeleton table rows for <tbody>
 */
export function TableSkeleton({
  rows = 6,
  cols = 6,
  cellHeights = "h-4",
  className = "",
}: {
  rows?: number;
  cols?: number;
  cellHeights?: string;
  className?: string;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr
          key={rIdx}
          className={`border-b border-slate-100 dark:border-slate-800/60 ${className}`}
        >
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="py-3 px-3">
              <Skeleton
                className={`${cellHeights} ${
                  cIdx === 0
                    ? "w-8 mx-auto"
                    : cIdx === 1
                    ? "w-4/5"
                    : cIdx === cols - 1
                    ? "w-20 ml-auto"
                    : "w-2/3"
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/**
 * CardSkeleton: Renders cards for mobile views or grid lists
 */
export function CardSkeleton({
  count = 4,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-[#cbd5e1] dark:border-[#334155] space-y-3 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-48" />
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24 ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * KpiSkeleton: Renders KPI top metric summary boxes
 */
export function KpiSkeleton({
  count = 4,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3.5 ${className}`}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-[#cbd5e1] dark:border-[#334155] shadow-xs space-y-2.5"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="w-8 h-8 rounded-xl" />
          </div>
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * ListPageSkeleton: Full page skeleton inside the main div wrapper
 * Renders skeleton for header title & buttons, filter inputs, and table header & rows
 */
export function ListPageSkeleton({
  hasKpis = false,
  kpiCount = 4,
  actionButtons = 2,
  filterCount = 4,
  tableCols = 8,
  tableRows = 8,
}: {
  hasKpis?: boolean;
  kpiCount?: number;
  actionButtons?: number;
  filterCount?: number;
  tableCols?: number;
  tableRows?: number;
}) {
  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. Header & Action Controls Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-44 sm:w-56 rounded-lg" />
            <Skeleton className="h-3 w-28 sm:w-36 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {Array.from({ length: actionButtons }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-[38px] rounded-xl shrink-0 ${
                i === 0 && actionButtons > 2 ? "w-[38px]" : "w-24 sm:w-28"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Optional KPIs */}
      {hasKpis && <KpiSkeleton count={kpiCount} />}

      {/* 2. Controls & Filter Bar Skeleton Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] shadow-xs p-3 sm:p-4 flex flex-col xl:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto flex-1">
          <Skeleton className="h-[38px] flex-1 min-w-[200px] sm:min-w-[240px] rounded-xl" />
          {Array.from({ length: filterCount }).map((_, i) => (
            <Skeleton key={i} className="h-[38px] w-28 sm:w-36 rounded-xl shrink-0" />
          ))}
        </div>
        <div className="self-end xl:self-auto shrink-0">
          <Skeleton className="h-[38px] w-24 rounded-xl" />
        </div>
      </div>

      {/* 3. Table Card with Skeleton Header & Skeleton Rows */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] shadow-xs overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/80 border-b border-[#cbd5e1] dark:border-[#334155]">
                {Array.from({ length: tableCols }).map((_, i) => (
                  <th key={i} className="p-[10px]">
                    <Skeleton
                      className={`h-4 ${
                        i === 0
                          ? "w-8 mx-auto"
                          : i === 1
                          ? "w-32"
                          : i === tableCols - 1
                          ? "w-16 mx-auto"
                          : "w-20"
                      }`}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              <TableSkeleton rows={tableRows} cols={tableCols} />
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="block md:hidden p-3 space-y-3">
          <CardSkeleton count={4} />
        </div>
      </div>
    </div>
  );
}

/**
 * PosPageSkeleton: Complete 100vh POS full-screen skeleton
 * Matches the exact layout of the POS page: Top bar, Catalog with search, categories, product cards,
 * and Cart panel with customer, payment pills, summary lines, and bottom action buttons.
 */
export function PosPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden animate-in fade-in duration-200">
      {/* 1. Header Bar */}
      <header className="h-[52px] bg-white dark:bg-[#0f172a] border-b border-[#cbd5e1] dark:border-[#334155] px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-[34px] w-36 sm:w-44 rounded-xl" />
          <Skeleton className="hidden sm:block h-[28px] w-40 rounded-xl" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-[32px] w-36 rounded-xl" />
          <Skeleton className="h-[32px] w-20 rounded-xl" />
          <Skeleton className="h-[32px] w-8 rounded-xl" />
          <Skeleton className="h-[32px] w-8 rounded-xl" />
        </div>
      </header>

      {/* 2. Main Body Split Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Product Catalog Area */}
        <div className="flex-1 min-h-0 flex flex-col border-r border-[#cbd5e1] dark:border-[#334155] bg-slate-100/50 dark:bg-[#0b0f19]">
          {/* Search & Actions Bar */}
          <div className="p-2 sm:p-2.5 bg-white dark:bg-[#0f172a] border-b border-[#cbd5e1] dark:border-[#334155] flex items-center gap-2">
            <Skeleton className="h-[38px] flex-1 rounded-xl" />
            <Skeleton className="h-[38px] w-28 rounded-xl shrink-0" />
            <Skeleton className="h-[38px] w-24 rounded-xl shrink-0" />
            <Skeleton className="h-[38px] w-24 rounded-xl shrink-0" />
          </div>

          {/* Category Tabs Bar */}
          <div className="w-full px-2 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 shrink-0 bg-slate-50/60 dark:bg-slate-900/40">
            <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
            <div className="flex-1 flex items-center gap-2 overflow-hidden">
              <Skeleton className="h-[28px] w-28 rounded-lg shrink-0" />
              <Skeleton className="h-[28px] w-24 rounded-lg shrink-0" />
              <Skeleton className="h-[28px] w-20 rounded-lg shrink-0" />
              <Skeleton className="h-[28px] w-24 rounded-lg shrink-0" />
              <Skeleton className="h-[28px] w-28 rounded-lg shrink-0" />
              <Skeleton className="h-[28px] w-20 rounded-lg shrink-0" />
            </div>
            <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
          </div>

          {/* Product Cards Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3.5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b] min-h-[148px] flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Cart, Payment & Summary Area */}
        <div className="w-full lg:w-[480px] xl:w-[520px] 2xl:w-[560px] flex flex-col bg-white dark:bg-[#0f172a] shrink-0 border-t lg:border-t-0 border-[#cbd5e1] dark:border-[#334155]">
          {/* Customer & Date Selection */}
          <div className="p-2 sm:p-2.5 border-b border-[#cbd5e1] dark:border-[#334155] flex items-center gap-2 bg-slate-50/50 dark:bg-slate-900/40">
            <Skeleton className="h-[38px] flex-1 rounded-xl" />
            <Skeleton className="h-[38px] w-16 rounded-xl shrink-0" />
            <Skeleton className="h-[38px] w-28 rounded-xl shrink-0" />
          </div>

          {/* Cart Items Area */}
          <div className="flex-1 min-h-[120px] p-3 flex flex-col justify-center items-center gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-56" />
          </div>

          {/* Payment & Financial Section */}
          <div className="p-3 border-t border-[#cbd5e1] dark:border-[#334155] space-y-2.5 bg-slate-50/40 dark:bg-slate-900/30">
            {/* Payment Method Pills */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-12" />
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[32px] rounded-lg" />
              ))}
            </div>

            {/* Note input */}
            <Skeleton className="h-[32px] w-full rounded-xl" />

            {/* Financial Rows */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3.5 w-14" />
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-800">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>

            {/* Bottom Actions Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <Skeleton className="h-[42px] rounded-xl" />
              <Skeleton className="h-[42px] rounded-xl" />
              <Skeleton className="h-[42px] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * DashboardSkeleton: Complete Dashboard Overview Page Skeleton
 * Matches the exact Overview Dashboard layout: Top Header banner, Primary 4 KPIs,
 * Secondary 4 Financial Metrics, 3 Bottom Catalog/Party cards, and Recent Orders.
 */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
      {/* 1. Top Header Banner Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] px-4 py-3.5 sm:px-5 sm:py-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-44 rounded-lg" />
            <Skeleton className="h-3 w-64 rounded-md" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-[38px] w-[148px] rounded-xl shrink-0" />
          <Skeleton className="h-[38px] w-[38px] rounded-xl shrink-0" />
          <Skeleton className="h-[38px] w-32 rounded-xl shrink-0" />
          <Skeleton className="h-[38px] w-28 rounded-xl shrink-0" />
        </div>
      </div>

      {/* 2. Primary 4 KPIs Grid (Income, Cash Collection, Expense, Profit) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-[1.5px] border-[#cbd5e1] dark:border-[#334155] shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="w-8 h-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>

      {/* 3. Secondary 4 Metrics Grid (Receivable Due, Payable Due, Return, Discount) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-[1.5px] border-[#cbd5e1] dark:border-[#334155] shadow-xs space-y-2"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-lg" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-6 w-28" />
          </div>
        ))}
      </div>

      {/* 4. Bottom 3 Overview Cards (Total Products, Total Customers, Total Suppliers) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-[1.5px] border-[#cbd5e1] dark:border-[#334155] shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="w-9 h-9 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-2.5 w-28" />
                </div>
              </div>
              <Skeleton className="h-7 w-12" />
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
