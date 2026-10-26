import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useMusic } from "../../context/MusicContext";
import { createMusic, createAlbum } from "../../apis/musicAPis";
import { CoverDrop, AudioDrop } from "../../components/UploadFields";
import { ErrorNote } from "../../components/Feedback";

const GENRES = ["Pop", "Hip-Hop", "Rock", "Bollywood", "Classical", "Electronic", "Lo-fi", "Jazz", "R&B", "Indie", "Other"];

const inputClass =
  "h-12 w-full rounded-lg border border-[#1f2a3f] bg-[#0f1624] px-4 text-[15px] text-white outline-none transition placeholder:text-[#5d6b82] focus:border-[#42e68b] focus:ring-2 focus:ring-[#42e68b]/25";

const Label = ({ htmlFor, required, children }) => (
  <label htmlFor={htmlFor} className="mb-2 block text-[15px] font-medium">
    {children} {required && <span className="text-red-400">*</span>}
  </label>
);

export default function UploadSong() {
  const { user } = useAuth();
  const { reload } = useMusic();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState(user?.username || "");
  const [album, setAlbum] = useState("");
  const [genre, setGenre] = useState("");
  const [cover, setCover] = useState(null);
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // check file type + size as soon as a file is chosen
  const pickCover = (f) => {
    if (!f) return;
    if (!/\.(jpe?g|png)$/i.test(f.name)) return setError("Cover image must be a JPG or PNG file.");
    if (f.size > 5 * 1024 * 1024) return setError("Cover image must be smaller than 5MB.");
    setError(""); setCover(f);
  };
  const pickAudio = (f) => {
    if (!f) return;
    if (!/\.(mp3|wav)$/i.test(f.name)) return setError("Audio file must be MP3 or WAV.");
    if (f.size > 10 * 1024 * 1024) return setError("Audio file must be smaller than 10MB.");
    setError(""); setAudio(f);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!audio) return setError("Please choose an audio file.");
    setBusy(true);
    setError("");
    try {
      const res = await createMusic({ title: title.trim(), artistName: artistName.trim(), albumName: album.trim(), genre, audio, cover });

      // If an album name was typed, make a playlist that contains this song
      const newId = res?.music?._id || res?.song?._id || res?.data?._id || res?._id;
      if (album.trim() && newId) {
        await createAlbum({ title: album.trim(), musics: [newId] });
      }
      await reload();

      if (album.trim() && !newId) {
        setError("Song uploaded, but its id wasn't returned, so the playlist wasn't created. Use Create Playlist instead.");
        return;
      }
      navigate("/artist/songs");
    } catch (err) {
      setError(err.message || "Upload failed. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-[28px]">Upload a New Song</h1>
        <Link to="/artist/create-playlist" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#2a3750] px-4 text-sm font-medium text-[#c3ccdb] hover:border-[#42e6a0] hover:text-[#42e6a0]">
          <FiPlus /> Create Playlist
        </Link>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
        <div>
          <Label htmlFor="title" required>Song Title</Label>
          <input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter song title" className={inputClass} />
        </div>

        <div>
          <Label htmlFor="artist" required>Artist Name</Label>
          <input id="artist" required value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Enter artist name" className={inputClass} />
        </div>

        <div>
          <Label htmlFor="album">Album</Label>
          <input id="album" value={album} onChange={(e) => setAlbum(e.target.value)} placeholder="Enter album name" className={inputClass} />
        </div>

        <div>
          <Label htmlFor="genre">Genre</Label>
          <div className="relative">
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className={`${inputClass} appearance-none pr-10 ${genre ? "" : "text-[#5d6b82]"}`}
            >
              <option value="">Select genre</option>
              {GENRES.map((g) => <option key={g} value={g} className="bg-[#0f1624] text-white">{g}</option>)}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#c3ccdb]" />
          </div>
        </div>

        <CoverDrop file={cover} onPick={pickCover} />

        <div>
          <p className="mb-2 text-[15px] font-medium">Audio File <span className="text-red-400">*</span></p>
          <AudioDrop file={audio} onPick={pickAudio} />
        </div>

        <div className="space-y-3 self-end">
          {error && <ErrorNote>{error}</ErrorNote>}
          <button disabled={busy} className="h-12 w-full rounded-lg bg-gradient-to-b from-[#55ec95] to-[#3cdc84] font-semibold text-[#04120a] shadow-lg shadow-[#42e68b]/20 hover:brightness-105 disabled:cursor-wait disabled:opacity-70">
            {busy ? "Uploading..." : "Upload Song"}
          </button>
        </div>
      </form>
    </>
  );
}