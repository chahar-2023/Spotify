import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ListenerLayout from "../layouts/ListenerLayout";
import ArtistLayout from "../layouts/ArtistLayout";

import Login from "../pages/Login";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Library from "../pages/Library";
import Playlists from "../pages/Playlists";
import CreatePlaylist from "../pages/CreatePlaylist";
import LikedSongs from "../pages/LikedSongs";
import PlaylistDetails from "../pages/PlaylistDetails";
import Profile from "../pages/Profile";

import Dashboard from "../pages/artist/Dashboard";
import MySongs from "../pages/artist/MySongs";
import UploadSong from "../pages/artist/UploadSong";
import ArtistCreatePlaylist from "../pages/artist/CreatePlaylist";
import Analytics from "../pages/artist/Analytics";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Listener pages */}
      <Route element={<ProtectedRoute><ListenerLayout /></ProtectedRoute>}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/library" element={<Library />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/create-playlist" element={<CreatePlaylist />} />
        <Route path="/liked-songs" element={<LikedSongs />} />
        <Route path="/playlist/:id" element={<PlaylistDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Artist pages */}
      <Route path="/artist" element={<ProtectedRoute role="artist"><ArtistLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="songs" element={<MySongs />} />
        <Route path="upload" element={<UploadSong />} />
        <Route path="create-playlist" element={<ArtistCreatePlaylist />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="playlist/:id" element={<PlaylistDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}