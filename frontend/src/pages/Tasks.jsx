import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import { MdAdd, MdDelete, MdCheck } from 'react-icons/md';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getTasks()
      .then(res => setTasks(res.data.data))
      .catch(err => console.warn('Backend not reachable:', err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      const res = await createTask({ title: newTitle.trim() });
      setTasks(prev => [res.data.data, ...prev]);
      setNewTitle('');
      toast.success('Task added!');
    } catch { toast.error('Failed to add task'); }
    finally { setAdding(false); }
  }

  async function handleToggle(task) {
    try {
      const res = await updateTask(task._id, { completed: !task.completed });
      setTasks(prev => prev.map(t => t._id === task._id ? res.data.data : t));
    } catch { toast.error('Update failed'); }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch { toast.error('Delete failed'); }
  }

  const pending = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>Daily Tasks</h1>
        <p>{pending.length} pending &bull; {done.length} completed</p>
      </div>

      {/* Add task form */}
      <div className="card mb-24">
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px' }}>
          <input
            className="form-control"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="What do you need to do today?"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" disabled={adding}>
            <MdAdd /> {adding ? 'Adding…' : 'Add'}
          </button>
        </form>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>No tasks yet</h3>
          <p>Add your first task above to get started.</p>
        </div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-24">
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Pending ({pending.length})
              </h2>
              {pending.map(task => (
                <div key={task._id} className="task-item">
                  <button
                    className="task-checkbox"
                    onClick={() => handleToggle(task)}
                    title="Mark complete"
                    aria-label="Mark complete"
                  >
                    {task.completed && <MdCheck />}
                  </button>
                  <span className="task-title">{task.title}</span>
                  <button className="btn btn-icon btn-danger" onClick={() => handleDelete(task._id)} aria-label="Delete task">
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          )}

          {done.length > 0 && (
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Completed ({done.length})
              </h2>
              {done.map(task => (
                <div key={task._id} className="task-item" style={{ opacity: 0.6 }}>
                  <button
                    className="task-checkbox checked"
                    onClick={() => handleToggle(task)}
                    title="Mark pending"
                    aria-label="Mark pending"
                  >
                    <MdCheck />
                  </button>
                  <span className="task-title done">{task.title}</span>
                  <button className="btn btn-icon btn-danger" onClick={() => handleDelete(task._id)} aria-label="Delete task">
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
