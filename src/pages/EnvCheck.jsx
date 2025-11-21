import React from "react";

export default function EnvCheck() {
  return (
    <div style={{ padding: "2rem", color: "white" }}>
      <h2>Environment Debug</h2>
      <p>This page shows what the frontend actually sees.</p>

      <pre
        style={{
          background: "#111",
          padding: "1rem",
          borderRadius: "0.5rem",
          marginTop: "1rem",
          fontSize: "0.9rem",
        }}
      >
{JSON.stringify(
  {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_WS_URL: import.meta.env.VITE_WS_URL,
    Derived_API_User: import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL + "/user/Jordan"
      : "undefined",
    Derived_WS_Endpoint: import.meta.env.VITE_WS_URL || "undefined",
    Full_ENV_Object: import.meta.env,
  },
  null,
  2
)}
      </pre>
    </div>
  );
}
