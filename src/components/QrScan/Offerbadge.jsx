// Offerbadge.jsx
import React from "react";
import { FiTag } from "react-icons/fi";

const formatDiscount = (discount) => {
    if (!discount) return "";
    if (discount.type === "PERCENTAGE") return `${discount.percentageOff}% OFF`;
    if (discount.type === "FLAT") return `₹${discount.flatAmount} OFF`;
    return "";
};

// ── Single badge ──────────────────────────────────────────────────────────────
const SingleOfferBadge = ({ offer }) => {
    const discountText = formatDiscount(offer.discount);
    return (
        <div className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 rounded-md px-2 py-0.5 w-fit max-w-full">
            <FiTag className="w-3 h-3 flex-shrink-0" />
            <span className="text-[10px] font-semibold truncate leading-tight">
                {offer.title}
                {discountText && <span className="font-bold"> — {discountText}</span>}
            </span>
        </div>
    );
};

// ── Main export — handles array of offers ────────────────────────────────────
const OfferBadge = ({ offers }) => {
    // Normalize: accept both single offer object or array
    const offerList = Array.isArray(offers) ? offers : offers ? [offers] : [];

    if (!offerList.length) return null;

    return (
        <div className="flex flex-col gap-1">
            {offerList.map((offer, i) => (
                <SingleOfferBadge key={offer._id || i} offer={offer} />
            ))}
        </div>
    );
};

export default OfferBadge;