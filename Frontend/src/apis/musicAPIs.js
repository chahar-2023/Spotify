import { http } from "./http";
import { ENDPOINTS } from "./config";
import { normalizeSong, normalizeAlbum } from "../utils/normalize";

const list = (d, ...keys) => (Array.isArray(d) ? d : keys.map((k) => d?.[k]).find(Array.isArray) || []);

export const getAllSongs = async () =>
  list(await http(ENDPOINTS.getAllSongs), "musics", "songs").map(normalizeSong);

export const getAllAlbums = async () =>
  list(await http(ENDPOINTS.getAllAlbums), "albums").map(normalizeAlbum);

// title: string, musics: array of song ids
export const createAlbum = ({ title, musics }) =>
  http(ENDPOINTS.createAlbum, { method: "POST", body: { title, musics } });

// Upload a song (multipart/form-data).
// The field names below must match your multer setup, e.g. upload.single("music")
export const createMusic = ({ title, artistName, albumName, genre, audio, cover }) => {
  const form = new FormData();
  form.append("title", title);
  form.append("artistName", artistName); // extra fields are ignored if your schema doesn't have them
  if (albumName) form.append("albumName", albumName);
  if (genre) form.append("genre", genre);
  form.append("music", audio); // <- audio file field name
  if (cover) form.append("cover", cover); // <- cover image field name
  return http(ENDPOINTS.createMusic, { method: "POST", body: form });
};

export const deleteMusic = (id) => http(ENDPOINTS.deleteMusic(id), { method: "DELETE" });