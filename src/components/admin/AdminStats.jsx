import React from 'react'
import { getFridaysOfYear } from '../../utils/getFridaysOfYear'
import { useFirestoreBooking } from '../../hooks/useFirestoreBooking'

const AdminStats = () => {
  const currentYear = new Date().getFullYear()
  const today = new Date()
  const { bookings, loading, error } = useFirestoreBooking(currentYear)

  // Get all Fridays of the year
  const allFridays = getFridaysOfYear(currentYear)
  
  // Get Fridays until today
  const fridaysUntilToday = allFridays.filter(date => date <= today)
  
  // Get current week number (1-52)
  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000))
    return Math.ceil((days + startOfYear.getDay() + 1) / 7)
  }
  
  const currentWeek = getWeekNumber(today)
  
  // Calculate statistics
  const calculateStats = () => {
    if (loading || error) return null

    const bookingList = Object.values(bookings).filter(booking => booking.status)
    
    // Get total number of Fridays in the year
    const totalFridaysInYear = allFridays.length
    
    // Get remaining Fridays (future Fridays, including today if today is Friday)
    const remainingFridays = allFridays.filter(date => date >= today).length
    
    // Total bookings this year
    const totalBookings = bookingList.length
    
    // Completed bookings - count all with status "Completed" (case insensitive)
    const completedBookings = bookingList.filter(booking => {
      return booking.status.toLowerCase() === 'completed'
    }).length
    
    // Future bookings: only bookings from today onward, status not completed/cancelled by admin
    const activeBookings = bookingList.filter(booking => {
      const status = booking.status.toLowerCase()
      const bookingDate = new Date(booking.date + 'T00:00:00')
      return bookingDate >= today && status !== 'completed' && status !== 'cancelled by admin'
    }).length
    
    // Bookings until today
    const bookingsUntilToday = bookingList.filter(booking => {
      const bookingDate = new Date(booking.date + 'T00:00:00')
      return bookingDate <= today
    }).length
    
    // Cancelled bookings until today (case insensitive)
    const cancelledBookings = bookingList.filter(booking => {
      const bookingDate = new Date(booking.date + 'T00:00:00')
      const status = booking.status.toLowerCase()
      return bookingDate <= today && (
        status === 'cancelled by admin' || 
        status === 'cancelled by devotee'
      )
    }).length
    
    // Calculate percentages
    const fridaysUntilTodayCount = fridaysUntilToday.length
    const completionRate = fridaysUntilTodayCount > 0 ? ((completedBookings / fridaysUntilTodayCount) * 100).toFixed(1) : 0
    const bookingRate = fridaysUntilTodayCount > 0 ? ((bookingsUntilToday / fridaysUntilTodayCount) * 100).toFixed(1) : 0
    
    return {
      totalBookings,
      totalFridaysInYear,
      bookingsUntilToday,
      completedBookings,
      fridaysUntilTodayCount,
      cancelledBookings,
      activeBookings,
      remainingFridays,
      currentWeek,
      completionRate,
      bookingRate
    }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading statistics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Error loading statistics: {error.message}
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column align-items-center justify-content-center mb-2" style={{minHeight: '48px'}}>
        <h2 className="stats-title text-center stylish-heading mb-2">
          Booking Statistics {currentYear}
        </h2>
      </div>
      {/* Desktop View - Separate Cards */}
      <div className="d-none d-md-block">
        <div className="row g-2">
          {/* Total Bookings This Year */}
          <div className="col-md-4">
            
            <div className="card border-0 shadow-sm compact-stats-card stats-border-blue">
              <div className="card-body text-center py-2 px-2">
                <div className="stats-icon mb-2">
                  <i className="bi bi-calendar-event text-primary" style={{ fontSize: '1.4rem' }}></i>
                </div>
                <h5 className="stats-number text-primary mb-1">{stats.totalBookings}/{stats.totalFridaysInYear}</h5>
                <p className="stats-label text-muted mb-0 small">Total Bookings This Year</p>
              </div>
            </div>
          </div>
          {/* Completed Bookings */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm compact-stats-card stats-border-green">
              <div className="card-body text-center py-2 px-2">
                <div className="stats-icon mb-2">
                  <i className="bi bi-check-circle text-success" style={{ fontSize: '1.4rem' }}></i>
                </div>
                <h5 className="stats-number text-success mb-1">{stats.completedBookings}/{stats.fridaysUntilTodayCount}</h5>
                <p className="stats-label text-muted mb-0 small">Completed Bookings</p>
              </div>
            </div>
          </div>
          {/* Future Bookings */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm compact-stats-card stats-border-yellow">
              <div className="card-body text-center py-2 px-2">
                <div className="stats-icon mb-2">
                  <i className="bi bi-clock text-warning" style={{ fontSize: '1.4rem' }}></i>
                </div>
                <h5 className="stats-number text-warning mb-1">{stats.activeBookings}/{stats.remainingFridays}</h5>
                <p className="stats-label text-muted mb-0 small">Future Bookings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile View - Single Card */}
      <div className="d-md-none">
        <div className="card border-0 shadow-sm compact-stats-card stats-border-blue">
          <div className="card-body py-2 px-2">
            <div className="row g-2">
              {/* Total Bookings */}
              <div className="col-4">
                <div className="text-center">
                  <div className="stats-icon mb-1">
                    <i className="bi bi-calendar-event text-primary" style={{ fontSize: '1.1rem' }}></i>
                  </div>
                  <h6 className="stats-number text-primary mb-1">{stats.totalBookings}/{stats.totalFridaysInYear}</h6>
                  <p className="stats-label text-muted mb-0 xsmall">Total</p>
                </div>
              </div>
              {/* Completed Bookings */}
              <div className="col-4">
                <div className="text-center">
                  <div className="stats-icon mb-1">
                    <i className="bi bi-check-circle text-success" style={{ fontSize: '1.1rem' }}></i>
                  </div>
                  <h6 className="stats-number text-success mb-1">{stats.completedBookings}/{stats.fridaysUntilTodayCount}</h6>
                  <p className="stats-label text-muted mb-0 xsmall">Completed</p>
                </div>
              </div>
              {/* Future Bookings */}
              <div className="col-4">
                <div className="text-center">
                  <div className="stats-icon mb-1">
                    <i className="bi bi-clock text-warning" style={{ fontSize: '1.1rem' }}></i>
                  </div>
                  <h6 className="stats-number text-warning mb-1">{stats.activeBookings}/{stats.remainingFridays}</h6>
                  <p className="stats-label text-muted mb-0 xsmall">Future</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .stats-icon {
          transition: transform 0.3s ease;
        }
        .card:hover .stats-icon {
          transform: scale(1.1);
        }
        .compact-stats-card {
          min-height: 0;
          margin-bottom: 0.5rem;
          border-radius: 1.2rem !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.10);
          border-width: 2.5px !important;
        }
        .stats-border-blue {
          border: 2.5px solid #2193b0 !important;
        }
        .stats-border-green {
          border: 2.5px solid #56ab2f !important;
        }
        .stats-border-yellow {
          border: 2.5px solid #f7971e !important;
        }
        .stats-number {
          font-size: 1.2rem;
          font-weight: 700;
          line-height: 1;
        }
        .stats-label {
          font-size: 0.8rem;
          font-weight: 500;
        }
        .xsmall {
          font-size: 0.7rem;
        }
        @media (max-width: 768px) {
          .stats-number {
            font-size: 1rem;
          }
          .stats-label {
            font-size: 0.7rem;
          }
        }
        .stats-title {
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: 0.01em;
          background: linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }
        .stylish-heading {
          position: relative;
          display: inline-block;
          padding-bottom: 0.3rem;
        }
        .stylish-heading::after {
          content: '';
          display: block;
          margin: 0.3rem auto 0 auto;
          width: 60%;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%);
          opacity: 0.7;
        }
      `}</style>
    </div>
  )
}

export default AdminStats 