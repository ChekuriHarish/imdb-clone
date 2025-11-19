import React, { useState } from "react";
import useDebounce from "../hooks/useDebounce";
export default function SearchBar({ onSearch, placeholder = "Search movies..." }) {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 550);
  React.useEffect(() => {
    onSearch(debouncedQ);
  }, [debouncedQ, onSearch]);
  return (
    <div className="search-bar" style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label="Search movies"
        style={{
          flex: 1,
          padding: "8px 10px",
          borderRadius: 6,
          border: "1px solid #ddd",
          background: "transparent",
          color: "inherit",
        }}
      />
      <button onClick={() => { setQ(""); onSearch(""); }} aria-label="Clear search">
        Clear
      </button>
    </div>
  );
}
