import { Link } from "react-router-dom";
import { FiMusic, FiPlus } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useMusic } from "../context/MusicContext";
import { ownedBy } from "../utils/normalize";
import MediaCard from "../components/MediaCard";
import SongRow from "../components/SongRow";
import { Loader, Empty } from "../components/Feedback";

// Artist: my albums + my songs.   Listener: all songs.
export default function Playlists() {
  const { user, isArtist } = useAuth();
  const { songs, albums, loading } = useMusic();

  if (loading) return <Loader />;

  if (!isArtist) {
    return (
      <>
        <h1 className="pt-2 text-2xl font-bold sm:text-[28px]">All Songs</h1>
        <p className="mt-1 text-sm text-[#8e9bb0]">{songs.length} songs available</p>
        <div className="mt-5">
          {songs.length ? songs.map((s, i) => <SongRow key={s._id} song={s} list={songs} index={i} />)
            : <Empty icon={FiMusic} title="No songs yet" text="Songs uploaded by artists will appear here." />}
        </div>
      </>
    );
  }

  const myAlbums = ownedBy(albums, user);
  const mySongs = ownedBy(songs, user);

  return (
    <>
      <div className="flex items-center justify-between gap-3 pt-2">
        <h1 className="text-2xl font-bold sm:text-[28px]">Your Playlists</h1>
        <Link to="/create-playlist" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#42e68b] px-4 text-sm font-semibold text-[#04120a] hover:brightness-110">
          <FiPlus /> Create
        </Link>
      </div>

      <h2 className="mb-4 mt-6 text-lg font-bold">Albums you created</h2>
      {myAlbums.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
          {myAlbums.map((a) => <MediaCard key={a._id} to={`/playlist/${a._id}`} title={a.title} subtitle={`${a.songIds.length} songs`} cover={a.cover} />)}
        </div>
      ) : (
        <Empty icon={FiMusic} title="No albums yet" text="Create your first playlist from your songs." />
      )}

      <h2 className="mb-2 mt-8 text-lg font-bold">Songs you created</h2>
      {mySongs.length ? mySongs.map((s, i) => <SongRow key={s._id} song={s} list={mySongs} index={i} />)
        : <p className="text-sm text-[#8e9bb0]">You haven't uploaded any songs yet.</p>}
    </>
  );
}   