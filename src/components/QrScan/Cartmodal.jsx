// components/menu/CartModal.jsx
import React, { useState } from "react";
import { FiX, FiPlus, FiMinus, FiMapPin, FiLoader } from "react-icons/fi";

const TypeDot = ({ type }) => {
  const isVeg = type === "veg";
  const color = isVeg ? "border-green-600" : "border-red-600";
  const dot = isVeg ? "bg-green-600" : "bg-red-600";
  return (
    <span className={`w-3 h-3 rounded-sm border-2 flex-shrink-0 flex items-center justify-center ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
    </span>
  );
};

const CartModal = ({
  cart,
  menuItems,
  onUpdateQty,
  onRemove,
  onChangeServeType,
  onClose,
  onPlaceOrder,
  loading,
  tableNumber,
  branchName,
  isLoggedIn,
  loggedInUser,
}) => {
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Build cart items from the new cart structure: { cartKey: { itemId, qty, serveType, unitPrice } }
  const cartItems = Object.entries(cart)
    .map(([cartKey, entry]) => {
      const item = menuItems.find((m) => m._id === entry.itemId);
      if (!item) return null;
      return {
        ...item,
        cartKey,
        quantity: entry.qty,
        selectedServeType: entry.serveType,
        unitPrice: entry.unitPrice,
      };
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50">
        <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-lg p-8 text-center">
          <div className="text-4xl mb-3">🛒</div>
          <p className="text-gray-500 text-sm mb-4">Your cart is empty</p>
          <button onClick={onClose} className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium">
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50">
      <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Order</h2>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FiMapPin className="w-3 h-3" />
              {branchName} • Table {tableNumber}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {/* Logged-in user chip */}
          {isLoggedIn && loggedInUser && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
              <span className="text-green-600 text-sm">✅</span>
              <div>
                <p className="text-xs font-semibold text-green-800">Ordering as {loggedInUser.name}</p>
                <p className="text-xs text-green-600">{loggedInUser.mobile}</p>
              </div>
            </div>
          )}

          {/* Cart Items */}
          {cartItems.map((item) => {
            const thumb = item.pictures?.[0];
            const hasMultipleTypes = Array.isArray(item.price) && item.price.length > 1;

            return (
              <div key={item.cartKey} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <TypeDot type={item.type} />

                  {thumb && (
                    <img
                      src={thumb}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">₹{item.unitPrice.toFixed(2)} each</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => item.quantity === 1 ? onRemove(item.cartKey) : onUpdateQty(item.cartKey, item.quantity - 1)}
                      className="p-1.5 text-orange-600 hover:bg-orange-50 transition"
                    >
                      {item.quantity === 1
                        ? <FiX className="w-3.5 h-3.5 text-red-500" />
                        : <FiMinus className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQty(item.cartKey, item.quantity + 1)} className="p-1.5 text-orange-600 hover:bg-orange-50 transition">
                      <FiPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-gray-900 w-16 text-right">
                    ₹{(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Serve Type Selector (shown only for multi-price items) */}
                {hasMultipleTypes && (
                  <div className="mt-2 flex items-center gap-1.5 pl-6">
                    <span className="text-[10px] text-gray-400 mr-1">Size:</span>
                    {item.price.map((p) => {
                      const isActive = item.selectedServeType?.toLowerCase() === p.serveType?.toLowerCase();
                      return (
                        <button
                          key={p.serveType}
                          onClick={() => {
                            if (!isActive) {
                              onChangeServeType(item.cartKey, p.serveType, item);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition border ${isActive
                              ? "bg-orange-500 text-white border-orange-500"
                              : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                            }`}
                        >
                          <span className="capitalize">{p.serveType}</span>
                          <span className="ml-1">₹{parseFloat(p.price || 0).toFixed(0)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Special Instructions */}
          <div className="pt-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Special Instructions (optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Less spicy, no onions, extra sauce..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 transition resize-none outline-none"
            />
          </div>
        </div>

        {/* Bill Summary & CTA */}
        <div className="border-t border-gray-100 px-6 py-4 space-y-3 flex-shrink-0">
          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>GST (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() =>
              onPlaceOrder({
                items: cartItems.map((i) => ({
                  menuItem: i._id,
                  name: i.name,
                  price: i.unitPrice,
                  serveType: i.selectedServeType || null,
                  priceBreakdown: i.price,
                  quantity: i.quantity,
                })),
                subtotal,
                tax,
                total,
                specialInstructions,
              })
            }
            disabled={loading}
            className="w-full py-3.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
          >
            {loading
              ? <><FiLoader className="w-5 h-5 animate-spin" /> Placing Order...</>
              : <>Place Order • ₹{total.toFixed(2)}</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;