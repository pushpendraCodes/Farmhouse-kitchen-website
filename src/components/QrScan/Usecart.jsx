// hooks/useCart.js
import { useState, useMemo, useCallback } from "react";

/**
 * Cart state shape:
 *   { [cartKey]: { itemId, qty, serveType, unitPrice } }
 *
 * cartKey = itemId            (for single-price items)
 * cartKey = itemId__serveType (for multi-price items when serveType is provided)
 */

const makeKey = (itemId, serveType) =>
  serveType ? `${itemId}__${serveType}` : itemId;

const parseKey = (cartKey) => {
  const parts = cartKey.split("__");
  return { itemId: parts[0], serveType: parts[1] || null };
};

const getPriceValue = (price, serveType) => {
  if (!price) return 0;

  if (Array.isArray(price)) {
    if (price.length === 0) return 0;

    // If serveType specified, find matching entry
    if (serveType) {
      const match = price.find(
        (p) => p.serveType?.toLowerCase() === serveType.toLowerCase()
      );
      if (match) return parseFloat(match.price) || 0;
    }

    // Default: first entry
    return parseFloat(price[0]?.price) || 0;
  }

  return parseFloat(price) || 0;
};

const useCart = (menuItems = []) => {
  const [cart, setCart] = useState({});

  const addToCart = useCallback((item, serveType = null) => {
    const resolvedServeType =
      serveType ||
      (Array.isArray(item.price) && item.price.length > 1
        ? item.price[0]?.serveType
        : null);

    const key = makeKey(item._id, resolvedServeType);
    const unitPrice = getPriceValue(item.price, resolvedServeType);

    setCart((prev) => {
      const existing = prev[key];
      return {
        ...prev,
        [key]: {
          itemId: item._id,
          qty: (existing?.qty || 0) + 1,
          serveType: resolvedServeType,
          unitPrice,
        },
      };
    });
  }, []);

  const removeFromCart = useCallback((item, serveType = null) => {
    const resolvedServeType =
      serveType ||
      (Array.isArray(item.price) && item.price.length > 1
        ? item.price[0]?.serveType
        : null);

    const key = makeKey(item._id, resolvedServeType);

    setCart((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      if (existing.qty <= 1) {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }
      return { ...prev, [key]: { ...existing, qty: existing.qty - 1 } };
    });
  }, []);

  const updateCartQty = useCallback((cartKey, qty) => {
    if (qty <= 0) {
      setCart((prev) => {
        const updated = { ...prev };
        delete updated[cartKey];
        return updated;
      });
    } else {
      setCart((prev) => ({
        ...prev,
        [cartKey]: { ...prev[cartKey], qty },
      }));
    }
  }, []);

  const removeCartItem = useCallback((cartKey) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[cartKey];
      return updated;
    });
  }, []);

  /** Change serve type for an item already in the cart */
  const changeServeType = useCallback((oldCartKey, newServeType, menuItem) => {
    setCart((prev) => {
      const existing = prev[oldCartKey];
      if (!existing) return prev;

      const newKey = makeKey(existing.itemId, newServeType);
      const newPrice = getPriceValue(menuItem.price, newServeType);

      const updated = { ...prev };
      delete updated[oldCartKey];

      // If same item+newType already exists, merge quantities
      const existingNew = updated[newKey];
      updated[newKey] = {
        itemId: existing.itemId,
        qty: (existingNew?.qty || 0) + existing.qty,
        serveType: newServeType,
        unitPrice: newPrice,
      };

      return updated;
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const totalItems = useMemo(
    () => Object.values(cart).reduce((sum, entry) => sum + entry.qty, 0),
    [cart]
  );

  /** Get total quantity for a specific itemId (across all serve types) */
  const getItemQty = useCallback(
    (itemId) =>
      Object.entries(cart).reduce((sum, [key, entry]) => {
        return entry.itemId === itemId ? sum + entry.qty : sum;
      }, 0),
    [cart]
  );

  const totalAmount = useMemo(
    () =>
      Object.values(cart).reduce(
        (sum, entry) => sum + entry.unitPrice * entry.qty,
        0
      ),
    [cart]
  );

  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    removeCartItem,
    changeServeType,
    clearCart,
    totalItems,
    totalAmount,
    getItemQty,
    getPriceValue,
    parseKey,
  };
};

export default useCart;