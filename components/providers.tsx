"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/components/ui/toast";

function ModalScrollLock() {
  const pathname = usePathname();

  useEffect(() => {
    let originalHtmlOverflow = "";
    let originalBodyOverflow = "";
    let originalBodyPaddingRight = "";
    let isLocked = false;

    const checkModals = () => {
      // Find all fixed full-screen modal overlays
      // Excludes full-screen non-modal workspaces like POS main screen (which has class "max-w-full")
      const modalElements = document.querySelectorAll<HTMLElement>(
        'div.fixed.inset-0:where([class*="z-50"], [class*="z-["], [class*="backdrop-blur"], [role="dialog"], [aria-modal="true"]):not([class*="max-w-full"])'
      );

      let hasVisibleModal = false;
      modalElements.forEach((el) => {
        if (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0) {
          const style = window.getComputedStyle(el);
          if (style.display !== "none" && style.visibility !== "hidden") {
            hasVisibleModal = true;
          }
        }
      });

      if (hasVisibleModal && !isLocked) {
        // Lock background page scroll
        isLocked = true;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        originalHtmlOverflow = document.documentElement.style.overflow;
        originalBodyOverflow = document.body.style.overflow;
        originalBodyPaddingRight = document.body.style.paddingRight;

        document.documentElement.setAttribute("data-modal-open", "true");
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
      } else if (!hasVisibleModal && isLocked) {
        // Unlock background page scroll
        isLocked = false;
        document.documentElement.removeAttribute("data-modal-open");
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.paddingRight = originalBodyPaddingRight;
      }
    };

    // Watch for DOM changes when modals are opened or closed
    const observer = new MutationObserver(() => {
      checkModals();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "aria-hidden", "data-state", "open"],
    });

    // Check immediately on mount
    checkModals();

    // Prevent background page navigation keys when focus is on body with open modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.documentElement.getAttribute("data-modal-open") === "true") {
        if (e.target === document.body || e.target === document.documentElement) {
          if (["Space", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"].includes(e.code)) {
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", handleKeyDown);
      if (isLocked) {
        document.documentElement.removeAttribute("data-modal-open");
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.paddingRight = originalBodyPaddingRight;
      }
    };
  }, [pathname]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ModalScrollLock />
      {children}
    </ToastProvider>
  );
}
