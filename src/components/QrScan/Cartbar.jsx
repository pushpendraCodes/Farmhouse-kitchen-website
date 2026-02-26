// components/menu/CartBar.jsx
import React from "react";
import { FiShoppingCart } from "react-icons/fi";

const CartBar = ({ itemCount, totalAmount, onViewCart }) => {
  if (itemCount === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-40 p-4">
      <button
        onClick={onViewCart}
        className="w-full flex items-center justify-between px-6 py-4 bg-orange-500 text-white rounded-2xl shadow-2xl shadow-orange-300 hover:bg-orange-600 transition active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </div>
          <span className="font-semibold text-sm">
            {itemCount} item{itemCount > 1 ? "s" : ""} added
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">₹{totalAmount.toFixed(2)}</span>
          <span className="text-sm opacity-80">View Cart →</span>
        </div>
      </button>
    </div>
  );
};

export default CartBar;