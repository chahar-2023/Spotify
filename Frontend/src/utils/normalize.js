// Turns your backend objects into one simple shape the UI can use.
// If your Mongoose fields have different names, edit them HERE only.
const idOf = (v) => (v && typeof v === "object" ? v._id || v.id : v);
const nameOf = (v) =>
  v && typeof v === "object" ? v.username || v.name || "Unknown artist" : v || "Unknown artist";

export const normalizeSong = (s) => ({
  _id: s._id || s.id,
  title: s.title || s.name || "Untitled",
  artist: nameOf(s.artist),
  ownerId: idOf(s.artist) || idOf(s.user) || null,
  album: s.album?.title || (typeof s.album === "string" ? s.album : ""),
  genre: s.genre || "",
  cover: s.cover || s.coverImage || s.image || "",
  url: s.uri || s.url || s.audio || s.music || "",
  duration: s.duration || 0,
  plays: s.plays ?? s.playCount ?? 0,
  createdAt: s.createdAt || null,
});

export const normalizeAlbum = (a) => {
  const items = a.musics || a.songs || [];
  return {
    _id: a._id || a.id,
    title: a.title || a.name || "Untitled playlist",
    artist: nameOf(a.artist),
    ownerId: idOf(a.artist) || idOf(a.user) || null,
    cover: a.cover || a.coverImage || "",
    createdAt: a.createdAt || null,
    songIds: items.map(idOf),
    songs: items.filter((m) => m && typeof m === "object").map(normalizeSong),
  };
};

// only the items that belong to this user
export const ownedBy = (items, user) =>
  items.filter((i) => i.ownerId && String(i.ownerId) === String(user?.id));

// newest first (keeps the original order if there are no dates)
export const newestFirst = (items) =>
  [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));