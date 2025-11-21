import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const Login = () => {
  const { login, error } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    await login(username, password)
    setSubmitting(false)
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '3rem auto' }}>
      <div className="card-title">Sign in</div>
      <div className="card-subtitle">
        Connect to your Mania API control panel.
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="jordan"
          autoComplete="username"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <div className="text-xs text-muted mt-md">
        Make sure <code>VITE_API_BASE_URL</code> points at your Render API.
      </div>
    </div>
  )
}

export default Login
