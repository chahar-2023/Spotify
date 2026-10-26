import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { useLibrary } from "../context/LibraryContext";
import { usePlayer } from "../context/PlayerContext";
import CollectionHeader from "../components/CollectionHeader";
import SongRow from "../components/SongRow";
import { Empty } from "../components/Feedback";

export default function LikedSongs() {
  const { liked } = useLibrary();
  const { playSong } = usePlayer();

  return (
    <>
      <CollectionHeader
        kind="Playlist"
        title="Liked Songs"
        meta={`${liked.length} ${liked.length === 1 ? "song" : "songs"}`}
        onPlay={liked.length ? () => playSong(liked[0], liked) : null}
        cover={<div className="grid h-full w-full place-items-center bg-gradient-to-br from-indigo-500 to-purple-700"><FaHeart className="h-16 w-16 text-white" /></div>}
      />
      <div className="mt-6">
        {liked.length ? (
          liked.map((s, i) => <SongRow key={s._id} song={s} list={liked} index={i} />)
        ) : (
          <Empty icon={FiHeart} title="No liked songs yet" text="Tap the heart on any song to save it here." />
        )}
      </div>
    </>
  );
}