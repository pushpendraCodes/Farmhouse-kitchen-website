import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Trash2, Plus, Minus, ShoppingCart, CreditCard, X,
    Smartphone, QrCode, Wallet, CheckCircle, ArrowLeft,
    Package, MapPin, Clock, Phone, User, Home
} from 'lucide-react';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentStep, setPaymentStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
    const [loading, setLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState({
        orderType: 'delivery',
        customerName: '',
        customerPhone: '',
        deliveryAddress: '',
        tableNumber: '',
        branchId: '',
        specialInstruction: ""
    });

    const customerId = JSON.parse(localStorage.getItem("user"))._id;
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchCart();
        fetchCustomerDetails();
    }, []);

    const validateOrderDetails = () => {
        const { orderType, customerName, customerPhone, deliveryAddress, tableNumber } = orderDetails;

        if (!customerName.trim()) {
            alert("Please enter your full name.");
            return false;
        }

        if (!customerPhone.trim() || !/^\d{10}$/.test(customerPhone)) {
            alert("Please enter a valid 10-digit phone number.");
            return false;
        }

        if (orderType === 'delivery' && !deliveryAddress.trim()) {
            alert("Please enter your delivery address.");
            return false;
        }

        if (orderType === 'dine_in' && !tableNumber.trim()) {
            alert("Please enter your table number.");
            return false;
        }

        return true;
    };

    const handleContinueToPayment = () => {
        if (validateOrderDetails()) {
            setPaymentStep(2);
        }
    };

    const fetchCustomerDetails = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/customer/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setOrderDetails(prev => ({
                    ...prev,
                    customerName: data.customer.fullName || '',
                    customerPhone: data.customer.phone || ''
                }));
            }
        } catch (err) {
            console.error("Error fetching customer details:", err);
        }
    };

    const fetchCart = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/customer/get-cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setCartItems(
                    data.cart.map(item => ({
                        id: item.menu._id,
                        name: item.menu.name,
                        price: item.menu.price,
                        branch: item.menu.branch,
                        discountPrice: item.menu.discountPrice,
                        image: item.menu.pictures?.[0],
                        quantity: item.quantity,
                        category: item.menu.category,

                    }))
                );
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
        }
    };

    const updateQuantity = async (menuId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/customer/update-cart-quantity`,
                { menuId, quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) fetchCart();
        } catch (err) {
            console.error("Error updating quantity:", err);
        }
    };

    const removeItem = async (menuId) => {
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/customer/remove-item-cart`,
                { menuId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) fetchCart();
        } catch (err) {
            console.error("Error removing item:", err);
        }
    };

    const calculatePricing = () => {
        const subtotal = cartItems.reduce((sum, item) => {
            const itemPrice = item.discountPrice || item.price;
            return sum + itemPrice * item.quantity;
        }, 0);
        const tax = subtotal * 0.05;
        const deliveryFee = orderDetails.orderType === 'delivery' ? 50 : 0;
        const total = subtotal + tax + deliveryFee;

        return { subtotal, tax, deliveryFee, total };
    };

    const { subtotal, tax, deliveryFee, total } = calculatePricing();

    const handleCheckout = () => {
        if (cartItems.length === 0) return;
        setShowPaymentModal(true);
        setPaymentStep(1);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const orderData = {
                // orderType: orderDetails.orderType,
                customerId: customerId || undefined,
                customerName: orderDetails.customerName,
                customerPhone: orderDetails.customerPhone,
                branchId: cartItems[0].branch || '674cb9bc29d31a31a8daa47d', // Use actual branch ID
                items: cartItems.map(item => ({
                    menuId: item.id,
                    quantity: item.quantity
                })),
                paymentMethod: paymentMethod,
                deliveryAddress: orderDetails.deliveryAddress,
                // tableNumber: orderDetails.orderType === 'dine_in' ? orderDetails.tableNumber : undefined,
                // deliveryFee: deliveryFee
                specialInstructions: orderDetails.specialInstruction || ""
            };

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/customer/order/delivery-book`,
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                setPaymentStep(3);
                // Clear cart after successful order
                setTimeout(() => {
                    setShowPaymentModal(false);
                    setCartItems([]);
                    setPaymentStep(1);
                }, 3000);
            }
        } catch (err) {
            console.error("Error placing order:", err);
            alert(err.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4  "> 
        
         <section
          className="relative max-w-7xl mx-auto text-white py-40 overflow-hidden min-h-[350px]"
            style={{
                backgroundImage: `linear-gradient(rgba(15,23,43,.9),rgba(15,23,43,.9)), url('/hero-bg.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="mb-8 flex flex-col items-center  justify-center text-center">
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                    Item Cart
                </h1>
                <p className="text-gray-300">Review your items and checkout</p>
            </div>

        </section>



            <div className="max-w-7xl mx-auto">
                {/* Header */}


                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                            {cartItems.length === 0 ? (
                                <div className="p-16 text-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <ShoppingCart className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                                    <p className="text-gray-500">Add some delicious items to get started!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <div className="flex gap-6">
                                                {/* Product Image */}
                                                <div className="relative">
                                                    <img
                                                        src={item.image || 'https://via.placeholder.com/150'}
                                                        alt={item.name}
                                                        className="w-28 h-28 object-cover rounded-xl shadow-md"
                                                    />
                                                    {item.discountPrice && (
                                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                            {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                                                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mt-1">
                                                                {item.category}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center gap-2 mb-4">
                                                        {item.discountPrice ? (
                                                            <>
                                                                <span className="text-2xl font-bold text-gray-900">₹{item.discountPrice}</span>
                                                                <span className="text-lg text-gray-400 line-through">₹{item.price}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                                                        )}
                                                    </div>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="p-3 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                            </button>
                                                            <span className="px-6 font-bold text-lg">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="p-3 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-500">Subtotal</p>
                                                            <p className="font-bold text-xl text-gray-900">
                                                                ₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Summary */}
                    {
                        cartItems.length > 0 && <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax (5%)</span>
                                        <span className="font-semibold">₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery Fee</span>
                                        <span className="font-semibold">
                                            {deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee.toFixed(2)}`}
                                        </span>
                                    </div>

                                    <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-bold text-blue-600">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    disabled={cartItems.length === 0}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg transition-all"
                                >
                                    <CreditCard className="w-6 h-6" /> Proceed to Checkout
                                </button>

                                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                                    <p className="text-sm text-green-800 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="font-semibold">Safe & Secure Payment</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                            <h3 className="text-2xl font-bold text-white">
                                {paymentStep === 1 && "Order Details"}
                                {paymentStep === 2 && "Payment Method"}
                                {paymentStep === 3 && "Order Confirmed"}
                            </h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Step 1: Order Details */}
                            {paymentStep === 1 && (
                                <div className="space-y-6">
                                    {/* Order Type */}
                                    {/* <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Order Type</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'delivery', label: 'Delivery', icon: Package },
                        { value: 'dine_in', label: 'Dine In', icon: Home },
                        { value: 'table_booking', label: 'Booking', icon: Clock }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setOrderDetails({...orderDetails, orderType: value})}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            orderDetails.orderType === value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                            orderDetails.orderType === value ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <p className={`font-semibold text-sm ${
                            orderDetails.orderType === value ? 'text-blue-600' : 'text-gray-700'
                          }`}>{label}</p>
                        </button>
                      ))}
                    </div>
                  </div> */}

                                    {/* Customer Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <User className="w-4 h-4 inline mr-2" />
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={orderDetails.customerName}
                                                onChange={(e) => setOrderDetails({ ...orderDetails, customerName: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={orderDetails.customerPhone}
                                                onChange={(e) => setOrderDetails({ ...orderDetails, customerPhone: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                    </div>

                                    {/* Conditional Fields */}
                                    {orderDetails.orderType === 'delivery' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    <MapPin className="w-4 h-4 inline mr-2" />
                                                    Delivery Address
                                                </label>
                                                <textarea
                                                    value={orderDetails.deliveryAddress}
                                                    onChange={(e) => setOrderDetails({ ...orderDetails, deliveryAddress: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                    rows="3"
                                                    placeholder="Enter complete delivery address"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                                    <MapPin className="w-4 h-4 inline mr-2" />
                                                    Special Insuction
                                                </label>
                                                <textarea
                                                    value={orderDetails.specialInstruction}
                                                    onChange={(e) => setOrderDetails({ ...orderDetails, specialInstruction: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                    rows="3"
                                                    placeholder="Enter if any Instruction"
                                                />
                                            </div>
                                        </>

                                    )}


                                    {/* {orderDetails.orderType === 'dine_in' && (
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Table Number
                                            </label>
                                            <input
                                                type="text"
                                                value={orderDetails.tableNumber}
                                                onChange={(e) => setOrderDetails({ ...orderDetails, tableNumber: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter table number"
                                            />
                                        </div>
                                    )} */}

                                    {/* Order Summary */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h4 className="font-bold text-gray-900 mb-3">Order Summary</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tax (5%)</span>
                                                <span className="font-semibold">₹{tax.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Delivery Fee</span>
                                                <span className="font-semibold">₹{deliveryFee.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-gray-200 text-lg">
                                                <span className="font-bold">Total</span>
                                                <span className="font-bold text-blue-600">₹{total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleContinueToPayment}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                                    >
                                        Continue to Payment
                                        <ArrowLeft className="w-5 h-5 rotate-180" />
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Payment Method */}
                            {paymentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { value: 'upi', label: 'UPI', icon: Smartphone, color: 'from-purple-500 to-pink-500' },
                                            { value: 'card', label: 'Card', icon: CreditCard, color: 'from-blue-500 to-cyan-500' },
                                            { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: Wallet, color: 'from-green-500 to-emerald-500' },
                                            { value: 'online', label: 'Online Banking', icon: Wallet, color: 'from-orange-500 to-red-500' }
                                        ].map(({ value, label, icon: Icon, color }) => (
                                            <button
                                                key={value}
                                                onClick={() => setPaymentMethod(value)}
                                                className={`p-6 rounded-xl border-2 transition-all ${paymentMethod === value
                                                    ? 'border-blue-600 bg-blue-50 scale-105'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <p className={`font-bold ${paymentMethod === value ? 'text-blue-600' : 'text-gray-700'
                                                    }`}>{label}</p>
                                            </button>
                                        ))}
                                    </div>

                                    {/* UPI QR Code */}
                                    {paymentMethod === 'upi' && (
                                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                                            <div className="text-center mb-4">
                                                <QrCode className="w-48 h-48 mx-auto text-purple-600 bg-white p-4 rounded-xl" />
                                                <p className="mt-4 font-bold text-gray-900">Scan QR Code to Pay</p>
                                                <p className="text-sm text-gray-600 mt-1">Use any UPI app to complete payment</p>
                                                <p className="text-2xl font-bold text-purple-600 mt-3">₹{total.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setPaymentStep(1)}
                                            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handlePlaceOrder}
                                            disabled={!paymentMethod || loading}
                                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    Confirm Order
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Order Confirmed */}
                            {paymentStep === 3 && (
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-12 h-12 text-green-600" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-3">Order Placed Successfully!</h3>
                                    <p className="text-gray-600 mb-6">Your order has been confirmed and is being processed.</p>
                                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                        <p className="text-sm text-gray-600 mb-2">Order Total</p>
                                        <p className="text-4xl font-bold text-green-600">₹{total.toFixed(2)}</p>
                                    </div>
                                    <p className="text-sm text-gray-500">Redirecting to home page...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}