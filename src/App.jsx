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

  const [popularPage, setPopularPage] = useState(1);
  const [popularTotal, setPopularTotal] = useState(0);
  const [popularHasMore, setPopularHasMore] = useState(true);
  const [loadingMorePopular, setLoadingMorePopular] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const [searchPage, setSearchPage] = useState(1);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchHasMore, setSearchHasMore] = useState(false);
  const [loadingMoreSearch, setLoadingMoreSearch] = useState(false);

  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      try {
        const { movies: initialMovies, totalResults, page } =
          await fetchPopularMovies(1);

        if (!active) return;

        setMovies(initialMovies || []);
        setPopularPage(page);
        setPopularTotal(totalResults);
        setPopularHasMore((initialMovies || []).length < totalResults);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load movies");
        setMovies([]);
        setPopularHasMore(false);
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
        setSearchPage(1);
        setSearchTotal(0);
        setSearchHasMore(false);
        return;
      }

      setSearching(true);
      setNoResults(false);

      try {
        const { movies: results, totalResults, page } =
          await fetchMoviesByTitle(searchQuery, 1);

        if (!active) return;

        setSearchResults(results || []);
        setSearchPage(page);
        setSearchTotal(totalResults);
        setSearchHasMore((results || []).length < totalResults);
        setNoResults(Array.isArray(results) && results.length === 0);
      } catch (err) {
        console.error("Search error", err);
        if (!active) return;
        setSearchResults([]);
        setNoResults(true);
        setSearchHasMore(false);
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
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
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

  const loadMorePopular = async () => {
    const nextPage = popularPage + 1;
    setLoadingMorePopular(true);

    try {
      const { movies: moreMovies, totalResults, page } =
        await fetchPopularMovies(nextPage);

      setMovies((prev) => {
        const combined = [...prev, ...(moreMovies || [])];
        setPopularTotal(totalResults);
        setPopularPage(page);
        setPopularHasMore(combined.length < totalResults);

        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });

        return combined;
      });
    } catch (err) {
      console.error("Load more popular error", err);
    } finally {
      setLoadingMorePopular(false);
    }
  };

  const loadMoreSearch = async () => {
    const nextPage = searchPage + 1;
    setLoadingMoreSearch(true);

    try {
      const { movies: moreMovies, totalResults, page } =
        await fetchMoviesByTitle(searchQuery, nextPage);

      setSearchResults((prev) => {
        const combined = [...prev, ...(moreMovies || [])];
        setSearchTotal(totalResults);
        setSearchPage(page);
        setSearchHasMore(combined.length < totalResults);

        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });

        return combined;
      });
    } catch (err) {
      console.error("Load more search error", err);
    } finally {
      setLoadingMoreSearch(false);
    }
  };

  const moviesToShow =
    searchQuery && searchQuery.trim() ? searchResults : movies;

  return (
    <div className="app max-w-6xl mx-auto min-h-screen flex flex-col gap-10 py-6 px-4 sm:px-6">
      <Header />

      <main className="mt-1">
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Welcome Akhil — toggle theme using the button above.
        </p>
      </main>

      <section className="mt-2">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">
          To-Do App
        </h2>
        <div className="bg-white/80 dark:bg-slate-900/70 rounded-2xl p-4 sm:p-5 shadow-md">
          <TodoInput onAdd={addTodo} />
          <FilterBar current={filter} setFilter={setFilter} filters={FILTERS} />
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </div>
      </section>

      <section className="mt-2">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">
          📝 Notes
        </h2>
        <div className="bg-white/80 dark:bg-slate-900/70 rounded-2xl p-4 sm:p-5 shadow-md">
          <div className="input-box mb-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your note here..."
              className="w-full min-h-[100px] rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent p-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />
            <button
              onClick={addNote}
              className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Save Note
            </button>
          </div>

          <div className="notes-list space-y-3">
            {notes.length === 0 ? (
              <p className="empty text-center text-slate-500 dark:text-slate-400">
                No notes yet...
              </p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="note-card flex items-start justify-between gap-3 bg-white dark:bg-slate-900 rounded-xl px-3 py-2 shadow-sm"
                >
                  <p className="text-sm sm:text-base whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <button
                    className="delete-btn text-xs sm:text-sm bg-red-500 hover:bg-red-400 text-white rounded-full px-3 py-1 self-start transition-colors duration-150"
                    onClick={() => deleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="container mt-2 pb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3">
          Popular Movies (OMDB)
        </h2>

        <div className="bg-white/80 dark:bg-slate-900/70 rounded-2xl p-4 sm:p-5 shadow-md">
          <SearchBar onSearch={(q) => setSearchQuery(q)} />

          {searching && <div className="center mt-2">Searching...</div>}
          {loading && !searching && (
            <div className="center mt-2">Loading...</div>
          )}
          {error && (
            <div className="center error mt-2 text-red-500">{error}</div>
          )}

          {noResults && !searching && (
            <div className="center empty mt-2 text-slate-500 dark:text-slate-400">
              No Results Found for "{searchQuery}"
            </div>
          )}

          <div className="movies-grid grid gap-4 sm:gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 mt-4">
            {moviesToShow.map((movie) => (
              <MovieCard
                key={movie.id || movie.imdbID || movie.title}
                movie={movie}
              />
            ))}
          </div>

          <div className="center mt-4">
            {searchQuery && searchQuery.trim() ? (
              searchHasMore && !searching && (
                <button
                  onClick={loadMoreSearch}
                  disabled={loadingMoreSearch}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  {loadingMoreSearch ? "Loading..." : "Load More Results"}
                </button>
              )
            ) : (
              popularHasMore && !loading && (
                <button
                  onClick={loadMorePopular}
                  disabled={loadingMorePopular}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  {loadingMorePopular ? "Loading..." : "Load More Movies"}
                </button>
              )
            )}
          </div>

          {!searching && moviesToShow.length === 0 && !loading && (
            <div className="center empty mt-3 text-slate-500 dark:text-slate-400">
              No movies to show.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
