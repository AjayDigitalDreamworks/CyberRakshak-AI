import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { pushToast } = useToast()
  const navigate = useNavigate()

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setLoading(true)
    try { await register(name, email, password); pushToast('success', 'Account created'); navigate('/app') }
    catch { pushToast('error', 'Unable to register') }
    finally { setLoading(false) }
  }

  return <div className="auth-page"><form className="panel auth-card" onSubmit={submit}><h1 className="auth-title">Create Account</h1><input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /><input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><button className="btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button><p className="muted">Have account? <Link to="/login">Login</Link></p></form></div>
}


