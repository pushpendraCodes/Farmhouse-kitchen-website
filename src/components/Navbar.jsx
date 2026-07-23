import React, { useState, useEffect, useRef } from 'react';
import { ChefHat, Menu, X, User, ShoppingCart, Clock, UserCircle, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Define your menu mapping path to name
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about-us", label: "About" },
    { to: "/facilities", label: "Facilities" },
    { to: "/menus", label: "Menu" },
    { to: "/booking", label: "Booking" },
    { to: "/contact-us", label: "Contact Us" },
  ];

  // Helper to match location
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setIsLoggedIn(false);
    setUser(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 font-sans transition-all duration-500 ${
        scrolled
          ? "bg-[#0b1020]/85 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-amber-500/15"
          : "md:bg-transparent bg-[#0b1020]/85 md:backdrop-blur-0 backdrop-blur-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-amber-500 hover:text-amber-400 transition group">
            {/* <ChefHat className="inline mr-2" /> */}
          <img
          src="/logo.jpg"
          alt="Logo"
          className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-500/60 transition-transform duration-500 group-hover:scale-105 group-hover:ring-amber-400"
        />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-7 text-white">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-1 text-sm font-medium transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-amber-400 after:transition-all after:duration-300 ${
                  isActive(link.to)
                    ? "text-amber-400 after:w-full"
                    : "text-gray-200 hover:text-amber-400 after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <Link
              to="/booking"
              className="btn-premium bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 rounded-full text-sm font-bold text-[#0b1020]"
            >
              Book A Table
            </Link>

            {/* User Menu - Desktop */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <div className="h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">{user?.fullName || user?.name || 'User'}</span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeIn">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 truncate">
                        {user?.fullName || user?.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{user?.email || user?.phone}</p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      to="/cart"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Cart</span>
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Orders History</span>
                    </Link>

                    <Link
                      to="/my-account"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserCircle className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">My Account</span>
                    </Link>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 w-full transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Sign Up</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 text-white">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  isActive(link.to)
                    ? "text-amber-400 font-bold underline underline-offset-8 transition"
                    : "hover:text-amber-500 transition"
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/booking"
              className="bg-amber-600 px-6 py-2 rounded hover:bg-amber-700 text-center transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book A Table
            </Link>

            {/* Mobile User Menu */}
            {isLoggedIn ? (
              <>
                <div className="border-t border-slate-700 mt-2 pt-3">
                  <p className="text-sm text-gray-400 mb-2">
                    Welcome, {user?.fullName || user?.name}
                  </p>
                  
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 py-2 hover:text-amber-400 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center gap-3 py-2 hover:text-amber-400 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Clock className="h-5 w-5" />
                    <span>Orders History</span>
                  </Link>

                  <Link
                    to="/my-account"
                    className="flex items-center gap-3 py-2 hover:text-amber-400 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>My Account</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 py-2 hover:text-red-400 transition text-red-500 mt-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded justify-center transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;