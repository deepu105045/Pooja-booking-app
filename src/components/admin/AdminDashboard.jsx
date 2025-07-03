import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, History, UserPlus, Users, IndianRupee } from 'lucide-react';
import AdminBookingManager from '../pooja-booking/AdminBookingManager';
import MemberForm from '../member-list/MemberForm';
import MemberList from '../member-list/MemberList';
import MonthlyContribution from '../contribution/MonthlyContribution';

const Placeholder = ({ title }) => (
  <div className="container mt-4">
    <div className="alert alert-info text-center">{title} section coming soon!</div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Tile data
  const tiles = [
    {
      key: 'active',
      title: 'Active Bookings',
      icon: 'bi-calendar-check',
      gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)', // blue
      url: '/admin/active-bookings',
      lucideIcon: CalendarCheck,
    },
    {
      key: 'past',
      title: 'Past Bookings',
      icon: 'bi-calendar-x',
      gradient: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)', // pink
      url: '/admin/past-bookings',
      lucideIcon: History,
    },
    {
      key: 'add-members',
      title: 'Add Members',
      icon: 'bi-person-plus',
      gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)', // green
      url: '/admin/add-members',
      lucideIcon: UserPlus,
    },
    {
      key: 'view-members',
      title: 'View Members',
      icon: 'bi-people',
      gradient: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)', // purple/teal
      url: '/admin/view-members',
      lucideIcon: Users,
    },
    {
      key: 'contribution',
      title: 'Monthly Contribution',
      icon: 'bi-cash-stack',
      gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', // orange/yellow
      url: '/admin/contribution',
      lucideIcon: IndianRupee,
    },
  ];

  return (
    <div className="container mt-4">
      {/* Mobile 2x2 grid */}
      <div className="d-md-none">
        <div className="row g-3">
          {tiles.map((tile, idx) => (
            <div className="col-6" key={tile.key}>
              <div
                className="card shadow-sm border-0 dashboard-tile text-white text-center clickable position-relative"
                style={{
                  cursor: 'pointer',
                  minHeight: 100,
                  maxHeight: 140,
                  background: tile.gradient,
                  borderRadius: '1.2rem',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                }}
                onClick={() => navigate(tile.url)}
              >
                {/* Watermark icon */}
                {tile.lucideIcon ? (
                  <tile.lucideIcon className="dashboard-tile-watermark" size={64} color="white" style={{opacity:0.18}} />
                ) : (
                  <i className={`bi ${tile.icon} dashboard-tile-watermark`}></i>
                )}
                <div className="card-body d-flex flex-column justify-content-center align-items-center p-2">
                  <span className="dashboard-icon-wrapper mb-2">
                    {tile.lucideIcon ? (
                      <tile.lucideIcon size={36} color="white" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))'}} />
                    ) : (
                      <i className={`bi ${tile.icon}`} style={{ fontSize: '2.2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))' }}></i>
                    )}
                  </span>
                  <span className="fw-bold text-wrap text-break dashboard-tile-label" style={{ fontSize: '1.08rem', lineHeight: 1.15 }}>{tile.title}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="row g-3 d-none d-md-flex mb-3">
        {tiles.map(tile => (
          <div className="col-6 col-lg-3" key={tile.key}>
            <div
              className="card shadow-sm border-0 h-100 dashboard-tile text-white text-center clickable position-relative"
              style={{
                cursor: 'pointer',
                minHeight: 110,
                maxHeight: 150,
                background: tile.gradient,
                borderRadius: '1.2rem',
                boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
              }}
              onClick={() => navigate(tile.url)}
            >
              {/* Watermark icon */}
              {tile.lucideIcon ? (
                <tile.lucideIcon className="dashboard-tile-watermark" size={72} color="white" style={{opacity:0.18}} />
              ) : (
                <i className={`bi ${tile.icon} dashboard-tile-watermark`}></i>
              )}
              <div className="card-body d-flex flex-column justify-content-center align-items-center p-2">
                <span className="dashboard-icon-wrapper mb-2">
                  {tile.lucideIcon ? (
                    <tile.lucideIcon size={40} color="white" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))'}} />
                  ) : (
                    <i className={`bi ${tile.icon}`} style={{ fontSize: '2.3rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))' }}></i>
                  )}
                </span>
                <span className="fw-bold text-wrap text-break dashboard-tile-label" style={{ fontSize: '1.12rem', lineHeight: 1.15 }}>{tile.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .dashboard-tile {
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .dashboard-tile:hover {
          transform: translateY(-6px) scale(1.04);
          box-shadow: 0 1rem 2rem rgba(0,0,0,0.18);
          filter: brightness(1.08);
        }
        .dashboard-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3.5rem;
          height: 3.5rem;
          background: rgba(255,255,255,0.10);
          border-radius: 50%;
          margin-bottom: 0.2rem;
        }
        .dashboard-tile-label {
          text-shadow: 0 1px 2px rgba(0,0,0,0.10);
        }
        .dashboard-tile-watermark {
          position: absolute;
          right: 0.5rem;
          bottom: 0.3rem;
          font-size: 3.8rem;
          color: rgba(255,255,255,0.18);
          pointer-events: none;
          z-index: 0;
          filter: blur(0.5px);
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard; 