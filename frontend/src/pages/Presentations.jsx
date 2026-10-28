import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getPresentations, createPresentation, updatePresentation, deletePresentation
} from '../api';
import { MdAdd, MdEdit, MdDelete, MdClose, MdEvent } from 'react-icons/md';

const EMPTY = { title: '', subject: '', presentationDate: '', outline: '' };

function PresentationModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (initial?._id) {
        const res = await updatePresentation(initial._id, form);
        onSave(res.data.data, 'update');
        toast.success('Presentation updated!');
      } else {
        const res = await createPresentation(form);
        onSave(res.data.data, 'create');
        toast.success('Presentation added!');
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || 'Error';
      toast.error(msg);
    } finally { setSaving(false); }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{initial?._id ? 'Edit Presentation' : 'New Presentation'}</h2>
          <button className="modal-close" onClick={onClose}><MdClose /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input className="form-control" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Climate Change Impact" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Subject *</label>
              <input className="form-control" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="e.g. Environmental Science" required />
            </div>
            <div className="form-group">
              <label>Presentation Date *</label>
              <input type="date" className="form-control" value={form.presentationDate ? form.presentationDate.slice(0, 10) : ''} onChange={e => set('presentationDate', e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Outline / Notes</label>
            <textarea className="form-control" value={form.outline} onChange={e => set('outline', e.target.value)} placeholder="Key points, slide ideas, resources…" style={{ minHeight: 120 }} />
          </div>
          <div className="flex gap-8" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : initial?._id ? 'Update' : 'Add Presentation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PresentationCard({ p, onEdit, onDelete }) {
  const date = new Date(p.presentationDate);
  const isPast = date < new Date();
  const daysLeft = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="presentation-card">
      <div className="flex-between" style={{ marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 600 }}>{p.title}</div>
          <div className="text-muted">📚 {p.subject}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(p)}><MdEdit /></button>
          <button className="btn btn-sm btn-danger" onClick={() => onDelete(p._id)}><MdDelete /></button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: p.outline ? 12 : 0 }}>
        <MdEvent style={{ color: isPast ? 'var(--danger)' : 'var(--accent)' }} />
        <span style={{ fontSize: 13, color: isPast ? 'var(--danger)' : 'var(--text-secondary)' }}>
          {date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
        {!isPast && daysLeft <= 7 && (
          <span className="badge badge-overdue">{daysLeft === 0 ? 'Today!' : `${daysLeft}d left`}</span>
        )}
        {isPast && <span className="badge badge-completed">Past</span>}
      </div>
      {p.outline && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 12px',
          fontSize: 13,
          color: 'var(--text-secondary)',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.7,
        }}>
          {p.outline}
        </div>
      )}
    </div>
  );
}

export default function Presentations() {
  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    getPresentations()
      .then(res => setPresentations(res.data.data))
      .catch(() => toast.error('Failed to load presentations'))
      .finally(() => setLoading(false));
  }, []);

  function handleSave(saved, action) {
    setPresentations(prev =>
      action === 'create' ? [saved, ...prev] : prev.map(p => p._id === saved._id ? saved : p)
    );
  }

  async function handleDelete(id) {
    if (!confirm('Delete this presentation?')) return;
    try {
      await deletePresentation(id);
      setPresentations(prev => prev.filter(p => p._id !== id));
      toast.success('Deleted');
    } catch { toast.error('Delete failed'); }
  }

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div>
      <div className="flex-between mb-24">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Presentations</h1>
          <p>{presentations.length} presentation{presentations.length !== 1 ? 's' : ''} planned</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditTarget(null); setShowModal(true); }}>
          <MdAdd /> Add Presentation
        </button>
      </div>

      {presentations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎤</div>
          <h3>No presentations yet</h3>
          <p>Click "Add Presentation" to plan your first one.</p>
        </div>
      ) : (
        <div className="assignments-grid">
          {presentations.map(p => (
            <PresentationCard
              key={p._id}
              p={p}
              onEdit={p => { setEditTarget(p); setShowModal(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showModal && (
        <PresentationModal
          initial={editTarget}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
