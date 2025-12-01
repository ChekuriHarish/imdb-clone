import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/"); 
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 shadow-md">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
        Login
      </h1>

      {error && (
        <p className="mb-3 text-sm text-red-500 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="text-indigo-600 dark:text-indigo-400 font-semibold"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
