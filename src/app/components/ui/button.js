import React from "react";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-6 py-3 rounded-full font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}