// CustomerMenuModal.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FiX, FiSearch, FiMapPin } from "react-icons/fi";

// Components
import CategoryPill from "./Categorypill";
import MenuItemCard from "./Menuitemcard";
import CartBar from "./Cartbar";
import CartModal from "./Cartmodal";
import OrderSuccessModal from "./Ordersuccessmodal";
import GuestRegistrationModal from "./Guestregistrationmodal";
import { LoadingScreen, ErrorScreen } from "./Screens";

// Hooks
import useMenuData from "./Usemenudata"
import useCart from "./Usecart";
import useAuth from "./Useauth";
import useOffers from "./useOffers";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── Menu Body ────────────────────────────────────────────────────────────────
const MenuBody = ({ branchInfo, tableInfo, menuItems, categories, onClose }) => {
  const { user, token, isLoggedIn, saveGuestSession } = useAuth();
  const { cart, addToCart, removeFromCart, updateCartQty, removeCartItem, changeServeType, clearCart, totalItems, totalAmount, getItemQty } =
    useCart(menuItems);
  const { offerMap } = useOffers(menuItems);

  // Filters — activeCategory stores the category _id ("all" = show all)
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  // type filter: "all" | "veg" | "non-veg" | "starter"
  const [filterType, setFilterType] = useState("all");

  // Modals
  const [showCart, setShowCart] = useState(false);
  const [showGuestReg, setShowGuestReg] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filteredItems = useMemo(
    () =>
      menuItems.filter((item) => {
        // menuCategory is populated: { _id, name }
        const catId = item.menuCategory?._id
          ? String(item.menuCategory._id)
          : String(item.menuCategory || "");

        const matchesCategory = activeCategory === "all" || catId === activeCategory;

        const matchesSearch =
          !searchQuery ||
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase());

        // item.type is "veg" | "non-veg" | "starter"
        const matchesType =
          filterType === "all" || item.type === filterType;

        return matchesCategory && matchesSearch && matchesType;
      }),
    [menuItems, activeCategory, searchQuery, filterType]
  );

  // ── Order submission ──────────────────────────────────────────────────────
  const submitOrder = async (orderData, authToken) => {
    setOrderLoading(true);
    try {
      const payload = {
        branchId: branchInfo?._id,
        // qrToken: tableInfo?.qrToken,
        tableId: tableInfo?._id,
        items: orderData.items,
        // subtotal: orderData.subtotal,
        // tax: orderData.tax,  
        // total: orderData.total,
        specialInstructions: orderData.specialInstructions,
        offerCode: orderData.offerCode,
        // orderType: "dine-in",
        // ...(guestUser && { customerName: guestUser.name, customerMobile: guestUser.mobile }),
      };

      const { data } = await axios.post(`${API_BASE}/api/customer/order/dine-in`, payload, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });

      setOrderSuccess(data.data || data.order || data);
      clearCart();
      setShowCart(false);
      setPendingOrderData(null);
      toast.success("Order placed successfully! 🎉");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setOrderLoading(false);
    }
  };

  const handlePlaceOrder = (orderData) => {
    if (isLoggedIn) {
      submitOrder(orderData, token);
    } else {
      setPendingOrderData(orderData);
      setShowCart(false);
      setShowGuestReg(true);
    }
  };

  const handleGuestSubmit = async ({ name, mobile }) => {
    setGuestLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/customer/auth/guest-register`, { fullName: name, phone: mobile });
      const guestToken = data.token || data.data?.token;
      saveGuestSession({ name, mobile, guestToken });
      setShowGuestReg(false);
      await submitOrder(pendingOrderData, guestToken, { name, mobile });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setGuestLoading(false);
    }
  };

  // Helper: get items for a given category _id
  const getItemsForCat = (catId) =>
    filteredItems.filter((i) => {
      const id = i.menuCategory?._id
        ? String(i.menuCategory._id)
        : String(i.menuCategory || "");
      return id === catId;
    });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50">
      {/* ── Sticky Header ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 flex-shrink-0 z-10">
        {/* Top bar */}
        <div className="bg-orange-500 text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <FiMapPin className="w-3 h-3" />
            {branchInfo?.name || "Restaurant"}
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
              Table {tableInfo?.tableNumber || "—"}
            </span>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 transition rounded-full p-1"
              aria-label="Close menu"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Restaurant name */}
        <div className="px-4 pt-3 pb-2">
          <h1 className="text-xl font-bold text-gray-900">
            {branchInfo?.restaurantName || "🍽️ Menu"}
          </h1>
          <p className="text-xs text-gray-500">{menuItems.length} items available</p>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none transition border-0"
            />
          </div>
        </div>

        {/* Type filter — matches item.type values exactly */}
        <div className="px-4 pb-2 flex gap-2">
          {[
            { label: "All", value: "all" },
            { label: "🟢 Veg", value: "veg" },
            { label: "🔴 Non-Veg", value: "non-veg" },
            { label: "🟡 Starter", value: "starter" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterType(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${filterType === f.value
                ? "bg-orange-100 text-orange-700 border border-orange-300"
                : "bg-gray-100 text-gray-600"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category pills — categories are now [{_id, name}] objects */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <CategoryPill
            label="All"
            active={activeCategory === "all"}
            count={menuItems.length}
            onClick={() => setActiveCategory("all")}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat._id}
              label={cat.name}
              active={activeCategory === cat._id}
              count={menuItems.filter((i) => {
                const id = i.menuCategory?._id
                  ? String(i.menuCategory._id)
                  : String(i.menuCategory || "");
                return id === cat._id;
              }).length}
              onClick={() => setActiveCategory(cat._id)}
            />
          ))}
        </div>
      </div>

      {/* ── Scrollable Items ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-semibold text-gray-900 mb-1">No items found</h3>
              <p className="text-sm text-gray-500">Try a different category or search term</p>
            </div>
          ) : activeCategory === "all" ? (
            // Grouped by category
            categories.map((cat) => {
              const catItems = getItemsForCat(cat._id);
              if (catItems.length === 0) return null;
              return (
                <div key={cat._id} className="mb-6">
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    {cat.name}
                    <span className="font-normal text-gray-400">({catItems.length})</span>
                  </h2>
                  <div className="grid md:grid-cols-4 grid-cols-2  gap-3">
                    {catItems.map((item) => (
                      <MenuItemCard
                        key={item._id}
                        item={item}
                        quantity={getItemQty(item._id)}
                        onAdd={addToCart}
                        onRemove={removeFromCart}
                        offer={offerMap[item._id] || null}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Single category selected
            <div className="grid grid-cols-2 md:grid-cols-4  gap-3">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item._id}
                  item={item}
                  quantity={getItemQty(item._id)}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                  offer={offerMap[item._id] || null}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Cart Bar ─────────────────────────────────────────────────── */}
      <CartBar itemCount={totalItems} totalAmount={totalAmount} onViewCart={() => setShowCart(true)} />

      {/* ── Cart Modal ────────────────────────────────────────────────── */}
      {showCart && (
        <CartModal
          offerMap={offerMap}              // ✅ add this
          branchId={branchInfo?._id}
          cart={cart}
          menuItems={menuItems}
          onUpdateQty={updateCartQty}
          onRemove={removeCartItem}
          onChangeServeType={changeServeType}
          onClose={() => setShowCart(false)}
          onPlaceOrder={handlePlaceOrder}
          loading={orderLoading}
          tableNumber={tableInfo?.tableNumber || "—"}
          branchName={branchInfo?.name || "Restaurant"}
          isLoggedIn={isLoggedIn}
          loggedInUser={user}
        />
      )}

      {/* ── Guest Registration ────────────────────────────────────────── */}
      {showGuestReg && (
        <GuestRegistrationModal
          onSubmit={handleGuestSubmit}
          onClose={() => { setShowGuestReg(false); setShowCart(true); }}
          loading={guestLoading}
        />
      )}

      {/* ── Order Success ─────────────────────────────────────────────── */}
      {orderSuccess && (
        <OrderSuccessModal order={orderSuccess} onClose={() => setOrderSuccess(null)} />
      )}
    </div>
  );
};

// ─── Main Export ──────────────────────────────────────────────────────────────
const CustomerMenuModal = ({ isOpen, onClose }) => {
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get("branch");
  const qrToken = searchParams.get("table");

  const { branchInfo, tableInfo, menuItems, categories, loading, error, refetch } =
    useMenuData(branchId, qrToken);


  useEffect(() => { if (isOpen) refetch(); }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <Toaster position="top-center" containerStyle={{ zIndex: 9999 }} />
      <div className="fixed inset-0 z-[9000] bg-gray-50 flex flex-col" style={{ isolation: "isolate" }}>
        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorScreen message={error} onRetry={refetch} />
        ) : (
          <MenuBody
            branchInfo={branchInfo}
            tableInfo={tableInfo}
            menuItems={menuItems}
            categories={categories}
            onClose={onClose}
          />
        )}
      </div>
    </>
  );
};

export default CustomerMenuModal;