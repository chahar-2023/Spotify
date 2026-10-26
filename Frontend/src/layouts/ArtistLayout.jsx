import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { FaSpotify } from "react-icons/fa";
import { MusicProvider } from "../context/MusicContext";
import ArtistSidebar from "../components/ArtistSidebar";
import MusicPlayer from "../components/MusicPlayer";

// Artist sidebar + scrolling page + fixed bottom player
export default function ArtistLayout() {
  const [menu, setMenu] = useState(false);
  const main = useRef();
  const { pathname } = useLocation();

  useEffect(() => { main.current?.scrollTo(0, 0); }, [pathname]);

  return (
    <MusicProvider>
      <div className="flex h-dvh flex-col bg-[#070a11] text-white">
        <div className="flex min-h-0 flex-1">
          <ArtistSidebar open={menu} onClose={() => setMenu(false)} />

          <div className="flex min-w-0 flex-1 flex-col">
            {/* menu button, phones and tablets only */}
            <header className="flex items-center gap-3 px-4 pt-3 lg:hidden">
              <button type="button" aria-label="Open menu" onClick={() => setMenu(true)} className="grid h-10 w-10 place-items-center rounded-lg text-[#c3ccdb] hover:bg-white/5">
                <FiMenu className="h-5 w-5" />
              </button>
              <span className="flex items-center gap-2 font-bold"><FaSpotify className="h-6 w-6 text-[#42e68b]" /> Spotify</span>
            </header>

            <main ref={main} className="flex-1 overflow-y-auto px-4 pb-8 pt-4 sm:px-8 lg:pt-8">
              <div className="mx-auto max-w-6xl"><Outlet /></div>
            </main>
          </div>
        </div>
        <MusicPlayer />
      </div>
    </MusicProvider>
  );
}