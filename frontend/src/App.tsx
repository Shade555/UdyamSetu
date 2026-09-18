import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from './context/AuthContext'

// Auth Pages
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'

// Onboarding Pages (Old journey flow moved here)
import LanguageSelector from './pages/LanguageSelector'
import NeedSelector from './pages/NeedSelector'
import RequirementInput from './pages/RequirementInput'
import ProfileConfirmation from './pages/ProfileConfirmation'
import EligibilityCheck from './pages/EligibilityCheck'
import SchemeRecommendation from './pages/SchemeRecommendation'
import Finance from './pages/Finance'
import Documents from './pages/Documents'
import Partner from './pages/Partner'
import OfficialAction from './pages/OfficialAction'

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  const { session, loading } = useAuth()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!loading) {
      setIsReady(true)
    }
  }, [loading])

  if (!isReady) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent-200 border-t-accent-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/signup" element={session ? <Navigate to="/dashboard" /> : <Signup />} />

      {/* Dashboard & Profile */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Onboarding Flow (Protected) */}
      <Route
        path="/onboarding/language"
        element={
          <ProtectedRoute>
            <LanguageSelector onSelectLanguage={() => {}} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/need"
        element={
          <ProtectedRoute>
            <NeedSelector language="en" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/requirement"
        element={
          <ProtectedRoute>
            <RequirementInput language="en" setUserProfile={() => {}} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/profile"
        element={
          <ProtectedRoute>
            <ProfileConfirmation language="en" profile={null} />
          </ProtectedRoute>
        }
      />

      {/* Journey Flow (Protected) */}
      <Route
        path="/eligibility"
        element={
          <ProtectedRoute>
            <EligibilityCheck language="en" profile={null} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scheme"
        element={
          <ProtectedRoute>
            <SchemeRecommendation language="en" profile={null} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance"
        element={
          <ProtectedRoute>
            <Finance language="en" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Documents language="en" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/partner"
        element={
          <ProtectedRoute>
            <Partner language="en" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/action"
        element={
          <ProtectedRoute>
            <OfficialAction language="en" />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="/" element={<Navigate to={session ? '/dashboard' : '/login'} replace />} />
    </Routes>
  )
}

export default App
