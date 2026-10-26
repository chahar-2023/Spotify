import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLibrary } from "./LibraryContext";

const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const { addRecent } = useLibrary();
  const audioRef = useRef(null);
  if (!audioRef.current) audioRef.current = new Audio();
  const audio = audioRef.current;

  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const current = queue[index] || null;

  // always-fresh copy of state for the audio event handlers
  const live = useRef({});
  live.current = { queue, index, shuffle, repeat };

  const next = useCallback(() => {
    const { queue, index, shuffle } = live.current;
    if (!queue.length) return;
    if (queue.length === 1) { audio.currentTime = 0; audio.play(); return; }
    setIndex(
      shuffle
        ? (index + 1 + Math.floor(Math.random() * (queue.length - 1))) % queue.length
        : (index + 1) % queue.length
    );
  }, [audio]);

  const prev = () => {
    const { queue, index } = live.current;
    if (!queue.length) return;
    if (audio.currentTime > 3 || queue.length === 1) { audio.currentTime = 0; return; }
    setIndex((index - 1 + queue.length) % queue.length);
  };

  // load + play whenever the current song changes
  useEffect(() => {
    if (!current?.url) return;
    audio.src = current.url;
    audio.play().catch(() => {});
  }, [current?._id]); // eslint-disable-line

  useEffect(() => { audio.volume = volume; }, [audio, volume]);

  useEffect(() => {
    const on = {
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      timeupdate: () => setProgress(audio.currentTime),
      loadedmetadata: () => setDuration(audio.duration),
      ended: () => {
        if (live.current.repeat) { audio.currentTime = 0; audio.play(); } else next();
      },
    };
    Object.entries(on).forEach(([e, f]) => audio.addEventListener(e, f));
    return () => Object.entries(on).forEach(([e, f]) => audio.removeEventListener(e, f));
  }, [audio, next]);

  const toggle = () => {
    if (!current) return;
    if (audio.paused) audio.play(); else audio.pause();
  };

  const playSong = (song, list = [song]) => {
    if (current?._id === song._id) return toggle();
    const i = list.findIndex((s) => s._id === song._id);
    setQueue(list);
    setIndex(i < 0 ? 0 : i);
    addRecent(song);
  };

  const seek = (t) => { audio.currentTime = t; setProgress(t); };

  return (
    <PlayerContext.Provider
      value={{
        current, playing, progress, duration, volume, shuffle, repeat,
        playSong, toggle, next, prev, seek, setVolume,
        toggleShuffle: () => setShuffle((s) => !s),
        toggleRepeat: () => setRepeat((r) => !r),
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}