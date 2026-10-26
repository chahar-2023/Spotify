import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useMusic } from "../../context/MusicContext";
import { createAlbum } from "../../apis/musicApis";
import { ownedBy } from "../../utils/normalize";
import Cover from "../../components/Cover";
import { Loader, ErrorNote } from "../../components/Feedback";

// Artist builds a playlist (album) from songs they already uploaded
export default function CreatePlaylist() {
  const { user } = useAuth();
  const { songs, loading, reload } = useMusic();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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
      navigate("/artist");
    } catch (err) {
      setError(err.message || "Could not create the playlist.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-[28px]">Create a Playlist</h1>
        <Link to="/artist/upload" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#2a3750] px-4 text-sm font-medium text-[#c3ccdb] hover:border-[#42e6a0] hover:text-[#42e6a0]">
          <FiUpload /> Upload Song
        </Link>
      </div>

      <form onSubmit={submit} className="mt-6 max-w-2xl space-y-5">
        <div>
          <label htmlFor="pl-title" className="mb-2 block text-[15px] font-medium">Playlist name <span className="text-red-400">*</span></label>
          <input
            id="pl-title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter playlist name"
            className="h-12 w-full rounded-lg border border-[#1f2a3f] bg-[#0f1624] px-4 text-[15px] outline-none placeholder:text-[#5d6b82] focus:border-[#42e68b] focus:ring-2 focus:ring-[#42e68b]/25"
          />
        </div>

        <fieldset>
          <legend className="mb-2 text-[15px] font-medium">Choose songs ({picked.length} selected)</legend>
          {loading ? <Loader /> : mine.length ? (
            <div className="max-h-96 overflow-y-auto rounded-xl border border-[#1f2a3f] bg-[#0a0f1a] p-1">
              {mine.map((s) => (
                <label key={s._id} className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-white/5">
                  <input type="checkbox" checked={picked.includes(s._id)} onChange={() => toggle(s._id)} className="h-4 w-4 accent-[#42e6a0]" />
                  <Cover src={s.cover} title={s.title} className="h-10 w-10 rounded-md" />
                  <span className="truncate text-sm">{s.title}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-[#1f2a3f] p-5 text-sm text-[#8e9bb0]">
              You have no songs yet. <Link to="/artist/upload" className="text-[#42e6a0] hover:underline">Upload a song</Link> first.
            </p>
          )}
        </fieldset>

        {error && <ErrorNote>{error}</ErrorNote>}

        <button disabled={busy} className="h-12 w-full rounded-lg bg-gradient-to-b from-[#55ec95] to-[#3cdc84] font-semibold text-[#04120a] hover:brightness-105 disabled:cursor-wait disabled:opacity-70 sm:w-64">
          {busy ? "Creating..." : "Create Playlist"}
        </button>
      </form>
    </>
  );
}