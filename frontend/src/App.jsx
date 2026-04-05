import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SessionProvider } from './context/SessionContext'
import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import Navbar from './components/common/Navbar'

import LoginPage           from './pages/auth/LoginPage'
import SignupPage          from './pages/auth/SignupPage'
import POSPage             from './pages/pos/POSPage'
import OrdersPage          from './pages/backoffice/OrdersPage'
import ProductsPage        from './pages/backoffice/ProductsPage'
import FloorPlanPage       from './pages/pos/FloorPlanPage'
import KitchenPage         from './pages/kds/KitchenPage'
import CustomerDisplayPage from './pages/customer/CustomerDisplayPage'
import MobileOrderPage     from './pages/pos/MobileOrderPage'
import QRPdfPage           from './pages/customer/QRPdfPage'
import ReportingPage       from './pages/backoffice/ReportingPage'
import SettingsPage        from './pages/SettingsPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Navbar />
      <div style={{ paddingTop: '60px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </div>
  )
}

function FullPageSpinner() {
  return (
    <div style={{
      minHeight: '100vh', background: '#1a1a1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '1rem', fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: '3px solid #3d5a47', borderTopColor: '#c9a84c',
        animation: 'spin 0.8s linear infinite',
      }} />
      <img src="/logo.png" alt="Jor Shor Logo" style={{ height: '30px', marginTop: '10px' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id-here';
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <SessionProvider>
              <Routes>
                {/* Public */}
              <Route path="/login"  element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/order"  element={<MobileOrderPage />} />

              {/* Protected */}
              <Route path="/pos" element={
                <ProtectedRoute><POSPage /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><OrdersPage /></ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute><ProductsPage /></ProtectedRoute>
              } />
              <Route path="/floor-plan" element={
                <ProtectedRoute><FloorPlanPage /></ProtectedRoute>
              } />
              <Route path="/kitchen" element={
                <ProtectedRoute><KitchenPage /></ProtectedRoute>
              } />
              <Route path="/customer-display" element={
                <ProtectedRoute><CustomerDisplayPage /></ProtectedRoute>
              } />
              <Route path="/qr-pdf" element={
                <ProtectedRoute><QRPdfPage /></ProtectedRoute>
              } />
              <Route path="/reporting" element={
                <ProtectedRoute><ReportingPage /></ProtectedRoute>
              } />
              <Route path="/pos-settings" element={
                <ProtectedRoute><SettingsPage /></ProtectedRoute>
              } />

              {/* Default */}
              <Route path="/" element={<Navigate to="/pos" replace />} />
              <Route path="*" element={<Navigate to="/pos" replace />} />
            </Routes>
          </SessionProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
    </GoogleOAuthProvider>
  )
}
