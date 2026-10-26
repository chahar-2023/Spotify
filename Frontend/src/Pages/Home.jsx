import { useAuth } from "../context/AuthContext";
import { useMusic } from "../context/MusicContext";
import { useLibrary } from "../context/LibraryContext";
import { usePlayer } from "../context/PlayerContext";
import { greeting } from "../utils/format";
import MediaCard from "../components/MediaCard";
import { Loader, ErrorNote } from "../components/Feedback";

const Section = ({ title, children }) => (
  <section className="mt-8">
    <h2 className="mb-4 text-lg font-bold sm:text-xl">{title}</h2>
    {children}
  </section>
);

export default function Home() {
  const { user } = useAuth();
  const { songs, albums, loading, error } = useMusic();
  const { recent } = useLibrary();
  const { playSong } = usePlayer();

  // first row: playlists/albums (falls back to songs if there are no albums yet)
  const featured = albums.length ? albums.slice(0, 4) : songs.slice(0, 4);
  const madeForYou = (songs.length > 4 ? songs.slice(4, 7) : songs.slice(0, 3));

  return (
    <>
      <h1 className="pt-2 text-2xl font-bold sm:text-[28px]">{greeting()}, {user?.username || "User"}!</h1>
      <p className="mt-1 text-sm text-[#8e9bb0]">Here's what's new for you</p>

      {error && <div className="mt-4"><ErrorNote>{error}</ErrorNote></div>}
      {loading && <Loader />}

      {!loading && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
            {albums.length
              ? featured.map((a) => <MediaCard key={a._id} to={`/playlist/${a._id}`} title={a.title} subtitle={`Playlist · ${a.artist}`} cover={a.cover} />)
              : featured.map((s) => <MediaCard key={s._id} title={s.title} subtitle={s.artist} cover={s.cover} onClick={() => playSong(s, songs)} />)}
          </div>

          <Section title="Recently Played">
            {recent.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]">
                {recent.slice(0, 4).map((s) => (
                  <MediaCard key={s._id} title={s.title} subtitle={s.artist} cover={s.cover} onClick={() => playSong(s, recent)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#8e9bb0]">Songs you play will show up here.</p>
            )}
          </Section>

          <Section title="Made For You">
            {madeForYou.length ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                {madeForYou.map((s) => (
                  <MediaCard key={s._id} wide title={s.title} subtitle={s.artist} cover={s.cover} onClick={() => playSong(s, songs)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#8e9bb0]">No songs yet. Check back soon.</p>
            )}
          </Section>
        </>
      )}
    </>
  );
}