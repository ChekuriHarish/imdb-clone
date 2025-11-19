import React, { useEffect, useState } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";
import MovieCard from "./components/MovieCard";
import useLocalStorage from "./hooks/useLocalStorage";
import { fetchPopularMovies, fetchMoviesByTitle } from "./api";
import SearchBar from "./components/SearchBar";
import "./styles.css";
import "./movies.css";
const FILTERS = {
  ALL: "all",
  COMPLETED: "completed",
  PENDING: "pending",
};
export default function App() {
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const results = await fetchPopularMovies();
        if (!active) return;
        setMovies(results || []);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load movies");
        setMovies([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    async function doSearch() {
      if (!searchQuery || !searchQuery.trim()) {
        if (!active) return;
        setSearchResults([]);
        setNoResults(false);
        setSearching(false);
        return;
      }
      setSearching(true);
      setNoResults(false);
      try {
        const results = await fetchMoviesByTitle(searchQuery);
        if (!active) return;
        setSearchResults(results || []);
        setNoResults(Array.isArray(results) && results.length === 0);
      } catch (err) {
        console.error("Search error", err);
        if (!active) return;
        setSearchResults([]);
        setNoResults(true);
      } finally {
        if (active) setSearching(false);
      }
    }
    doSearch();
    return () => {
      active = false;
    };
  }, [searchQuery]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("notes");
      if (saved) setNotes(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to read notes from localStorage", e);
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (e) {
      console.error("Failed to save notes", e);
    }
  }, [notes]);
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
  const addNote = () => {
    if (!noteText.trim()) return;
    const newNote = { id: Date.now(), content: noteText.trim() };
    setNotes([newNote, ...notes]);
    setNoteText("");
  };
  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };
  const moviesToShow = searchResults.length > 0 ? searchResults : movies;

  return (
    <div className="app">
      <Header />
      <main style={{ padding: 16 }}>
        <p>Welcome Akhil — toggle theme using the button above.</p>
      </main>
      <section style={{ padding: "0 16px", marginTop: 8 }}>
        <h2>To-Do App</h2>
        <TodoInput onAdd={addTodo} />
        <FilterBar current={filter} setFilter={setFilter} filters={FILTERS} />
        <TodoList todos={filteredTodos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </section>
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
      <section className="container" style={{ marginTop: 40, padding: "0 16px" }}>
        <h2>Popular Movies (OMDB)</h2>
        <SearchBar onSearch={(q) => setSearchQuery(q)} />
        {searching && <div className="center">Searching...</div>}
        {loading && !searching && <div className="center">Loading...</div>}
        {error && <div className="center error">{error}</div>}
        {noResults && !searching && (
          <div className="center empty">No Results Found for "{searchQuery}"</div>
        )}
        <div className="movies-grid">
          {moviesToShow.map((movie) => (
            <MovieCard key={movie.id || movie.imdbID || movie.title} movie={movie} />
          ))}
        </div>
        {!searching && moviesToShow.length === 0 && (
          <div className="center empty">No movies to show.</div>
        )}
      </section>
    </div>
  );
}
