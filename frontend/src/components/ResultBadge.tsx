export function ResultBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-xs">
      <span className="text-slate-400">{label}: </span>
      <span className="text-cyan-200">{value}</span>
    </div>
  )
}


