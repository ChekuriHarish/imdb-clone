import React from "react";
export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? "done" : ""}`}>
      <label>
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
        <span>{todo.text}</span>
      </label>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}
