// Useoffers.js
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL

/**
 * Fetches active offers for all menu items in parallel.
 * Returns a map: { [menuItemId]: offerObject | null }
 */
const useOffers = (menuItems = []) => {
    const [offerMap, setOfferMap] = useState({});
    const [offersLoading, setOffersLoading] = useState(false);

    useEffect(() => {
        if (!menuItems.length) return;

        const fetchOffers = async () => {
            setOffersLoading(true);
            try {
                const results = await Promise.allSettled(
                    menuItems.map((item) =>
                        axios
                            .get(`${API_BASE}/api/customer/offer/menu-item/${item._id}/active`)
                            .then((res) => {
                                let offers = res.data?.data || res.data || [];

                                // ✅ Always normalize to an array
                                if (!Array.isArray(offers)) offers = [offers];

                                // ✅ Filter only currently active ones (fallback if virtual missing)
                                const now = new Date();
                                const activeOffers = offers.filter((o) => {
                                    if (!o) return false;
                                    return (
                                        o.isCurrentlyActive ??
                                        (o.status === "ACTIVE" &&
                                            new Date(o.startDate) <= now &&
                                            new Date(o.endDate) >= now)
                                    );
                                });

                                return { id: item._id, offers: activeOffers };
                            })
                            .catch(() => ({ id: item._id, offers: [] }))
                    )
                );

                const map = {};
                results.forEach((result) => {
                    if (result.status === "fulfilled" && result.value) {
                        // ✅ Only add to map if there are actual active offers
                        if (result.value.offers.length > 0) {
                            map[result.value.id] = result.value.offers;
                        }
                    }
                });

                setOfferMap(map);
            } finally {
                setOffersLoading(false);
            }
        };

        fetchOffers();
    }, [menuItems]);

    return { offerMap, offersLoading };
};

export default useOffers;