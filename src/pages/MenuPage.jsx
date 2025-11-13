import React, { useState, useEffect } from 'react';
import { Leaf, Drumstick, Star, Search, SlidersHorizontal, X, Plus, Minus, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(12);
  
  // Order Modal States
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

const navigate = useNavigate()

  useEffect(() => {
   
    fetchBranches();
  }, []);

  useEffect(() => {
    if(selectedBranch){
    fetchMenuItems();
    }

  }, [page, selectedBranch, selectedType, sortBy, searchTerm]);

const fetchBranches = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/branches/get-all?all=true`,
      {
        headers: { Authorization: `Bearer ${token || ""}` },
      }
    );
    const branchData = res.data.data || res.data || [];
    setBranches(branchData);

    // ✅ Only set the first branch if there is one
   const mainBranch = branchData.find(b => b.isMainBranch);

    if (mainBranch) {
      setSelectedBranch(mainBranch._id);
    } else if (branchData.length > 0) {
      // fallback if no main branch is found
      setSelectedBranch(branchData[0]._id);
    }
  } catch (error) {
    console.error("Error fetching branches:", error);
  }
};

const fetchMenuItems = async () => {
  // ✅ Don't fetch if no branch is selected
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

    if (selectedType !== "all") params.category = selectedType;
    if (sortBy) params.sortBy = sortBy;

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/menus`,
      {
        headers: { Authorization: `Bearer ${token || ""}` },
        params,
      }
    );

    setMenuItems(res.data.data || res.data.items || []);
    setTotalPages(res.data.pagination?.pages || 1);
  } catch (error) {
    console.error("Error fetching menu items:", error);
  } finally {
    setLoading(false);
  }
};

  const handleOrderNow = (item) => {
    setSelectedMenuItem(item);
    setQuantity(1);
    setShowOrderModal(true);
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
        `${import.meta.env.VITE_API_URL}/api/customer/add-to-cart`,
        {
          menuId: selectedMenuItem._id,
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Optional: Save a copy in localStorage for faster UI updates
        localStorage.setItem("cart", JSON.stringify(response.data.cart));

        // Close modal and show success toast/alert
        setShowOrderModal(false);
        alert(`${quantity}x ${selectedMenuItem.name} added to cart!`);

        // Navigate to Cart page
        navigate("/cart");
      } else {
        alert("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Add to Cart Error:", error);
      alert(
        error.response?.data?.message || "Something went wrong while adding to cart."
      );
    }
  };


  const resetFilters = () => {
    setSelectedBranch('');
    setSelectedType('all');
    setSortBy('');
    setSearchTerm('');
    setPage(1);
  };

  const categories = [
    { id: 'all', label: 'All Items', icon: null },
    { id: 'Veg', label: 'Vegetarian', icon: Leaf },
    { id: 'Non-Veg', label: 'Non-Vegetarian', icon: Drumstick },
    { id: 'Starter', label: 'Starters', icon: null },
    // { id: 'main', label: 'Main Course', icon: null },
    // { id: 'dessert', label: 'Desserts', icon: null },
  ];

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
                {/* <option value="">All Branches</option> */}
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
              {(selectedBranch || selectedType !== 'all' || sortBy || searchTerm) && (
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
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="highestRated">Highest Rated</option>
                <option value="mostPopular">Most Popular</option>
              </select>

              {(selectedBranch || selectedType !== 'all' || sortBy || searchTerm) && (
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
          {/* Category Tabs */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedType(category.id);
                    setPage(1);
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    selectedType === category.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {category.label}
                </button>
              );
            })}
          </div>

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
                        src={item?.pictures[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
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
                          <span className="text-sm font-semibold">{item.rating.average.toFixed(1)}</span>
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

                      {/* Category */}
                      {item.category && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mb-3">
                          {item.category}
                        </span>
                      )}

                      {/* Price and Order Button */}
                      <div className="flex items-center justify-between mt-4">
                        <div>
                        
                          {item.discountPrice && (
                            <span className="  font-bold text-2xl text-green-600">
                              ₹{item.discountPrice}
                            </span>
                          )}
                            <span className="text-sm ml-2 text-gray-400  line-through ">
                            ₹{item.price}
                          </span>
                        </div>
                        <button
                          onClick={() => handleOrderNow(item)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-semibold"
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
                    className={`px-6 py-2.5 rounded-lg font-semibold ${
                      page === 1
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
                    className={`px-6 py-2.5 rounded-lg font-semibold ${
                      page === totalPages
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
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
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
                src={selectedMenuItem.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
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

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
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
                <span className="font-semibold">₹{selectedMenuItem?.discountPrice||selectedMenuItem?.price}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Quantity</span>
                <span className="font-semibold">× {quantity}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-green-600">
                    ₹{((selectedMenuItem?.discountPrice||selectedMenuItem?.price) * quantity).toFixed(2)}
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