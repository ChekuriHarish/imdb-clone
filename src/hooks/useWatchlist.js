import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

function getMovieId(movie) {
  return movie?.id || movie?.imdbID || null;
}

export default function useWatchlist(user) {
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const colRef = collection(db, "users", user.uid, "watchlist");
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Watchlist listener error:", err);
        setItems([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const isInWatchlist = (movie) => {
    const id = getMovieId(movie);
    if (!id) return false;
    return items.some((it) => it.id === id);
  };

  const addToWatchlist = async (movie) => {
    if (!user) {
      alert("Please login to use Watchlist 🙂");
      return;
    }
    const id = getMovieId(movie);
    if (!id) return;

    const ref = doc(db, "users", user.uid, "watchlist", id);
    await setDoc(ref, {
      title: movie.title,
      year: movie.year,
      poster: movie.poster,
      createdAt: serverTimestamp(),
    });
  };

  const removeFromWatchlist = async (movie) => {
    if (!user) return;
    const id = getMovieId(movie);
    if (!id) return;

    const ref = doc(db, "users", user.uid, "watchlist", id);
    await deleteDoc(ref);
  };

  const toggleWatchlist = async (movie) => {
    if (isInWatchlist(movie)) {
      await removeFromWatchlist(movie);
    } else {
      await addToWatchlist(movie);
    }
  };

  return {
    watchlist: items,
    watchlistLoading: loading,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
  };
}
