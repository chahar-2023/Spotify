import { useState } from "react";
import { FiMusic } from "react-icons/fi";
import { gradientFor } from "../utils/format";

// Cover image, or a colourful gradient tile when there is no image
export default function Cover({ src, title = "", className = "", showTitle = false }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
  }
  return (
    <div className={`flex bg-gradient-to-br text-white ${gradientFor(title)} ${showTitle ? "items-end" : "items-center justify-center"} ${className}`}>
      {showTitle ? (
        <span className="p-3 text-left text-lg font-bold leading-tight">{title}</span>
      ) : (
        <FiMusic className="h-2/5 w-2/5 opacity-70" />
      )}
    </div>
  );
}