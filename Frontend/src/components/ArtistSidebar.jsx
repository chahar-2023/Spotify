import { NavLink, useLocation } from "react-router-dom";
import { FaSpotify } from "react-icons/fa";
import {
  FiGrid,
  FiMusic,
  FiPlusSquare,
  FiBarChart2,
  FiSettings,
  FiHeadphones,
  FiX,
} from "react-icons/fi";

const MAIN = [
  { to: "/artist", label: "Dashboard", Icon: FiGrid, end: true },
  { to: "/artist/songs", label: "My Songs", Icon: FiMusic },
  // "Upload Song" stays highlighted on the Create Playlist page too
  {
    to: "/artist/upload",
    label: "Upload Song",
    Icon: FiPlusSquare,
    also: ["/artist/create-playlist"],
  },
  { to: "/artist/analytics", label: "Analytics", Icon: FiBarChart2 },
];

const linkClass = (active) =>
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition " +
  (active
    ? "bg-gradient-to-r from-[#12402f] to-[#0e2a2a] text-[#42e6a0] shadow-[0_0_0_1px_rgba(66,230,160,0.15)]"
    : "text-[#c3ccdb] hover:bg-white/5 hover:text-white");

export default function ArtistSidebar({ open, onClose }) {
  const { pathname } = useLocation();

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

        <nav className="flex flex-col gap-1.5">
          {MAIN.map(({ to, label, Icon, end, also = [] }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                linkClass(isActive || also.some((p) => pathname.startsWith(p)))
              }
            >
              <Icon className="h-5 w-5" /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-1.5">
          {/* artists can open all the listener pages too */}
          <NavLink to="/" onClick={onClose} className={() => linkClass(false)}>
            <FiHeadphones className="h-5 w-5" /> Listener View
          </NavLink>

          {/* Settings opens the artist's profile page */}
          <NavLink
            to="/artist/profile"
            onClick={onClose}
            className={({ isActive }) => linkClass(isActive)}
          >
            <FiSettings className="h-5 w-5" /> Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
}
