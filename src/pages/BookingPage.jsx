import { useState } from "react";
import { Play } from "lucide-react"; // Lucide React icon

export default function BookingPage() {
  const [people, setPeople] = useState("1");

  return (

    <>
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
            Booking
          </h1>
        </div>
      </section>
      <section className=" min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-2xl">
          {/* Left Side - Image & Play Button */}
          <div className="relative bg-white h-[430px] md:h-auto flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop"   // Change to your image path!
              alt="Restaurant table"
              className="w-full h-full object-cover"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-amber-400 rounded-full p-0 shadow-lg flex items-center justify-center transition hover:bg-amber-500"
                style={{ width: "100px", height: "100px" }}>
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
            <form className="w-full space-y-5">
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
                  onChange={e => setPeople(e.target.value)}
                  required
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>People {i + 1}</option>
                  ))}
                </select>
              </div>
              {/* Special Request */}
              <textarea
                rows={3}
                placeholder="Special Request"
                className="bg-white text-[#10162F] rounded px-5 py-4 w-full font-medium outline-none"
              />
              {/* Submit Button */}
              <button
                type="submit"
                className="bg-amber-400 text-[#10162F] font-bold text-lg w-full rounded mt-2 py-4 transition hover:bg-amber-600"
              >
                BOOK NOW
              </button>
            </form>
          </div>
        </div>
      </section>
    </>


  );
}
