import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import NavBar from './components/NavBar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Notifications from './pages/Notifications.jsx'
import Peek from './pages/Peek.jsx'
import Settings from './pages/Settings.jsx'

import EnvCheck from './pages/EnvCheck.jsx'   // ⭐ NEW DEBUG PAGE

const App = () => {
  return (
    <div className="app-root">
      <NavBar />
      <main className="app-main">
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/peek"
            element={
              <ProtectedRoute>
                <Peek />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* ⭐ NEW: Debug environment variables */}
          <Route path="/env-check" element={<EnvCheck />} />

          {/* Catch-all → redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
