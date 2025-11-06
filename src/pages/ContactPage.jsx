import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Check } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send to backend or email service
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Get in Touch</h2>
          
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <Check className="h-12 w-12 mb-4 text-green-600" />
              <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
              <p className="text-green-700">We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Information</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 mr-4 text-green-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-1">Address</h3>
                <p className="text-gray-700">Bazaz Nagar, Main Street</p>
                <p className="text-gray-700">Indore, Madhya Pradesh</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-6 w-6 mr-4 text-green-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-1">Phone</h3>
                <p className="text-gray-700">+91 1234567890</p>
                <p className="text-gray-700">+91 0987654321</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-6 w-6 mr-4 text-green-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-1">Email</h3>
                <p className="text-gray-700">info@farmhousekitchen.com</p>
                <p className="text-gray-700">support@farmhousekitchen.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-6 w-6 mr-4 text-green-600 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-1">Hours</h3>
                <p className="text-gray-700">Monday - Sunday</p>
                <p className="text-gray-700">11:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-green-50 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-2">Visit Us</h3>
            <p className="text-gray-700">
              We'd love to see you at any of our three locations. Walk-ins are welcome, 
              or you can make a reservation by calling us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;