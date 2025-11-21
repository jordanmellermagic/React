// src/pages/Settings.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserData, setUserData } from "../api.js";

function computeDaysAlive(birthdayStr) {
  if (!birthdayStr) return null;
  const d = new Date(birthdayStr);
  if (Number.isNaN(d.getTime())) return null;

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return days >= 0 ? days : null;
}

const Settings = () => {
  const { userId } = useAuth();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    birthday: "",
    days_alive: 0,
    address: "",
    note_name: "",
    screenshot_base64: "",
    command: "",
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

        setForm({
          first_name: res?.first_name ?? "",
          last_name: res?.last_name ?? "",
          phone_number: res?.phone_number ?? "",
          birthday: res?.birthday ?? "",
          days_alive:
            typeof res?.days_alive === "number" ? res.days_alive : 0,
          address: res?.address ?? "",
          note_name: res?.note_name ?? "",
          screenshot_base64: res?.screenshot_base64 ?? "",
          command: res?.command ?? "",
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
      // auto-calc days_alive from birthday before saving
      const days = computeDaysAlive(form.birthday);
      const payload = {
        ...form,
        days_alive: days ?? form.days_alive ?? 0,
      };

      await setUserData(userId, payload);
      setSuccess("User data saved.");
      setForm((prev) => ({ ...prev, days_alive: payload.days_alive }));
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
        These fields map directly to your FastAPI <code>/user/{"{user_id}"}</code> data.
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
          <div className="row">
            <div className="col">
              <label htmlFor="first_name">First name</label>
              <input
                id="first_name"
                value={form.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
              />
            </div>
            <div className="col">
              <label htmlFor="last_name">Last name</label>
              <input
                id="last_name"
                value={form.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
              />
            </div>
          </div>

          <div className="row mt-sm">
            <div className="col">
              <label htmlFor="phone_number">Phone number</label>
              <input
                id="phone_number"
                value={form.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
              />
            </div>
            <div className="col">
              <label htmlFor="birthday">Birthday</label>
              <input
                id="birthday"
                placeholder="YYYY-MM-DD"
                value={form.birthday}
                onChange={(e) => handleChange("birthday", e.target.value)}
              />
              <div className="text-xs text-muted mt-sm">
                Days alive:{" "}
                {typeof form.days_alive === "number"
                  ? form.days_alive
                  : "—"}{" "}
                (auto-calculated on save)
              </div>
            </div>
          </div>

          <div className="mt-sm">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="row mt-sm">
            <div className="col">
              <label htmlFor="note_name">Note name</label>
              <input
                id="note_name"
                value={form.note_name}
                onChange={(e) => handleChange("note_name", e.target.value)}
              />
            </div>
            <div className="col">
              <label htmlFor="command">Command</label>
              <input
                id="command"
                value={form.command}
                onChange={(e) => handleChange("command", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-sm">
            <label htmlFor="screenshot_base64">Screenshot (base64)</label>
            <textarea
              id="screenshot_base64"
              value={form.screenshot_base64}
              onChange={(e) =>
                handleChange("screenshot_base64", e.target.value)
              }
              placeholder="Paste base64 string here"
              style={{
                width: "100%",
                minHeight: 120,
                borderRadius: "0.5rem",
                border: "1px solid #374151",
                background: "#020617",
                color: "#f9fafb",
                padding: "0.6rem",
                fontFamily: "monospace",
                fontSize: "0.85rem",
              }}
            />
            <div className="text-xs text-muted mt-sm">
              If valid, a preview will show on the Dashboard.
            </div>
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
