import React, { useState, useEffect } from 'react';
import { ChefHat, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Define your menu mapping path to name
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about-us", label: "About" },
    { to: "/facilities", label: "Facilities" },
    { to: "/menus", label: "Menu" },
    { to: "/booking", label: "Booking" },
    { to: "/signup", label: "Signup" },
    { to: "/contact-us", label: "Contact Us" },
  ];

  // Helper to match location (for root routes, use location.pathname === item.to)
  const isActive = (path) => location.pathname === path;

  return (
  <nav
  className={`fixed w-full top-0 z-50 transition-colors duration-300
    ${
      scrolled
        ? "md:bg-slate-900 md:shadow-lg bg-slate-900" // solid bg on scroll (desktop), always bg on mobile
        : "md:bg-transparent bg-slate-900" // transparent on desktop, solid bg on mobile
    }`}
>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-amber-500">
            <ChefHat className="inline mr-2" />
            FarmHouse
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 text-white">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  isActive(link.to)
                    ? "text-amber-400 font-bold underline underline-offset-8 transition"
                    : "hover:text-amber-500 transition"
                }
              >
                {link.label}
              </Link>
            ))}
            <Link to="/booking" className="hidden md:block bg-amber-600 px-6 py-2 rounded hover:bg-amber-700 transition">
              Book A Table
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
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
              className="bg-amber-600 px-6 py-2 rounded hover:bg-amber-700 w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book A Table
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
