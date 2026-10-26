import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// <ProtectedRoute>                -> any logged-in user (listener OR artist)
// <ProtectedRoute role="artist">  -> artists only (listeners are sent to Home)
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role === "artist" && user.role !== "artist") return <Navigate to="/" replace />;
  return children;
}