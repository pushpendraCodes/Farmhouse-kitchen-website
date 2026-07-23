import { Phone } from 'lucide-react'
import { MapPin } from 'lucide-react'
import React from 'react'

const Topbar = () => {
  return (
 
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white py-2.5 px-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center text-sm gap-2">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} />
              123 Street, New York, USA
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={16} />
              +012 345 6789
            </span>
          </div>
          <div className="flex gap-3 font-medium">
            <a href="#" className="hover:text-[#0b1020] transition-colors">Facebook</a>
            <a href="#" className="hover:text-[#0b1020] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[#0b1020] transition-colors">Instagram</a>
          </div>
        </div>
      </div>

  )
}

export default Topbar