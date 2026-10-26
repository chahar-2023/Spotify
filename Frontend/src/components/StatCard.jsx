const TONES = {
  green: "bg-[#12382f] text-[#42e6a0]",
  purple: "bg-[#241a52] text-[#8b7cff]",
};

// Small box on the dashboard: label, big number, round icon on the right
export default function StatCard({ label, value, Icon, tone = "green" }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#1b2638] bg-[#0c1220] px-5 py-4 shadow-lg shadow-black/20">
      <div>
        <p className="text-[13px] text-[#c3ccdb]">{label}</p>
        <p className="mt-1 text-[28px] font-bold leading-none">{value}</p>
      </div>
      <span className={`grid h-11 w-11 place-items-center rounded-full ${TONES[tone]}`}>
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}