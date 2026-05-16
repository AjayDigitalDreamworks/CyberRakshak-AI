import { createContext, useContext, useMemo, useState } from 'react'

type Toast = { id: number; type: 'success' | 'error' | 'info'; message: string }
type ToastContextType = { pushToast: (type: Toast['type'], message: string) => void }
const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const pushToast = (type: Toast['type'], message: string) => {
    const id = Date.now(); setToasts((p) => [...p, { id, type, message }]); setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000)
  }
  const value = useMemo(() => ({ pushToast }), [])
  return <ToastContext.Provider value={value}>{children}<div style={{ position: 'fixed', right: 16, top: 16, zIndex: 50, display: 'grid', gap: 10 }}>{toasts.map((t) => <div key={t.id} className="panel" style={{ padding: '.6rem .8rem', borderColor: t.type === 'error' ? 'rgba(255,77,77,.45)' : 'var(--border)' }}>{t.message}</div>)}</div></ToastContext.Provider>
}

export function useToast() { const ctx = useContext(ToastContext); if (!ctx) throw new Error('useToast must be used inside ToastProvider'); return ctx }


