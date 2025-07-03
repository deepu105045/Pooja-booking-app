import { useEffect, useState } from 'react'
import { getFridaysOfYear } from '../../utils/getFridaysOfYear'
import { malayalamCalendar2025 } from '../../utils/malayalamCalendar2025'
import { useFirestoreBooking } from '../../hooks/useFirestoreBooking'

const BookingList = () => {
  const currentYear = new Date().getFullYear()
  const today = new Date()
  const [fridays, setFridays] = useState([])
  const [activeBooking, setActiveBooking] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [toastMessage, setToastMessage] = useState('')

  const { bookings, loading, error, addBooking } = useFirestoreBooking(currentYear)

  useEffect(() => {
    setFridays(getFridaysOfYear(currentYear))
  }, [currentYear])

  // Helper to get Malayalam month & Nakshatra for a date
  const getMalayalamInfo = (date) => {
    const dateStr = date.toISOString().slice(0, 10) // YYYY-MM-DD
    const info = malayalamCalendar2025[dateStr]
    return info || { month: '-', nakshatra: '-' }
  }

  // Only show Fridays from today onward
  const futureFridays = fridays.filter(date => date >= today)

  const handleBookClick = (date) => {
    setActiveBooking(date)
    setFormData({ name: '', phone: '' })
  }

  const handleCancel = () => setActiveBooking(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dateStr = activeBooking.toISOString().slice(0, 10)
      await addBooking(dateStr, formData.name, formData.phone, "Requested")
      setToastMessage(`🙏 ${formData.name} reserved pooja on ${activeBooking.toDateString()}`)
      setActiveBooking(null)
      setTimeout(() => setToastMessage(''), 4000)
    } catch {
      setToastMessage('❌ Error saving booking. Please try again.')
    }
  }

  if (loading) return (
    <div className="booking-list-section">
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading bookings...</p>
        </div>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="booking-list-section">
      <div className="container">
        <div className="text-center py-5">
          <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3 text-danger">Error: {error.message}</p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="booking-list-section">
      <div className="container">
        {/* Toast Message */}
        {toastMessage && (
          <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1200 }}>
            <div className="toast show align-items-center text-bg-success border-0" role="alert">
              <div className="d-flex">
                <div className="toast-body">{toastMessage}</div>
                <button
                  type="button"
                  className="btn-close btn-close-white me-2 m-auto"
                  onClick={() => setToastMessage('')}
                ></button>
              </div>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="row">
          <div className="col-12">
            <div className="section-header text-center mb-4">
              <span className="cute-friday-label px-3 py-1">
                <i className="bi bi-calendar-heart me-1"></i>
                All Upcoming Friday Poojas {currentYear}
              </span>
            </div>
          </div>
        </div>

        {/* Flat List of Friday Poojas */}
        <div className="booking-list-responsive">
          {futureFridays.map((date) => {
            const dateStr = date.toISOString().slice(0, 10)
            const booking = bookings[dateStr]
            const malInfo = getMalayalamInfo(date)
            const isBooked = booking && booking.status && booking.status !== 'Cancelled by Admin'
            return (
              <div className="pooja-card" key={dateStr}>
                <div className="pooja-date">
                  <div className="day">{date.getDate()}</div>
                  <div className="month">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                </div>
                <div className="pooja-info">
                  <div className="malayalam-month">{malInfo.month}</div>
                  <div className="nakshatra">{malInfo.nakshatra}</div>
                </div>
                <div className="pooja-action fixed-action-height d-flex align-items-center justify-content-center">
                  {isBooked ? (
                    <span className="badge bg-secondary booked-badge-custom text-center d-block p-2">
                      Booked<br />
                      <span style={{ fontSize: '0.85em', fontWeight: 400 }}>By</span><br />
                      <span style={{ fontWeight: 600 }}>{booking?.name || ''}</span>
                    </span>
                  ) : activeBooking?.toDateString() === date.toDateString() ? (
                    <form className="booking-form d-flex flex-column gap-2" onSubmit={handleSubmit} style={{minWidth: 180}}>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                      <input
                        type="tel"
                        className="form-control form-control-sm"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                      <div className="d-flex gap-2">
                        <button className="btn btn-success btn-sm flex-fill" type="submit">
                          Confirm
                        </button>
                        <button className="btn btn-secondary btn-sm flex-fill" type="button" onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      className="book-pooja-btn"
                      onClick={() => handleBookClick(date)}
                    >
                      Book Pooja
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <style jsx>{`
          .booking-list-section {
            padding: 2rem 0 3rem 0;
            background: #f8f8f8;
          }
          .pooja-card {
            display: flex;
            align-items: center;
            max-width: 360px;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            width: 100%;
            min-height: 100px;
            max-height: 100px;
            height: 100px;
          }
          .pooja-date {
            background: #3b5998;
            color: #fff;
            padding: 16px;
            text-align: center;
            width: 100px;
          }
          .pooja-date .day {
            font-size: 36px;
            font-weight: bold;
            line-height: 1;
          }
          .pooja-date .month {
            font-size: 16px;
            text-transform: uppercase;
            font-weight: bold;
          }
          .pooja-info {
            flex: 1;
            padding: 12px 16px;
          }
          .pooja-info .malayalam-month,
          .pooja-info .nakshatra {
            margin: 4px 0;
            font-size: 14px;
            color: #333;
          }
          .pooja-action.fixed-action-height {
            min-width: 120px;
            min-height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .pooja-action button.book-pooja-btn {
            background: linear-gradient(90deg, #2193b0 0%, #6dd5ed 100%);
            color: #fff;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s, box-shadow 0.2s;
            box-shadow: 0 2px 8px rgba(33,147,176,0.08);
          }
          .pooja-action button.book-pooja-btn:hover {
            background: linear-gradient(90deg, #6dd5ed 0%, #2193b0 100%);
            box-shadow: 0 4px 16px rgba(33,147,176,0.13);
          }
          .pooja-action .badge, .booked-badge-custom {
            font-size: 14px;
            padding: 10px 18px;
            border-radius: 8px;
            background: linear-gradient(90deg, #56ab2f 0%, #a8e063 100%) !important;
            color: #fff !important;
            box-shadow: 0 2px 8px rgba(86,171,47,0.08);
          }
          .pooja-action .book-pooja-btn {
            padding: 0 12px;
          }
          .pooja-action .booking-form {
            min-width: 180px;
          }
          .booking-list-responsive {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.1rem;
          }
          @media (min-width: 768px) {
            .booking-list-responsive {
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: flex-start;
              align-items: stretch;
              gap: 1.5rem;
            }
            .pooja-card {
              margin: 0;
              flex: 1 1 320px;
              max-width: 340px;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default BookingList 