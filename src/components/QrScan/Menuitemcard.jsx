// components/menu/MenuItemCard.jsx
import React, { useState } from "react";
import { FiPlus, FiMinus, FiClock } from "react-icons/fi";
import OfferBadge from "./Offerbadge";
// import { getPriceValue } from "./Usecart";


// ─── Type badge (replaces old isVeg boolean) ─────────────────────────────────
const TypeBadge = ({ type }) => {
  const isVeg = type === "veg";
  const isStarter = type === "starter";
  const color = isVeg ? "border-green-600" : isStarter ? "border-yellow-500" : "border-red-600";
  const dot = isVeg ? "bg-green-600" : isStarter ? "bg-yellow-500" : "bg-red-600";
  return (
    <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${color}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
    </span>
  );
};

// ─── Price display — handles array [{serveType, price}] ──────────────────────
const PriceTag = ({ price }) => {
  if (!price) return <span className="font-bold text-gray-900">—</span>;
  if (!Array.isArray(price)) {
    return <span className="font-bold text-gray-900">₹{Number(price).toFixed(2)}</span>;
  }
  if (price.length === 1) {
    return (
      <span className="font-bold text-gray-900">
        ₹{parseFloat(price[0]?.price || 0).toFixed(2)}
      </span>
    );
  }
  // Multiple sizes — show all with labels
  return (
    <div className="flex flex-col gap-0.5">
      {price.map((p, i) => (
        <span key={i} className="text-xs font-semibold text-gray-900">
          <span className="text-[10px] font-normal text-gray-400 mr-1 capitalize">{p.serveType}:</span>
          ₹{parseFloat(p.price || 0).toFixed(2)}
        </span>
      ))}
    </div>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
const MenuItemCard = ({ item, quantity, onAdd, onRemove, offer }) => {
  const [imgError, setImgError] = useState(false);

  console.log(offer);

  // Schema field: `available` (Boolean)
  const isAvailable = item.available !== false;

  // Schema field: `pictures` ([String])
  const mainImage = item.pictures?.[0];

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${!isAvailable ? "opacity-50 pointer-events-none" : ""
        }`}
    >
      {/* Image — full width on top */}
      {mainImage && !imgError && (
        <div className="relative w-full h-36 bg-gray-100 overflow-hidden">
          <img
            src={mainImage}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                Unavailable
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-3">
        {/* Type badge row */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <TypeBadge type={item.type} />
          <span className="text-[10px] text-gray-400 capitalize">{item.type}</span>
        </div>
        {offer && offer.length > 0 && (
          <div className="mt-1 mb-1.5">
            <OfferBadge offers={offer} />
          </div>
        )}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
          {item.name}
        </h3>

        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">
            {item.description}
          </p>
        )}

        <div className="flex items-end justify-between gap-2 mt-2">
          <div>
            <PriceTag price={item.price} />
            {item.preparationTime && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-400 mt-0.5">
                <FiClock className="w-2.5 h-2.5" />
                {item.preparationTime} min
              </span>
            )}
          </div>


          {/* Add / Quantity stepper */}
          {!isAvailable ? (
            <span className="text-xs text-red-500 font-medium">Unavailable</span>
          ) : quantity === 0 ? (
            <button
              onClick={() => onAdd(item)}
              className="px-4 py-1.5 bg-white border-2 border-orange-500 text-orange-600 text-xs font-bold rounded-xl hover:bg-orange-50 transition active:scale-95 flex-shrink-0"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center gap-0.5 bg-orange-500 rounded-xl overflow-hidden flex-shrink-0">
              <button onClick={() => onRemove(item)} className="p-1.5 text-white hover:bg-orange-600 transition">
                <FiMinus className="w-3.5 h-3.5" />
              </button>
              <span className="text-white font-bold text-sm w-5 text-center">{quantity}</span>
              <button onClick={() => onAdd(item)} className="p-1.5 text-white hover:bg-orange-600 transition">
                <FiPlus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;