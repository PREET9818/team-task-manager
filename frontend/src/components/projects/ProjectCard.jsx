import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CheckSquare, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';
import ProgressBar from '../ui/ProgressBar';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { format, isPast, parseISO } from 'date-fns';

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isOverdue = project.deadline && isPast(parseISO(project.deadline)) && project.status !== 'completed';

  return (
    <div
      className="card p-5 cursor-pointer hover:shadow-card-hover transition-all duration-200 group animate-fade-in"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-semibold text-slate-800 text-sm leading-snug truncate group-hover:text-brand-600 transition-colors">
            {project.title}
          </h3>
          {project.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>

        {isAdmin && (
          <div className="relative" ref={menuRef} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={15} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-white rounded-xl shadow-modal border border-slate-100 py-1.5 z-10 w-36 animate-fade-in">
                <button
                  onClick={() => { setMenuOpen(false); onEdit(project); }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                >
                  <Edit2 size={14} /> Edit
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(project); }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status badge */}
      <div className="mb-4">
        <Badge value={project.status} />
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Progress</span>
          <span className="font-medium">{project.total_tasks} tasks</span>
        </div>
        <ProgressBar value={project.progress} showLabel />
      </div>

      {/* Footer meta */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Users size={13} />
          <span>{project.member_count ?? 0} members</span>
        </div>

        {project.deadline && (
          <div className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-500' : ''}`}>
            <Calendar size={13} />
            <span>{format(parseISO(project.deadline), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
