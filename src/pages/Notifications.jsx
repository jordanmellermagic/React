import React from 'react'
import { useWebSocket } from '../context/WebSocketContext.jsx'

const Notifications = () => {
  const { messages, status } = useWebSocket()

  return (
    <div className="card">
      <div className="card-title">Notifications</div>
      <div className="card-subtitle">
        Live feed of messages pushed over your WebSocket connection.
      </div>

      <div className="mt-md text-sm text-muted">
        Status: <strong>{status}</strong>
      </div>

      {messages.length === 0 ? (
        <div className="mt-md text-sm text-muted">
          No notifications yet. Trigger something in your API that sends a WS
          message and they&apos;ll show up here.
        </div>
      ) : (
        <ul className="list mt-md">
          {messages.map((m) => (
            <li key={m.id} className="list-item">
              <div className="text-xs text-muted">{m.ts}</div>
              <pre
                style={{
                  marginTop: '0.25rem',
                  fontSize: '0.8rem',
                  background: '#020617',
                  padding: '0.5rem',
                  borderRadius: '0.4rem',
                  border: '1px solid #111827',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {typeof m.raw === 'string'
                  ? m.raw
                  : JSON.stringify(m.raw, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Notifications
