import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { tasksApi, usersApi, projectsApi } from '../../api';
import toast from 'react-hot-toast';

const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];
const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TaskForm({ open, onClose, task, projectId, onSaved }) {
  const [form, setForm] = useState({
    title: '', description: '', project_id: projectId ?? '',
    assigned_to_id: '', priority: 'medium', status: 'pending', due_date: ''
  });
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    usersApi.list().then(r => setUsers(r.data.results ?? r.data)).catch(() => {});
    if (!projectId) {
      projectsApi.list().then(r => setProjects(r.data.results ?? r.data)).catch(() => {});
    }
  }, [open, projectId]);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        project_id: task.project_id || projectId || '',
        assigned_to_id: task.assigned_to?.id ?? '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        due_date: task.due_date || '',
      });
    } else {
      setForm({ title: '', description: '', project_id: projectId ?? '', assigned_to_id: '', priority: 'medium', status: 'pending', due_date: '' });
    }
    setErrors({});
  }, [task, open, projectId]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.due_date) delete payload.due_date;
      if (!payload.assigned_to_id) { payload.assigned_to_id = null; }
      let saved;
      if (task) {
        saved = await tasksApi.patch(task.id, payload);
        toast.success('Task updated!');
      } else {
        saved = await tasksApi.create(payload);
        toast.success('Task created!');
      }
      onSaved(saved.data);
      onClose();
    } catch (err) {
      const data = err.response?.data ?? {};
      setErrors(data);
      const firstMsg = Object.values(data).flat()[0];
      if (firstMsg) toast.error(typeof firstMsg === 'string' ? firstMsg : 'Error saving task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit Task' : 'New Task'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Task title *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Design landing page" required className="input" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Task details..." rows={2} className="input resize-none" />
        </div>

        {!projectId && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Project *</label>
            <select name="project_id" value={form.project_id} onChange={handleChange} required className="input">
              <option value="">Select project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Assign to</label>
          <select name="assigned_to_id" value={form.assigned_to_id} onChange={handleChange} className="input">
            <option value="">Unassigned</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>)}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className="input">
              {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Due date</label>
            <input name="due_date" type="date" value={form.due_date} onChange={handleChange} className="input" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
