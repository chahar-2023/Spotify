import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useMusic } from "../context/MusicContext";
import { createAlbum } from "../apis/musicAPis";
import { ownedBy } from "../utils/normalize";
import Cover from "../components/Cover";
import { Empty, ErrorNote } from "../components/Feedback";

// Uses your createAlbum API. Only artists can create.
export default function CreatePlaylist() {
  const { user, isArtist } = useAuth();
  const { songs, reload } = useMusic();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!isArtist) {
    return (
      <div className="pt-6">
        <Empty icon={FiLock} title="Only artists can create playlists" text="Switch to an artist account to build albums from your songs." />
      </div>
    );
  }

  const mine = ownedBy(songs, user);
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const submit = async (e) => {
    e.preventDefault();
    if (!picked.length) return setError("Pick at least one song.");
    setBusy(true);
    setError("");
    try {
      await createAlbum({ title: title.trim(), musics: picked });
      await reload();
      navigate("/playlists");
    } catch (err) {
      setError(err.message || "Could not create the playlist.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="pt-2 text-2xl font-bold sm:text-[28px]">Create Playlist</h1>
      <form onSubmit={submit} className="mt-5 max-w-xl space-y-5">
        <div>
          <label htmlFor="title" className="mb-2 block text-[13px] font-medium text-[#c3ccdb]">Playlist name</label>
          <input
            id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My new playlist"
            className="h-12 w-full rounded-lg border border-[#1f2a3f] bg-[#0c1220] px-4 text-[15px] outline-none placeholder:text-[#5d6b82] focus:border-[#42e68b] focus:ring-2 focus:ring-[#42e68b]/25"
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-[#c3ccdb]">Add songs ({picked.length} selected)</legend>
          {mine.length ? (
            <div className="max-h-80 overflow-y-auto rounded-lg border border-[#1f2a3f] p-1">
              {mine.map((s) => (
                <label key={s._id} className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-white/5">
                  <input type="checkbox" checked={picked.includes(s._id)} onChange={() => toggle(s._id)} className="h-4 w-4 accent-[#42e6a0]" />
                  <Cover src={s.cover} title={s.title} className="h-9 w-9 rounded" />
                  <span className="truncate text-sm">{s.title}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8e9bb0]">You have no songs yet. Upload a song first.</p>
          )}
        </fieldset>

        {error && <ErrorNote>{error}</ErrorNote>}

        <button disabled={busy} className="h-12 w-full rounded-lg bg-gradient-to-b from-[#55ec95] to-[#3cdc84] font-semibold text-[#04120a] hover:brightness-105 disabled:cursor-wait disabled:opacity-70">
          {busy ? "Creating..." : "Create Playlist"}
        </button>
      </form>
    </>
  );
}