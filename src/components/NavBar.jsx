import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useWebSocket } from '../context/WebSocketContext.jsx'

const NavBar = () => {
  const { token, logout } = useAuth()
  const { status } = useWebSocket()
  const location = useLocation()

  const isAuthed = !!token
  const onLoginPage = location.pathname === '/login'

  return (
    <nav className="navbar">
      <div className="nav-brand">Mania Control</div>

      {isAuthed && (
        <div className="badge mt-sm">
          <span className="badge-dot" />
          <span className="text-xs">WS: {status}</span>
        </div>
      )}

      <div className="nav-links mt-lg">
        {isAuthed ? (
          <>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' active' : '')
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' active' : '')
              }
            >
              Notifications
            </NavLink>
            <NavLink
              to="/peek"
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' active' : '')
              }
            >
              Peek
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' active' : '')
              }
            >
              Settings
            </NavLink>
          </>
        ) : !onLoginPage ? (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              'nav-link' + (isActive ? ' active' : '')
            }
          >
            Login
          </NavLink>
        ) : null}
      </div>

      {isAuthed && (
        <div className="nav-footer">
          <button onClick={logout}>Log out</button>
        </div>
      )}
    </nav>
  )
}

export default NavBar
