import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FiMenu, FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onMenu }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const timer = useRef();

  // keep the box in sync when you arrive on /search?q=...
  useEffect(() => {
    if (pathname === "/search") setQ(params.get("q") || "");
  }, [pathname]); // eslint-disable-line

  const go = (value) => {
    const v = value.trim();
    navigate(v ? `/search?q=${encodeURIComponent(v)}` : "/search", { replace: pathname === "/search" });
  };

  const onChange = (e) => {
    setQ(e.target.value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => go(e.target.value), 400); // search while typing
  };

  return (
    <header className="flex items-center gap-3 px-4 py-4 sm:px-6">
      <button type="button" aria-label="Open menu" onClick={onMenu} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-[#c3ccdb] hover:bg-white/5 lg:hidden">
        <FiMenu className="h-5 w-5" />
      </button>

      <form
        onSubmit={(e) => { e.preventDefault(); clearTimeout(timer.current); go(q); }}
        className="relative max-w-xl flex-1"
      >
        <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8e9bb0]" />
        <input
          value={q}
          onChange={onChange}
          type="search"
          aria-label="Search"
          placeholder="Search songs, artists, albums..."
          className="h-11 w-full rounded-lg border border-[#1b2638] bg-[#0f1624] pl-10 pr-4 text-sm text-white outline-none placeholder:text-[#7c8aa1] focus:border-[#42e6a0]"
        />
      </form>

      <Link to="/profile" aria-label="Your profile" className="ml-auto grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#42e68b] to-teal-600 text-sm font-bold text-[#04120a] ring-2 ring-transparent transition hover:ring-[#42e6a0]">
        {user?.avatar ? <img src={user.avatar} alt="" className="h-full w-full object-cover" /> : (user?.username?.[0] || "U").toUpperCase()}
      </Link>
    </header>
  );
}