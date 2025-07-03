import React, { useEffect, useState } from 'react'
import { getFridaysOfYear } from '../../utils/getFridaysOfYear'
import { useFirestoreBooking } from '../../hooks/useFirestoreBooking'
import { useNavigate } from 'react-router-dom'

const STATUS = {
  REQUESTED: 'Requested',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  PENDING_PAYMENT: 'Pending Payment',
  PAYMENT_RECEIVED: 'Payment Received',
  SCHEDULED: 'Scheduled',
  COMPLETED: 'Completed',
  CANCELLED_BY_DEVOTEE: 'Cancelled by Devotee',
  CANCELLED_BY_ADMIN: 'Cancelled by Admin',
  FAILED_PAYMENT: 'Failed Payment',
  REFUND_INITIATED: 'Refund Initiated',
  REFUNDED: 'Refunded',
}

// type: 'active' | 'past'
const AdminBookingManager = ({ initialTab = 'active', showBack }) => {
  const currentYear = new Date().getFullYear()
  const today = new Date()
  const { bookings, loading, error, updateBookingStatus } = useFirestoreBooking(currentYear)
  const [toast, setToast] = useState('')
  const [activeTab] = useState(initialTab) // controlled by prop, no toggle
  const navigate = useNavigate()

  // Convert bookings object to array with date info
  const bookingList = Object.entries(bookings)
    .map(([dateStr, booking]) => ({
      ...booking,
      dateStr,
      date: new Date(dateStr),
    }))
    .filter(booking => booking.status) // Only include bookings with valid status

  // Filter bookings based on activeTab (from prop)
  const filteredBookings = bookingList.filter(b => {
    if (activeTab === 'active') {
      // Show future bookings that are not completed or cancelled
      return b.date >= today && 
             !b.status.includes('Completed') && 
             !b.status.includes('Cancelled') &&
             !b.status.includes('Refunded')
    } else {
      // Show past bookings, completed, or cancelled
      return b.date < today || 
             b.status.includes('Completed') || 
             b.status.includes('Cancelled') ||
             b.status.includes('Refunded')
    }
  }).sort((a, b) => a.date - b.date)

  // Mark as Under Review
  const handleUnderReview = async (booking) => {
    try {
      await updateBookingStatus(booking.id, STATUS.UNDER_REVIEW)
      setToast(`Booking for ${booking.name} marked as Under Review`)
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Error updating booking status.')
    }
  }

  // Approve booking
  const handleApprove = async (booking) => {
    try {
      await updateBookingStatus(booking.id, STATUS.APPROVED)
      setToast(`Booking for ${booking.name} approved!`)
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Error approving booking.')
    }
  }

  // Mark as Pending Payment
  const handlePendingPayment = async (booking) => {
    try {
      await updateBookingStatus(booking.id, STATUS.PENDING_PAYMENT)
      setToast(`Booking for ${booking.name} marked as Pending Payment`)
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Error updating payment status.')
    }
  }

  // Mark Payment as Received
  const handlePaymentReceived = async (booking) => {
    try {
      await updateBookingStatus(booking.id, STATUS.PAYMENT_RECEIVED)
      setToast(`Payment received for ${booking.name}`)
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Error updating payment status.')
    }
  }

  // Mark as Scheduled
  const handleScheduled = async (booking) => {
    try {
      await updateBookingStatus(booking.id, STATUS.SCHEDULED)
      setToast(`Booking for ${booking.name} marked as Scheduled`)
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Error updating booking status.')
    }
  }

  // Mark as Completed
  const handleCompleted = async (booking) => {
    try {
      await updateBookingStatus(booking.id, STATUS.COMPLETED)
      setToast(`Booking for ${booking.name} marked as Completed`)
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Error updating booking status.')
    }
  }

  // Cancel by Admin
  const handleCancelByAdmin = async (booking) => {
    try {
      await updateBookingStatus(booking.id, STATUS.CANCELLED_BY_ADMIN)
      setToast(`Booking for ${booking.name} cancelled by admin`)
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Error cancelling booking.')
    }
  }

  // Mark as Failed Payment
  const handleFailedPayment = async (booking) => {
    try {
      await updateBookingStatus(booking.id, STATUS.FAILED_PAYMENT)
      setToast(`Payment failed for ${booking.name}`)
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Error updating payment status.')
    }
  }

  // Initiate Refund
  const handleRefundInitiated = async (booking) => {
    try {
      await updateBookingStatus(booking.id, STATUS.REFUND_INITIATED)
      setToast(`Refund initiated for ${booking.name}`)
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Error updating refund status.')
    }
  }

  // Mark as Refunded
  const handleRefunded = async (booking) => {
    try {
      await updateBookingStatus(booking.id, STATUS.REFUNDED)
      setToast(`Refund completed for ${booking.name}`)
      setTimeout(() => setToast(''), 3000)
    } catch {
      setToast('Error updating refund status.')
    }
  }

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case STATUS.REQUESTED: return 'info'
      case STATUS.UNDER_REVIEW: return 'warning'
      case STATUS.APPROVED: return 'primary'
      case STATUS.PENDING_PAYMENT: return 'warning'
      case STATUS.PAYMENT_RECEIVED: return 'success'
      case STATUS.SCHEDULED: return 'success'
      case STATUS.COMPLETED: return 'success'
      case STATUS.CANCELLED_BY_DEVOTEE: return 'danger'
      case STATUS.CANCELLED_BY_ADMIN: return 'danger'
      case STATUS.FAILED_PAYMENT: return 'danger'
      case STATUS.REFUND_INITIATED: return 'warning'
      case STATUS.REFUNDED: return 'secondary'
      default: return 'secondary'
    }
  }

  // Get available actions for a booking
  const getAvailableActions = (booking) => {
    const actions = []

    switch (booking.status) {
      case STATUS.REQUESTED:
        actions.push(
          <div key="requested-actions" className="d-flex flex-row action-row-mobile-compact w-100">
            <button className="btn btn-warning btn-xs flex-fill" style={{ minWidth: 0, fontSize: '0.68rem', padding: '0.25rem 0.2rem' }} onClick={() => handleUnderReview(booking)}>
              Under Review
            </button>
            <button className="btn btn-success btn-xs flex-fill" style={{ minWidth: 0, fontSize: '0.68rem', padding: '0.25rem 0.2rem', marginLeft: '2px', marginRight: '2px' }} onClick={() => handleApprove(booking)}>
              Approve
            </button>
            <button className="btn btn-danger btn-xs flex-fill" style={{ minWidth: 0, fontSize: '0.68rem', padding: '0.25rem 0.2rem' }} onClick={() => handleCancelByAdmin(booking)}>
              Cancel
            </button>
          </div>
        )
        break

      case STATUS.UNDER_REVIEW:
        actions.push(
          <button key="approve" className="btn btn-success btn-sm me-2" onClick={() => handleApprove(booking)}>
            Approve
          </button>,
          <button key="cancel" className="btn btn-danger btn-sm" onClick={() => handleCancelByAdmin(booking)}>
            Cancel
          </button>
        )
        break

      case STATUS.APPROVED:
        actions.push(
          <button key="pending-payment" className="btn btn-warning btn-sm me-2" onClick={() => handlePendingPayment(booking)}>
            Pending Payment
          </button>,
          <button key="cancel" className="btn btn-danger btn-sm" onClick={() => handleCancelByAdmin(booking)}>
            Cancel
          </button>
        )
        break

      case STATUS.PENDING_PAYMENT:
        actions.push(
          <button key="payment-received" className="btn btn-success btn-sm me-2" onClick={() => handlePaymentReceived(booking)}>
            Payment Received
          </button>,
          <button key="failed-payment" className="btn btn-danger btn-sm me-2" onClick={() => handleFailedPayment(booking)}>
            Failed Payment
          </button>,
          <button key="cancel" className="btn btn-danger btn-sm" onClick={() => handleCancelByAdmin(booking)}>
            Cancel
          </button>
        )
        break

      case STATUS.PAYMENT_RECEIVED:
        actions.push(
          <button key="scheduled" className="btn btn-success btn-sm me-2" onClick={() => handleScheduled(booking)}>
            Mark Scheduled
          </button>,
          <button key="refund" className="btn btn-warning btn-sm" onClick={() => handleRefundInitiated(booking)}>
            Initiate Refund
          </button>
        )
        break

      case STATUS.SCHEDULED:
        actions.push(
          <button key="completed" className="btn btn-success btn-sm me-2" onClick={() => handleCompleted(booking)}>
            Mark Completed
          </button>,
          <button key="refund" className="btn btn-warning btn-sm" onClick={() => handleRefundInitiated(booking)}>
            Initiate Refund
          </button>
        )
        break

      case STATUS.FAILED_PAYMENT:
        actions.push(
          <button key="pending-payment" className="btn btn-warning btn-sm me-2" onClick={() => handlePendingPayment(booking)}>
            Retry Payment
          </button>,
          <button key="cancel" className="btn btn-danger btn-sm" onClick={() => handleCancelByAdmin(booking)}>
            Cancel
          </button>
        )
        break

      case STATUS.REFUND_INITIATED:
        actions.push(
          <button key="refunded" className="btn btn-success btn-sm" onClick={() => handleRefunded(booking)}>
            Mark Refunded
          </button>
        )
        break
    }

    return actions
  }

  if (loading) return <div className="container mt-4">Loading bookings...</div>
  if (error) return <div className="container mt-4 text-danger">Error: {error.message}</div>

  return (
    <div className="container mt-4">
      {showBack && (
        <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin')}>
          &larr; Back
        </button>
      )}
      <h2 className="mb-4">Booking Manager</h2>
      
      {/* Desktop Table View */}
      <div className="d-none d-lg-block">
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Date</th>
                <th>Status</th>
                {activeTab === 'active' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={activeTab === 'active' ? 5 : 4} className="text-center text-muted">No bookings found.</td>
                </tr>
              )}
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.name}</td>
                  <td>{b.phone}</td>
                  <td>{b.date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  {activeTab === 'active' && (
                    <td>
                      {getAvailableActions(b)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="d-lg-none">
        {filteredBookings.length === 0 && (
          <div className="text-center text-muted py-4">No bookings found.</div>
        )}
        <div className="row g-3">
          {filteredBookings.map((b) => {
            // Determine card style for past bookings
            let cardClass = 'card border-0 shadow-sm admin-booking-card';
            let ribbon = null;
            if (activeTab === 'past') {
              if (b.status.toLowerCase().includes('completed')) {
                cardClass += ' past-completed';
                ribbon = <span className="ribbon ribbon-success">Completed</span>;
              } else if (b.status.toLowerCase().includes('cancelled')) {
                cardClass += ' past-cancelled';
                ribbon = <span className="ribbon ribbon-danger">Cancelled</span>;
              } else if (b.status.toLowerCase().includes('refunded')) {
                cardClass += ' past-refunded';
                ribbon = <span className="ribbon ribbon-secondary">Refunded</span>;
              } else {
                cardClass += ' past-other';
              }
            }
            return (
              <div key={b.id} className="col-12">
                <div className={cardClass}>
                  {ribbon}
                  <div className="card-body p-3">
                    <div className="row align-items-start">
                      <div className="col-12 col-sm-8">
                        <div className="d-flex flex-column">
                          <h6 className="mb-1 fw-bold text-primary">{b.name}</h6>
                          <small className="text-muted mb-1">
                            <i className="bi bi-telephone me-1"></i>
                            {b.phone}
                          </small>
                          <small className="text-muted mb-2">
                            <i className="bi bi-calendar me-1"></i>
                            {b.date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </small>
                          <span className={`badge bg-${getStatusColor(b.status)} align-self-start`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                      {activeTab === 'active' && (
                        <div className="col-12 col-sm-4 mt-3 mt-sm-0">
                          <div className="d-flex flex-column gap-1">
                            {getAvailableActions(b).map((action, index) => (
                              <div key={index} className="w-100">
                                {React.cloneElement(action, {
                                  className: action.props.className.replace('btn-sm me-2', 'btn-sm w-100 mb-1'),
                                  style: { fontSize: '0.75rem', padding: '0.375rem 0.5rem' }
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdminBookingManager

// Add custom styles for mobile responsiveness
const styles = `
  @media (max-width: 991px) {
    .admin-booking-card {
      transition: transform 0.2s ease;
      margin-bottom: 0.5rem;
    }
    
    .admin-booking-card:hover {
      transform: translateY(-2px);
    }
    
    .admin-booking-card .card-body {
      padding: 1rem;
    }
    
    .admin-booking-card .btn {
      font-size: 0.75rem !important;
      padding: 0.5rem 0.75rem !important;
      white-space: nowrap;
      min-height: 38px;
    }
    
    .admin-booking-card .badge {
      font-size: 0.7rem;
      padding: 0.375rem 0.5rem;
    }
  }
  
  @media (max-width: 576px) {
    .admin-booking-card .card-body {
      padding: 0.75rem;
    }
    
    .admin-booking-card h6 {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    
    .admin-booking-card small {
      font-size: 0.75rem;
      line-height: 1.3;
    }
    
    .admin-booking-card .btn {
      font-size: 0.7rem !important;
      padding: 0.5rem 0.5rem !important;
      min-height: 36px;
    }
    
    .admin-booking-card .badge {
      font-size: 0.65rem;
      padding: 0.25rem 0.375rem;
    }
    
    .admin-booking-card .row {
      margin: 0;
    }
    
    .admin-booking-card .col-12 {
      padding: 0;
    }
  }
  
  @media (max-width: 480px) {
    .admin-booking-card .card-body {
      padding: 0.5rem;
    }
    
    .admin-booking-card h6 {
      font-size: 0.85rem;
    }
    
    .admin-booking-card small {
      font-size: 0.7rem;
    }
    
    .admin-booking-card .btn {
      font-size: 0.65rem !important;
      padding: 0.375rem 0.375rem !important;
      min-height: 32px;
    }
  }
  
  .action-row-mobile-compact {
    gap: 0 !important;
  }
  .action-row-mobile-compact > .btn {
    min-width: 0 !important;
    flex: 1 1 0;
    font-size: 0.68rem !important;
    padding: 0.25rem 0.2rem !important;
    margin: 0 !important;
    border-radius: 0.3rem !important;
  }
  .past-completed {
    background: linear-gradient(90deg, #e0ffe0 0%, #f8f9fa 100%);
    opacity: 0.95;
    position: relative;
  }
  .past-cancelled {
    background: linear-gradient(90deg, #ffe0e0 0%, #f8f9fa 100%);
    opacity: 0.95;
    position: relative;
  }
  .past-refunded {
    background: linear-gradient(90deg, #e0e0ff 0%, #f8f9fa 100%);
    opacity: 0.95;
    position: relative;
  }
  .ribbon {
    position: absolute;
    top: 0.5rem;
    right: -0.5rem;
    padding: 0.2rem 0.8rem;
    font-size: 0.7rem;
    font-weight: 700;
    color: #fff;
    border-radius: 0.5rem;
    z-index: 2;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  .ribbon-success { background: #28a745; }
  .ribbon-danger { background: #dc3545; }
  .ribbon-secondary { background: #6c757d; }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
} 