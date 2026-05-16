import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useToast } from '../context/ToastContext'

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [threshold, setThreshold] = useState(70)
  const { pushToast } = useToast()

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      setEmailAlerts(Boolean(data.emailAlerts))
      setThreshold(Number(data.riskThreshold || 70))
    }).catch(() => {})
  }, [])

  const save = async () => {
    try {
      await api.put('/settings', { emailAlerts, riskThreshold: threshold })
      pushToast('success', 'Settings updated')
    } catch {
      pushToast('error', 'Failed to update settings')
    }
  }

  return <div className="panel scan-form"><h2 className="scan-title">Settings</h2><label style={{ display: 'flex', gap: '.5rem', marginBottom: '.9rem' }}><input type="checkbox" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} /> Email Threat Alerts</label><label className="muted">Risk Threshold: {threshold}</label><input type="range" min="10" max="95" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} style={{ width: '100%', margin: '.6rem 0 1rem' }} /><button className="btn-primary" onClick={save}>Save Preferences</button></div>
}

