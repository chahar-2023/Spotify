import { FiPlay } from "react-icons/fi";

// Big header used by Liked Songs and the playlist detail page
export default function CollectionHeader({ cover, kind, title, meta, onPlay }) {
  return (
    <div className="flex flex-col gap-5 pt-4 sm:flex-row sm:items-end">
      <div className="h-40 w-40 shrink-0 overflow-hidden rounded-xl shadow-2xl shadow-black/50 sm:h-48 sm:w-48">{cover}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wider text-[#8e9bb0]">{kind}</p>
        <h1 className="mt-1 truncate text-3xl font-bold sm:text-5xl">{title}</h1>
        <p className="mt-2 text-sm text-[#8e9bb0]">{meta}</p>
        {onPlay && (
          <button
            type="button"
            onClick={onPlay}
            className="mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-[#42e68b] px-6 font-semibold text-[#04120a] transition hover:brightness-110"
          >
            <FiPlay /> Play
          </button>
        )}
      </div>
    </div>
  );
}