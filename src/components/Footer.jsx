import React from 'react';
import { ChefHat } from 'lucide-react';

const Footer = ({ navigate }) => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <ChefHat className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">Farmhouse Kitchen</span>
            </div>
            <p className="text-gray-400">
              Bringing authentic flavors and warm hospitality to your table since 2015.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('home')} className="text-gray-400 hover:text-white">Home</button></li>
              <li><button onClick={() => navigate('about')} className="text-gray-400 hover:text-white">About</button></li>
              <li><button onClick={() => navigate('menu')} className="text-gray-400 hover:text-white">Menu</button></li>
              <li><button onClick={() => navigate('order')} className="text-gray-400 hover:text-white">Order</button></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>+91 1234567890</li>
              <li>info@farmhousekitchen.com</li>
              <li>Bazaz Nagar, Indore</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Hours</h3>
            <p className="text-gray-400">Monday - Sunday</p>
            <p className="text-gray-400">11:00 AM - 11:00 PM</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Farmhouse Kitchen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;