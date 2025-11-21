import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("cp_user_id");
    if (stored) setUserId(stored);
    setLoading(false);
  }, []);

  const login = async (userIdInput) => {
    // Store userId only, no API calls
    setUserId(userIdInput);
    localStorage.setItem("cp_user_id", userIdInput);
    navigate("/dashboard");
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("cp_user_id");
    navigate("/login");
  };

  const value = {
    userId,
    loading,
    login,
    logout,
    token: "NO_TOKEN" // kept for compatibility
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
