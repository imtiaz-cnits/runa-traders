"use client";

import React from "react";

interface FreshWatermarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  isContained?: boolean; // If true (e.g. half-page Challan), absolute inside container. If false (default), fixed across all print pages.
}

export function FreshWatermark({ className = "", size = "md", isContained = false }: FreshWatermarkProps) {
  const sizeClasses =
    size === "sm"
      ? "w-[140px] sm:w-[160px]"
      : size === "lg"
      ? "w-[300px] sm:w-[360px]"
      : "w-[240px] sm:w-[280px]";

  // Only visible in print view (hidden on main screen as requested in Point 6)
  // When isContained is false, print:fixed centers on EVERY page if multi-page (Point 5)
  // When isContained is true (Challan), absolute inset-0 centers within challan height (Point 1)
  const positionClasses = isContained
    ? "hidden print:flex absolute inset-0 items-center justify-center pointer-events-none z-0 overflow-hidden select-none"
    : "hidden print:flex print:fixed print:inset-0 items-center justify-center pointer-events-none z-0 overflow-hidden select-none";

  return (
    <div
      aria-hidden="true"
      className={`${positionClasses} ${className}`}
    >
      <svg
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses} opacity-[0.11] print:opacity-[0.12] select-none`}
      >
        {/* Pink/Reddish Square Container matching Image 4 */}
        <rect x="25" y="25" width="250" height="250" rx="8" fill="#be123c" />

        {/* Nested Geometric Tiles Icon matching Image 4 */}
        <g
          transform="translate(150, 95)"
          stroke="#ffffff"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Tilted outer diamond / square */}
          <rect
            x="-40"
            y="-40"
            width="80"
            height="80"
            rx="4"
            transform="rotate(14)"
            strokeOpacity="0.95"
          />
          {/* Straight middle square */}
          <rect
            x="-28"
            y="-28"
            width="56"
            height="56"
            rx="3"
            strokeOpacity="0.95"
          />
          {/* Tilted inner small diamond */}
          <rect
            x="-16"
            y="-16"
            width="32"
            height="32"
            rx="2"
            transform="rotate(14)"
            strokeOpacity="0.95"
          />
          {/* Central tiny square */}
          <rect
            x="-6"
            y="-6"
            width="12"
            height="12"
            rx="1"
            fill="#ffffff"
            stroke="none"
          />
        </g>

        {/* Brand Text "Fresh" */}
        <text
          x="150"
          y="200"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="48"
          fontWeight="900"
          fontStyle="italic"
          fontFamily="Arial, sans-serif"
          letterSpacing="1"
        >
          Fresh
        </text>

        {/* Sub-text "CERAMICS" */}
        <text
          x="150"
          y="228"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="13"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
          letterSpacing="9"
        >
          CERAMICS
        </text>

        {/* Decorative underline */}
        <line
          x1="65"
          y1="244"
          x2="235"
          y2="244"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
}
