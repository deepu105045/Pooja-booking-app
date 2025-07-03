// src/components/Header.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import { FaUserShield, FaSignOutAlt, FaHome } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import { useAdminAccess } from '../../hooks/useAdminAccess'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { isAdmin, loading } = useAdminAccess(user)

  const isAdminPage = location.pathname === '/admin'

  const handleClick = () => {
    navigate(isAdminPage ? '/' : '/admin')
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <span className="navbar-brand">🛕 Pooja Booking</span>
      <div className="ms-auto d-flex align-items-center">
        {user && (
          <>
            <span className="text-light me-3">
              <span
                className="d-inline d-lg-none"
                data-bs-toggle="tooltip"
                data-bs-placement="bottom"
                title={user.displayName}
                style={{ cursor: 'pointer' }}
              >
                {(() => {
                  if (!user.displayName) return '';
                  const parts = user.displayName.trim().split(' ');
                  const first = parts[0]?.[0] || '';
                  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
                  return (first + last).toUpperCase();
                })()}
              </span>
              <span className="d-none d-lg-inline">{user.displayName}</span>
            </span>
            {isAdminPage ? (
              <button
                onClick={handleClick}
                className="btn btn-outline-light me-3 d-flex align-items-center"
                title="Home"
              >
                <FaHome />
              </button>
            ) : (
              <button
                onClick={handleClick}
                className="btn btn-outline-light me-3 d-flex align-items-center"
                title="Admin"
              >
                <FaUserShield />
              </button>
            )}
            <button 
              className="btn btn-outline-light"
              onClick={handleLogout}
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </>
        )}
        {!user && !isAdminPage && (
          <button
            onClick={handleClick}
            className="btn btn-outline-light d-flex align-items-center"
            title="Admin"
          >
            <FaUserShield />
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
