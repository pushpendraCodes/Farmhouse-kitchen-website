import React from 'react';

import { Menu, X, Phone, MapPin, Clock, Users, Utensils, Award, ChefHat } from 'lucide-react';
const AboutPage = () => {
  return (
   <>

    {/* Hero Section */}
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
        <div className="container mx-auto px-4 text-center  gap-10">
         <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center leading-tight">
            About Us
            </h1>
        </div>
      </section>
      <section id="about" className="py-20">
           <div className="container max-w-7xl mx-auto px-4">
             <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="grid grid-cols-2 gap-4">
                 <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=500&fit=crop" alt="Restaurant" className="rounded-lg shadow-lg w-full h-64 object-cover" />
                 <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=500&fit=crop" alt="Food" className="rounded-lg shadow-lg w-full h-64 object-cover mt-8" />
                 <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=500&fit=crop" alt="Dining" className="rounded-lg shadow-lg w-full h-64 object-cover" />
                 <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=500&fit=crop" alt="Cuisine" className="rounded-lg shadow-lg w-full h-64 object-cover mt-8" />
               </div>
               <div>
                 <h5 className="text-amber-600 font-semibold mb-2">About Us</h5>
                 <h2 className="text-4xl font-bold mb-4">Welcome to <span className="text-amber-600">FarmHouse</span></h2>
                 <p className="text-gray-600 mb-4">
                   Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos erat ipsum et lorem et sit, sed stet lorem sit.
                 </p>
                 <p className="text-gray-600 mb-6">
                   Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet
                 </p>
                 <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="flex items-center">
                     <Award className="text-amber-600 mr-3" size={32} />
                     <div>
                       <h4 className="text-2xl font-bold">15</h4>
                       <p className="text-sm text-gray-600">Years of<br />EXPERIENCE</p>
                     </div>
                   </div>
                   <div className="flex items-center">
                     <Users className="text-amber-600 mr-3" size={32} />
                     <div>
                       <h4 className="text-2xl font-bold">50</h4>
                       <p className="text-sm text-gray-600">Popular<br />MASTER CHEFS</p>
                     </div>
                   </div>
                 </div>
                 <button className="bg-amber-600 px-8 py-3 rounded text-white hover:bg-amber-700 transition">
                   READ MORE
                 </button>
               </div>
             </div>
           </div>
         </section>


          {/* Team Section */}
      <section id="team" className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h5 className="text-amber-600 font-semibold mb-2">Team Members</h5>
            <h2 className="text-4xl font-bold">Our Master Chefs</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: 'Full Name', role: 'Designation', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&h=400&fit=crop' },
              { name: 'Full Name', role: 'Designation', image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=300&h=400&fit=crop' },
              { name: 'Full Name', role: 'Designation', image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=300&h=400&fit=crop' },
              { name: 'Full Name', role: 'Designation', image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=300&h=400&fit=crop' }
            ].map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img src={member.image} alt={member.name} className="w-full h-80 object-cover group-hover:scale-110 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end justify-center pb-4">
                    <div className="flex gap-2">
                      <a href="#" className="w-10 h-10 bg-amber-600 rounded flex items-center justify-center hover:bg-amber-700">
                        <span className="text-white text-sm">f</span>
                      </a>
                      <a href="#" className="w-10 h-10 bg-amber-600 rounded flex items-center justify-center hover:bg-amber-700">
                        <span className="text-white text-sm">t</span>
                      </a>
                      <a href="#" className="w-10 h-10 bg-amber-600 rounded flex items-center justify-center hover:bg-amber-700">
                        <span className="text-white text-sm">in</span>
                      </a>
                    </div>
                  </div>
                </div>
                <h4 className="text-xl font-bold">{member.name}</h4>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
   </>
  );
};

export default AboutPage;
