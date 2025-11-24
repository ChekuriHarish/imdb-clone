import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="
        theme-toggle
        inline-flex items-center gap-2
        px-3 py-1.5 rounded-full
        bg-slate-100 dark:bg-slate-800
        text-slate-700 dark:text-slate-200
        text-sm font-medium
        shadow-sm hover:shadow-md
        border border-slate-200/60 dark:border-slate-700/60
        transition-all duration-200
        hover:-translate-y-0.5
      "
      aria-label="Toggle theme"
    >
      <span className="text-base">
        {theme === "light" ? "🌞" : "🌙"}
      </span>
      <span className="hidden sm:inline">
        {theme === "light" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
