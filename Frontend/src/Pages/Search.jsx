import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { searchWorld } from "../apis/itunesApi";
import { useMusic } from "../context/MusicContext";
import SongRow from "../components/SongRow";
import { Loader, Empty, ErrorNote } from "../components/Feedback";

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const { songs } = useMusic();
  const [world, setWorld] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error

  // search any song in the world (public iTunes Search API)
  useEffect(() => {
    if (!q) { setWorld([]); setStatus("idle"); return; }
    let cancelled = false;
    setStatus("loading");
    searchWorld(q)
      .then((r) => { if (!cancelled) { setWorld(r); setStatus("done"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, [q]);

  const mine = q ? songs.filter((s) => `${s.title} ${s.artist}`.toLowerCase().includes(q.toLowerCase())) : [];

  if (!q) {
    return (
      <div className="pt-6">
        <Empty icon={FiSearch} title="Search for any song" text="Type a song or artist name in the search bar above." />
      </div>
    );
  }

  return (
    <>
      <h1 className="pt-2 text-2xl font-bold sm:text-[28px]">Results for "{q}"</h1>

      {mine.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-bold">On this app</h2>
          {mine.map((s, i) => <SongRow key={s._id} song={s} list={mine} index={i} />)}
        </section>
      )}

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-bold">Songs from around the world</h2>
        {status === "loading" && <Loader />}
        {status === "error" && <ErrorNote>Couldn't search right now. Check your connection and try again.</ErrorNote>}
        {status === "done" && !world.length && <p className="text-sm text-[#8e9bb0]">No songs found. Try a different spelling.</p>}
        {world.map((s, i) => <SongRow key={s._id} song={s} list={world} index={i} />)}
        {status === "done" && world.length > 0 && (
          <p className="mt-3 text-xs text-[#8e9bb0]">World results play 30-second previews.</p>
        )}
      </section>
    </>
  );
}