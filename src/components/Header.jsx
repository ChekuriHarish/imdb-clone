import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const name =
    currentUser?.displayName ||
    (currentUser?.email ? currentUser.email.split("@")[0] : null);

  return (
    <header className="mb-4 flex items-center justify-between gap-3">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-lg sm:text-xl font-bold">
          🎬 HarishDB
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Logged in as
              </span>
              <span className="text-sm font-semibold">
                {name || "User"}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
              {name ? name[0].toUpperCase() : "U"}
            </div>

            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
