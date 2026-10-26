import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiShuffle, FiRepeat, FiVolume2, FiVolumeX, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { usePlayer } from "../context/PlayerContext";
import { useLibrary } from "../context/LibraryContext";
import { formatTime } from "../utils/format";
import Cover from "./Cover";

export default function MusicPlayer() {
  const p = usePlayer();
  const { isLiked, toggleLike } = useLibrary();
  const { current } = p;
  const liked = current && isLiked(current._id);
  const pct = p.duration ? (p.progress / p.duration) * 100 : 0;

  return (
    <footer className="relative border-t border-[#1b2638] bg-[#080c14] px-3 sm:px-5">
      {/* thin progress line on phones */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-white/10 sm:hidden">
        <div className="h-full bg-[#42e6a0]" style={{ width: `${pct}%` }} />
      </div>

      <div className="grid h-20 grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[1fr_minmax(0,1.6fr)_1fr]">
        {/* left: song info */}
        <div className="flex min-w-0 items-center gap-3">
          {current ? (
            <>
              <Cover src={current.cover} title={current.title} className="h-12 w-12 shrink-0 rounded-md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{current.title}</p>
                <p className="truncate text-xs text-[#8e9bb0]">{current.artist}</p>
              </div>
              <button type="button" aria-label="Like" onClick={() => toggleLike(current)} className={`hidden sm:block ${liked ? "text-[#42e6a0]" : "text-[#8e9bb0] hover:text-white"}`}>
                {liked ? <FaHeart /> : <FiHeart />}
              </button>
            </>
          ) : (
            <p className="text-sm text-[#8e9bb0]">Pick a song to start listening</p>
          )}
        </div>

        {/* centre: controls + seek bar */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4 sm:gap-5">
            <button type="button" aria-label="Shuffle" onClick={p.toggleShuffle} className={`hidden sm:block ${p.shuffle ? "text-[#42e6a0]" : "text-[#c3ccdb] hover:text-white"}`}><FiShuffle /></button>
            <button type="button" aria-label="Previous" onClick={p.prev} className="text-[#c3ccdb] hover:text-white"><FiSkipBack className="h-5 w-5" /></button>
            <button type="button" aria-label={p.playing ? "Pause" : "Play"} onClick={p.toggle} className="grid h-10 w-10 place-items-center rounded-full bg-[#42e68b] text-[#04120a] transition hover:scale-105">
              {p.playing ? <FiPause className="h-5 w-5" /> : <FiPlay className="h-5 w-5" />}
            </button>
            <button type="button" aria-label="Next" onClick={p.next} className="text-[#c3ccdb] hover:text-white"><FiSkipForward className="h-5 w-5" /></button>
            <button type="button" aria-label="Repeat" onClick={p.toggleRepeat} className={`hidden sm:block ${p.repeat ? "text-[#42e6a0]" : "text-[#c3ccdb] hover:text-white"}`}><FiRepeat /></button>
          </div>
          <div className="hidden w-full max-w-xl items-center gap-3 sm:flex">
            <span className="w-9 text-right text-xs text-[#8e9bb0]">{formatTime(p.progress)}</span>
            <input type="range" aria-label="Seek" min="0" max={p.duration || 0} step="0.1" value={p.progress} onChange={(e) => p.seek(+e.target.value)} className="h-1 flex-1 accent-[#42e6a0]" />
            <span className="w-9 text-xs text-[#8e9bb0]">{formatTime(p.duration)}</span>
          </div>
        </div>

        {/* right: volume */}
        <div className="hidden items-center justify-end gap-2 text-[#c3ccdb] sm:flex">
          {p.volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
          <input type="range" aria-label="Volume" min="0" max="1" step="0.01" value={p.volume} onChange={(e) => p.setVolume(+e.target.value)} className="h-1 w-24 accent-[#42e6a0]" />
        </div>
      </div>
    </footer>
  );
}