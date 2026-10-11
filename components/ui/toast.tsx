"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, title?: string, duration?: number) => void;
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", title?: string, duration = 3500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, message, type, title };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: (message: string, title?: string, duration?: number) =>
      showToast(message, "success", title, duration),
    error: (message: string, title?: string, duration?: number) =>
      showToast(message, "error", title, duration),
    info: (message: string, title?: string, duration?: number) =>
      showToast(message, "info", title, duration),
  };

  return (
    <ToastContext.Provider value={{ showToast, toast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2 sm:p-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
              t.type === "success"
                ? "bg-white/95 dark:bg-slate-900/95 border-emerald-500/30 text-slate-800 dark:text-slate-100 shadow-emerald-500/10"
                : t.type === "error"
                ? "bg-white/95 dark:bg-slate-900/95 border-rose-500/30 text-slate-800 dark:text-slate-100 shadow-rose-500/10"
                : "bg-white/95 dark:bg-slate-900/95 border-sky-500/30 text-slate-800 dark:text-slate-100 shadow-sky-500/10"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                t.type === "success"
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                  : t.type === "error"
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                  : "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400"
              }`}
            >
              {t.type === "success" && <CheckCircle2 className="w-4 h-4" />}
              {t.type === "error" && <AlertCircle className="w-4 h-4" />}
              {t.type === "info" && <Info className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              {t.title && (
                <h5 className="text-xs font-bold tracking-tight mb-0.5 text-slate-900 dark:text-white">
                  {t.title}
                </h5>
              )}
              <p className="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-200">
                {t.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
