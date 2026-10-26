import { Link } from "react-router-dom";
import { FiMusic, FiPlay, FiUsers, FiPlus } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useMusic } from "../../context/MusicContext";
import { ownedBy, newestFirst } from "../../utils/normalize";
import { formatCount } from "../../utils/format";
import StatCard from "../../components/StatCard";
import SongTable from "../../components/SongTable";
import MediaCard from "../../components/MediaCard";
import { Loader, Empty, ErrorNote } from "../../components/Feedback";

const RECENT_LIMIT = 5; // how many songs to show before "View All"

export default function Dashboard() {
  const { user } = useAuth();
  const { songs, albums, loading, error, reload } = useMusic();

  const mySongs = newestFirst(ownedBy(songs, user));
  const myAlbums = newestFirst(ownedBy(albums, user));
  const totalPlays = mySongs.reduce((n, s) => n + (s.plays || 0), 0);

  return (
    <>
      <h1 className="text-2xl font-bold sm:text-[28px]">Artist Dashboard</h1>

      {error && <div className="mt-4"><ErrorNote>{error}</ErrorNote></div>}
      {loading ? <Loader /> : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Songs" value={mySongs.length} Icon={FiMusic} />
            <StatCard label="Total Plays" value={formatCount(totalPlays)} Icon={FiPlay} />
            <StatCard label="Followers" value={formatCount(user?.followers ?? 0)} Icon={FiUsers} tone="purple" />
          </div>

          {/* Recent uploads */}
          <div className="mb-3 mt-9 flex items-center justify-between">
            <h2 className="text-lg font-bold sm:text-xl">Recent Uploads</h2>
            <Link to="/artist/songs" className="text-sm font-medium text-[#42e6a0] hover:underline">View All</Link>
          </div>
          {mySongs.length ? (
            <SongTable songs={mySongs.slice(0, RECENT_LIMIT)} onDeleted={reload} />
          ) : (
            <Empty icon={FiMusic} title="No songs yet" text="Upload your first song to see it here.">
              <Link to="/artist/upload" className="inline-flex h-10 items-center rounded-full bg-[#42e68b] px-5 text-sm font-semibold text-[#04120a]">Upload Song</Link>
            </Empty>
          )}

          {/* All created playlists */}
          <div className="mb-4 mt-10 flex items-center justify-between">
            <h2 className="text-lg font-bold sm:text-xl">Your Playlists</h2>
            <Link to="/artist/create-playlist" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#42e6a0] hover:underline">
              <FiPlus /> Create Playlist
            </Link>
          </div>
          {myAlbums.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
              {myAlbums.map((a) => (
                <MediaCard key={a._id} to={`/artist/playlist/${a._id}`} title={a.title} subtitle={`${a.songIds.length} songs`} cover={a.cover} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8e9bb0]">You haven't created any playlists yet.</p>
          )}
        </>
      )}
    </>
  );
}