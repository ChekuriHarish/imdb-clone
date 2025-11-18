import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Content() {
  const { theme } = useContext(ThemeContext);
  return (
    <section className="content">
      <p>Current theme: <strong>{theme}</strong></p>
      <p>
        This is sample content to show how background and text color change with
        the selected theme.
      </p>
    </section>
  );
}
