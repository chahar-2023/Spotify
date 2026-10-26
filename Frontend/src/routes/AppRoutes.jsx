import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ListenerLayout from "../layouts/ListenerLayout";
import ArtistLayout from "../layouts/ArtistLayout";

import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Search from "../Pages/Search";
import Library from "../Pages/Library";
import Playlists from "../Pages/Playlists";
import CreatePlaylist from "../Pages/CreatePlaylist";
import LikedSongs from "../Pages/LikedSongs";
import PlaylistDetails from "../Pages/PlaylistDetails";
import Profile from "../Pages/Profile";

import Dashboard from "../Pages/artist/Dashboard";
import MySongs from "../Pages/artist/MySongs";
import UploadSong from "../Pages/artist/UploadSong";
import ArtistCreatePlaylist from "../Pages/artist/CreatePlaylist";
import Analytics from "../Pages/artist/Analytics";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Listener Pages */}
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

      {/* Artist Pages */}
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