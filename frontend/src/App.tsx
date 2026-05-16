import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppShell from './layouts/AppShell'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import UrlScannerPage from './pages/UrlScannerPage'
import SmsAnalyzerPage from './pages/SmsAnalyzerPage'
import ScreenshotPage from './pages/ScreenshotPage'
import DeepfakePage from './pages/DeepfakePage'
import VoiceClonePage from './pages/VoiceClonePage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="url-scanner" element={<UrlScannerPage />} />
        <Route path="sms-analyzer" element={<SmsAnalyzerPage />} />
        <Route path="screenshot" element={<ScreenshotPage />} />
        <Route path="deepfake" element={<DeepfakePage />} />
        <Route path="voice" element={<VoiceClonePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


