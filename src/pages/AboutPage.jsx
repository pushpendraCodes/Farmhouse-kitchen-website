import React from 'react';
import { Leaf, Users, ChefHat } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">About Farmhouse Kitchen</h1>
      
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800" alt="Restaurant" className="rounded-lg shadow-lg w-full h-96 object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2015, Farmhouse Kitchen started with a simple vision: to bring authentic, farm-fresh cuisine to our community. What began as a small family restaurant has grown into three beloved locations across the city.
          </p>
          <p className="text-gray-700 mb-4">
            We believe in using only the freshest ingredients, sourced directly from local farms. Our commitment to quality and sustainability has made us a favorite among food lovers who appreciate authentic flavors and responsible dining.
          </p>
          <p className="text-gray-700">
            Every dish is prepared with love and attention to detail, ensuring that each visit to Farmhouse Kitchen is a memorable culinary experience.
          </p>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Our Mission</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <Leaf className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-bold mb-2">Sustainability</h3>
            <p className="text-gray-600">Supporting local farmers and sustainable practices</p>
          </div>
          <div>
            <Users className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-gray-600">Creating a welcoming space for everyone</p>
          </div>
          <div>
            <ChefHat className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-bold mb-2">Excellence</h3>
            <p className="text-gray-600">Delivering exceptional food and service</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Chef Rajesh Kumar', role: 'Head Chef', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400' },
            { name: 'Priya Sharma', role: 'Restaurant Manager', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
            { name: 'Chef Amit Patel', role: 'Pastry Chef', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400' }
          ].map((member, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={member.image} alt={member.name} className="w-full h-64 object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold mb-1 text-gray-800">{member.name}</h3>
                <p className="text-green-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
