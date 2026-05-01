import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(username, password);
      const role = localStorage.getItem("scholarlink_role");
      if (role === "admin") {
        navigate("/admin");
      } else {
        setError("Not an admin account");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-bg px-6">
      <div className="w-full max-w-md rounded-lg border border-base-border bg-base-surface p-8">
        <Link to="/" className="text-sm text-text-secondary hover:text-text-primary">
          ← Back
        </Link>
        <h2 className="mt-4 text-2xl font-semibold text-text-primary">Admin Login</h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-text-muted">Username</label>
            <input
              className="mt-2 w-full rounded-md border border-base-border bg-base-surface2 px-4 py-3 text-sm text-text-primary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.24em] text-text-muted">Password</label>
            <input
              className="mt-2 w-full rounded-md border border-base-border bg-base-surface2 px-4 py-3 text-sm text-text-primary"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-status-rejected">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-brand-primary py-3 text-sm font-semibold text-white transition hover:bg-brand-primaryDark disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}