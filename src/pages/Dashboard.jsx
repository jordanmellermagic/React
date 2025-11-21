import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getDashboardData } from '../api.js'
import { useWebSocket } from '../context/WebSocketContext.jsx'

const Dashboard = () => {
  const { token, userId } = useAuth()
  const { status } = useWebSocket()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const d = await getDashboardData(token)
        setData(d)
      } catch (e) {
        console.error(e)
        setError('Could not load dashboard data. Check your API routes.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  return (
    <div>
      <div className="card">
        <div className="card-title">Overview</div>
        <div className="card-subtitle">
          High-level status of your Mania control system.
        </div>

        <div className="row mt-md">
          <div className="col">
            <div className="text-sm text-muted">User</div>
            <div>{userId || '—'}</div>
          </div>
          <div className="col">
            <div className="text-sm text-muted">WebSocket</div>
            <div className="badge mt-sm">
              <span className="badge-dot" />
              <span className="text-xs">{status}</span>
            </div>
          </div>
          <div className="col">
            <div className="text-sm text-muted">API</div>
            <div>{error ? 'Error' : data ? 'Online' : 'Loading…'}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Raw API data</div>
        <div className="card-subtitle text-sm text-muted">
          This is whatever your <code>/dashboard</code> route returns.
        </div>
        {loading && <div>Loading…</div>}
        {error && <div className="form-error mt-sm">{error}</div>}
        {!loading && !error && (
          <pre
            style={{
              marginTop: '0.75rem',
              fontSize: '0.8rem',
              background: '#020617',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #111827',
              maxHeight: 280,
              overflow: 'auto'
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}

export default Dashboard
