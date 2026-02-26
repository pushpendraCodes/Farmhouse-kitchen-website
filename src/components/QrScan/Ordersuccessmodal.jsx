// components/menu/OrderSuccessModal.jsx
import React from "react";
import { FiCheckCircle, FiClock } from "react-icons/fi";

const OrderSuccessModal = ({ order, onClose }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
    <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h2>
      <p className="text-sm text-gray-500 mb-5">
        Your order has been sent to the kitchen. Sit back and relax!
      </p>

      {order?.orderId && (
        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <p className="text-xs text-gray-500 mb-0.5">Order ID</p>
          <p className="text-lg font-bold text-gray-900 font-mono">
            #{order.orderNumber}
          </p>
        </div>
      )}

      {order?.estimatedTime && (
        <div className="flex items-center justify-center gap-1.5 text-sm text-orange-600 mb-6 bg-orange-50 py-2 rounded-xl">
          <FiClock className="w-4 h-4" />
          Estimated time: <strong>{order.estimatedTime} mins</strong>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition active:scale-[0.98]"
      >
        Order More 🍽️
      </button>
    </div>
  </div>
);

export default OrderSuccessModal;