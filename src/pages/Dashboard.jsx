// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserData } from "../api.js";
import { useWebSocket } from "../context/WebSocketContext.jsx";

const Dashboard = () => {
  const { userId } = useAuth();
  const { status: wsStatus } = useWebSocket();

  const [data, setData] = useState(null);
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserData(userId);
        setData(res || {});
        setRaw(res || {});
      } catch (e) {
        console.error(e);
        setError("Could not load user data. Check your /user/{user_id} route.");
        setData(null);
        setRaw(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId]);

  const {
    first_name,
    last_name,
    phone_number,
    birthday,
    days_alive,
    address,
    note_name,
    screenshot_base64,
    command,
  } = data || {};

  const hasScreenshot =
    typeof screenshot_base64 === "string" &&
    screenshot_base64.trim() !== "" &&
    screenshot_base64 !== "string";

  return (
    <div>
      {/* Overview card */}
      <div className="card">
        <div className="card-title">Overview</div>
        <div className="card-subtitle">
          High-level status of your Mania control system.
        </div>

        <div className="row mt-md">
          <div className="col">
            <div className="text-sm text-muted">User ID</div>
            <div>{userId || "—"}</div>
          </div>

          <div className="col">
            <div className="text-sm text-muted">WebSocket</div>
            <div className="badge mt-sm">
              <span className="badge-dot" />
              <span className="text-xs">{wsStatus}</span>
            </div>
          </div>

          <div className="col">
            <div className="text-sm text-muted">Command</div>
            <div>{command || "—"}</div>
          </div>

          <div className="col">
            <div className="text-sm text-muted">Days alive</div>
            <div>{typeof days_alive === "number" ? days_alive : "—"}</div>
          </div>
        </div>

        <div className="row mt-md">
          <div className="col">
            <div className="text-sm text-muted">Name</div>
            <div>
              {first_name || "—"} {last_name || ""}
            </div>
          </div>

          <div className="col">
            <div className="text-sm text-muted">Phone</div>
            <div>{phone_number || "—"}</div>
          </div>

          <div className="col">
            <div className="text-sm text-muted">Birthday</div>
            <div>{birthday || "—"}</div>
          </div>

          <div className="col">
            <div className="text-sm text-muted">Address</div>
            <div>{address || "—"}</div>
          </div>
        </div>

        <div className="mt-md">
          <div className="text-sm text-muted">Note name</div>
          <div>{note_name || "—"}</div>
        </div>
      </div>

      {/* Screenshot preview */}
      {hasScreenshot && (
        <div className="card">
          <div className="card-title">Latest Screenshot</div>
          <div className="card-subtitle text-sm text-muted">
            From <code>screenshot_base64</code>.
          </div>
          <div className="mt-md">
            <img
              src={`data:image/png;base64,${screenshot_base64}`}
              alt="Screenshot"
              style={{
                maxWidth: "100%",
                borderRadius: "0.5rem",
                border: "1px solid #111827",
              }}
            />
          </div>
        </div>
      )}

      {/* Raw data card */}
      <div className="card">
        <div className="card-title">Raw API data</div>
        <div className="card-subtitle text-sm text-muted">
          This is whatever your <code>/user/{"{user_id}"}</code> route returns.
        </div>

        {loading && <div>Loading…</div>}
        {error && <div className="form-error mt-sm">{error}</div>}

        {!loading && !error && raw && (
          <pre
            style={{
              marginTop: "0.75rem",
              fontSize: "0.8rem",
              background: "#020617",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #111827",
              maxHeight: 280,
              overflow: "auto",
            }}
          >
            {JSON.stringify(raw, null, 2)}
          </pre>
        )}

        {!loading && !error && !raw && (
          <div className="mt-md text-sm text-muted">
            No data returned yet. Try creating data via POST /user/{userId} in
            your FastAPI docs.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
