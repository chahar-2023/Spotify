export function Loader() {
  return (
    <div className="flex gap-1.5 py-10" role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#42e6a0]" style={{ animationDelay: `${i * 150}ms` }} />
      ))}
    </div>
  );
}

export function Empty({ icon: Icon, title, text, children }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#1f2a3f] px-6 py-12 text-center">
      {Icon && <Icon className="mb-3 h-9 w-9 text-[#42e6a0]" />}
      <p className="text-lg font-semibold">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-[#8e9bb0]">{text}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function ErrorNote({ children }) {
  return (
    <p role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {children}
    </p>
  );
}