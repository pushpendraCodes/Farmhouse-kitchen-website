// hooks/useMenuData.js
import { useState, useCallback } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const useMenuData = (branchId, qrToken) => {
  const [branchInfo, setBranchInfo] = useState(null);
  const [tableInfo, setTableInfo] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuData = useCallback(async () => {
    if (!branchId || !qrToken) {
      setError("Invalid QR code. Missing branch or table information.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Validate QR token & get table info
      const { data: tableData } = await axios.get(
        `${API_BASE}/api/customer/tables/validate/${branchId}/${qrToken}`
      );

      setTableInfo(tableData.data?.table || tableData.table || tableData);
      setBranchInfo(tableData.data?.branch || tableData.branch || null);

      // Fetch menu items
      const { data: menuData } = await axios.get(
        `${API_BASE}/api/customer/menu?branch=${branchId}`
      );

      const items = menuData.data || menuData.items || menuData || [];
      setMenuItems(items);

      // Build unique category objects { _id, name } from populated menuCategory
      const catMap = new Map();
      items.forEach((i) => {
        const cat = i.menuCategory;
        if (cat?._id && !catMap.has(String(cat._id))) {
          catMap.set(String(cat._id), { _id: String(cat._id), name: cat.name || "Other" });
        }
      });
      setCategories([...catMap.values()]);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Unable to load menu. Please scan the QR code again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [branchId, qrToken]);

  return {
    branchInfo,
    tableInfo,
    menuItems,
    categories,
    loading,
    error,
    refetch: fetchMenuData,
  };
};

export default useMenuData;