import React from 'react';
import { Utensils, ShoppingBag, Users, ShoppingCart, Car, Wifi, CreditCard, Clock, Check } from 'lucide-react';
import { Music } from 'lucide-react';

const FacilityPage = () => {
  const facilities = [
    { icon: Utensils, title: 'Dine-In', description: 'Comfortable seating with elegant ambiance' },
    { icon: Music, title: 'DJ Flower', description: 'DJ Flower' },
    { icon: Users, title: 'Catering', description: 'Full-service catering for events' },
    { icon: ShoppingCart, title: 'Online Order', description: 'Order from home with ease' },
    { icon: Car, title: 'Free Parking', description: 'Ample parking space for guests' },
    { icon: Wifi, title: 'Free WiFi', description: 'Stay connected while you dine' },
    { icon: CreditCard, title: 'Card Payment', description: 'All major cards accepted' },
    { icon: Clock, title: 'Extended Hours', description: 'Open till late for your convenience' }
  ];

  return (

    <>
  {/* Hero Section */}
      <section
        id="home"
        className="relative max-w-7xl mx-auto text-white py-40 overflow-hidden min-h-[350px]"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,43,.9),rgba(15,23,43,.9)), url('/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="container mx-auto px-4 text-center  gap-10">
         <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center leading-tight">
         Facilities
            </h1>
        </div>
      </section>
 <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Our Facilities</h1>
      <p className="text-center text-gray-600 mb-12 text-lg">
        We offer a range of services to make your dining experience exceptional
      </p>

      <div className="grid md:grid-cols-4 gap-8">
        {facilities.map((facility, idx) => (
          <div
            key={idx}
            className="bg-white hover:text-white  rounded-lg shadow-lg p-6 text-center hover:shadow-xl hover:bg-amber-500 transition-colors duration-300"
          >
            <facility.icon className="h-12 w-12 mx-auto mb-4 text-amber-500 hover:text-white" />
            <h3 className="text-xl font-bold mb-2  ">{facility.title}</h3>
            <p className="">{facility.description}</p>
          </div>

        ))}
      </div>

      <div className="mt-16 bg-green-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Special Services</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Private Events</h3>
            <p className="text-gray-700 mb-4">
              Host your special occasions in our private dining areas. Perfect for birthdays, anniversaries, and corporate events.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center"><Check className="h-5 w-5 mr-2 text-green-600" /> Customized menus</li>
              <li className="flex items-center"><Check className="h-5 w-5 mr-2 text-green-600" /> Dedicated staff</li>
              <li className="flex items-center"><Check className="h-5 w-5 mr-2 text-green-600" /> Audio/visual equipment</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Catering Services</h3>
            <p className="text-gray-700 mb-4">
              Let us bring the Farmhouse Kitchen experience to your location with our full-service catering.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center"><Check className="h-5 w-5 mr-2 text-green-600" /> On-site cooking</li>
              <li className="flex items-center"><Check className="h-5 w-5 mr-2 text-green-600" /> Professional servers</li>
              <li className="flex items-center"><Check className="h-5 w-5 mr-2 text-green-600" /> Complete setup & cleanup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
   
  );
};

export default FacilityPage;