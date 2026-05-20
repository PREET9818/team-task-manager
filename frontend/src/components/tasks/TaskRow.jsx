import { Calendar, User, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { format, parseISO } from 'date-fns';
import { tasksApi } from '../../api';
import toast from 'react-hot-toast';
import { useState } from 'react';

const STATUS_OPTIONS = ['pending', 'in_progress', 'completed'];

export default function TaskRow({ task, onEdit, onDelete, onUpdated }) {
  const { isAdmin, user } = useAuth();
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const canEdit = isAdmin;
  const canDelete = isAdmin;
  const canChangeStatus = isAdmin || task.assigned_to?.id === user?.id;

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setUpdatingStatus(true);
    try {
      const res = await tasksApi.updateStatus(task.id, newStatus);
      onUpdated(res.data);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className={`px-4 py-3.5 hover:bg-surface-50 transition-colors flex flex-col sm:flex-row sm:items-center gap-3 group
      ${task.is_overdue ? 'border-l-2 border-red-400' : ''}`}>

      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {task.is_overdue && <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />}
          <p className="text-sm font-medium text-slate-700 truncate">{task.title}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          {task.project_title && (
            <span className="text-xs text-slate-400">{task.project_title}</span>
          )}
          {task.assigned_to && (
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <User size={11} /> {task.assigned_to.full_name}
            </span>
          )}
          {task.due_date && (
            <span className={`flex items-center gap-1 text-xs ${task.is_overdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
              <Calendar size={11} /> {format(parseISO(task.due_date), 'MMM d, yyyy')}
            </span>
          )}
        </div>
      </div>

      {/* Badges + actions */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge value={task.priority} />

        {/* Status selector or badge */}
        {canChangeStatus ? (
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={updatingStatus}
            onClick={e => e.stopPropagation()}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-400 disabled:opacity-60"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>
                {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        ) : (
          <Badge value={task.status} />
        )}

        {/* Edit/Delete (admin only) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {canEdit && (
            <button
              onClick={e => { e.stopPropagation(); onEdit(task); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
            >
              <Edit2 size={13} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={e => { e.stopPropagation(); onDelete(task); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
