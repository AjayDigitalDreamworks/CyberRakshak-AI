export function LoaderSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="panel" style={{ padding: '1rem', display: 'grid', gap: '.6rem' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ height: 14, borderRadius: 8, background: 'rgba(148,163,184,0.2)' }} />
      ))}
    </div>
  )
}


