"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

const ENGLISH_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function LiveDateTime({ compact = false }: { compact?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] bg-slate-50/70 dark:bg-slate-800/60 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-2xs">
        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="tabular-nums">-- --- ----</span>
      </div>
    );
  }

  const day = String(now.getDate()).padStart(2, "0");
  const month = ENGLISH_MONTHS[now.getMonth()];
  const year = now.getFullYear();
  const dateFormatted = `${day} ${month}, ${year}`;

  const rawHours = now.getHours();
  const rawMins = String(now.getMinutes()).padStart(2, "0");
  const rawSecs = String(now.getSeconds()).padStart(2, "0");
  const ampm = rawHours >= 12 ? "PM" : "AM";
  const displayHours = String(rawHours % 12 || 12).padStart(2, "0");
  const timeFormatted = `${displayHours}:${rawMins}:${rawSecs} ${ampm}`;
  const timeShort = `${displayHours}:${rawMins} ${ampm}`;

  return (
    <div
      title="Current Date & Time"
      className="hidden md:inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border-[1.5px] border-[#cbd5e1] dark:border-[#334155] bg-slate-50/90 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs select-none"
      style={{ fontFamily: "'Valley Sans', sans-serif" }}
    >
      <div className="flex items-center gap-1.5">
        <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="font-bold tracking-wide">{dateFormatted}</span>
      </div>

      <span className="text-slate-300 dark:text-slate-600 font-normal">|</span>

      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
        <Clock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
        <span className="font-bold tracking-wider tabular-nums font-mono text-[11px]">
          {compact ? timeShort : timeFormatted}
        </span>
      </div>
    </div>
  );
}
