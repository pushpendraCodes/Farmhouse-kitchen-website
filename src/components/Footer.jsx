import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#10162f] text-white pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-8">
        {/* Column: Company */}
        <div>
          <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
            Company
            <span className="flex-1 h-0.5 bg-amber-400 ml-4"></span>
          </h3>
          <ul className="space-y-3 text-base">
            <li className="flex items-center gap-2">
              <ArrowRight size={18} className="text-amber-400" />
              About Us
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight size={18} className="text-amber-400" />
              Contact Us
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight size={18} className="text-amber-400" />
              Reservation
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight size={18} className="text-amber-400" />
              Privacy Policy
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight size={18} className="text-amber-400" />
              Terms &amp; Condition
            </li>
          </ul>
        </div>

        {/* Column: Contact */}
        <div>
          <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
            Contact
            <span className="flex-1 h-0.5 bg-amber-400 ml-4"></span>
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <MapPin size={20} className="text-amber-400" />
             Near Ganesh Lawn East Shankar Nagar Ramdaspeth, Bajaj Nagar, Nagpur, Maharashtra 440010
            </li>
            <li className="flex items-center gap-2">
              <Phone size={20} className="text-amber-400" />
          099225 22224
            </li>
            <li className="flex items-center gap-2">
              <Mail size={20} className="text-amber-400" />
              info@example.com
            </li>
          </ul>
          <div className="flex gap-4 mt-5">
            <a href="#" className="border border-amber-400 rounded-full p-2 hover:bg-amber-400 hover:text-black transition">
              <Twitter size={20} />
            </a>
            <a href="#" className="border border-amber-400 rounded-full p-2 hover:bg-amber-400 hover:text-black transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="border border-amber-400 rounded-full p-2 hover:bg-amber-400 hover:text-black transition">
              <Youtube size={20} />
            </a>
            <a href="#" className="border border-amber-400 rounded-full p-2 hover:bg-amber-400 hover:text-black transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* Column: Opening */}
        <div>
          <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
            Opening
            <span className="flex-1 h-0.5 bg-amber-400 ml-4"></span>
          </h3>
          <div className="mb-2">Monday - Saturday</div>
          <div className="mb-6">09AM - 09PM</div>
          <div className="mb-2">Sunday</div>
          <div>10AM - 08PM</div>
        </div>

        {/* Column: Newsletter */}
        <div>
          <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
            Newsletter
            <span className="flex-1 h-0.5 bg-amber-400 ml-4"></span>
          </h3>
          <p className="mb-5 text-[#e5e7eb]">
            Dolor amet sit justo amet elitr clita ipsum elitr est.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-3 rounded-l bg-white text-black flex-1 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-amber-400 text-[#1a202c] font-bold px-6 py-3 rounded-r hover:bg-amber-500 transition"
            >
              SIGNUP
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-slate-700 pt-5 flex flex-col md:flex-row items-center justify-between text-sm text-[#e5e7eb]">
        <div className="mb-2 md:mb-0">
          © Farmhouse, All Right Reserved. Designed By{" "}
          <a href="#" className="underline">Technocrate</a>
        </div>
        <div className="flex gap-6 flex-wrap">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Cookies</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">FAQs</a>
        </div>
      </div>
      {/* <div className="pt-3 text-xs text-[#e5e7eb]">
        Distributed By <a href="#" className="underline">ThemeWagon</a>
      </div> */}
    </footer>
  );
}
