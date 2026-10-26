// >>> Change these paths to match your Express routes <<<
export const BASE_URL = import.meta.env.VITE_API_URL || "";

export const ENDPOINTS = {
  // ---- auth ----
  registerUser: "/api/auth/register",
  loginUser: "/api/auth/login",
  logoutUser: "/api/auth/logout",        // was "logout"; authAPIs.js looks for "logoutUser"

  // ---- music ----
  getAllSongs: "/api/music",
  getAllAlbums: "/api/music/albums",
  getAlbumById: (id) => `/api/music/albums/${id}`,
  createMusic: "/api/music/upload",       // POST (multipart) - artist uploads a song
  createAlbum: "/api/music/album",
  deleteMusic: (id) => `/api/music/${id}`, // new: used by the Delete menu on My Songs
};