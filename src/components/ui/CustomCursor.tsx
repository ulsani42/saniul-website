"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    // Add smooth hover effects for interactive elements
    const style = document.createElement("style");
    style.textContent = `
      a, button, [role="button"], input, textarea, select, label, .cursor-pointer {
        transition: opacity 0.15s ease;
      }
      a:active, button:active, [role="button"]:active {
        opacity: 0.8;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
