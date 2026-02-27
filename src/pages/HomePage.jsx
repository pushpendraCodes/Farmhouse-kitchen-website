import React from 'react';
import { Menu, X, Phone, MapPin, Clock, Users, Utensils, Award, ChefHat, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import AOS from "aos";
import "aos/dist/aos.css";
import axios from 'axios';
const HomePage = () => {


  useEffect(() => {
    AOS.init({
      duration: 700, // Animation duration in ms
      // Animation only happens once when scrolling down
      easing: "ease-out-cubic",
      offset: 50,    // Offset (px) from the original trigger point
    });
  }, []);




  const [branches, setBranches] = useState([]);
  const [menuItems, setMenu] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branchOffers, setBranchOffers] = useState({}); // { branchId: offer }
  const [menuOffers, setMenuOffers] = useState({}); // { menuItemId: offer }


  const [selectedBranch, setSelectedBranch] = useState("");
  const [people, setPeople] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const Navigate = useNavigate()
  useEffect(() => {
    fetchBranches();
    fetchTopRatedMenu()
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/branches/get-all?all=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch branches');
      }

      const branchList = data.data || [];
      setBranches(branchList);

      // Fetch active offers for each branch
      branchList.forEach(async (branch) => {
        try {
          const offerRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/customer/offer/branch/${branch._id}/active`
          );
          const offerData = await offerRes.json();
          if (offerRes.ok && offerData.data) {
            const activeOffer = Array.isArray(offerData.data) ? offerData.data[0] : offerData.data;
            if (activeOffer) {
              setBranchOffers(prev => ({ ...prev, [branch._id]: activeOffer }));
            }
          }
        } catch (e) {
          // silently ignore offer fetch errors
        }
      });
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err.message || 'Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {

    if (!localStorage.getItem("token")) {
      alert("Please login to book a table")
      Navigate("/login")
      return
    }

    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.target;
    const customerName = form[0].value.trim();
    const customerEmail = form[1].value.trim();
    const customerPhone = form[2].value.trim();
    const bookingDateTime = form[4].value;
    const specialRequests = form[6].value.trim();

    // Split datetime-local into date & time parts
    const [bookingDate, bookingTime] = bookingDateTime.split("T");
    const customerId = JSON.parse(localStorage.getItem("user"))?._id || null
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/customer/order/table-booking`, {
        customerId: customerId,
        customerName,
        customerPhone,
        customerEmail,
        branchId: selectedBranch,
        bookingDate,
        bookingTime,
        numberOfGuests: Number(people),
        specialRequests,
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (data.success) {
        setMessage("✅ Table booking request sent successfully!");
        form.reset();
        setSelectedBranch("");
        setPeople(1);
      } else {
        setMessage("❌ Failed to book table. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Server error occurred.");
    } finally {
      setLoading(false);
    }
  };
  const fetchTopRatedMenu = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/menus/analytics/top-rated`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch menu');
      }

      const items = data.data || [];
      setMenu(items);

      // Fetch active offers for each menu item
      items.forEach(async (item) => {
        try {
          const offerRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/customer/offer/menu-item/${item._id}/active`
          );
          const offerData = await offerRes.json();
          if (offerRes.ok && offerData.data) {
            const activeOffer = Array.isArray(offerData.data) ? offerData.data[0] : offerData.data;
            if (activeOffer) {
              setMenuOffers(prev => ({ ...prev, [item._id]: activeOffer }));
            }
          }
        } catch (e) {
          // silently ignore offer fetch errors
        }
      });
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError(err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-white">



      {/* Hero Section */}
      <section
        id="home"
        className="relative max-w-7xl mx-auto text-white py-32 overflow-hidden min-h-[600px]"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,43,.9),rgba(15,23,43,.9)), url('/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div data-aos="fade-up" className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Text Section */}
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Enjoy Our<br />
              Delicious Meal
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu
              diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet
              lorem sit clita duo justo magna dolore erat amet.
            </p>
            <Link to="/booking" className="bg-amber-600 px-8 py-3 rounded-lg text-lg hover:bg-amber-700 transition">
              BOOK A TABLE
            </Link>
          </div>
          {/* Right Rotating Image */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl animate-slow-spin border-4 border-amber-600">
            <img
              src="/hero.png"
              alt="Delicious Meal"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>


      <div data-aos="fade-up"
        className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Our Branches</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {branches.map(branch => (
            <Link
              key={branch.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer transform hover:scale-105"
              to={`/branch/${branch._id}`}
            >
              <div className="relative">
                <img src={branch?.pictures[0]} alt={branch.name} className="w-full h-48 object-cover" />
                {branchOffers[branch._id] && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                    <Tag className="h-3 w-3" />
                    {branchOffers[branch._id].title}
                    {branchOffers[branch._id].discount?.type === 'PERCENTAGE'
                      ? ` - ${branchOffers[branch._id].discount.percentageOff}% OFF`
                      : branchOffers[branch._id].discount?.type === 'FLAT'
                        ? ` - ₹${branchOffers[branch._id].discount.flatAmount} OFF`
                        : ''}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{branch.name}</h3>
                <p className="text-gray-600 mb-4">{branch.description}</p>
                <div className="flex items-center text-amber-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {branch?.address
                      ? `${branch.address.street || ""}, ${branch.address.city || ""}, ${branch.address.state || ""
                      }, ${branch.address.country || ""} - ${branch.address.zipCode || ""}`
                      : "Address not available"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>


      {/* Service Features */}


      {/* About Section */}
      <section data-aos="fade-up" id="about" className="py-20 ">
        <div className="container mx-auto px-4 max-w-7xl">
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

      {/* Menu Section */}
      <section id="menu" data-aos="fade-up" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h5 className="text-amber-600 font-semibold mb-2">Food Menu</h5>
            <h2 className="text-4xl font-bold">Most Popular Items</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {menuItems.length > 0 ? (
              menuItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition"
                >
                  <div className="relative mr-4">
                    <img
                      src={item.pictures?.[0] || "https://via.placeholder.com/80"}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    {menuOffers[item._id] && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                        {menuOffers[item._id].discount?.type === 'PERCENTAGE'
                          ? `${menuOffers[item._id].discount.percentageOff}%`
                          : `₹${menuOffers[item._id].discount?.flatAmount}`}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold">{item.name}</h4>
                      <div className="flex flex-col items-end gap-0.5">
                        {Array.isArray(item.price) ? (
                          item.price.map((p) => (
                            <span key={p._id} className="text-amber-600 font-bold text-sm whitespace-nowrap">
                              {p.serveType.charAt(0).toUpperCase() + p.serveType.slice(1)}: ₹{p.price}
                            </span>
                          ))
                        ) : (
                          <span className="text-amber-600 font-bold">₹{item.discountPrice || item.price}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {item.description
                        ? item.description.slice(0, 100)
                        : "Delicious and freshly prepared meal."}
                      {item.description && item.description.length > 100 && "..."}
                    </p>

                    {menuOffers[item._id] && (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full mt-1">
                        <Tag className="h-3 w-3" />
                        {menuOffers[item._id].title}
                      </span>
                    )}

                    {/* ✅ See More Button Link */}
                    <Link
                      to={`/menus`}
                      className="text-amber-600 text-sm mt-1 inline-block font-medium hover:underline"
                    >
                      See More →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-2 text-gray-500">
                Loading menu items...
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section
        data-aos="fade-up"
        className="min-h-screen flex items-center justify-center px-4 py-12"
      >
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-2xl">
          {/* Left Side - Image */}
          <div className="relative bg-white h-[430px] md:h-auto flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop"
              alt="Restaurant table"
              className="w-full h-full object-cover"
            />
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="bg-amber-400 rounded-full p-0 shadow-lg flex items-center justify-center transition hover:bg-amber-500"
                style={{ width: "100px", height: "100px" }}
              >
                <Play size={50} className="text-[#10162F]" />
              </button>
            </div>
          </div>

          {/* Right Side - Booking Form */}
          <div className="p-10 bg-[#10162F] flex flex-col items-start justify-center h-full w-full">
            <h4 className="text-amber-400 text-xl font-bold mb-1 flex items-center gap-2">
              Reservation
              <span className="h-0.5 w-20 bg-amber-400 ml-2"></span>
            </h4>
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-8 mt-2">
              Book A Table Online
            </h1>

            <form className="w-full space-y-5" onSubmit={handleSubmit}>
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="bg-white text-[#10162F] rounded px-5 py-4 w-full font-medium outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-white text-[#10162F] rounded px-5 py-4 w-full font-medium outline-none"
                  required
                />
              </div>

              {/* Phone */}
              <div className="grid grid-cols-1 my-2 md:grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  className="bg-white text-[#10162F] rounded px-5 py-4 w-full font-medium outline-none"
                  required
                />
              </div>

              {/* Branch Dropdown */}
              <select
                className="bg-white text-[#10162F] rounded px-5 py-4 my-2 w-full font-medium outline-none"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                required
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name} — {branch.address?.city}
                  </option>
                ))}
              </select>

              {/* Date & People */}
              <div className="grid grid-cols-1 md:grid-cols-2 my-2 gap-4">
                <input
                  type="datetime-local"
                  className="bg-white text-[#10162F] rounded px-5 py-4 w-full font-medium outline-none"
                  required
                />
                <select
                  className="bg-white text-[#10162F] rounded px-5 py-4 w-full font-medium outline-none"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  required
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      People {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Special Request */}
              <textarea
                rows={3}
                placeholder="Special Request"
                className="bg-white text-[#10162F] rounded px-5 py-4 w-full font-medium outline-none"
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-400 text-[#10162F] font-bold text-lg w-full rounded mt-2 py-4 transition hover:bg-amber-600"
              >
                {loading ? "Booking..." : "BOOK NOW"}
              </button>

              {message && (
                <p className="text-center text-sm text-white mt-2">{message}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      <section data-aos="fade-up" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
              <Users className="mx-auto mb-4 text-amber-600" size={48} />
              <h3 className="text-xl font-bold mb-2">Master Chefs</h3>
              <p className="text-gray-600">Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
              <Utensils className="mx-auto mb-4 text-amber-600" size={48} />
              <h3 className="text-xl font-bold mb-2">Quality Food</h3>
              <p className="text-gray-600">Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
              <Phone className="mx-auto mb-4 text-amber-600" size={48} />
              <h3 className="text-xl font-bold mb-2">Online Order</h3>
              <p className="text-gray-600">Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition">
              <Clock className="mx-auto mb-4 text-amber-600" size={48} />
              <h3 className="text-xl font-bold mb-2">24/7 Service</h3>
              <p className="text-gray-600">Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam</p>
            </div>
          </div>
        </div>
      </section>


      {/* Team Section */}
      <section data-aos="fade-up" id="team" className="py-20">
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


    </div>
  );
};

export default HomePage;