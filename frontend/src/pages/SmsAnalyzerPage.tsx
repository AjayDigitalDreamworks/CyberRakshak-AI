import { useState } from 'react'
import api from '../lib/api'

export default function SmsAnalyzerPage() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<any>(null)
  const run = async () => { const { data } = await api.post('/sms-scan', { message }); setResult(data) }
  return <><div className="panel scan-form"><h2 className="scan-title">SMS Scam Analyzer</h2><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Paste suspicious SMS" /><button className="btn-primary" style={{ marginTop: '.8rem' }} onClick={run}>Analyze Message</button></div>{result && <div className="panel result"><p>Scam Probability: {result.scamProbability}%</p><p className="muted">Signals: {(result.signals || []).join(', ')}</p><p>{result.explanation}</p></div>}</>
}


