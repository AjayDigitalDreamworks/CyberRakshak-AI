import { createContext, useContext, useMemo, useState } from 'react'
import api from '../lib/api'

type User = { name: string; email: string } | null

type AuthContextType = {
  user: User
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('cr_token'))
  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem('cr_user')
    return raw ? JSON.parse(raw) : null
  })

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('cr_token', data.token)
    localStorage.setItem('cr_user', JSON.stringify(data.user))
  }

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('cr_token', data.token)
    localStorage.setItem('cr_user', JSON.stringify(data.user))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('cr_token')
    localStorage.removeItem('cr_user')
  }

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}


