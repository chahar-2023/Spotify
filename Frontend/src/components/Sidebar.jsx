import { NavLink } from "react-router-dom";
import { FaSpotify, FaHeart } from "react-icons/fa";
import { FiHome, FiSearch, FiMusic, FiPlus, FiX, FiGrid } from "react-icons/fi";
import { BiLibrary } from "react-icons/bi";
import { useMusic } from "../context/MusicContext";
import { useAuth } from "../context/AuthContext";
import { ownedBy } from "../utils/normalize";
import Cover from "./Cover";

const MAIN = [
  { to: "/", label: "Home", Icon: FiHome, end: true },
  { to: "/search", label: "Search", Icon: FiSearch },
  { to: "/library", label: "Your Library", Icon: BiLibrary },
  { to: "/playlists", label: "Playlists", Icon: FiMusic },
];

const linkClass = ({ isActive }) =>
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition " +
  (isActive
    ? "bg-[#12382f] text-[#42e6a0]"
    : "text-[#c3ccdb] hover:bg-white/5 hover:text-white");

export default function Sidebar({ open, onClose }) {
  const { albums } = useMusic();
  const { user, isArtist } = useAuth();
  const myAlbums = (isArtist ? ownedBy(albums, user) : albums).slice(0, 8);

  return (
    <>
      {/* dark backdrop behind the drawer on phones/tablets */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col gap-1 overflow-y-auto border-r border-[#1b2638] bg-[#070a11] p-4 transition-transform lg:static lg:w-56 lg:translate-x-0 xl:w-60 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-4 flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2.5 text-lg font-bold">
            <FaSpotify className="h-8 w-8 text-[#42e68b]" /> Spotify
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="text-[#8e9bb0] hover:text-white lg:hidden"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {MAIN.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={linkClass}
            >
              <Icon className="h-5 w-5" /> {label}
            </NavLink>
          ))}
          {/* only artists see this link */}
          {isArtist && (
            <NavLink to="/artist" onClick={onClose} className={linkClass}>
              <FiGrid className="h-5 w-5" /> Artist Dashboard
            </NavLink>
          )}
          
        </nav>

        <nav className="mt-6 flex flex-col gap-1">
          <NavLink
            to="/create-playlist"
            onClick={onClose}
            className={linkClass}
          >
            <FiPlus className="h-5 w-5" /> Create Playlist
          </NavLink>
          <NavLink to="/liked-songs" onClick={onClose} className={linkClass}>
            <span className="grid h-5 w-5 place-items-center rounded bg-gradient-to-br from-indigo-500 to-purple-600 text-[10px] text-white">
              <FaHeart />
            </span>
            Liked Songs
          </NavLink>

          {myAlbums.map((a) => (
            <NavLink
              key={a._id}
              to={`/playlist/${a._id}`}
              onClick={onClose}
              className={linkClass}
            >
              <Cover
                src={a.cover}
                title={a.title}
                className="h-5 w-5 shrink-0 rounded"
              />
              <span className="truncate">{a.title}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
