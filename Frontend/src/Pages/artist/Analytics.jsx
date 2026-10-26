import { FiBarChart2 } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useMusic } from "../../context/MusicContext";
import { ownedBy } from "../../utils/normalize";
import { formatCount } from "../../utils/format";
import { Loader, Empty } from "../../components/Feedback";

// Plays per song. Needs a `plays` number on each song from your backend.
export default function Analytics() {
  const { user } = useAuth();
  const { songs, loading } = useMusic();
  if (loading) return <Loader />;

  const mine = ownedBy(songs, user).sort((a, b) => b.plays - a.plays);
  const total = mine.reduce((n, s) => n + s.plays, 0);
  const max = Math.max(1, ...mine.map((s) => s.plays));

  return (
    <>
      <h1 className="text-2xl font-bold sm:text-[28px]">Analytics</h1>

      {!mine.length ? (
        <div className="mt-6"><Empty icon={FiBarChart2} title="Nothing to show yet" text="Upload songs to see how they perform." /></div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Total plays", formatCount(total)],
              ["Average per song", formatCount(Math.round(total / mine.length))],
              ["Top song", mine[0].title],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-[#1b2638] bg-[#0c1220] px-5 py-4">
                <p className="text-[13px] text-[#c3ccdb]">{label}</p>
                <p className="mt-1 truncate text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>

          <h2 className="mb-3 mt-8 text-lg font-bold">Plays by song</h2>
          <div className="space-y-3 rounded-xl border border-[#1b2638] bg-[#0c1220] p-5">
            {mine.map((s) => (
              <div key={s._id} className="grid grid-cols-[minmax(0,110px)_1fr_44px] items-center gap-3 text-sm sm:grid-cols-[minmax(0,180px)_1fr_52px]">
                <span className="truncate">{s.title}</span>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#070a11]">
                  <div className="h-full rounded-full bg-[#42e6a0]" style={{ width: `${(s.plays / max) * 100}%` }} />
                </div>
                <span className="text-right text-[#c3ccdb]">{formatCount(s.plays)}</span>
              </div>
            ))}
          </div>
          {total === 0 && <p className="mt-3 text-xs text-[#8e9bb0]">All counts are 0. Play counts appear once your backend saves a `plays` number on each song.</p>}
        </>
      )}
    </>
  );
}