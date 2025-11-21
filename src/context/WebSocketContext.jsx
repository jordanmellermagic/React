import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const { userId } = useAuth();        // ✔ we only use userId now
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("disconnected");
  const wsRef = useRef(null);

  useEffect(() => {
    // No userId means no websocket connection
    if (!userId) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setStatus("disconnected");
      setMessages([]);
      return;
    }

    const url = import.meta.env.VITE_WS_URL;
    if (!url) {
      console.warn("VITE_WS_URL not set");
      return;
    }

    setStatus("connecting");

    // ✔ Connect using userId (no token)
    const ws = new WebSocket(`${url}?userId=${encodeURIComponent(userId)}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("connected");
    };

    ws.onmessage = (event) => {
      let data = event.data;
      try {
        data = JSON.parse(event.data);
      } catch (_) {}
      setMessages((prev) => [
        {
          id: Date.now() + Math.random(),
          ts: new Date().toISOString(),
          raw: data,
        },
        ...prev,
      ]);
    };

    ws.onerror = () => {
      setStatus("error");
    };

    ws.onclose = () => {
      setStatus("disconnected");
    };

    return () => {
      ws.close();
    };
  }, [userId]);

  // ✔ Send messages using just WS payloads (no auth)
  const sendMessage = (payload) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        status,
        messages,
        sendMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
