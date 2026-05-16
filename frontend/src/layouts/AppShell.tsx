import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Activity, AudioLines, ChartNoAxesCombined, FileWarning, Globe, LayoutDashboard, LogOut, MessageSquareWarning, Settings, ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const nav = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/url-scanner', icon: Globe, label: 'URL Scanner' },
  { to: '/app/sms-analyzer', icon: MessageSquareWarning, label: 'SMS Analyzer' },
  { to: '/app/screenshot', icon: FileWarning, label: 'Screenshot' },
  { to: '/app/deepfake', icon: ShieldAlert, label: 'Deepfake' },
  { to: '/app/voice', icon: AudioLines, label: 'Voice Clone' },
  { to: '/app/reports', icon: ChartNoAxesCombined, label: 'Reports' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
]

export default function AppShell() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <div>
      <div className="grid-bg" />
      <div className="app-wrap">
        <aside className="app-sidebar">
          <div className="brand"><div className="brand-mark" /><div className="brand-text">CyberRakshak</div></div>
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/app'} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
              <item.icon size={16} /> {item.label}
            </NavLink>
          ))}
          <div className="sidebar-bottom">
            <div className="muted">{user?.name}</div>
            <button className="btn-outline" onClick={toggleTheme}>Theme: {theme}</button>
            <button className="btn-danger" onClick={() => { logout(); navigate('/login') }}><LogOut size={14} /> Logout</button>
          </div>
        </aside>

        <main>
          <header className="panel topbar">
            <div>
              <div className="title">AI Security Command Center</div>
              <div className="muted">Real-time cyber fraud intelligence</div>
            </div>
            <button className="btn-primary" onClick={() => navigate('/app/url-scanner')}>New Scan</button>
          </header>
          <div className="content"><Outlet /></div>
        </main>
      </div>
    </div>
  )
}


