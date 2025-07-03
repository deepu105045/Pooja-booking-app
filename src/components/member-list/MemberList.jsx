import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirestoreMembers } from '../../hooks/useFirestoreMembers';

const MemberList = ({ showBack }) => {
  const { members, loading, error, updateMember } = useFirestoreMembers();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', familyName: '', phone: '', isMonthlyContributor: false });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const navigate = useNavigate();

  const handleEdit = (member) => {
    setEditingId(member.id);
    setEditForm({ name: member.name, familyName: member.familyName || '', phone: member.phone || '', isMonthlyContributor: member.isMonthlyContributor });
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', familyName: '', phone: '', isMonthlyContributor: false });
    setEditError('');
  };

  const handleSaveEdit = async () => {
    setEditLoading(true);
    setEditError('');
    if (!editForm.familyName.trim()) {
      setEditError('Family Name is required.');
      setEditLoading(false);
      return;
    }
    if (!editForm.name.trim()) {
      setEditError('Name is required.');
      setEditLoading(false);
      return;
    }
    try {
      await updateMember(editingId, editForm);
      setEditingId(null);
      setEditForm({ name: '', familyName: '', phone: '', isMonthlyContributor: false });
    } catch (err) {
      setEditError('Failed to update member.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <div className="container mt-4">
      {showBack && (
        <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin')}>
          &larr; Back
        </button>
      )}
      <h5 className="mb-3">Members</h5>
      {loading && <div className="text-muted">Loading members...</div>}
      {error && <div className="alert alert-danger">Failed to load members.</div>}
      {!loading && !error && (
        <div className="row g-3">
          {members.length === 0 && (
            <div className="col-12 text-center text-muted">No members found.</div>
          )}
          {members.map((m) => (
            <div className="col-12 col-md-6 col-lg-4" key={m.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  {editingId === m.id ? (
                    <form onSubmit={e => { e.preventDefault(); handleSaveEdit(); }}>
                      <div className="mb-2">
                        <label className="form-label mb-1">Family Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="familyName"
                          value={editForm.familyName}
                          onChange={handleEditChange}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label mb-1">Name</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          required
                        />
                      </div>
                      <div className="mb-2">
                        <label className="form-label mb-1">Phone <span className="text-muted">(optional)</span></label>
                        <input
                          type="tel"
                          className="form-control form-control-sm"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="isMonthlyContributor"
                          checked={editForm.isMonthlyContributor}
                          onChange={handleEditChange}
                        />
                        <label className="form-check-label ms-1">Monthly Contributor</label>
                      </div>
                      <div className="btn-group btn-group-sm w-100 mb-2">
                        <button
                          className="btn btn-success"
                          type="submit"
                          disabled={editLoading}
                        >
                          {editLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          className="btn btn-secondary"
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={editLoading}
                        >
                          Cancel
                        </button>
                      </div>
                      {editError && <div className="alert alert-danger py-1 mb-0">{editError}</div>}
                    </form>
                  ) : (
                    <>
                      <div className="d-flex align-items-center mb-2">
                        <span className="badge bg-primary me-2">{m.familyName || <span className="text-muted">No Family</span>}</span>
                        <span className="fw-bold">{m.name}</span>
                      </div>
                      <div className="mb-1">
                        <i className="bi bi-telephone me-1 text-muted"></i>
                        <span className="text-muted small">{m.phone || <span className="text-muted">No phone</span>}</span>
                      </div>
                      <div className="mb-2">
                        {m.isMonthlyContributor ? (
                          <span className="badge bg-success">Monthly Contributor</span>
                        ) : (
                          <span className="badge bg-secondary">Not a Contributor</span>
                        )}
                      </div>
                      <button
                        className="btn btn-outline-primary btn-sm w-100"
                        onClick={() => handleEdit(m)}
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberList; 