import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext();
export const useWebSocket = () => useContext(WebSocketContext);

// ---- Polling interval (in ms) ----
const POLL_INTERVAL = 2000; // 2 seconds

export const WebSocketProvider = ({ children }) => {
  const userId = localStorage.getItem("user_id") || "Jordan";
  const apiBase = import.meta.env.VITE_API_BASE_URL;

  const [data, setData] = useState(null);
  const [wsStatus, setWsStatus] = useState("disconnected"); // always disconnected visually
  const [apiError, setApiError] = useState(null);

  // ---- Polling Function ----
  const fetchUserData = async () => {
    try {
      const res = await fetch(`${apiBase}/user/${userId}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const json = await res.json();
      setData(json);
      setApiError(null);
    } catch (err) {
      console.error("Polling error:", err);
      setApiError(err.message);
    }
  };

  // ---- Start Polling Loop ----
  useEffect(() => {
    fetchUserData(); // initial load immediately
    const interval = setInterval(fetchUserData, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        data,
        apiError,
        wsStatus, // always "disconnected" since WS not used
        userId,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
