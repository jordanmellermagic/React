import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from './AuthContext.jsx'

const WebSocketContext = createContext(null)

export const WebSocketProvider = ({ children }) => {
  const { token, userId } = useAuth()
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('disconnected')
  const wsRef = useRef(null)

  useEffect(() => {
    if (!token || !userId) {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      setStatus('disconnected')
      setMessages([])
      return
    }

    const url = import.meta.env.VITE_WS_URL
    if (!url) {
      console.warn('VITE_WS_URL not set')
      return
    }

    setStatus('connecting')
    const ws = new WebSocket(url + `?userId=${encodeURIComponent(userId)}`)
    wsRef.current = ws

    ws.onopen = () => {
      setStatus('connected')
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setMessages((prev) => [
          {
            id: Date.now() + Math.random(),
            ts: new Date().toISOString(),
            raw: data
          },
          ...prev
        ])
      } catch (e) {
        setMessages((prev) => [
          {
            id: Date.now() + Math.random(),
            ts: new Date().toISOString(),
            raw: event.data
          },
          ...prev
        ])
      }
    }

    ws.onerror = () => {
      setStatus('error')
    }

    ws.onclose = () => {
      setStatus('disconnected')
    }

    return () => {
      ws.close()
    }
  }, [token, userId])

  const sendMessage = (payload) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload))
    }
  }

  const value = {
    status,
    messages,
    sendMessage
  }

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => useContext(WebSocketContext)
