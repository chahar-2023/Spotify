import { Link } from "react-router-dom";
import { FiPlay } from "react-icons/fi";
import Cover from "./Cover";

// Square (or wide) card: cover, title, subtitle. Pass `to` for a link, or `onClick` to play.
export default function MediaCard({ title, subtitle, cover, to, onClick, wide = false }) {
  const Tag = to ? Link : "button";
  const props = to ? { to } : { type: "button", onClick };

  return (
    <Tag {...props} className="group block w-full min-w-0 text-left">
      <div className={`relative overflow-hidden rounded-xl bg-[#0f1624] ${wide ? "aspect-[16/9]" : "aspect-square"}`}>
        <Cover src={cover} title={title} showTitle className="h-full w-full transition duration-300 group-hover:scale-105" />
        <span className="absolute bottom-2 right-2 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-[#42e68b] text-[#04120a] opacity-0 shadow-lg transition group-hover:translate-y-0 group-hover:opacity-100">
          <FiPlay />
        </span>
      </div>
      <p className="mt-2 truncate text-sm font-medium">{title}</p>
      {subtitle && <p className="truncate text-xs text-[#8e9bb0]">{subtitle}</p>}
    </Tag>
  );
}