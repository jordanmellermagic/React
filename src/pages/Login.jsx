import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const [userId, setUserId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId.trim().length === 0) return;
    login(userId.trim());
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "3rem auto" }}>
      <div className="card-title">Enter Your User ID</div>
      <div className="card-subtitle">
        This web app doesn’t use passwords — just tell us your User ID.
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="userid">User ID</label>
        <input
          id="userid"
          type="text"
          placeholder="jordan"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <button type="submit">Continue</button>
      </form>

      <div className="text-xs text-muted mt-md">
        This ID will be used for API requests and WebSocket messages.
      </div>
    </div>
  );
};

export default Login;
