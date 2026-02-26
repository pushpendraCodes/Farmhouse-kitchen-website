import React, { useState, useEffect, useMemo } from 'react';
import { Leaf, Drumstick, Star, Search, SlidersHorizontal, X, Plus, Minus, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

// ─── Price helpers ──────────────────────────────────────────────────────────────
const getPriceDisplay = (price) => {
  if (!price) return null;
  if (!Array.isArray(price)) {
    return { single: parseFloat(price) || 0 };
  }
  if (price.length === 1) {
    return { single: parseFloat(price[0]?.price) || 0 };
  }
  // multiple serve types
  return { multi: price };
};

const getLowestPrice = (price) => {
  if (!price) return 0;
  if (!Array.isArray(price)) return parseFloat(price) || 0;
  if (price.length === 0) return 0;
  return Math.min(...price.map((p) => parseFloat(p.price) || 0));
};

// ─── Price Tag component for menu cards ─────────────────────────────────────────
const PriceTag = ({ price, discountPrice }) => {
  const display = getPriceDisplay(price);
  if (!display) return <span className="font-bold text-gray-400">—</span>;

  if (display.multi) {
    return (
      <div className="flex flex-col gap-0.5">
        {display.multi.map((p, i) => (
          <span key={i} className="text-sm font-bold text-green-600">
            <span className="text-xs font-normal text-gray-400 mr-1 capitalize">{p.serveType}:</span>
            ₹{parseFloat(p.price || 0).toFixed(0)}
          </span>
        ))}
      </div>
    );
  }

  // single price
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-bold text-2xl text-green-600">₹{display.single}</span>
    </div>
  );
};

// ─── Main Page ──────────────────────────────────────────────────────────────────
const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [allItems, setAllItems] = useState([]); // unfiltered items for category extraction
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // menuCategory _id or "all"
  const [selectedType, setSelectedType] = useState('all'); // veg / non-veg / starter
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(12);

  // Order Modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedServeType, setSelectedServeType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const branchId = searchParams.get("branchId");

  // ── Branches ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      fetchMenuItems();
    }
  }, [page, selectedBranch, selectedCategory, selectedType, sortBy, searchTerm]);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API}/api/admin/branches/get-all?all=true`,
        { headers: { Authorization: `Bearer ${token || ""}` } }
      );
      const branchData = res.data.data || res.data || [];
      setBranches(branchData);

      const mainBranch = branchData.find((b) => b.isMainBranch);
      if (branchId) {
        setSelectedBranch(branchId);
      } else if (mainBranch) {
        setSelectedBranch(mainBranch._id);
      } else if (branchData.length > 0) {
        setSelectedBranch(branchData[0]._id);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  // ── Menu Items ───────────────────────────────────────────────────────────────
  const fetchMenuItems = async () => {
    if (!selectedBranch) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = {
        page,
        limit,
        search: searchTerm,
        available: true,
        branch: selectedBranch,
      };

      if (selectedCategory !== "all") params.category = selectedCategory;
      if (selectedType !== "all") params.type = selectedType;
      if (sortBy) params.sortBy = sortBy;

      const res = await axios.get(`${API}/api/customer/menu`, {
        headers: { Authorization: `Bearer ${token || ""}` },
        params,
      });

      const items = res.data.data || res.data.items || [];
      setMenuItems(items);
      setTotalPages(res.data.pagination?.pages || 1);

      // On first fetch (or branch change), store ALL items for category extraction
      if (page === 1 && selectedCategory === 'all' && selectedType === 'all' && !searchTerm) {
        setAllItems(items);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Build dynamic categories from fetched items ──────────────────────────────
  const categories = useMemo(() => {
    const catMap = new Map();
    const source = allItems.length > 0 ? allItems : menuItems;
    source.forEach((item) => {
      const cat = item.menuCategory;
      if (cat?._id && !catMap.has(String(cat._id))) {
        catMap.set(String(cat._id), { _id: String(cat._id), name: cat.name || "Other" });
      }
    });
    return [...catMap.values()];
  }, [allItems, menuItems]);

  // ── Type pills (veg/non-veg/starter) ──────────────────────────────────────
  const typeFilters = [
    { id: 'all', label: 'All Types', icon: null },
    { id: 'veg', label: 'Vegetarian', icon: Leaf },
    { id: 'non-veg', label: 'Non-Veg', icon: Drumstick },
    { id: 'starter', label: 'Starters', icon: null },
  ];

  // ── Order modal ───────────────────────────────────────────────────────────
  const handleOrderNow = (item) => {
    setSelectedMenuItem(item);
    setQuantity(1);
    // default to first serve type if array
    if (Array.isArray(item.price) && item.price.length > 0) {
      setSelectedServeType(item.price[0]?.serveType || null);
    } else {
      setSelectedServeType(null);
    }
    setShowOrderModal(true);
  };

  const getModalUnitPrice = () => {
    if (!selectedMenuItem) return 0;
    const p = selectedMenuItem.price;
    if (!Array.isArray(p)) return parseFloat(selectedMenuItem.discountPrice || p) || 0;
    if (selectedServeType) {
      const match = p.find((x) => x.serveType === selectedServeType);
      if (match) return parseFloat(match.price) || 0;
    }
    return parseFloat(p[0]?.price) || 0;
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add items to cart.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API}/api/customer/cart/add-to-cart`,
        {
          menuId: selectedMenuItem._id,
          quantity,
          ...(selectedServeType && { serveType: selectedServeType }),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        localStorage.setItem("cart", JSON.stringify(response.data.cart));
        setShowOrderModal(false);
        alert(`${quantity}x ${selectedMenuItem.name}${selectedServeType ? ` (${selectedServeType})` : ''} added to cart!`);
        navigate("/cart");
      } else {
        alert("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Add to Cart Error:", error);
      alert(error.response?.data?.message || "Something went wrong while adding to cart.");
    }
  };

  const resetFilters = () => {
    setSelectedBranch(branches.find((b) => b.isMainBranch)?._id || branches[0]?._id || '');
    setSelectedCategory('all');
    setSelectedType('all');
    setSortBy('');
    setSearchTerm('');
    setPage(1);
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative max-w-7xl mx-auto text-white py-32 overflow-hidden min-h-[400px] rounded-lg"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,43,.9),rgba(15,23,43,.9)), url('/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">Our Menu</h1>
          <p className="text-xl text-gray-300">Discover our delicious offerings</p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-3 items-center flex-wrap">
              {/* Branch Filter */}
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Sort By</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>

              {/* Reset Button */}
              {(selectedCategory !== 'all' || selectedType !== 'all' || sortBy || searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Sort By</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>

              {(selectedCategory !== 'all' || selectedType !== 'all' || sortBy || searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Type Tabs (veg / non-veg / starter) */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {typeFilters.map((tf) => {
              const Icon = tf.icon;
              return (
                <button
                  key={tf.id}
                  onClick={() => {
                    setSelectedType(tf.id);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all text-sm ${selectedType === tf.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {tf.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Category Pills */}
          {categories.length > 0 && (
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setPage(1);
                }}
                className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all text-sm border ${selectedCategory === 'all'
                  ? 'bg-green-100 text-green-700 border-green-300'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => {
                    setSelectedCategory(cat._id);
                    setPage(1);
                  }}
                  className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all text-sm border ${selectedCategory === cat._id
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-lg">No menu items found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              {/* Menu Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {menuItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item?.pictures?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        {item.type === 'veg' ? (
                          <div className="bg-green-500 text-white p-1.5 rounded-full">
                            <Leaf className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="bg-red-500 text-white p-1.5 rounded-full">
                            <Drumstick className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      {/* Rating Badge */}
                      {item.rating && (
                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-semibold">
                            {typeof item.rating === 'object'
                              ? item.rating.average?.toFixed(1)
                              : Number(item.rating).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.description || 'Delicious and freshly prepared'}
                      </p>

                      {/* Category badge */}
                      {item.menuCategory?.name && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-3">
                          {item.menuCategory.name}
                        </span>
                      )}

                      {/* Price and Order Button */}
                      <div className="flex items-end justify-between mt-2">
                        <PriceTag price={item.price} discountPrice={item.discountPrice} />
                        <button
                          onClick={() => handleOrderNow(item)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold text-sm flex-shrink-0"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={`px-6 py-2.5 rounded-lg font-semibold ${page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50'
                      }`}
                  >
                    Previous
                  </button>
                  <span className="text-gray-700 font-medium">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-6 py-2.5 rounded-lg font-semibold ${page === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Order Modal */}
      {showOrderModal && selectedMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowOrderModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Modal Content */}
            <div className="flex gap-4 mb-6">
              <img
                src={selectedMenuItem.pictures?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
                alt={selectedMenuItem.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedMenuItem.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {selectedMenuItem.description}
                </p>
                <div className="flex items-center gap-2">
                  {selectedMenuItem.type === 'veg' ? (
                    <Leaf className="h-4 w-4 text-green-500" />
                  ) : (
                    <Drumstick className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm text-gray-500">
                    {selectedMenuItem.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                  </span>
                </div>
              </div>
            </div>

            {/* Serve Type Selector (for multi-price items) */}
            {Array.isArray(selectedMenuItem.price) && selectedMenuItem.price.length > 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Size</label>
                <div className="flex gap-2 flex-wrap">
                  {selectedMenuItem.price.map((p) => (
                    <button
                      key={p.serveType}
                      onClick={() => setSelectedServeType(p.serveType)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${selectedServeType === p.serveType
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                        }`}
                    >
                      <span className="capitalize">{p.serveType}</span> — ₹{parseFloat(p.price || 0).toFixed(0)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price per item</span>
                <span className="font-semibold">₹{getModalUnitPrice()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Quantity</span>
                <span className="font-semibold">× {quantity}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-green-600">
                    ₹{(getModalUnitPrice() * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuPage;