import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const LibraryContext = createContext(null);
export const useLibrary = () => useContext(LibraryContext);

const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
};

// Liked songs + recently played, saved in the browser per user
export function LibraryProvider({ children }) {
  const { user } = useAuth();
  const uid = user?.id || "guest";
  const [liked, setLiked] = useState(() => read(`liked:${uid}`));
  const [recent, setRecent] = useState(() => read(`recent:${uid}`));

  useEffect(() => localStorage.setItem(`liked:${uid}`, JSON.stringify(liked)), [liked, uid]);
  useEffect(() => localStorage.setItem(`recent:${uid}`, JSON.stringify(recent)), [recent, uid]);

  const isLiked = (id) => liked.some((s) => s._id === id);
  const toggleLike = (song) =>
    setLiked((l) => (l.some((s) => s._id === song._id) ? l.filter((s) => s._id !== song._id) : [song, ...l]));
  const addRecent = (song) =>
    setRecent((r) => [song, ...r.filter((s) => s._id !== song._id)].slice(0, 50));
  const clearRecent = () => setRecent([]);

  return (
    <LibraryContext.Provider value={{ liked, recent, isLiked, toggleLike, addRecent, clearRecent }}>
      {children}
    </LibraryContext.Provider>
  );
}