import { Routes, Route } from 'react-router-dom'
import Header from './components/header/Header'
import BookingList from './components/pooja-booking/BookingList'
import AdminPage from './components/admin/AdminPage'
import HomePage from './components/home/HomePage'
import AdminBookingManager from './components/pooja-booking/AdminBookingManager'
import MemberForm from './components/member-list/MemberForm'
import MemberList from './components/member-list/MemberList'
import MonthlyContribution from './components/contribution/MonthlyContribution'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/active-bookings" element={<ProtectedRoute><AdminBookingManager initialTab="active" showBack /></ProtectedRoute>} />
        <Route path="/admin/past-bookings" element={<ProtectedRoute><AdminBookingManager initialTab="past" showBack /></ProtectedRoute>} />
        <Route path="/admin/add-members" element={<ProtectedRoute><MemberForm showBack /></ProtectedRoute>} />
        <Route path="/admin/view-members" element={<ProtectedRoute><MemberList showBack /></ProtectedRoute>} />
        <Route path="/admin/contribution" element={<ProtectedRoute><MonthlyContribution /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App
