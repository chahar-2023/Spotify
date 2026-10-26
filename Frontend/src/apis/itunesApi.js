// Free public search API (no key). Returns 30-second previews of songs worldwide.
export async function searchWorld(term, limit = 30) {
  const qs = new URLSearchParams({ term, media: "music", entity: "song", limit });
  const res = await fetch(`https://itunes.apple.com/search?${qs}`);
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return (data.results || [])
    .filter((r) => r.previewUrl)
    .map((r) => ({
      _id: `it-${r.trackId}`,
      title: r.trackName,
      artist: r.artistName,
      album: r.collectionName || "",
      cover: (r.artworkUrl100 || "").replace("100x100", "300x300"),
      url: r.previewUrl,
      duration: Math.round((r.trackTimeMillis || 0) / 1000),
    }));
}