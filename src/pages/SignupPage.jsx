import React, { useState } from 'react';
import { Check } from 'lucide-react';

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', mobile: '', address: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      // Save to database (console log for demo)
      console.log('User data saved:', formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', mobile: '', address: '' });
      }, 3000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">Sign Up</h1>
        <p className="text-center text-gray-600 mb-8">Join our community and enjoy exclusive benefits</p>
        
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <Check className="h-16 w-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Welcome to Farmhouse Kitchen!</h2>
            <p className="text-green-700">Your registration was successful.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.mobile ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your complete address"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupPage;