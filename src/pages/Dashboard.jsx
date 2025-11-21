// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getUserData } from "../api.js";
import { useWebSocket } from "../context/WebSocketContext.jsx";

const Dashboard = () => {
  const { userId } = useAuth();
  const { status: wsStatus } = useWebSocket();

  const [data, setData] = useState(null);        // normalized user data
  const [raw, setRaw] = useState(null);         // raw API response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserData(userId);

        // Handle both {data: {...}} and plain {...}
        const normalized = res && typeof res === "object" && "data" in res
          ? res.data
          : res;

        setData(normalized || {});
        setRaw(res);
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

  const name = data?.name ?? "—";
  const status = data?.status ?? "—";
  const message = data?.message ?? "—";

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
            <div className="text-sm text-muted">Name</div>
            <div>{name}</div>
          </div>

          <div className="col">
            <div className="text-sm text-muted">Status</div>
            <div>{status}</div>
          </div>
        </div>

        <div className="mt-md">
          <div className="text-sm text-muted">Message</div>
          <div>{message}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Raw API data</div>
        <div className="card-subtitle text-sm text-muted">
          This is whatever your <code>/user/{{"&"}user_id}</code> route returns.
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
