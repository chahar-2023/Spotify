import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAllSongs, getAllAlbums } from "../apis/musicAPIs";

const MusicContext = createContext(null);
export const useMusic = () => useContext(MusicContext);

// Loads songs + albums once and shares them with every page
export function MusicProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    const [s, a] = await Promise.allSettled([getAllSongs(), getAllAlbums()]);
    if (s.status === "fulfilled") setSongs(s.value);
    if (a.status === "fulfilled") setAlbums(a.value);
    const failed = [s, a].find((r) => r.status === "rejected");
    if (failed) setError(failed.reason?.message || "Could not load music");
    setLoading(false);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return (
    <MusicContext.Provider value={{ songs, albums, loading, error, reload }}>
      {children}
    </MusicContext.Provider>
  );
}