// components/menu/GuestRegistrationModal.jsx
import React, { useState } from "react";
import { FiX, FiUser, FiPhone, FiLoader, FiArrowRight } from "react-icons/fi";

const GuestRegistrationModal = ({ onSubmit, onClose, loading }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Please enter your full name";
    if (!/^[6-9]\d{9}$/.test(mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit({ name: name.trim(), mobile });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Almost there! 👋</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Quick sign-in to place your order
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Your Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                }}
                className={`w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition outline-none ${
                  errors.name ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Mobile Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-sm text-gray-500">🇮🇳</span>
                <span className="text-xs text-gray-400 border-r border-gray-200 pr-2">+91</span>
              </div>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit number"
                value={mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setMobile(val);
                  if (errors.mobile) setErrors((p) => ({ ...p, mobile: "" }));
                }}
                className={`w-full pl-16 pr-4 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition outline-none ${
                  errors.mobile ? "border-red-400 bg-red-50" : "border-gray-200"
                }`}
              />
            </div>
            {errors.mobile && (
              <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center">
            We'll remember you for future orders at this restaurant.
          </p>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
          >
            {loading ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue to Order
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestRegistrationModal;