import { useAuth } from "./context/AuthContext";
import { LibraryProvider } from "./context/LibraryContext";
import { PlayerProvider } from "./context/PlayerContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  const { user } = useAuth();
  return (
    // key = a fresh library + player for every different user
    <LibraryProvider key={user?.id || "guest"}>
      <PlayerProvider>
        <AppRoutes />
      </PlayerProvider>
    </LibraryProvider>
  );
}