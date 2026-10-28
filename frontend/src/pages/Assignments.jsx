import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getAssignments, createAssignment, updateAssignment, deleteAssignment
} from '../api';
import {
  MdAdd, MdEdit, MdDelete, MdCheckCircle, MdRadioButtonUnchecked,
  MdFilterList, MdClose
} from 'react-icons/md';

const EMPTY_FORM = {
  title: '', subject: '', description: '', dueDate: '', priority: 'medium', status: 'pending'
};

function AssignmentModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (initial?._id) {
        const res = await updateAssignment(initial._id, form);
        onSave(res.data.data, 'update');
        toast.success('Assignment updated!');
      } else {
        const res = await createAssignment(form);
        onSave(res.data.data, 'create');
        toast.success('Assignment added!');
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{initial?._id ? 'Edit Assignment' : 'New Assignment'}</h2>
          <button className="modal-close" onClick={onClose}><MdClose /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Math Chapter 5 Problems" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Subject *</label>
              <input className="form-control" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="e.g. Mathematics" required />
            </div>
            <div className="form-group">
              <label>Due Date *</label>
              <input type="date" className="form-control" value={form.dueDate ? form.dueDate.slice(0, 10) : ''} onChange={e => set('dueDate', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select className="form-control" value={form.priority} onChange={e => set('priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional notes..." />
          </div>
          <div className="flex gap-8" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : initial?._id ? 'Update' : 'Add Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AssignmentCard({ a, onEdit, onDelete, onToggle }) {
  const now = new Date();
  const due = new Date(a.dueDate);
  const overdue = a.status === 'pending' && due < now;

  const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

  return (
    <div className={`assignment-card ${a.status === 'completed' ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
      <div className="assignment-card-header">
        <div className={`assignment-card-title ${a.status === 'completed' ? 'completed' : ''}`}>{a.title}</div>
        <span className={`badge badge-${a.priority}`}>{a.priority}</span>
      </div>
      {a.description && <p className="text-muted" style={{ marginBottom: 8 }}>{a.description}</p>}
      <div className="assignment-card-meta">
        <span className="text-muted">📚 {a.subject}</span>
        <span className={`badge ${overdue ? 'badge-overdue' : a.status === 'completed' ? 'badge-completed' : 'badge-pending'}`}>
          {overdue ? 'Overdue' : a.status === 'completed' ? 'Completed' : `Due ${due.toLocaleDateString()}`}
        </span>
        {a.status === 'pending' && !overdue && (
          <span className="text-muted">{daysLeft === 0 ? 'Due today!' : daysLeft < 0 ? '' : `${daysLeft}d left`}</span>
        )}
      </div>
      <div className="assignment-card-actions">
        <button
          className={`btn btn-sm ${a.status === 'completed' ? 'btn-secondary' : 'btn-success'}`}
          onClick={() => onToggle(a)}
          title={a.status === 'completed' ? 'Mark pending' : 'Mark complete'}
        >
          {a.status === 'completed' ? <MdRadioButtonUnchecked /> : <MdCheckCircle />}
          {a.status === 'completed' ? 'Pending' : 'Complete'}
        </button>
        <button className="btn btn-sm btn-secondary" onClick={() => onEdit(a)}><MdEdit /> Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(a._id)}><MdDelete /></button>
      </div>
    </div>
  );
}

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await getAssignments({ status: filterStatus || undefined, subject: filterSubject || undefined });
      setAssignments(res.data.data);
    } catch { toast.error('Failed to load assignments'); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [filterStatus, filterSubject]);

  function handleSave(saved, action) {
    setAssignments(prev =>
      action === 'create' ? [saved, ...prev] : prev.map(a => a._id === saved._id ? saved : a)
    );
  }

  async function handleDelete(id) {
    if (!confirm('Delete this assignment?')) return;
    try {
      await deleteAssignment(id);
      setAssignments(prev => prev.filter(a => a._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  }

  async function handleToggle(a) {
    try {
      const res = await updateAssignment(a._id, { ...a, status: a.status === 'completed' ? 'pending' : 'completed' });
      setAssignments(prev => prev.map(x => x._id === a._id ? res.data.data : x));
    } catch { toast.error('Update failed'); }
  }

  const subjects = [...new Set(assignments.map(a => a.subject))];

  return (
    <div>
      <div className="flex-between mb-24">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Assignments</h1>
          <p>{assignments.length} assignment{assignments.length !== 1 ? 's' : ''} found</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditTarget(null); setShowModal(true); }}>
          <MdAdd /> Add Assignment
        </button>
      </div>

      <div className="filter-bar">
        <MdFilterList style={{ color: 'var(--text-muted)' }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <input
          value={filterSubject}
          onChange={e => setFilterSubject(e.target.value)}
          placeholder="Filter by subject…"
          style={{ minWidth: 180 }}
        />
      </div>

      {loading ? (
        <div className="loading-spinner"><div className="spinner" /></div>
      ) : assignments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No assignments yet</h3>
          <p>Click "Add Assignment" to get started.</p>
        </div>
      ) : (
        <div className="assignments-grid">
          {assignments.map(a => (
            <AssignmentCard
              key={a._id}
              a={a}
              onEdit={a => { setEditTarget(a); setShowModal(true); }}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AssignmentModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
