import { Phone } from 'lucide-react'
import { MapPin } from 'lucide-react'
import React from 'react'

const Topbar = () => {
  return (
 
      <div className="bg-amber-600 text-white py-2 px-4">
        <div className="container mx-auto flex flex-wrap justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin size={16} />
              123 Street, New York, USA
            </span>
            <span className="flex items-center gap-1">
              <Phone size={16} />
              +012 345 6789
            </span>
          </div>
          <div className="flex gap-2">
            <a href="#" className="hover:text-amber-200">Facebook</a>
            <a href="#" className="hover:text-amber-200">Twitter</a>
            <a href="#" className="hover:text-amber-200">Instagram</a>
          </div>
        </div>
      </div>

  )
}

export default Topbar