import React, { useState } from 'react';
import { Leaf, Drumstick } from 'lucide-react';

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const menuItems = [
    { id: 1, name: 'Paneer Tikka', category: 'veg', type: 'starter', price: 250, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', description: 'Grilled cottage cheese with spices' },
    { id: 2, name: 'Veg Spring Rolls', category: 'veg', type: 'starter', price: 180, image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400', description: 'Crispy rolls with mixed vegetables' },
    { id: 3, name: 'Chicken Tikka', category: 'nonveg', type: 'starter', price: 320, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', description: 'Tender chicken marinated in yogurt' },
    { id: 4, name: 'Fish Fingers', category: 'nonveg', type: 'starter', price: 350, image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400', description: 'Crispy fried fish strips' },
    { id: 5, name: 'Dal Makhani', category: 'veg', type: 'main', price: 220, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', description: 'Creamy black lentils' },
    { id: 6, name: 'Paneer Butter Masala', category: 'veg', type: 'main', price: 280, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', description: 'Rich tomato-based curry' },
    { id: 7, name: 'Butter Chicken', category: 'nonveg', type: 'main', price: 350, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', description: 'Creamy chicken curry' },
    { id: 8, name: 'Mutton Rogan Josh', category: 'nonveg', type: 'main', price: 420, image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', description: 'Kashmiri mutton curry' }
  ];

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'veg', label: 'Vegetarian', icon: Leaf },
    { id: 'nonveg', label: 'Non-Vegetarian', icon: Drumstick },
    { id: 'starter', label: 'Starters' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory || item.type === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Our Menu</h1>
      <p className="text-center text-gray-600 mb-12 text-lg">Discover our delicious offerings</p>
      
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-3 rounded-full font-semibold transition flex items-center ${
              selectedCategory === cat.id
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-green-50'
            }`}
          >
            {cat.icon && <cat.icon className="h-5 w-5 mr-2" />}
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                {item.category === 'veg' ? (
                  <div className="w-6 h-6 border-2 border-green-600 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-600"></div>
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-red-600 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              <p className="text-green-600 font-bold text-xl">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;