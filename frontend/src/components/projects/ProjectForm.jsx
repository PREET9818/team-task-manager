import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import { projectsApi } from '../../api';
import toast from 'react-hot-toast';

const STATUSES = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ProjectForm({ open, onClose, project, onSaved }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'planning', deadline: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || '',
        description: project.description || '',
        status: project.status || 'planning',
        deadline: project.deadline || '',
      });
    } else {
      setForm({ title: '', description: '', status: 'planning', deadline: '' });
    }
    setErrors({});
  }, [project, open]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(err => ({ ...err, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.deadline) delete payload.deadline;
      let saved;
      if (project) {
        saved = await projectsApi.patch(project.id, payload);
        toast.success('Project updated!');
      } else {
        saved = await projectsApi.create(payload);
        toast.success('Project created!');
      }
      onSaved(saved.data);
      onClose();
    } catch (err) {
      const data = err.response?.data ?? {};
      setErrors(data);
      const firstMsg = Object.values(data).flat()[0];
      if (firstMsg) toast.error(firstMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={project ? 'Edit Project' : 'New Project'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Project title *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Website Redesign" required className="input" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="What's this project about?" rows={3} className="input resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
            <select name="status" value={form.status} onChange={handleChange} className="input">
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Deadline</label>
            <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="input" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? 'Saving...' : project ? 'Update' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
