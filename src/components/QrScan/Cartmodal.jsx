// components/menu/CartModal.jsx
import React, { useState } from "react";
import { FiX, FiPlus, FiMinus, FiMapPin, FiLoader, FiTag, FiCheckCircle, FiXCircle } from "react-icons/fi";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

// ─── Single Offer Row with Apply button ───────────────────────────────────────
const OfferRow = ({ offer, appliedOfferCode, applyLoading, onApply, onRemove }) => {
  const isApplied = appliedOfferCode === offer.offerCode;
  const isOtherApplied = appliedOfferCode && appliedOfferCode !== offer.offerCode;

  const formatDiscount = (discount) => {
    if (!discount) return "";
    if (discount.type === "PERCENTAGE") return `${discount.percentageOff}% OFF`;
    if (discount.type === "FLAT") return `₹${discount.flatAmount} OFF`;
    return "";
  };

  return (
    <div
      className={`flex items-center justify-between px-2 py-1.5 rounded-lg border transition-all ${isApplied
        ? "bg-green-50 border-green-300"
        : "bg-red-50 border-red-100"
        }`}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <FiTag className={`w-3 h-3 flex-shrink-0 ${isApplied ? "text-green-600" : "text-red-500"}`} />
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold truncate ${isApplied ? "text-green-700" : "text-red-600"}`}>
            {offer.title}
            <span className="font-bold"> — {formatDiscount(offer.discount)}</span>
          </p>
          <p className="text-[9px] text-gray-400 font-mono">{offer.offerCode}</p>
        </div>
      </div>

      {isApplied ? (
        <button
          onClick={onRemove}
          className="flex items-center gap-1 text-[10px] text-green-700 font-semibold bg-green-100 hover:bg-green-200 px-2 py-1 rounded-md transition flex-shrink-0 ml-2"
        >
          <FiCheckCircle className="w-3 h-3" />
          Applied
          <FiX className="w-3 h-3 ml-0.5 text-green-500" />
        </button>
      ) : (
        <button
          onClick={() => onApply(offer.offerCode)}
          disabled={!!isOtherApplied || applyLoading === offer.offerCode}
          className="flex items-center gap-1 text-[10px] text-red-600 font-semibold bg-white hover:bg-red-50 border border-red-200 px-2 py-1 rounded-md transition flex-shrink-0 ml-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {applyLoading === offer.offerCode ? (
            <FiLoader className="w-3 h-3 animate-spin" />
          ) : (
            "Apply"
          )}
        </button>
      )}
    </div>
  );
};

// ─── Main CartModal ───────────────────────────────────────────────────────────
const CartModal = ({
  cart,
  menuItems,
  offerMap = {},           // { [itemId]: [offer, ...] }
  branchId,                // needed for validate API
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

  // Offer state
  const [appliedOfferCode, setAppliedOfferCode] = useState(null);
  const [appliedOfferData, setAppliedOfferData] = useState(null); // response from validate API
  const [applyLoading, setApplyLoading] = useState(null); // offerCode string while loading
  const [offerError, setOfferError] = useState(null);

  // Build cart items
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
  const discountAmount = appliedOfferData?.discountAmount || 0;
  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.05;
  const total = discountedSubtotal + tax;

  // ── Apply Offer via validate API ──────────────────────────────────────────
  const handleApplyOffer = async (offerCode) => {
    setApplyLoading(offerCode);
    setOfferError(null);
    try {
      const payload = {
        offerCode,
        branchId,
        cartItems: cartItems.map((i) => ({
          menuItemId: i._id,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
        })),
      };

      const { data } = await axios.post(`${API_BASE}/api/customer/offer/validate`, payload);

      if (data.success) {
        setAppliedOfferCode(offerCode);
        setAppliedOfferData(data.data);
      } else {
        setOfferError(data.message || "Offer could not be applied.");
      }
    } catch (err) {
      setOfferError(err.response?.data?.message || "Failed to apply offer. Try again.");
    } finally {
      setApplyLoading(null);
    }
  };

  // ── Remove applied offer ──────────────────────────────────────────────────
  const handleRemoveOffer = () => {
    setAppliedOfferCode(null);
    setAppliedOfferData(null);
    setOfferError(null);
  };

  // ── Collect all unique offers across all cart items ───────────────────────
  // So user sees available offers once (not duplicated per item)
  const allOffersMap = {};
  cartItems.forEach((item) => {
    const offers = offerMap[item._id] || [];
    offers.forEach((offer) => {
      if (offer?.offerCode) allOffersMap[offer.offerCode] = offer;
    });
  });
  const allUniqueOffers = Object.values(allOffersMap);

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
                <p className="text-xs font-semibold text-green-800">Ordering as {loggedInUser.fullName}</p>
                <p className="text-xs text-green-600">{loggedInUser.mobile}</p>
              </div>
            </div>
          )}

          {/* Cart Items */}
          {cartItems.map((item) => {
            const thumb = item.pictures?.[0];
            const hasMultipleTypes = Array.isArray(item.price) && item.price.length > 1;
            const itemOffers = offerMap[item._id] || [];

            return (
              <div key={item.cartKey} className="bg-gray-50 rounded-xl p-3 space-y-2">
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

                {/* Serve Type Selector */}
                {hasMultipleTypes && (
                  <div className="flex items-center gap-1.5 pl-6">
                    <span className="text-[10px] text-gray-400 mr-1">Size:</span>
                    {item.price.map((p) => {
                      const isActive = item.selectedServeType?.toLowerCase() === p.serveType?.toLowerCase();
                      return (
                        <button
                          key={p.serveType}
                          onClick={() => !isActive && onChangeServeType(item.cartKey, p.serveType, item)}
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

                {/* ── Per-item Offer Badges ── */}
                {itemOffers.length > 0 && (
                  <div className="pl-1 space-y-1">
                    {itemOffers.map((offer) => (
                      <OfferRow
                        key={offer.offerCode}
                        offer={offer}
                        appliedOfferCode={appliedOfferCode}
                        applyLoading={applyLoading}
                        onApply={handleApplyOffer}
                        onRemove={handleRemoveOffer}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* ── Offer Error ── */}
          {offerError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <FiXCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600">{offerError}</p>
            </div>
          )}

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

            {/* Discount row — only shown when offer applied */}
            {appliedOfferData && (
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span className="flex items-center gap-1">
                  <FiTag className="w-3.5 h-3.5" />
                  {appliedOfferData.title} ({appliedOfferCode})
                </span>
                <span>− ₹{discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-gray-600">
              <span>GST (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="flex items-center gap-2">
                {appliedOfferData && (
                  <span className="text-xs text-gray-400 line-through font-normal">
                    ₹{(subtotal * 1.05).toFixed(2)}
                  </span>
                )}
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              onPlaceOrder({
                items: cartItems.map((i) => ({
                  menuId: i._id,
                  name: i.name,
                  price: i.unitPrice,
                  serveType: i.selectedServeType || null,
                  priceBreakdown: i.price,
                  quantity: i.quantity,
                })),
                subtotal,
                discountAmount,
                tax,
                total,
                specialInstructions,
                // ✅ Coupon sent only if applied
                ...(appliedOfferCode && {
                  offerCode: appliedOfferCode,
                }),
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