import React from 'react';
import { Menu, X, Phone, MapPin, Clock, Users, Utensils, Award, ChefHat, Tag, Star, ArrowRight, Sparkles, Quote, Leaf, Soup } from 'lucide-react';
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

  // Premium scroll-reveal: reveal elements with the `.reveal` class as they enter view
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [branches, menuItems]);

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


  const formatAddress = (address) => {
    if (!address) return "Address not available";
    const parts = [
      address.street,
      address.city,
      address.state,
      address.country,
    ].filter(Boolean);
    const zip = address.zipCode ? ` - ${address.zipCode}` : "";
    return parts.length ? `${parts.join(", ")}${zip}` : "Address not available";
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] overflow-x-hidden">

      {/* ============ Hero Section ============ */}
      <section
        id="home"
        className="relative text-white overflow-hidden min-h-screen flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(8,11,24,.86),rgba(8,11,24,.92)), url('/hero-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Decorative floating orbs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-amber-600/10 blur-3xl animate-float" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,162,78,0.12),transparent_45%)]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 md:pt-32 md:pb-20 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          {/* Left Text Section */}
          <div className="w-full max-w-xl text-center lg:text-left">
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-amber-300 mb-5">
              <Sparkles className="h-4 w-4 shrink-0" /> Fine Dining • Farm to Table
            </span>
            <h1 className="animate-fade-up font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-5 leading-[1.1]" style={{ animationDelay: '0.1s' }}>
              Enjoy Our <br />
              <span className="gold-shimmer-text">Delicious Meal</span>
            </h1>
            <p className="animate-fade-up text-base sm:text-lg mb-8 text-gray-300/90 leading-relaxed max-w-lg mx-auto lg:mx-0" style={{ animationDelay: '0.2s' }}>
              Savour handcrafted dishes made from the freshest farm ingredients,
              served in an atmosphere designed to make every visit unforgettable.
            </p>
            <div className="animate-fade-up flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/booking"
                className="btn-premium bg-gradient-to-r from-amber-500 to-amber-600 px-7 py-3.5 rounded-full text-sm sm:text-base font-bold tracking-wide text-[#0b1020] shadow-lg"
              >
                BOOK A TABLE
              </Link>
              <Link
                to="/menus"
                className="btn-premium border border-amber-400/60 px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold tracking-wide text-amber-200 hover:text-white"
              >
                EXPLORE MENU
              </Link>
            </div>

            {/* Stats strip */}
            <div className="animate-fade-up mt-10 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto lg:mx-0" style={{ animationDelay: '0.45s' }}>
              {[
                { n: '15+', l: 'Years' },
                { n: '50+', l: 'Master Chefs' },
                { n: '20k+', l: 'Happy Guests' },
              ].map((s) => (
                <div key={s.l} className="text-center lg:text-left">
                  <div className="font-display text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">{s.n}</div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Rotating Image with glowing ring */}
          <div className="relative animate-scale-in shrink-0 flex items-center justify-center p-10 sm:p-14" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-8 sm:inset-10 rounded-full border border-dashed border-amber-400/40 animate-ring" />
            <div className="absolute inset-2 sm:inset-4 rounded-full border border-amber-400/10" />
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl animate-slow-spin ring-4 ring-amber-500/70 animate-glow">
              <img
                src="/hero.png"
                alt="Delicious Meal"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute bottom-6 left-2 sm:left-6 glass-dark rounded-2xl px-4 py-2.5 flex items-center gap-3 animate-bounce-soft">
              <Star className="h-5 w-5 text-amber-400 fill-amber-400 shrink-0" />
              <div className="text-left">
                <div className="font-bold text-base leading-none">4.9</div>
                <div className="text-[10px] text-gray-300 mt-0.5">Rated by guests</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-amber-300/70">
          <span className="text-[11px] tracking-[0.3em] uppercase">Scroll</span>
          <span className="w-px h-8 bg-gradient-to-b from-amber-400 to-transparent" />
        </div>
      </section>

      {/* ============ Cuisine Marquee ============ */}
      <div className="bg-[#0b1020] py-4 overflow-hidden border-y border-amber-500/20">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex items-center">
              {['Farm Fresh', 'Authentic Flavours', 'Handcrafted Dishes', 'Fine Dining', 'Local Ingredients', 'Signature Recipes'].map((t, i) => (
                <span key={`${dup}-${i}`} className="flex items-center gap-3 px-6 sm:px-8 font-display text-lg sm:text-xl md:text-2xl text-amber-200/90">
                  {t}
                  <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 shrink-0" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ Branches ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="text-center mb-10 md:mb-14 reveal">
          <h5 className="text-amber-600 font-semibold tracking-[0.2em] uppercase text-sm mb-3">Find Us Nearby</h5>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">Our Branches</h2>
          <span className="accent-line" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {branches.length > 0 ? branches.map((branch, i) => (
            <Link
              key={branch._id || branch.id || i}
              className={`group card-lift bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden cursor-pointer flex flex-col h-full reveal reveal-delay-${(i % 3) + 1}`}
              to={`/branch/${branch._id}`}
            >
              <div className="relative overflow-hidden shrink-0">
                <img
                  src={branch?.pictures?.[0] || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop"}
                  alt={branch.name}
                  className="w-full h-48 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020]/70 via-transparent to-transparent" />
                {branchOffers[branch._id] && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
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
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">{branch.name}</h3>
                {branch.description && branch.description.trim().length > 3 && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{branch.description}</p>
                )}
                <div className="flex items-start gap-2 mt-auto">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
                  <span className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {formatAddress(branch?.address)}
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 group-hover:gap-3 transition-all">
                  View Branch <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          )) : (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse h-full">
                <div className="h-52 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ============ About Section ============ */}
      <section id="about" className="py-16 md:py-24 relative bg-[#fdfaf5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative grid grid-cols-2 gap-3 sm:gap-4 reveal">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=500&fit=crop" alt="Restaurant" className="rounded-2xl shadow-xl w-full h-48 sm:h-56 md:h-64 object-cover" />
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=500&fit=crop" alt="Food" className="rounded-2xl shadow-xl w-full h-48 sm:h-56 md:h-64 object-cover mt-6 sm:mt-10" />
              <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=500&fit=crop" alt="Dining" className="rounded-2xl shadow-xl w-full h-48 sm:h-56 md:h-64 object-cover" />
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=500&fit=crop" alt="Cuisine" className="rounded-2xl shadow-xl w-full h-48 sm:h-56 md:h-64 object-cover mt-6 sm:mt-10" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-amber-500 to-amber-600 text-[#0b1020] rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex flex-col items-center justify-center shadow-2xl animate-glow z-10">
                <span className="font-display text-3xl sm:text-4xl font-bold leading-none">15</span>
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mt-1">Years</span>
              </div>
            </div>
            <div className="reveal reveal-delay-2 text-center lg:text-left">
              <h5 className="text-amber-600 font-semibold tracking-[0.2em] uppercase text-sm mb-3">About Us</h5>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900">Welcome to <span className="gradient-text">FarmHouse</span></h2>
              <span className="accent-line accent-line-left lg:mx-0 mx-auto" />
              <p className="text-gray-600 mt-6 mb-4 leading-relaxed">
                For over fifteen years we've been serving heartfelt meals crafted from the
                finest farm-fresh ingredients. Every plate tells a story of passion,
                tradition, and an uncompromising love for great food.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                From intimate dinners to grand celebrations, our chefs pour their soul into
                each dish — delivering flavours that linger long after the last bite.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-md text-left">
                  <Award className="text-amber-600 shrink-0" size={36} />
                  <div>
                    <h4 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">15</h4>
                    <p className="text-sm text-gray-600">Years of Experience</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-md text-left">
                  <Users className="text-amber-600 shrink-0" size={36} />
                  <div>
                    <h4 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">50</h4>
                    <p className="text-sm text-gray-600">Master Chefs</p>
                  </div>
                </div>
              </div>
              <Link to="/about-us" className="btn-premium inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-3.5 rounded-full text-[#0b1020] font-bold">
                READ MORE <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Menu Section ============ */}
      <section id="menu" className="py-16 md:py-24 relative bg-[#0b1020] text-white overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-0 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10 md:mb-14 reveal">
            <h5 className="text-amber-500 font-semibold tracking-[0.2em] uppercase text-sm mb-3">Food Menu</h5>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">Most Popular Items</h2>
            <span className="accent-line" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {menuItems.length > 0 ? (
              menuItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className={`group flex items-start gap-4 sm:gap-5 glass-dark p-4 sm:p-5 rounded-2xl transition-all duration-500 hover:border-amber-500/50 hover:-translate-y-1 reveal reveal-delay-${(index % 2) + 1}`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={item.pictures?.[0] || "https://via.placeholder.com/80"}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover ring-2 ring-amber-500/30 transition-transform duration-500 group-hover:scale-105"
                    />
                    {menuOffers[item._id] && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                        {menuOffers[item._id].discount?.type === 'PERCENTAGE'
                          ? `${menuOffers[item._id].discount.percentageOff}%`
                          : `₹${menuOffers[item._id].discount?.flatAmount}`}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1.5 gap-3">
                      <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">{item.name}</h4>
                      <div className="flex flex-col items-end gap-0.5 shrink-0">
                        {Array.isArray(item.price) ? (
                          item.price.map((p) => (
                            <span key={p._id} className="text-amber-400 font-bold text-xs sm:text-sm whitespace-nowrap">
                              {p.serveType.charAt(0).toUpperCase() + p.serveType.slice(1)}: ₹{p.price}
                            </span>
                          ))
                        ) : (
                          <span className="text-amber-400 font-bold">₹{item.discountPrice || item.price}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
                      {item.description
                        ? item.description.slice(0, 100)
                        : "Delicious and freshly prepared meal."}
                      {item.description && item.description.length > 100 && "..."}
                    </p>

                    {menuOffers[item._id] && (
                      <span className="inline-flex items-center gap-1 bg-red-500/15 text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full mt-2">
                        <Tag className="h-3 w-3" />
                        {menuOffers[item._id].title}
                      </span>
                    )}

                    <Link
                      to={`/menus`}
                      className="text-amber-400 text-sm mt-2 inline-flex items-center gap-1 font-medium hover:gap-2 transition-all"
                    >
                      See More <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-5 glass-dark p-5 rounded-2xl animate-pulse">
                  <div className="w-24 h-24 rounded-xl bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ============ Booking Section ============ */}
      <section className="py-16 md:py-24 px-4 sm:px-6 bg-[#fdfaf5]">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl reveal">
          <div className="relative bg-white h-64 sm:h-80 lg:h-auto min-h-[320px] flex items-center justify-center overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=900&fit=crop"
              alt="Restaurant table"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020]/50 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="relative bg-amber-400 rounded-full shadow-2xl flex items-center justify-center transition hover:bg-amber-500 hover:scale-105 w-20 h-20 sm:w-24 sm:h-24"
              >
                <span className="absolute inset-0 rounded-full bg-amber-400/60 animate-ping" />
                <Play size={36} className="text-[#10162F] relative z-10 ml-1" />
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-[#10162F] flex flex-col items-stretch justify-center w-full">
            <h4 className="text-amber-400 text-sm sm:text-base font-bold mb-1 flex items-center gap-2 tracking-widest uppercase">
              Reservation
              <span className="h-0.5 w-12 sm:w-16 bg-amber-400"></span>
            </h4>
            <h2 className="font-display text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 mt-2">
              Book A Table Online
            </h2>

            <form className="w-full space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="bg-white/95 text-[#10162F] rounded-xl px-4 sm:px-5 py-3.5 w-full font-medium outline-none border-2 border-transparent focus:border-amber-400 transition"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-white/95 text-[#10162F] rounded-xl px-4 sm:px-5 py-3.5 w-full font-medium outline-none border-2 border-transparent focus:border-amber-400 transition"
                  required
                />
              </div>

              <input
                type="tel"
                placeholder="Your Phone Number"
                className="bg-white/95 text-[#10162F] rounded-xl px-4 sm:px-5 py-3.5 w-full font-medium outline-none border-2 border-transparent focus:border-amber-400 transition"
                required
              />

              <select
                className="bg-white/95 text-[#10162F] rounded-xl px-4 sm:px-5 py-3.5 w-full font-medium outline-none border-2 border-transparent focus:border-amber-400 transition"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="datetime-local"
                  className="bg-white/95 text-[#10162F] rounded-xl px-4 sm:px-5 py-3.5 w-full font-medium outline-none border-2 border-transparent focus:border-amber-400 transition"
                  required
                />
                <select
                  className="bg-white/95 text-[#10162F] rounded-xl px-4 sm:px-5 py-3.5 w-full font-medium outline-none border-2 border-transparent focus:border-amber-400 transition"
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

              <textarea
                rows={3}
                placeholder="Special Request"
                className="bg-white/95 text-[#10162F] rounded-xl px-4 sm:px-5 py-3.5 w-full font-medium outline-none border-2 border-transparent focus:border-amber-400 transition resize-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="btn-premium bg-gradient-to-r from-amber-400 to-amber-500 text-[#10162F] font-bold text-base sm:text-lg w-full rounded-xl py-3.5 sm:py-4 disabled:opacity-70"
              >
                {loading ? "Booking..." : "BOOK NOW"}
              </button>

              {message && (
                <p className="text-center text-sm text-white">{message}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ============ Features ============ */}
      <section className="py-16 md:py-24 bg-[#fdfaf5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-14 reveal">
            <h5 className="text-amber-600 font-semibold tracking-[0.2em] uppercase text-sm mb-3">Why Choose Us</h5>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">The FarmHouse Promise</h2>
            <span className="accent-line" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 items-stretch">
            {[
              { Icon: Users, title: 'Master Chefs', desc: 'Award-winning chefs crafting every dish with precision and passion.' },
              { Icon: Utensils, title: 'Quality Food', desc: 'Only the freshest farm ingredients make it onto your plate.' },
              { Icon: Soup, title: 'Online Order', desc: 'Your favourite meals delivered hot and fresh to your doorstep.' },
              { Icon: Clock, title: '24/7 Service', desc: 'We are here to serve you deliciousness around the clock.' },
            ].map(({ Icon, title, desc }, i) => (
              <div key={title} className={`group text-center p-6 sm:p-8 bg-white rounded-2xl md:rounded-3xl shadow-md card-lift h-full flex flex-col items-center reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="mb-5 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center transition-all duration-500 group-hover:from-amber-500 group-hover:to-amber-600">
                  <Icon className="text-amber-600 transition-colors duration-500 group-hover:text-white" size={28} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Testimonials ============ */}
      <section className="py-16 md:py-24 bg-[#0b1020] text-white relative overflow-hidden">
        <div className="pointer-events-none absolute -bottom-20 left-0 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10 md:mb-14 reveal">
            <h5 className="text-amber-500 font-semibold tracking-[0.2em] uppercase text-sm mb-3">Testimonials</h5>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold">What Our Guests Say</h2>
            <span className="accent-line" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 items-stretch">
            {[
              { name: 'Aarav Mehta', role: 'Food Blogger', text: 'An absolutely divine experience. Every dish was a masterpiece and the ambience was pure luxury.' },
              { name: 'Priya Sharma', role: 'Regular Guest', text: 'The best fine-dining spot in the city. Warm service, stunning interiors and unforgettable flavours.' },
              { name: 'Rahul Verma', role: 'Chef & Critic', text: 'Farm-fresh ingredients handled with true artistry. This place sets the benchmark for premium dining.' },
            ].map((t, i) => (
              <div key={t.name} className={`glass-dark rounded-2xl md:rounded-3xl p-6 sm:p-8 card-lift h-full flex flex-col reveal reveal-delay-${(i % 3) + 1}`}>
                <Quote className="h-8 w-8 sm:h-10 sm:w-10 text-amber-500/60 mb-4 shrink-0" />
                <p className="text-gray-300 leading-relaxed mb-6 flex-1">"{t.text}"</p>
                <div className="flex items-center gap-1 mb-3 text-amber-400">
                  {[...Array(5)].map((_, s) => <Star key={s} className="h-4 w-4 fill-amber-400" />)}
                </div>
                <div className="font-bold text-white">{t.name}</div>
                <div className="text-sm text-gray-400">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Team Section ============ */}
      <section id="team" className="py-16 md:py-24 bg-[#fdfaf5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-14 reveal">
            <h5 className="text-amber-600 font-semibold tracking-[0.2em] uppercase text-sm mb-3">Team Members</h5>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">Our Master Chefs</h2>
            <span className="accent-line" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { name: 'Full Name', role: 'Designation', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&h=400&fit=crop' },
              { name: 'Full Name', role: 'Designation', image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=300&h=400&fit=crop' },
              { name: 'Full Name', role: 'Designation', image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=300&h=400&fit=crop' },
              { name: 'Full Name', role: 'Designation', image: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=300&h=400&fit=crop' }
            ].map((member, index) => (
              <div key={index} className={`text-center group reveal reveal-delay-${(index % 4) + 1}`}>
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl mb-4 shadow-lg">
                  <img src={member.image} alt={member.name} className="w-full h-72 sm:h-80 object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1020]/90 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition duration-500 flex items-end justify-center pb-5">
                    <div className="flex gap-2 translate-y-4 group-hover:translate-y-0 transition duration-500">
                      <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-600 rounded-full flex items-center justify-center hover:bg-amber-500 transition">
                        <span className="text-white text-sm">f</span>
                      </a>
                      <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-600 rounded-full flex items-center justify-center hover:bg-amber-500 transition">
                        <span className="text-white text-sm">t</span>
                      </a>
                      <a href="#" className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-600 rounded-full flex items-center justify-center hover:bg-amber-500 transition">
                        <span className="text-white text-sm">in</span>
                      </a>
                    </div>
                  </div>
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900">{member.name}</h4>
                <p className="text-amber-600 text-sm sm:text-base mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
