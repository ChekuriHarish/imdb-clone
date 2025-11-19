// import React, { useEffect, useState } from "react";
// import TodoInput from "./components/TodoInput";
// import TodoList from "./components/TodoList";
// import FilterBar from "./components/FilterBar";
// import Header from "./components/Header";
// import MovieCard from "./components/MovieCard";
// import useLocalStorage from "./hooks/useLocalStorage";
// import { fetchPopularMovies } from "./api";
// import "./styles.css";
// import "./movies.css";

// const FILTERS = {
//   ALL: "all",
//   COMPLETED: "completed",
//   PENDING: "pending",
// };

// console.log("App mounted — hello Akhil!");

// export default function App() {
//   const [todos, setTodos] = useLocalStorage("todos", []);
//   const [filter, setFilter] = React.useState(FILTERS.ALL);
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch movies on mount
//   useEffect(() => {
//     async function load() {
//       setLoading(true);
//       try {
//         const results = await fetchPopularMovies();
//         setMovies(results);
//       } catch (err) {
//         setError(err.message);
//       }
//       setLoading(false);
//     }
//     load();
//   }, []);

//   const addTodo = (text) => {
//     const newTodo = {
//       id: Date.now().toString(),
//       text: text.trim(),
//       completed: false,
//     };
//     if (!newTodo.text) return;
//     setTodos([newTodo, ...todos]);
//   };

//   const toggleTodo = (id) => {
//     setTodos(
//       todos.map((t) =>
//         t.id === id ? { ...t, completed: !t.completed } : t
//       )
//     );
//   };

//   const deleteTodo = (id) => {
//     setTodos(todos.filter((t) => t.id !== id));
//   };

//   const filtered = todos.filter((t) => {
//     if (filter === FILTERS.ALL) return true;
//     if (filter === FILTERS.COMPLETED) return t.completed;
//     return !t.completed;
//   });

//   return (
//     <div className="app">
//       {/* Header with Theme Toggle */}
//       <Header />

//       <main style={{ padding: 16 }}>
//         <p>Welcome Akhil — toggle theme using the button above.</p>
//       </main>

//       {/* To-Do App Section */}
//       <h1>To-Do App</h1>
//       <TodoInput onAdd={addTodo} />
//       <FilterBar
//         current={filter}
//         setFilter={setFilter}
//         filters={FILTERS}
//       />
//       <TodoList
//         todos={filtered}
//         onToggle={toggleTodo}
//         onDelete={deleteTodo}
//       />

//       {/* Movies Section */}
//       <div className="container" style={{ marginTop: "40px" }}>
//         <h1>Popular Movies (OMDB)</h1>
//         {loading && <div className="center">Loading...</div>}
//         {error && <div className="center error">{error}</div>}
//         <div className="movies-grid">
//           {movies.map((movie) => (
//             <MovieCard key={movie.id} movie={movie} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }








import React, { useEffect, useState } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";
import MovieCard from "./components/MovieCard";
import useLocalStorage from "./hooks/useLocalStorage";
import { fetchPopularMovies } from "./api";
import "./styles.css";
import "./movies.css";

const FILTERS = {
  ALL: "all",
  COMPLETED: "completed",
  PENDING: "pending",
};

export default function App() {
  // ---------- To-Do app state (persistent) ----------
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [filter, setFilter] = useState(FILTERS.ALL);

  // ---------- Movies state ----------
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------- Notes state (localStorage) ----------
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");

  // ---- Fetch movies on mount ----
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const results = await fetchPopularMovies();
        setMovies(results || []);
      } catch (err) {
        setError(err.message || "Failed to load movies");
      }
      setLoading(false);
    }
    load();
  }, []);

  // ---- Load notes from localStorage on mount ----
  useEffect(() => {
    try {
      const saved = localStorage.getItem("notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to read notes from localStorage", e);
    }
  }, []);

  // ---- Persist notes to localStorage when changed ----
  useEffect(() => {
    try {
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes", e);
    }
  }, [notes]);

  // ---------- To-Do functions ----------
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
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const filteredTodos = todos.filter((t) => {
    if (filter === FILTERS.ALL) return true;
    if (filter === FILTERS.COMPLETED) return t.completed;
    return !t.completed;
  });

  // ---------- Notes functions ----------
  const addNote = () => {
    if (!noteText.trim()) return;
    const newNote = { id: Date.now(), content: noteText.trim() };
    setNotes([newNote, ...notes]);
    setNoteText("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="app">
      {/* Header with Theme Toggle */}
      <Header />

      <main style={{ padding: 16 }}>
        <p>Welcome Akhil — toggle theme using the button above.</p>
      </main>

      {/* ---------------- To-Do App Section ---------------- */}
      <section style={{ padding: "0 16px", marginTop: 8 }}>
        <h2>To-Do App</h2>
        <TodoInput onAdd={addTodo} />
        <FilterBar current={filter} setFilter={setFilter} filters={FILTERS} />
        <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </section>

      {/* ---------------- Notes App Section ---------------- */}
      <section style={{ padding: "0 16px", marginTop: 40 }}>
        <h2>📝 Notes</h2>
        <div className="input-box" style={{ marginBottom: 12 }}>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write your note here..."
          />
          <button onClick={addNote}>Save Note</button>
        </div>

        <div className="notes-list">
          {notes.length === 0 ? (
            <p className="empty">No notes yet...</p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="note-card">
                <p>{note.content}</p>
                <button className="delete-btn" onClick={() => deleteNote(note.id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ---------------- Movies Section ---------------- */}
      <section className="container" style={{ marginTop: 40, padding: "0 16px" }}>
        <h2>Popular Movies (OMDB)</h2>
        {loading && <div className="center">Loading...</div>}
        {error && <div className="center error">{error}</div>}
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id || movie.imdbID || movie.title} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}
