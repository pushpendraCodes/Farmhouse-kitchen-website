// components/menu/LoadingScreen.jsx
import React from "react";

export const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500" />
      <span className="absolute inset-0 flex items-center justify-center text-2xl">
        🍽️
      </span>
    </div>
    <p className="text-sm text-gray-500 font-medium">Loading menu...</p>
  </div>
);

// components/menu/ErrorScreen.jsx
import { FiAlertCircle } from "react-icons/fi";

export const ErrorScreen = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[60vh] p-6 text-center">
    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FiAlertCircle className="w-10 h-10 text-red-500" />
    </div>
    <h2 className="text-xl font-bold text-gray-900 mb-2">Oops!</h2>
    <p className="text-sm text-gray-500 mb-6 max-w-xs">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-6 py-2.5 bg-orange-500 text-white font-medium rounded-xl hover:bg-orange-600 transition"
      >
        Try Again
      </button>
    )}
  </div>
);