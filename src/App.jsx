import React from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import FilterBar from "./components/FilterBar";
import useLocalStorage from "./hooks/useLocalStorage";
import "./styles.css";
const FILTERS = {
  ALL: "all",
  COMPLETED: "completed",
  PENDING: "pending",
};
console.log("App mounted — hello Akhil!");
export default function App() {
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [filter, setFilter] = React.useState(FILTERS.ALL);
  const addTodo = (text) => {
    const newTodo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
    };
    if (!newTodo.text) return;
    setTodos([newTodo, ...todos]);
  };
  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? {...t, completed: !t.completed} : t));
  };
  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };
  const filtered = todos.filter(t => {
    if (filter === FILTERS.ALL) return true;
    if (filter === FILTERS.COMPLETED) return t.completed;
    return !t.completed;
  });
  return (
    <div className="app">
      <h1>To-Do App</h1>
      <TodoInput onAdd={addTodo} />
      <FilterBar current={filter} setFilter={setFilter} filters={FILTERS} />
      <TodoList todos={filtered} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}
