import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getSettings, updateSettings } from '../api.js'

const Settings = () => {
  const { token } = useAuth()
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (!token) return
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const s = await getSettings(token)
        setSettings(s)
      } catch (e) {
        console.error(e)
        setError('Could not load settings. Check your /settings endpoint.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...(prev || {}),
      [key]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const updated = await updateSettings(token, settings)
      setSettings(updated)
      setSuccess('Settings saved.')
    } catch (e) {
      console.error(e)
      setError('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <div className="card-title">Settings</div>
      <div className="card-subtitle">
        These fields mirror whatever your API returns from <code>/settings</code>.
      </div>

      {loading && <div className="mt-md">Loading…</div>}
      {error && <div className="form-error mt-md">{error}</div>}
      {success && (
        <div className="mt-md text-sm" style={{ color: '#bbf7d0' }}>
          {success}
        </div>
      )}

      {settings && (
        <form className="mt-md" onSubmit={handleSubmit}>
          {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="mt-sm">
              <label htmlFor={key}>{key}</label>
              <input
                id={key}
                value={value ?? ''}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </div>
          ))}

          <button type="submit" className="mt-md" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </form>
      )}

      {!loading && !settings && !error && (
        <div className="mt-md text-sm text-muted">
          No settings returned from API.
        </div>
      )}
    </div>
  )
}

export default Settings
