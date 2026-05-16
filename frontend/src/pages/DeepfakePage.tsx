import { useState } from 'react'
import api from '../lib/api'

export default function DeepfakePage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const run = async () => { if (!file) return; const f = new FormData(); f.append('file', file); const { data } = await api.post('/deepfake', f); setResult(data) }
  return <><div className="panel scan-form"><h2 className="scan-title">Deepfake Detector</h2><input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} /><button className="btn-primary" style={{ marginTop: '.8rem' }} onClick={run}>Detect Deepfake</button></div>{result && <div className="panel result"><p>Deepfake Confidence: {result.deepfakeConfidence}%</p><p className="muted">{result.explanation}</p></div>}</>
}


