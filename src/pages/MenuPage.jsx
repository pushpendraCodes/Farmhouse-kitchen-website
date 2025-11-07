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

    <>{/* Hero Section */}
      <section
        id="home"
        className="relative max-w-7xl mx-auto text-white py-32 overflow-hidden min-h-[400px]"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,43,.9),rgba(15,23,43,.9)), url('/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container  mx-auto px-4 text-center  gap-10">
         <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center leading-tight">
         Menu
            </h1>
        </div>
      </section>
      <section id="menu" className="py-20 bg-gray-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h5 className="text-amber-500 font-semibold mb-2 flex items-center justify-center gap-2">
              <span className="w-16 h-0.5 bg-amber-500"></span>
              Food Menu
              <span className="w-16 h-0.5 bg-amber-500"></span>
            </h5>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Most Popular Items</h2>
          </div>

          {/* Menu Tabs */}
          <div className="flex justify-center gap-8 mb-12 flex-wrap">
            <button className="flex items-center gap-2 pb-2 border-b-2 border-amber-500 text-gray-900">
              <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 19h20v2H2v-2zm2-6h16v2H4v-2zm0-4h16v2H4V9zm18-4H2V3h20v2z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-600">Popular</div>
                <div className="font-bold">Breakfast</div>
              </div>
            </button>
            <button className="flex items-center gap-2 pb-2 text-gray-600 hover:text-gray-900">
              <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="12" cy="12" r="4"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Special</div>
                <div className="font-bold">Launch</div>
              </div>
            </button>
            <button className="flex items-center gap-2 pb-2 text-gray-600 hover:text-gray-900">
              <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Lovely</div>
                <div className="font-bold">Dinner</div>
              </div>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'Chicken Burger', price: '$115', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop', desc: 'Ipsum ipsum clita erat amet dolor justo diam' },
              { name: 'Chicken Burger', price: '$115', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop', desc: 'Ipsum ipsum clita erat amet dolor justo diam' },
              { name: 'Chicken Burger', price: '$115', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=150&fit=crop', desc: 'Ipsum ipsum clita erat amet dolor justo diam' },
              { name: 'Chicken Burger', price: '$115', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&h=150&fit=crop', desc: 'Ipsum ipsum clita erat amet dolor justo diam' },
              { name: 'Chicken Burger', price: '$115', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=150&fit=crop', desc: 'Ipsum ipsum clita erat amet dolor justo diam' },
              { name: 'Chicken Burger', price: '$115', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=200&h=150&fit=crop', desc: 'Ipsum ipsum clita erat amet dolor justo diam' },
              { name: 'Chicken Burger', price: '$115', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=150&fit=crop', desc: 'Ipsum ipsum clita erat amet dolor justo diam' },
              { name: 'Chicken Burger', price: '$115', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop', desc: 'Ipsum ipsum clita erat amet dolor justo diam' }
            ].map((item, index) => (
              <div key={index} className="flex gap-4 bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover flex-shrink-0" />
                <div className="flex-1 py-4 pr-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-gray-900">{item.name}</h4>
                    <span className="text-amber-500 font-bold text-xl">{item.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm italic">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
    
  );
};

export default MenuPage;