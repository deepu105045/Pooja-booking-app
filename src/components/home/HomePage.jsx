import { motion } from 'framer-motion'
import BookingList from '../pooja-booking/BookingList'
// import MemberList from '../member-list/MemberList'
// import PoojaEvents from '../pooja-events/PoojaEvents'

const HomePage = () => {
  return (
    <div className="home-page">
      <BookingList />
      <style jsx>{`
        .home-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
        }
        @media (max-width: 768px) {
          .home-page {
            min-height: 100vh;
          }
        }
      `}</style>
    </div>
  )
}

export default HomePage 