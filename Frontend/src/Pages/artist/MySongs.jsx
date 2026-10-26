import { Link } from "react-router-dom";
import { FiMusic, FiPlus } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useMusic } from "../../context/MusicContext";
import { ownedBy, newestFirst } from "../../utils/normalize";
import SongTable from "../../components/SongTable";
import { Loader, Empty, ErrorNote } from "../../components/Feedback";

// Every song this artist uploaded
export default function MySongs() {
  const { user } = useAuth();
  const { songs, loading, error, reload } = useMusic();
  const mine = newestFirst(ownedBy(songs, user));

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold sm:text-[28px]">My Songs</h1>
          <p className="mt-1 text-sm text-[#8e9bb0]">{mine.length} {mine.length === 1 ? "song" : "songs"} uploaded</p>
        </div>
        <Link to="/artist/upload" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#42e68b] px-4 text-sm font-semibold text-[#04120a] hover:brightness-110">
          <FiPlus /> Upload
        </Link>
      </div>

      <div className="mt-6">
        {error && <ErrorNote>{error}</ErrorNote>}
        {loading ? <Loader /> : mine.length ? (
          <SongTable songs={mine} showAlbum onDeleted={reload} />
        ) : (
          <Empty icon={FiMusic} title="No songs yet" text="Songs you upload will appear here." />
        )}
      </div>
    </>
  );
}