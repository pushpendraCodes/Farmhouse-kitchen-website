import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Get form values
    const form = e.target;
    const name = form[0].value.trim();
    const mobile = form[1].value.trim();
    const email = form[2].value.trim();
    const address = form[3].value.trim();

    try {
      // 🔹 Make API call (adjust endpoint as needed)
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/register`, {
        fullName:name,
        phone: mobile,
        email,
        address,
      });

      if (data.success) {
        setMessage("✅ Account created successfully!");
        form.reset();
           setTimeout(() => {
                    navigate("/login");
                }, 1000);
      } else {
        setMessage(data.message || "❌ Signup failed, please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section
        id="home"
        className="relative max-w-7xl mx-auto text-white py-32 overflow-hidden min-h-[400px]"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,43,.9),rgba(15,23,43,.9)), url('/hero-bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-4 text-center gap-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center leading-tight">
            Sign Up
          </h1>
        </div>
      </section>

      {/* Signup Form */}
      <section className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-amber-600 mb-2 text-center">
            Sign Up
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Create your account to book a table and access exclusive features!
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-amber-600 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-amber-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-800"
                required
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-amber-600 mb-2">
                Mobile
              </label>
              <input
                type="tel"
                placeholder="Enter your mobile number"
                className="w-full border border-amber-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-800"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-amber-600 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border border-amber-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-800"
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-amber-600 mb-2">
                Address
              </label>
              <textarea
                rows={3}
                placeholder="Enter your address"
                className="w-full border border-amber-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-600 text-gray-800"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 transition text-white font-bold rounded-md text-lg shadow-lg"
            >
              {loading ? "Creating..." : "CREATE ACCOUNT"}
            </button>
          </form>
 <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-600 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>

          {/* Message */}
          {message && (
            <p className="text-center text-gray-700 font-medium mt-4">
              {message}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
