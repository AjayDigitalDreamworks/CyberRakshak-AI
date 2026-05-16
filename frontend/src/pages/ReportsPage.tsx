import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  useEffect(() => { api.get('/reports').then(({ data }) => setReports(data.reports || [])) }, [])
  return <div className="panel table-wrap"><h2 className="scan-title">Reports & History</h2><table className="table"><thead><tr><th>Type</th><th>Verdict</th><th>Score</th><th>Date</th></tr></thead><tbody>{reports.map((r, i) => <tr key={i}><td>{r.scanType}</td><td>{r.verdict}</td><td>{r.riskScore}</td><td>{new Date(r.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div>
}


