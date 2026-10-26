import { useParams } from "react-router-dom";
import { FiMusic } from "react-icons/fi";
import { useMusic } from "../context/MusicContext";
import { usePlayer } from "../context/PlayerContext";
import CollectionHeader from "../components/CollectionHeader";
import Cover from "../components/Cover";
import SongRow from "../components/SongRow";
import { Loader, Empty } from "../components/Feedback";

// Opens when you click a playlist / album card
export default function PlaylistDetails() {
  const { id } = useParams();
  const { albums, songs, loading } = useMusic();
  const { playSong } = usePlayer();

  const album = albums.find((a) => String(a._id) === id);
  if (loading && !album) return <Loader />;
  if (!album) return <div className="pt-6"><Empty icon={FiMusic} title="Playlist not found" text="It may have been removed." /></div>;

  // albums can hold full song objects or just ids
  const list = album.songs.length
    ? album.songs
    : album.songIds.map((sid) => songs.find((s) => s._id === sid)).filter(Boolean);

  return (
    <>
      <CollectionHeader
        kind="Playlist"
        title={album.title}
        meta={`${album.artist} · ${list.length} songs`}
        onPlay={list.length ? () => playSong(list[0], list) : null}
        cover={<Cover src={album.cover} title={album.title} showTitle className="h-full w-full" />}
      />
      <div className="mt-6">
        {list.length
          ? list.map((s, i) => <SongRow key={s._id} song={s} list={list} index={i} />)
          : <p className="text-sm text-[#8e9bb0]">This playlist is empty.</p>}
      </div>
    </>
  );
}