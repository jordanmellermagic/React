import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true
})

// Adjust these paths to match your FastAPI routes.

export const loginRequest = async (username, password) => {
  const res = await api.post('/auth/login', { username, password })
  return res.data // expected { token, userId }
}

export const getDashboardData = async (token) => {
  const res = await api.get('/dashboard', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export const getSettings = async (token) => {
  const res = await api.get('/settings', {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export const updateSettings = async (token, payload) => {
  const res = await api.put('/settings', payload, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

export default api
