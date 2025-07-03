import React, { useState } from 'react';
import { useFirestoreMembers } from '../../hooks/useFirestoreMembers';
import { useFirestoreContributions } from '../../hooks/useFirestoreContributions';

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const getCurrentYear = () => new Date().getFullYear();

const MonthlyContribution = () => {
  const year = getCurrentYear();
  const { members, loading: membersLoading, error: membersError } = useFirestoreMembers();
  const { contributions, loading: contribLoading, error: contribError, addOrUpdateContribution, refetch } = useFirestoreContributions(year);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ memberId: '', month: '', amount: '' });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Only monthly contributors
  const monthlyContributors = members
    .filter(m => m.isMonthlyContributor)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

  const openModal = (memberId, month, currentAmount) => {
    setModalData({ memberId, month, amount: currentAmount || '' });
    setModalError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData({ memberId: '', month: '', amount: '' });
    setModalError('');
  };

  const handleModalChange = (e) => {
    setModalData(d => ({ ...d, [e.target.name]: e.target.value }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError('');
    try {
      await addOrUpdateContribution({
        memberId: modalData.memberId,
        year,
        month: modalData.month,
        amount: modalData.amount,
      });
      await refetch();
      closeModal();
    } catch (err) {
      setModalError('Failed to save contribution.');
    } finally {
      setModalLoading(false);
    }
  };

  // Calculate total amount received for the year
  const totalReceived = Object.values(contributions).reduce((sum, memberContribs) => {
    return (
      sum +
      Object.values(memberContribs || {}).reduce((memberSum, contrib) => {
        const amount = Number(contrib.amount) || 0;
        return memberSum + amount;
      }, 0)
    );
  }, 0);

  return (
    <div className="container mt-4 mb-5">
      <h5 className="mb-3 d-flex justify-content-between align-items-center">
        Monthly Contributions ({year})
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            if (monthlyContributors.length > 0) openModal(monthlyContributors[0].id, months[0], '');
          }}
        >
          <i className="bi bi-plus-lg me-1"></i> Add/Edit Contribution
        </button>
      </h5>
      {/* Total Amount Received */}
      {!membersLoading && !contribLoading && (
        <div className="alert alert-info fw-bold mb-3" style={{ fontSize: '1.1rem' }}>
          Total Received: <span className="text-success">₹{totalReceived}</span>
        </div>
      )}
      {(membersLoading || contribLoading) && <div className="text-muted">Loading...</div>}
      {(membersError || contribError) && <div className="alert alert-danger">Failed to load data.</div>}
      {!membersLoading && !contribLoading && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle contrib-table">
            <thead className="table-light sticky-top">
              <tr>
                <th>Member</th>
                {months.map((m, idx) => (
                  <th key={m}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyContributors.length === 0 && (
                <tr><td colSpan={13} className="text-center text-muted">No monthly contributors found.</td></tr>
              )}
              {monthlyContributors.map(member => (
                <tr key={member.id}>
                  <td>
                    <span className="fw-bold">{member.name}</span>
                    <br />
                    <span className="badge bg-primary">{member.familyName}</span>
                  </td>
                  {months.map((month, idx) => {
                    const contrib = contributions[member.id]?.[month] || null;
                    return (
                      <td key={month} className="contrib-cell position-relative">
                        {contrib ? (
                          <span className="badge bg-success">₹{contrib.amount}</span>
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                        <button
                          className="btn btn-link btn-sm p-0 contrib-edit-btn"
                          title={contrib ? 'Edit Contribution' : 'Add Contribution'}
                          onClick={() => openModal(member.id, month, contrib?.amount)}
                        >
                          <i className={`bi ${contrib ? 'bi-pencil' : 'bi-plus-circle'} ms-1`}></i>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit Contribution */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleModalSubmit}>
                <div className="modal-header">
                  <h6 className="modal-title">{modalData.amount ? 'Edit' : 'Add'} Contribution</h6>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Member</label>
                    <select className="form-select" name="memberId" value={modalData.memberId} onChange={handleModalChange} required>
                      {monthlyContributors.map(m => (
                        <option key={m.id} value={m.id}>{m.name} ({m.familyName})</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Month</label>
                    <select className="form-select" name="month" value={modalData.month} onChange={handleModalChange} required>
                      {months.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Amount (₹)</label>
                    <input type="number" className="form-control" name="amount" value={modalData.amount} onChange={handleModalChange} min="0" required />
                  </div>
                  {modalError && <div className="alert alert-danger py-1 mb-0">{modalError}</div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={modalLoading}>
                    {modalLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .contrib-table th, .contrib-table td {
          text-align: center;
          vertical-align: middle;
          padding: 0.5rem;
        }
        .contrib-edit-btn {
          position: absolute;
          right: 0.25rem;
          top: 0.25rem;
          color: #007bff;
          background: none;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default MonthlyContribution; 