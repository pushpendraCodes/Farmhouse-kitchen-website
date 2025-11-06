import React from 'react';
import { MapPin, Phone, Clock, Check } from 'lucide-react';

const BranchDetail = ({ branch }) => {
  if (!branch) return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl text-gray-600">Please select a branch from the home page</h2>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img src={branch.image} alt={branch.name} className="w-full h-96 object-cover" />
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">{branch.name}</h1>
          <p className="text-xl text-gray-600 mb-6">{branch.description}</p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Location</h3>
              <div className="flex items-start mb-4">
                <MapPin className="h-5 w-5 mr-3 text-green-600 mt-1" />
                <p className="text-gray-700">{branch.address}</p>
              </div>
              <div className="flex items-start mb-4">
                <Phone className="h-5 w-5 mr-3 text-green-600 mt-1" />
                <p className="text-gray-700">+91 1234567890</p>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-green-600 mt-1" />
                <p className="text-gray-700">Open Daily: 11:00 AM - 11:00 PM</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Features</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><Check className="h-5 w-5 mr-2 text-green-600" /> Air Conditioned</li>
                <li className="flex items-center"><Check className="h-5 w-5 mr-2 text-green-600" /> Free Parking</li>
                <li className="flex items-center"><Check className="h-5 w-5 mr-2 text-green-600" /> Free WiFi</li>
                <li className="flex items-center"><Check className="h-5 w-5 mr-2 text-green-600" /> Takeaway Available</li>
                <li className="flex items-center"><Check className="h-5 w-5 mr-2 text-green-600" /> Online Ordering</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetail;