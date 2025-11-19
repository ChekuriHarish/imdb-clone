import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
      {theme === "light" ? "🌞 Light" : "🌙 Dark"}
    </button>
  );
}
