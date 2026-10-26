import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MusicProvider } from "../context/MusicContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import MusicPlayer from "../components/MusicPlayer";

// Sidebar + top bar + scrolling page + fixed bottom player
export default function ListenerLayout() {
  const [menu, setMenu] = useState(false);
  const main = useRef();
  const { pathname } = useLocation();

  useEffect(() => { main.current?.scrollTo(0, 0); }, [pathname]);

  return (
    <MusicProvider>
      <div className="flex h-dvh flex-col bg-[#070a11] text-white">
        <div className="flex min-h-0 flex-1">
          <Sidebar open={menu} onClose={() => setMenu(false)} />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar onMenu={() => setMenu(true)} />
            <main ref={main} className="flex-1 overflow-y-auto px-4 pb-8 sm:px-6">
              <Outlet />
            </main>
          </div>
        </div>
        <MusicPlayer />
      </div>
    </MusicProvider>
  );
}