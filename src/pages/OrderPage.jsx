import React, { useState } from 'react';
import { X, Check, CreditCard } from 'lucide-react';

const OrderPage = () => {
  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const menuItems = [
    { id: 1, name: 'Paneer Tikka', category: 'veg', price: 250, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400' },
    { id: 2, name: 'Veg Spring Rolls', category: 'veg', price: 180, image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400' },
    { id: 3, name: 'Chicken Tikka', category: 'nonveg', price: 320, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
    { id: 4, name: 'Dal Makhani', category: 'veg', price: 220, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
    { id: 5, name: 'Paneer Butter Masala', category: 'veg', price: 280, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400' },
    { id: 6, name: 'Butter Chicken', category: 'nonveg', price: 350, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
  ];

  const addToCart = (item) => {
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = total * 0.05;
  const grandTotal = total + tax;

  const handlePayment = () => {
    setShowPayment(true);
  };

  const processPayment = (method) => {
    console.log('Processing payment via', method);
    console.log('Order details:', cart);
    setOrderConfirmed(true);
    setTimeout(() => {
      setOrderConfirmed(false);
      setCart([]);
      setShowPayment(false);
    }, 5000);
  };

  if (orderConfirmed) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <Check className="h-20 w-20 mx-auto mb-6 text-green-600" />
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-6">Thank you for your order</p>
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 font-bold text-xl mt-4">
              <span>Total Paid</span>
              <span className="text-green-600">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-gray-600">Your order will be ready in 30-40 minutes</p>
          <p className="text-sm text-gray-500 mt-2">Order ID: #{Math.floor(Math.random() * 10000)}</p>
        </div>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Payment</h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between py-2 border-b">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 mt-4">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 font-bold text-xl border-t-2">
                <span>Total</span>
                <span className="text-green-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Payment Method</h2>
              <div className="space-y-4">
                <button
                  onClick={() => processPayment('razorpay')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition flex items-center justify-center"
                >
                  <CreditCard className="mr-2" />
                  Pay with Razorpay
                </button>
                <button
                  onClick={() => processPayment('stripe')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg transition flex items-center justify-center"
                >
                  <CreditCard className="mr-2" />
                  Pay with Stripe
                </button>
                <button
                  onClick={() => processPayment('cod')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition"
                >
                  Cash on Delivery
                </button>
                <button
                  onClick={() => setShowPayment(false)}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-lg transition"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Order Online</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Items</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {menuItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-bold text-xl">₹{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Cart</h2>
            
            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="border-b pb-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{item.name}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full"
                          >
                            -
                          </button>
                          <span className="font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl border-t pt-2">
                    <span>Total</span>
                    <span className="text-green-600">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
                >
                  Proceed to Payment
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;