// components/menu/CategoryPill.jsx
import React from "react";

const CategoryPill = ({ label, active, count, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
      active
        ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
        : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
    }`}
  >
    {label}
    {count > 0 && (
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full ${
          active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

export default CategoryPill;