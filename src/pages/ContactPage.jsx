import { Mail } from "lucide-react";

export default function ContactUs() {
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
            Contact Us
          </h1>
        </div>
      </section>
      <section className="bg-white min-h-screen px-4 py-10 flex flex-col items-center">
        {/* Heading & Contact Types */}
        <div className="w-full max-w-7xl mx-auto mb-10">
          <h4 className="text-center text-lg font-bold text-amber-400 mb-2 flex items-center justify-center gap-2">
            <span className="h-0.5 w-10 bg-amber-400 mr-3"></span>
            Contact Us
            <span className="h-0.5 w-10 bg-amber-400 ml-3"></span>
          </h4>
          <h1 className="text-center font-black text-4xl text-[#10162f] mb-10">
            Contact For Any Query
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-bold text-amber-400 mb-1 flex items-center gap-2">
                Booking <span className="h-0.5 w-10 bg-amber-400"></span>
              </h3>
              <span className="flex items-center text-gray-700 font-semibold">
                <Mail className="text-amber-400 mr-2" size={20} />
                <span>book@example.com</span>
              </span>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-bold text-amber-400 mb-1 flex items-center gap-2">
                General <span className="h-0.5 w-10 bg-amber-400"></span>
              </h3>
              <span className="flex items-center text-gray-700 font-semibold">
                <Mail className="text-amber-400 mr-2" size={20} />
                <span>info@example.com</span>
              </span>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-bold text-amber-400 mb-1 flex items-center gap-2">
                Technical <span className="h-0.5 w-10 bg-amber-400"></span>
              </h3>
              <span className="flex items-center text-gray-700 font-semibold">
                <Mail className="text-amber-400 mr-2" size={20} />
                <span>tech@example.com</span>
              </span>
            </div>
          </div>
        </div>

        {/* Map & Form Section */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Map */}
          <div className="rounded-lg overflow-hidden shadow-md h-[400px] bg-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193571.43834501724!2d-74.11808665168164!3d40.70582539880782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5b43c81a3%3A0xa8c90c5e6b8a8781!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1633074419023!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="New York Map"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Form */}
          <form className="bg-white rounded-lg shadow-md p-8 flex flex-col gap-5 justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Your Name"
                className="border border-gray-200 rounded px-4 py-3 w-full focus:outline-none text-gray-800"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                className="border border-gray-200 rounded px-4 py-3 w-full focus:outline-none text-gray-800"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              className="border border-gray-200 rounded px-4 py-3 w-full focus:outline-none text-gray-800"
              required
            />
            <textarea
              rows={4}
              placeholder="Message"
              className="border border-gray-200 rounded px-4 py-3 w-full focus:outline-none text-gray-800"
              required
            />
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 rounded text-white font-bold text-lg py-4 w-full transition"
            >
              SEND MESSAGE
            </button>
          </form>
        </div>
      </section>
    </>


  );
}
