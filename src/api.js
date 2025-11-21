// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// GET user data
export const getUserData = async (userId) => {
  try {
    const res = await api.get(`user/${encodeURIComponent(userId)}`);
    return res.data;
  } catch (error) {
    console.error("GET ERROR:", error.response?.data || error);
    throw error;
  }
};

// POST user data
export const setUserData = async (userId, payload) => {
  try {
    const res = await api.post(`user/${encodeURIComponent(userId)}`, payload);
    return res.data;
  } catch (error) {
    console.error("POST ERROR:", error.response?.data || error);
    throw error;
  }
};

export default api;
