import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useMusic } from "../context/MusicContext";
import { useLibrary } from "../context/LibraryContext";
import { ownedBy } from "../utils/normalize";

const Stat = ({ label, value }) => (
  <div className="rounded-xl border border-[#1b2638] bg-[#0c1220] px-5 py-4">
    <p className="text-xs text-[#8e9bb0]">{label}</p>
    <p className="mt-1 text-2xl font-bold">{value}</p>
  </div>
);

// Same page for listeners and artists (artists also see song/album counts)
export default function Profile() {
  const { user, isArtist, logout } = useAuth();
  const { songs, albums } = useMusic();
  const { liked, recent } = useLibrary();
  const navigate = useNavigate();

  return (
    <>
      <h1 className="pt-2 text-2xl font-bold sm:text-[28px]">Profile</h1>

      <div className="mt-6 flex flex-col items-center gap-5 rounded-2xl border border-[#1b2638] bg-[#0c1220] p-6 text-center sm:flex-row sm:text-left">
        <span className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#42e68b] to-teal-600 text-4xl font-bold text-[#04120a]">
          {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : (user?.username?.[0] || "U").toUpperCase()}
        </span>
        <div className="min-w-0">
          <span className="rounded-full bg-[#12382f] px-3 py-1 text-xs font-medium text-[#42e6a0]">{isArtist ? "Artist" : "Listener"}</span>
          <h2 className="mt-2 truncate text-2xl font-bold">{user?.username}</h2>
          <p className="truncate text-sm text-[#8e9bb0]">{user?.email}</p>
        </div>
        <button
          type="button"
          onClick={async () => { await logout(); navigate("/login"); }}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-[#2a3750] px-4 text-sm font-medium text-[#c3ccdb] hover:border-red-400 hover:text-red-300 sm:ml-auto"
        >
          <FiLogOut /> Log out
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Liked songs" value={liked.length} />
        <Stat label="Recently played" value={recent.length} />
        {isArtist && <Stat label="Your songs" value={ownedBy(songs, user).length} />}
        {isArtist && <Stat label="Your albums" value={ownedBy(albums, user).length} />}
      </div>
    </>
  );
}