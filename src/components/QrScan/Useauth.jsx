// hooks/useAuth.js
import { useState, useEffect } from "react";

/**
 * useAuth
 * Reads logged-in user from localStorage (token + user profile).
 * Adapt the keys to match your auth implementation.
 *
 * Expected localStorage shape:
 *   "authToken"  → JWT string
 *   "authUser"   → JSON { _id, name, mobile, email }
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const saveGuestSession = ({ name, mobile, guestToken }) => {
    const guestUser = { name, mobile, isGuest: true };


    localStorage.setItem("token", guestToken);
    localStorage.setItem("user", JSON.stringify(guestUser));
    setToken(guestToken);
    setUser(guestUser);
  };

  const isLoggedIn = !!token && !!user;

  return { user, token, isLoggedIn, saveGuestSession };
};

export default useAuth;