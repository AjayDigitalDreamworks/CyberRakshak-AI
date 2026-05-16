import { useEffect, useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import api from '../lib/api'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

type Summary = {
  totalScans: number
  dangerousScans: number
  deepfakes: number
  securityScore: number
  trend: { labels: string[]; values: number[] }
}

type Alert = { id?: string; message: string; severity?: string; createdAt?: string }

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary>({ totalScans: 0, dangerousScans: 0, deepfakes: 0, securityScore: 100, trend: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [0, 0, 0, 0, 0, 0, 0] } })
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const [s, a] = await Promise.all([api.get('/dashboard/summary'), api.get('/threat-alerts')])
        if (!active) return
        setSummary(s.data)
        setAlerts(a.data.alerts || [])
      } catch {
        if (!active) return
      }
    }
    load()
    const id = setInterval(load, 10000)
    return () => { active = false; clearInterval(id) }
  }, [])

  const data = useMemo(() => ({
    labels: summary.trend?.labels || [],
    datasets: [{ label: 'Dangerous Scans', data: summary.trend?.values || [], borderColor: '#00e5ff', tension: 0.4 }],
  }), [summary])

  const stats = [
    `${summary.totalScans}|Total Scans`,
    `${summary.dangerousScans}|Dangerous`,
    `${summary.deepfakes}|Deepfakes`,
    `${summary.securityScore}/100|Security Score`,
  ]

  return (
    <>
      <div className="cards-4">
        {stats.map((it) => {
          const [n, l] = it.split('|')
          return <div className="panel stat" key={it}><div className="num">{n}</div><div className="muted">{l}</div></div>
        })}
      </div>
      <div className="cards-3">
        <div className="panel" style={{ padding: '1rem' }}><div className="scan-title">Threat Detection Trend (Live)</div><Line data={data} /></div>
        <div className="panel" style={{ padding: '1rem' }}>
          <div className="scan-title">Real-Time Alerts</div>
          {alerts.length === 0 ? <div className="alert">No high-risk alerts yet. Run scans to generate intelligence.</div> : alerts.map((a, i) => <div className="alert" key={a.id || i}>{a.message}</div>)}
        </div>
      </div>
    </>
  )
}

