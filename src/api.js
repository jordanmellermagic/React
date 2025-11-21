// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/**
 * Get user data from GET /user/{userId}
 */
export const getUserData = async (userId) => {
  if (!userId) throw new Error("No userId provided");
  const res = await api.get(`/user/${encodeURIComponent(userId)}`);
  return res.data;
};

/**
 * Set user data with POST /user/{userId}
 * We send { name, status, message }
 */
export const setUserData = async (userId, payload) => {
  if (!userId) throw new Error("No userId provided");
  const res = await api.post(`/user/${encodeURIComponent(userId)}`, payload);
  return res.data;
};

export default api;
