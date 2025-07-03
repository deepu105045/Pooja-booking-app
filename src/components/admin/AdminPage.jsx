// src/components/admin/AdminPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth'
import { useAdminAccess } from '../../hooks/useAdminAccess'
import AdminDashboard from './AdminDashboard'
import AdminStats from './AdminStats'

const AdminPage = () => {
  const { user, loading: authLoading, error: authError, signInWithGoogle } = useAuth()
  const { isAdmin, loading: adminLoading, error: adminError } = useAdminAccess(user)
  const [showStats, setShowStats] = useState(false)

  if (authLoading || adminLoading) return <div className="container mt-4">Loading...</div>
  if (authError) return <div className="container mt-4 text-danger">Error: {authError.message}</div>
  if (adminError) return <div className="container mt-4 text-danger">Error: {adminError.message}</div>

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        <h2 className="mb-4">Admin Access Required</h2>
        <p className="mb-4">Please sign in with your Google account to access the admin panel.</p>
        <button 
          className="btn btn-primary"
          onClick={signInWithGoogle}
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mt-4 text-center">
        <h2 className="mb-4">Access Denied</h2>
        <p className="mb-4">You don't have permission to access the admin panel.</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* AdminStats at the top */}
      <AdminStats />
      <AdminDashboard />
    </div>
  )
}

export default AdminPage
