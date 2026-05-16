import { useState } from 'react'
import api from '../lib/api'

export default function ScreenshotPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const run = async () => { if (!file) return; const f = new FormData(); f.append('file', file); const { data } = await api.post('/screenshot', f); setResult(data) }
  return <><div className="panel scan-form"><h2 className="scan-title">Screenshot Verification</h2><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /><button className="btn-primary" style={{ marginTop: '.8rem' }} onClick={run}>Analyze Screenshot</button></div>{result && <div className="panel result"><p>Manipulation Confidence: {result.manipulationConfidence}%</p><p className="muted">OCR: {result.ocrText}</p></div>}</>
}


