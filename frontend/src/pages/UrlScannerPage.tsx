import { useState } from 'react'
import api from '../lib/api'

export default function UrlScannerPage() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<any>(null)
  const run = async () => { const { data } = await api.post('/url-scan', { url }); setResult(data) }
  return <><div className="panel scan-form"><h2 className="scan-title">URL Scanner</h2><textarea value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" /><button className="btn-primary" style={{ marginTop: '.8rem' }} onClick={run}>Analyze URL</button></div>{result && <div className="panel result"><div className="title">{result.verdict}</div><p>Risk Score: {result.riskScore}%</p><p className="muted">{result.explanation}</p></div>}</>
}


