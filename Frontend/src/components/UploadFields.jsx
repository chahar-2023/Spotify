import { useEffect, useState } from "react";
import { FiUploadCloud, FiUpload } from "react-icons/fi";

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1);

// Dashed box: click to choose the cover image (shows a preview after choosing)
export function CoverDrop({ file, onPick }) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <label className="relative flex min-h-[190px] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-[#2a3750] bg-[#0a0f1a] p-4 text-center transition hover:border-[#42e6a0] focus-within:border-[#42e6a0] md:row-span-2 md:min-h-0">
      <input type="file" accept="image/png,image/jpeg" className="sr-only" onChange={(e) => onPick(e.target.files[0])} />
      {preview ? (
        <>
          <img src={preview} alt="Cover preview" className="absolute inset-0 h-full w-full object-cover" />
          <span className="relative mt-auto rounded-full bg-black/70 px-3 py-1 text-xs">Click to change</span>
        </>
      ) : (
        <>
          <FiUploadCloud className="h-9 w-9 text-white" />
          <p className="text-sm font-medium">Click to upload cover image</p>
          <p className="text-xs text-[#8e9bb0]">(JPG, PNG - Max 5MB)</p>
        </>
      )}
    </label>
  );
}

// Box to choose the audio file
export function AudioDrop({ file, onPick }) {
  return (
    <label className="flex h-[96px] cursor-pointer items-center gap-4 rounded-xl border border-[#1f2a3f] bg-[#0a0f1a] px-5 transition hover:border-[#42e6a0] focus-within:border-[#42e6a0]">
      <input type="file" accept=".mp3,.wav,audio/mpeg,audio/wav" className="sr-only" onChange={(e) => onPick(e.target.files[0])} />
      <FiUpload className="h-5 w-5 shrink-0 text-white" />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{file ? file.name : "Choose audio file"}</p>
        <p className="text-xs text-[#8e9bb0]">{file ? `${mb(file.size)} MB` : "(MP3, WAV - Max 10MB)"}</p>
      </div>
    </label>
  );
}