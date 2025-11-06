import React, { useState } from 'react';
import { ChefHat, Home, Info, Grid, Menu as MenuIcon, UserPlus, ShoppingCart, MessageSquare } from 'lucide-react';

const Navbar = ({ navigate, currentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'facility', label: 'Facilities', icon: Grid },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
    { id: 'order', label: 'Order Now', icon: ShoppingCart },
    { id: 'signup', label: 'Sign Up', icon: UserPlus },
    { id: 'contact', label: 'Contact', icon: MessageSquare }
  ];

  return (
    <nav className="bg-green-800 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
            <ChefHat className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl">Farmhouse Kitchen</span>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  currentPage === item.id ? 'bg-green-900' : 'hover:bg-green-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-green-900">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 hover:bg-green-800"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;