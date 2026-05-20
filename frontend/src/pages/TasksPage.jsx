import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, CheckSquare, SlidersHorizontal } from 'lucide-react';
import { tasksApi } from '../api';
import { useAuth } from '../context/AuthContext';
import TaskRow from '../components/tasks/TaskRow';
import TaskForm from '../components/tasks/TaskForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const FILTERS = [
  { key: 'status', options: [{ value: '', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'in_progress', label: 'In Progress' }, { value: 'completed', label: 'Completed' }] },
  { key: 'priority', options: [{ value: '', label: 'All Priority' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }] },
];

export default function TasksPage() {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [overdue, setOverdue] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (search) params.search = search;
      if (overdue) params.overdue = 'true';
      const res = await tasksApi.list(params);
      setTasks(res.data.results ?? res.data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, filters, overdue]);

  useEffect(() => { load(); }, [filters, overdue]);

  useEffect(() => {
    const t = setTimeout(load, 350);
    return () => clearTimeout(t);
  }, [search]);

  const handleSaved = (saved) => {
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await tasksApi.delete(deleting.id);
      setTasks(prev => prev.filter(t => t.id !== deleting.id));
      toast.success('Task deleted');
      setDeleting(null);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Tasks</h2>
          <p className="text-sm text-slate-400">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button onClick={() => { setEditing(null); setFormOpen(true); }} className="btn-primary">
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Search + filters */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="input pl-9"
            />
          </div>
          {FILTERS.map(f => (
            <select
              key={f.key}
              value={filters[f.key]}
              onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
              className="input sm:w-40"
            >
              {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOverdue(o => !o)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
              ${overdue
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600'
              }`}
          >
            <SlidersHorizontal size={14} />
            {overdue ? 'Showing Overdue' : 'Show Overdue'}
          </button>
          {(filters.status || filters.priority || overdue || search) && (
            <button
              onClick={() => { setFilters({ status: '', priority: '' }); setOverdue(false); setSearch(''); }}
              className="text-xs text-slate-400 hover:text-slate-600 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="card divide-y divide-slate-50">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-4 py-4 animate-pulse flex gap-3">
              <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-slate-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
              </div>
              <div className="h-6 w-16 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found"
          message={search || filters.status || filters.priority ? 'Try adjusting your filters.' : isAdmin ? 'Create your first task to get started.' : 'No tasks assigned to you yet.'}
          action={isAdmin && <button onClick={() => setFormOpen(true)} className="btn-primary"><Plus size={16} /> Create Task</button>}
        />
      ) : (
        <div className="card overflow-hidden divide-y divide-slate-50">
          {tasks.map(task => (
            <TaskRow
              key={task.id}
              task={task}
              onEdit={(t) => { setEditing(t); setFormOpen(true); }}
              onDelete={setDeleting}
              onUpdated={handleSaved}
            />
          ))}
        </div>
      )}

      <TaskForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        task={editing}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
}
