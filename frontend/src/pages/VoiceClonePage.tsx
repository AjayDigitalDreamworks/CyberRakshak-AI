import { useState } from 'react'
import api from '../lib/api'

export default function VoiceClonePage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const run = async () => { if (!file) return; const f = new FormData(); f.append('file', file); const { data } = await api.post('/audio-scan', f); setResult(data) }
  return <><div className="panel scan-form"><h2 className="scan-title">Voice Clone Detector</h2><input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /><button className="btn-primary" style={{ marginTop: '.8rem' }} onClick={run}>Analyze Voice</button></div>{result && <div className="panel result"><p>Classification: {result.classification}</p><p>Confidence: {result.confidence}%</p></div>}</>
}


