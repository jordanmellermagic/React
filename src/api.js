// src/api.js
import axios from "axios";

/**
 * Axios client for talking to your FastAPI backend.
 * This version adds:
 *  - timeout (prevents stalled requests)
 *  - safe CORS headers
 *  - validation for non-200 responses
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  validateStatus: (status) => true, // Prevent axios from throwing for non-200
});

/**
 * Get user data from GET /user/{userId}
 */
export const getUserData = async (userId) => {
  if (!userId) throw new Error("No userId provided");

  const endpoint = `/user/${encodeURIComponent(userId)}`;
  console.log("GET:", endpoint);

  const res = await api.get(endpoint);

  // If backend didn't return OK, log and throw for dashboard UI
  if (res.status !== 200) {
    console.warn("GET /user failed:", res.status, res.data);
    throw new Error(`GET /user failed with status ${res.status}`);
  }

  return res.data;
};

/**
 * Set user data via POST /user/{userId}
 */
export const setUserData = async (userId, payload) => {
  if (!userId) throw new Error("No userId provided");

  const endpoint = `/user/${encodeURIComponent(userId)}`;
  console.log("POST:", endpoint, payload);

  const res = await api.post(endpoint, payload);

  // If backend didn't return OK, log and throw for settings UI
  if (res.status !== 200) {
    console.warn("POST /user failed:", res.status, res.data);
    throw new Error(`POST /user failed with status ${res.status}`);
  }

  return res.data;
};

export default api;
