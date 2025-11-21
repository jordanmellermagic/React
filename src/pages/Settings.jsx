// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserData, setUserData } from "../api.js";

const Settings = () => {
  const { userId } = useAuth();

  const [form, setForm] = useState({
    name: "",
    status: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load existing user data into form
  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserData(userId);

        const normalized =
          res && typeof res === "object" && "data" in res ? res.data : res;

        setForm({
          name: normalized?.name ?? "",
          status: normalized?.status ?? "",
          message: normalized?.message ?? "",
        });
      } catch (e) {
        console.error(e);
        setError("Could not load user data. You may need to create it first.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await setUserData(userId, form);
      setSuccess("User data saved.");
    } catch (e) {
      console.error(e);
      setError("Failed to save user data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <div className="card-title">User Settings</div>
      <div className="card-subtitle">
        These fields are stored in your FastAPI backend via{" "}
        <code>/user/{{"&"}user_id}</code>.
      </div>

      {loading && <div className="mt-md">Loading…</div>}
      {error && <div className="form-error mt-md">{error}</div>}
      {success && (
        <div className="mt-md text-sm" style={{ color: "#bbf7d0" }}>
          {success}
        </div>
      )}

      {!loading && (
        <form className="mt-md" onSubmit={handleSubmit}>
          <div className="mt-sm">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="mt-sm">
            <label htmlFor="status">Status</label>
            <input
              id="status"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            />
          </div>

          <div className="mt-sm">
            <label htmlFor="message">Message</label>
            <input
              id="message"
              value={form.message}
              onChange={(e) => handleChange("message", e.target.value)}
            />
          </div>

          <button type="submit" className="mt-md" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </form>
      )}

      {!loading && !userId && (
        <div className="mt-md text-sm text-muted">
          No userId set. Go to the login page and enter a user ID first.
        </div>
      )}
    </div>
  );
};

export default Settings;
