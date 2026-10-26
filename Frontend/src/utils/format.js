export const formatTime = (s = 0) => {
  if (!s || !isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good Morning" : h < 18 ? "Good Afternoon" : "Good Evening";
};

const GRADIENTS = [
  "from-indigo-600 to-fuchsia-500",
  "from-teal-600 to-cyan-500",
  "from-orange-500 to-rose-600",
  "from-purple-700 to-indigo-500",
  "from-emerald-600 to-teal-500",
  "from-sky-600 to-blue-800",
  "from-pink-500 to-purple-700",
  "from-amber-500 to-red-600",
];

// same title -> same gradient (used when a song/album has no cover image)
export const gradientFor = (text = "") => {
  let h = 0;
  for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
};

// 2400 -> "2.4K", 12500 -> "12.5K", 980 -> "980"
export const formatCount = (n = 0) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
};

// "2026-10-06T..." -> "Oct 6, 2026"
export const formatDate = (iso) => {
  const d = new Date(iso);
  return iso && !isNaN(d) ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-";
};