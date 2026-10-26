import { FiPlay, FiPause, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";
import { formatTime } from "../utils/format";
import Cover from "./Cover";

// One song in a list. Click anywhere on the row to play it.
export default function SongRow({ song, list, index }) {
  const { current, playing, playSong } = usePlayer();
  const { isLiked, toggleLike } = useLibrary();
  const active = current?._id === song._id;
  const liked = isLiked(song._id);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => playSong(song, list)}
      onKeyDown={(e) => e.key === "Enter" && playSong(song, list)}
      className={`group grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-lg px-2 py-2 outline-none transition hover:bg-white/5 focus-visible:bg-white/5 md:grid-cols-[28px_1fr_1fr_auto] ${active ? "bg-white/5" : ""}`}
    >
      <span className="grid place-items-center text-sm text-[#8e9bb0]">
        {active && playing ? (
          <FiPause className="text-[#42e6a0]" />
        ) : (
          <>
            <span className="group-hover:hidden">{index + 1}</span>
            <FiPlay className="hidden group-hover:block" />
          </>
        )}
      </span>

      <div className="flex min-w-0 items-center gap-3">
        <Cover src={song.cover} title={song.title} className="h-11 w-11 shrink-0 rounded-md" />
        <div className="min-w-0">
          <p className={`truncate text-sm font-medium ${active ? "text-[#42e6a0]" : ""}`}>{song.title}</p>
          <p className="truncate text-xs text-[#8e9bb0]">{song.artist}</p>
        </div>
      </div>

      <p className="hidden truncate text-sm text-[#8e9bb0] md:block">{song.album}</p>

      <div className="flex items-center gap-3 text-[#8e9bb0]">
        <button
          type="button"
          aria-label={liked ? "Remove from Liked Songs" : "Add to Liked Songs"}
          onClick={(e) => { e.stopPropagation(); toggleLike(song); }}
          className={liked ? "text-[#42e6a0]" : "hover:text-white"}
        >
          {liked ? <FaHeart /> : <FiHeart />}
        </button>
        <span className="w-9 text-right text-xs">{song.duration ? formatTime(song.duration) : ""}</span>
      </div>
    </div>
  );
}