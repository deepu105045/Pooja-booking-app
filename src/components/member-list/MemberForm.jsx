import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirestoreMembers } from '../../hooks/useFirestoreMembers';

const MemberForm = ({ showBack }) => {
  const { addMember } = useFirestoreMembers();
  const [form, setForm] = useState({ name: '', familyName: '', phone: '', isMonthlyContributor: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    if (!form.familyName.trim()) {
      setError('Family Name is required.');
      setLoading(false);
      return;
    }
    if (!form.name.trim()) {
      setError('Name is required.');
      setLoading(false);
      return;
    }
    try {
      await addMember(form);
      setSuccess('Member added successfully!');
      setForm({ name: '', familyName: '', phone: '', isMonthlyContributor: false });
    } catch (err) {
      setError('Failed to add member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      {showBack && (
        <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin')}>
          &larr; Back
        </button>
      )}
      <h5 className="mb-3">Add New Member</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Family Name</label>
          <input type="text" className="form-control" name="familyName" value={form.familyName} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone Number <span className="text-muted">(optional)</span></label>
          <input type="tel" className="form-control" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" name="isMonthlyContributor" id="isMonthlyContributor" checked={form.isMonthlyContributor} onChange={handleChange} />
          <label className="form-check-label" htmlFor="isMonthlyContributor">
            Monthly Contributor
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Adding...' : 'Add Member'}
        </button>
        {success && <div className="alert alert-success mt-3">{success}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default MemberForm; 