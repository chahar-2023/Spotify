import { useEffect, useRef, useState } from "react";
import { FiMoreVertical, FiPlay, FiTrash2 } from "react-icons/fi";
import { usePlayer } from "../context/PlayerContext";
import { deleteMusic } from "../apis/musicApis";
import { formatCount, formatDate } from "../utils/format";
import Cover from "./Cover";

// small "..." menu on every row
function RowMenu({ song, list, up, onDeleted }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const { playSong } = usePlayer();

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const remove = async () => {
    setOpen(false);
    if (!window.confirm(`Delete "${song.title}"? This cannot be undone.`)) return;
    try {
      await deleteMusic(song._id);
      onDeleted?.();
    } catch (err) {
      window.alert(err.message || "Could not delete the song.");
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`More options for ${song.title}`}
        aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="grid h-9 w-9 place-items-center rounded-full text-[#c3ccdb] hover:bg-white/10 hover:text-white"
      >
        <FiMoreVertical />
      </button>
      {open && (
        <div className={`absolute right-0 z-20 w-40 overflow-hidden rounded-lg border border-[#1f2a3f] bg-[#0f1624] py-1 text-sm shadow-xl shadow-black/50 ${up ? "bottom-full mb-1" : "top-full mt-1"}`}>
          <button type="button" onClick={() => { setOpen(false); playSong(song, list); }} className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-white/5">
            <FiPlay /> Play
          </button>
          <button type="button" onClick={remove} className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-300 hover:bg-white/5">
            <FiTrash2 /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

// Song | Plays | Date | menu   (used on the Dashboard and My Songs)
export default function SongTable({ songs, showAlbum = false, onDeleted }) {
  const { current, playing, playSong } = usePlayer();
  const cols = showAlbum
    ? "sm:grid-cols-[1fr_130px_80px_120px_36px]"
    : "sm:grid-cols-[1fr_80px_120px_36px]";

  return (
    <div>
      <div className={`hidden gap-3 border-b border-[#1b2638] px-3 pb-3 text-sm text-[#c3ccdb] sm:grid ${cols}`}>
        <span>Song</span>
        {showAlbum && <span>Album</span>}
        <span>Plays</span>
        <span>Date</span>
        <span />
      </div>

      {songs.map((s, i) => {
        const active = current?._id === s._id;
        return (
          <div
            key={s._id}
            role="button"
            tabIndex={0}
            onClick={() => playSong(s, songs)}
            onKeyDown={(e) => e.key === "Enter" && playSong(s, songs)}
            className={`grid cursor-pointer grid-cols-[1fr_36px] items-center gap-3 border-b border-[#1b2638] px-3 py-3 outline-none transition hover:bg-white/5 focus-visible:bg-white/5 ${cols} ${active ? "bg-white/5" : ""}`}
          >
            <div className="flex min-w-0 items-center gap-4">
              <Cover src={s.cover} title={s.title} className="h-12 w-12 shrink-0 rounded-md" />
              <div className="min-w-0">
                <p className={`truncate text-[15px] ${active && playing ? "text-[#42e6a0]" : ""}`}>{s.title}</p>
                {/* phones show plays + date under the title */}
                <p className="truncate text-xs text-[#8e9bb0] sm:hidden">
                  {formatCount(s.plays)} plays · {formatDate(s.createdAt)}
                </p>
              </div>
            </div>
            {showAlbum && <span className="hidden truncate text-sm text-[#c3ccdb] sm:block">{s.album || "-"}</span>}
            <span className="hidden text-sm text-[#c3ccdb] sm:block">{formatCount(s.plays)}</span>
            <span className="hidden text-sm text-[#c3ccdb] sm:block">{formatDate(s.createdAt)}</span>
            <RowMenu song={s} list={songs} up={songs.length > 3 && i >= songs.length - 2} onDeleted={onDeleted} />
          </div>
        );
      })}
    </div>
  );
}