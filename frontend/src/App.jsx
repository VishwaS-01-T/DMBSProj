import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LandingPage from './pages/LandingPage'
import StudentLogin from './pages/StudentLogin'
import AdminLogin from './pages/AdminLogin'
import StudentDashboard from './pages/StudentDashboard'
import AdminPanel from './pages/AdminPanel'

function ProtectedStudent({ children }) {
  const { token, role } = useAuthStore()
  if (!token || role !== 'student') return <Navigate to="/login/student" replace />
  return children
}

function ProtectedAdmin({ children }) {
  const { token, role } = useAuthStore()
  if (!token || role !== 'admin') return <Navigate to="/login/admin" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/student" element={<ProtectedStudent><StudentDashboard /></ProtectedStudent>} />
        <Route path="/admin" element={<ProtectedAdmin><AdminPanel /></ProtectedAdmin>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}