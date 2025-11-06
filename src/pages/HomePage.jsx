import React from 'react';
import { MapPin, Utensils, ChefHat, Users } from 'lucide-react';

const HomePage = ({ navigate }) => {
  const branches = [
    {
      id: 1,
      name: 'Farmhouse Kitchen Bazaz Nagar',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      description: 'Our flagship location with a premium dining experience',
      address: 'Bazaz Nagar, Main Street'
    },
    {
      id: 2,
      name: 'Farmhouse Kitchen Buttiburi',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800',
      description: 'Cozy atmosphere perfect for family gatherings',
      address: 'Buttiburi Road, Near City Center'
    },
    {
      id: 3,
      name: 'Farmhouse Cloud',
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      description: 'Rooftop dining with panoramic city views',
      address: 'Cloud Tower, 15th Floor'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-96 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">Welcome to Farmhouse Kitchen</h1>
            <p className="text-xl mb-6">Experience authentic flavors in a warm, inviting atmosphere</p>
            <button
              onClick={() => navigate('menu')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-semibold transition"
            >
              View Menu
            </button>
          </div>
        </div>
      </div>

      {/* Branches Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Branches</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {branches.map(branch => (
            <div
              key={branch.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:scale-105"
              onClick={() => navigate('branch', branch)}
            >
              <img src={branch.image} alt={branch.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{branch.name}</h3>
                <p className="text-gray-600 mb-4">{branch.description}</p>
                <div className="flex items-center text-green-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">{branch.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Utensils className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">We source the freshest ingredients daily</p>
            </div>
            <div>
              <ChefHat className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold mb-2">Expert Chefs</h3>
              <p className="text-gray-600">Experienced culinary masters at work</p>
            </div>
            <div>
              <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-bold mb-2">Friendly Service</h3>
              <p className="text-gray-600">Warm hospitality every visit</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;