import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/landing-exact.css'

export default function LandingPage() {
  useEffect(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const vals = [28, 45, 33, 67, 52, 89, 61]
    const max = Math.max(...vals)
    const container = document.getElementById('bars')
    if (!container) return
    container.innerHTML = ''

    days.forEach((d, i) => {
      const wrap = document.createElement('div')
      wrap.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%'
      const bar = document.createElement('div')
      const pct = Math.round((vals[i] / max) * 100)
      bar.className = 'bar'
      bar.style.cssText = `height:${pct}%;background:linear-gradient(180deg,#00e5ff,rgba(0,229,255,0.3));margin-top:auto`
      const lbl = document.createElement('div')
      lbl.style.cssText = 'font-size:0.58rem;color:#94a3b8;font-family:Inter,sans-serif;'
      lbl.textContent = d
      wrap.appendChild(bar)
      wrap.appendChild(lbl)
      container.appendChild(wrap)
    })
  }, [])

  return (
    <>
      <div className="grid-bg"></div>

      <nav>
        <div className="logo">
          <div className="logo-icon"></div>
          <span className="logo-text">CyberRakshak</span>
        </div>
        <div className="nav-links">
          <a>Home</a><a>Features</a><a>How It Works</a><a>Technology</a><a>Contact</a>
        </div>
        <div className="nav-actions">
          <button className="btn-ghost">GitHub</button>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </nav>

      <section className="hero">
        <div>
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span className="badge-text">AI THREAT DETECTION ACTIVE</span>
          </div>
          <h1>AI Powered Scam &amp; Deepfake Detection Platform</h1>
          <p className="hero-sub">Protect yourself from phishing, fake screenshots, deepfakes, and AI scams using advanced cybersecurity intelligence. Real-time protection powered by machine learning.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-lg btn-cyan" style={{ textDecoration: 'none' }}>Try Demo</Link>
            <button className="btn-lg btn-outline">GitHub Repo</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="scanner-frame">
            <div className="sf-header">
              <span className="sf-title">THREAT SCANNER</span>
              <span className="sf-status">ANALYZING</span>
            </div>
            <div className="url-input-mock">
              <span style={{ color: 'var(--sub)', fontSize: 14 }}>🌐</span>
              <span className="url-text">http://paypal-secure-login.ru/verify/account</span>
            </div>
            <div className="threat-meter">
              <div className="tm-label">RISK SCORE</div>
              <div className="tm-bar"><div className="tm-fill"></div></div>
              <div className="tm-score">92%</div>
            </div>
            <div className="threat-tags">
              <span className="tag tag-danger">⚠ Phishing Detected</span>
              <span className="tag tag-warn">Suspicious Domain</span>
              <span className="tag tag-danger">Malicious Redirect</span>
              <span className="tag tag-info">AI Confidence: 97%</span>
            </div>
            <div className="mini-grid">
              <div className="mini-card"><div className="mc-val">1.2M</div><div className="mc-lbl">URLs Scanned</div></div>
              <div className="mini-card"><div className="mc-val" style={{ color: 'var(--danger)' }}>48K</div><div className="mc-lbl">Threats Found</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-num">1.2M+</div><div className="stat-label">SCAM URLS DETECTED</div><div className="stat-trend">↑ 12% this week</div></div>
          <div className="stat-card"><div className="stat-num" style={{ color: 'var(--purple)' }}>48K</div><div className="stat-label">DEEPFAKES FLAGGED</div><div className="stat-trend">↑ 8% this week</div></div>
          <div className="stat-card"><div className="stat-num" style={{ color: 'var(--danger)' }}>310K</div><div className="stat-label">FRAUD REPORTS</div><div className="stat-trend">↑ 3% this week</div></div>
          <div className="stat-card"><div className="stat-num" style={{ color: 'var(--success)' }}>98.7%</div><div className="stat-label">AI CONFIDENCE</div><div className="stat-trend">↑ Improving</div></div>
        </div>
      </section>

      <section className="features">
        <div className="section-header"><div className="section-tag">CAPABILITIES</div><div className="section-title">Detection Arsenal</div><p className="section-sub">Multi-layered AI protection against every modern cyber threat vector — from phishing URLs to AI-synthesized deepfakes.</p></div>
        <div className="features-grid">
          <div className="feat-card"><div className="feat-icon fi-cyan">🛡️</div><div className="feat-name">URL Scam Detection</div><div className="feat-desc">Real-time analysis of URLs using ML models trained on millions of phishing patterns and malicious domains.</div><span className="feat-acc">99.1% Accuracy</span></div>
          <div className="feat-card"><div className="feat-icon fi-purple">💬</div><div className="feat-name">SMS Fraud Analyzer</div><div className="feat-desc">NLP-powered detection of fraudulent SMS messages, OTP scams, and smishing attacks with highlighted risk zones.</div><span className="feat-acc">96.4% Accuracy</span></div>
          <div className="feat-card"><div className="feat-icon fi-danger">🧬</div><div className="feat-name">Deepfake Detector</div><div className="feat-desc">Frame-by-frame video analysis using convolutional neural networks to detect AI-generated faces and synthetic media.</div><span className="feat-acc">94.8% Accuracy</span></div>
          <div className="feat-card"><div className="feat-icon fi-warn">📷</div><div className="feat-name">Screenshot Verification</div><div className="feat-desc">OCR + metadata forensics to detect manipulated screenshots used in financial fraud and social engineering.</div><span className="feat-acc">97.2% Accuracy</span></div>
          <div className="feat-card"><div className="feat-icon fi-success">🎙️</div><div className="feat-name">Voice Clone Detection</div><div className="feat-desc">Spectral analysis of audio signals to identify AI-cloned voices used in vishing and impersonation attacks.</div><span className="feat-acc">91.3% Accuracy</span></div>
          <div className="feat-card"><div className="feat-icon fi-cyan">📡</div><div className="feat-name">Real-Time Reports</div><div className="feat-desc">Instant threat intelligence reports with risk scores, evidence trails, and downloadable forensic summaries.</div><span className="feat-acc">Live Dashboard</span></div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="section-header" style={{ textAlign: 'center' }}><div className="section-tag" style={{ textAlign: 'center' }}>WORKFLOW</div><div className="section-title">How It Works</div><p className="section-sub" style={{ margin: '0 auto' }}>Three steps from suspicious content to complete threat analysis.</p></div>
        <div className="steps">
          <div className="step"><div className="step-num">01</div><div className="step-title">Upload or Paste</div><p className="step-desc">Submit suspicious URLs, SMS messages, screenshots, or video files through our secure drag-and-drop interface.</p></div>
          <div className="step"><div className="step-num" style={{ borderColor: 'var(--purple)', color: 'var(--purple)', boxShadow: '0 0 20px rgba(139,92,246,0.2)' }}>02</div><div className="step-title">AI Analyzes</div><p className="step-desc">Multi-model ensemble AI processes your content using NLP, computer vision, and behavioral pattern matching.</p></div>
          <div className="step"><div className="step-num" style={{ borderColor: 'var(--success)', color: 'var(--success)', boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}>03</div><div className="step-title">Report Generated</div><p className="step-desc">Receive a detailed forensic report with threat classification, confidence scores, and recommended actions.</p></div>
        </div>
      </section>

      <section className="dash-preview">
        <div className="section-header" style={{ textAlign: 'center' }}><div className="section-tag" style={{ textAlign: 'center' }}>DEMO PREVIEW</div><div className="section-title">Dashboard Overview</div></div>
        <div className="dash-mock">
          <div className="dash-topbar"><span className="dash-logo">CYBERRAKSHAK</span><div className="dash-pills"><div className="dash-pill" style={{ background: '#ff4d4d' }}></div><div className="dash-pill" style={{ background: '#ff9d00' }}></div><div className="dash-pill" style={{ background: '#22c55e' }}></div></div></div>
          <div className="dash-body">
            <div className="dash-sidebar">
              <div className="ds-item active">Dashboard</div><div className="ds-item">URL Scanner</div><div className="ds-item">SMS Analyzer</div><div className="ds-item">Screenshot</div><div className="ds-item">Deepfake</div><div className="ds-item">Reports</div><div className="ds-item">Settings</div>
            </div>
            <div className="dash-main">
              <div className="dm-stat"><div className="dms-val">4,821</div><div className="dms-lbl">Total Scans</div></div>
              <div className="dm-stat"><div className="dms-val" style={{ color: 'var(--danger)' }}>312</div><div className="dms-lbl">Threats</div></div>
              <div className="dm-stat"><div className="dms-val" style={{ color: 'var(--purple)' }}>47</div><div className="dms-lbl">Deepfakes</div></div>
              <div className="dm-stat"><div className="dms-val" style={{ color: 'var(--success)' }}>A+</div><div className="dms-lbl">Security Score</div></div>
              <div className="dash-chart-row"><div className="chart-label">THREAT DETECTION TREND — 7 DAYS</div><div className="bar-row" id="bars"></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="tech">
        <div className="section-header" style={{ textAlign: 'center' }}><div className="section-tag" style={{ textAlign: 'center' }}>BUILT WITH</div><div className="section-title">Technology Stack</div></div>
        <div className="tech-row">
          <div className="tech-chip"><div className="tc-dot" style={{ background: '#61DAFB' }}></div>React</div>
          <div className="tech-chip"><div className="tc-dot" style={{ background: '#339933' }}></div>Node.js</div>
          <div className="tech-chip"><div className="tc-dot" style={{ background: '#3776AB' }}></div>Python</div>
          <div className="tech-chip"><div className="tc-dot" style={{ background: '#FF6F00' }}></div>TensorFlow</div>
          <div className="tech-chip"><div className="tc-dot" style={{ background: '#47A248' }}></div>MongoDB</div>
          <div className="tech-chip"><div className="tc-dot" style={{ background: '#009688' }}></div>FastAPI</div>
          <div className="tech-chip"><div className="tc-dot" style={{ background: '#06B6D4' }}></div>Tailwind CSS</div>
          <div className="tech-chip"><div className="tc-dot" style={{ background: '#764ABC' }}></div>PyTorch</div>
        </div>
      </section>

      <footer>
        <div className="logo"><div className="logo-icon"></div><span className="logo-text">CyberRakshak AI</span></div>
        <div className="footer-links"><a>About</a><a>Privacy Policy</a><a>GitHub</a><a>Contact</a></div>
        <div className="footer-copy">CyberRakshak AI © 2026</div>
      </footer>
    </>
  )
}
