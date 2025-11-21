import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginRequest } from '../api.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem('cp_token')
    const storedUserId = localStorage.getItem('cp_user_id')
    if (storedToken && storedUserId) {
      setToken(storedToken)
      setUserId(storedUserId)
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    setError(null)
    try {
      const data = await loginRequest(username, password)
      setToken(data.token)
      setUserId(data.userId)
      localStorage.setItem('cp_token', data.token)
      localStorage.setItem('cp_user_id', data.userId)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Login failed. Check your credentials or API endpoint.')
    }
  }

  const logout = () => {
    setToken(null)
    setUserId(null)
    localStorage.removeItem('cp_token')
    localStorage.removeItem('cp_user_id')
    navigate('/login')
  }

  const value = {
    token,
    userId,
    loading,
    error,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
