export function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return <div className="panel stat"><p className="muted">{title}</p><p className="num">{value}</p><p className="muted">{subtitle}</p></div>
}


