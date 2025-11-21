import React, { useState } from 'react'
import { useWebSocket } from '../context/WebSocketContext.jsx'

const Peek = () => {
  const { sendMessage } = useWebSocket()
  const [command, setCommand] = useState('')
  const [payload, setPayload] = useState('')

  const handleSend = () => {
    const base = { command }
    let extra = {}
    if (payload.trim()) {
      try {
        extra = JSON.parse(payload)
      } catch (e) {
        extra = { payload }
      }
    }
    sendMessage({ ...base, ...extra })
  }

  return (
    <div className="card">
      <div className="card-title">Peek / Test commands</div>
      <div className="card-subtitle">
        Manually send commands over the WebSocket to see how your API reacts.
      </div>

      <div className="mt-md">
        <label htmlFor="command">Command</label>
        <input
          id="command"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="status_check"
        />
      </div>

      <div className="mt-md">
        <label htmlFor="payload">
          Payload (JSON or plain text, optional)
        </label>
        <textarea
          id="payload"
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder='{"foo": "bar"}'
          style={{
            width: '100%',
            minHeight: 120,
            borderRadius: '0.5rem',
            border: '1px solid #374151',
            background: '#020617',
            color: '#f9fafb',
            padding: '0.6rem',
            fontFamily: 'monospace',
            fontSize: '0.85rem'
          }}
        />
      </div>

      <button className="mt-md" onClick={handleSend}>
        Send command
      </button>

      <div className="text-xs text-muted mt-md">
        Wire this into however your Mania API expects incoming WS messages.
      </div>
    </div>
  )
}

export default Peek
