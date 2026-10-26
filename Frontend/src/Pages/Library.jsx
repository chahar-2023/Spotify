import { FiClock } from "react-icons/fi";
import { useLibrary } from "../context/LibraryContext";
import SongRow from "../components/SongRow";
import { Empty } from "../components/Feedback";

// "Your Library" = everything you recently played
export default function Library() {
  const { recent, clearRecent } = useLibrary();

  return (
    <>
      <div className="flex items-end justify-between gap-3 pt-2">
        <div>
          <h1 className="text-2xl font-bold sm:text-[28px]">Your Library</h1>
          <p className="mt-1 text-sm text-[#8e9bb0]">Recently played songs</p>
        </div>
        {recent.length > 0 && (
          <button type="button" onClick={clearRecent} className="text-sm text-[#8e9bb0] hover:text-white">Clear history</button>
        )}
      </div>

      <div className="mt-5">
        {recent.length ? (
          recent.map((s, i) => <SongRow key={s._id} song={s} list={recent} index={i} />)
        ) : (
          <Empty icon={FiClock} title="Nothing played yet" text="Songs you listen to will appear here so you can jump back in." />
        )}
      </div>
    </>
  );
}