import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { pushToast } = useToast()
  const navigate = useNavigate()

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true)
    try { await login(email, password); pushToast('success', 'Login successful'); navigate('/app') }
    catch { pushToast('error', 'Invalid credentials') }
    finally { setLoading(false) }
  }

  return <div className="auth-page"><form className="panel auth-card" onSubmit={submit}><h1 className="auth-title">Welcome Back</h1><input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><button className="btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button><p className="muted">No account? <Link to="/register">Register</Link></p></form></div>
}


