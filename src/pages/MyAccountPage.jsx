import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Lock,
  Calendar,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyAccountPage = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addresses: [],
  });

  // New address input
  const [newAddress, setNewAddress] = useState('');
  const [addingAddress, setAddingAddress] = useState(false);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      if (!token || !userData._id) {
        navigate('/signup');
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/customer/getById/${userData._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomer(res.data.data);
      setFormData({
        fullName: res.data.data.fullName || '',
        email: res.data.data.email || '',
        phone: res.data.data.phone || '',
        addresses: res.data.data.addresses || [],
      });
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError(err.response?.data?.message || 'Failed to load account data');
      if (err.response?.status === 401) {
        navigate('/signup');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAddress = () => {
    if (newAddress.trim()) {
      setFormData((prev) => ({
        ...prev,
        addresses: [...prev.addresses, newAddress.trim()],
      }));
      setNewAddress('');
      setAddingAddress(false);
    }
  };

  const handleRemoveAddress = (index) => {
    setFormData((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/customer/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update customer data
      setCustomer(res.data);
      
      // Update localStorage user data
      localStorage.setItem('user', JSON.stringify(res.data.customer));

      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: customer.fullName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      addresses: customer.addresses || [],
    });
    setEditMode(false);
    setNewAddress('');
    setAddingAddress(false);
    setError(null);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center pt-16 sm:pt-24 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-green-200 border-t-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
        <section
                    className="relative max-w-7xl mx-auto items-center text-white  overflow-hidden min-h-[300px] md:min-h-[400px] rounded-lg"
                    style={{
                        backgroundImage: `linear-gradient(rgba(15,23,43,.9),rgba(15,23,43,.9)), url('/hero-bg.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="mb-8 flex flex-col items-center  mt-30 justify-center text-center">
                        <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                {/* <ShoppingCart className="w-6 h-6 text-white" /> */}
                            </div>
                           My Account
                        </h1>
                        <p className="text-gray-300">View Your Account Details</p>
                    </div>

                </section>

      <div className="max-w-4xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 sm:mb-6 bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 animate-fadeIn">
            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium text-sm sm:text-base">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium text-sm sm:text-base">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">My Account</h1>
                <p className="text-gray-500 flex items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">Member since {formatDate(customer?.createdAt)}</span>
                </p>
              </div>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Edit2 className="h-4 w-4 sm:h-5 sm:w-5" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Account Status Card */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg sm:rounded-xl border-2 border-green-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-green-900 text-base sm:text-lg">Account Status</p>
                <p className="text-xs sm:text-sm text-green-700">
                  Your account is {customer?.status === 'active' ? 'active and verified' : customer?.status}
                </p>
              </div>
            </div>
            <span
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm self-start sm:self-auto ${
                customer?.status === 'active'
                  ? 'bg-green-500 text-white'
                  : 'bg-yellow-500 text-white'
              }`}
            >
              {customer?.status?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <User className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            Personal Information
          </h2>

          <div className="space-y-4 sm:space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                  <p className="text-gray-900 font-medium text-sm sm:text-base break-words">{customer?.fullName}</p>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                  <p className="text-gray-900 font-medium text-sm sm:text-base break-words">{customer?.phone}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Enter your email address"
                />
              ) : (
                <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                  <p className="text-gray-900 font-medium text-sm sm:text-base break-all">
                    {customer?.email || 'Not provided'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              Saved Addresses
            </h2>
            {editMode && !addingAddress && (
              <button
                onClick={() => setAddingAddress(true)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-semibold flex items-center justify-center gap-2 border border-green-200 text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                Add New
              </button>
            )}
          </div>

          {/* Add New Address Form */}
          {editMode && addingAddress && (
            <div className="mb-4 p-3 sm:p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                New Address
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Enter complete address..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddAddress}
                    className="flex-1 sm:flex-none px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-5 w-5 mx-auto" />
                  </button>
                  <button
                    onClick={() => {
                      setAddingAddress(false);
                      setNewAddress('');
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <X className="h-5 w-5 mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Addresses List */}
          {formData.addresses.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
              <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium text-sm sm:text-base">No addresses saved</p>
              {editMode && (
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Add your first address to get started
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {formData.addresses.map((address, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-300 transition-colors"
                >
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="flex-1 text-gray-900 text-sm sm:text-base break-words">{address}</p>
                  {editMode && (
                    <button
                      onClick={() => handleRemoveAddress(index)}
                      className="text-red-600 hover:text-red-800 transition-colors p-1 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {editMode && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
          <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs sm:text-sm font-semibold text-blue-900">
              Your information is secure
            </p>
            <p className="text-xs text-blue-700 mt-1">
              We use industry-standard encryption to protect your personal data. Your
              information is never shared with third parties.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MyAccountPage;