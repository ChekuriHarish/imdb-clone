import React from "react";
export default function FilterBar({ current, setFilter, filters }) {
  return (
    <div className="filter-bar">
      <button onClick={() => setFilter(filters.ALL)} className={current===filters.ALL? "active":""}>All</button>
      <button onClick={() => setFilter(filters.PENDING)} className={current===filters.PENDING? "active":""}>Pending</button>
      <button onClick={() => setFilter(filters.COMPLETED)} className={current===filters.COMPLETED? "active":""}>Completed</button>
    </div>
  );
}
