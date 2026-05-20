import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsApi, tasksApi, usersApi } from '../api';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import TaskRow from '../components/tasks/TaskRow';
import TaskForm from '../components/tasks/TaskForm';
import ProjectForm from '../components/projects/ProjectForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Plus, Edit2, Trash2, Users, CheckSquare,
  Calendar, UserPlus, UserMinus, Crown
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('tasks');

  const [editOpen, setEditOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [deleteTaskLoading, setDeleteTaskLoading] = useState(false);
  const [deleteProjectLoading, setDeleteProjectLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, taskRes] = await Promise.all([
        projectsApi.get(id),
        tasksApi.list({ project: id }),
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data.results ?? taskRes.data);
    } catch {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (isAdmin) {
      usersApi.list().then(r => setAllUsers(r.data.results ?? r.data)).catch(() => {});
    }
  }, [isAdmin]);

  const handleTaskSaved = (saved) => {
    setTasks(prev => {
      const idx = prev.findIndex(t => t.id === saved.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; }
      return [saved, ...prev];
    });
    load(); // refresh project progress
  };

  const handleDeleteTask = async () => {
    setDeleteTaskLoading(true);
    try {
      await tasksApi.delete(deletingTask.id);
      setTasks(prev => prev.filter(t => t.id !== deletingTask.id));
      toast.success('Task deleted');
      setDeletingTask(null);
      load();
    } catch { toast.error('Failed to delete task'); }
    finally { setDeleteTaskLoading(false); }
  };

  const handleDeleteProject = async () => {
    setDeleteProjectLoading(true);
    try {
      await projectsApi.delete(id);
      toast.success('Project deleted');
      navigate('/projects');
    } catch { toast.error('Failed to delete project'); }
    finally { setDeleteProjectLoading(false); }
  };

  const handleAddMember = async (userId) => {
    setMemberLoading(true);
    try {
      await projectsApi.addMember(id, userId);
      toast.success('Member added');
      load();
    } catch { toast.error('Failed to add member'); }
    finally { setMemberLoading(false); }
  };

  const handleRemoveMember = async (userId) => {
    setMemberLoading(true);
    try {
      await projectsApi.removeMember(id, userId);
      toast.success('Member removed');
      load();
    } catch { toast.error('Failed to remove member'); }
    finally { setMemberLoading(false); }
  };

  if (loading) return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 bg-slate-100 rounded w-48" />
      <div className="card p-6 space-y-3">
        <div className="h-6 bg-slate-100 rounded w-64" />
        <div className="h-4 bg-slate-100 rounded w-full" />
        <div className="h-4 bg-slate-100 rounded w-2/3" />
      </div>
    </div>
  );

  if (!project) return null;

  const nonMembers = allUsers.filter(u => !project.members?.find(m => m.id === u.id));
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const overdueCount = tasks.filter(t => t.is_overdue).length;

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Back */}
      <button onClick={() => navigate('/projects')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Project header */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-800">{project.title}</h1>
              <Badge value={project.status} />
            </div>
            {project.description && (
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{project.description}</p>
            )}

            <div className="flex flex-wrap gap-5 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Users size={14} /> {project.members?.length ?? 0} members
              </span>
              <span className="flex items-center gap-1.5">
                <CheckSquare size={14} /> {tasks.length} tasks
              </span>
              {project.deadline && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} /> Due {format(parseISO(project.deadline), 'MMM d, yyyy')}
                </span>
              )}
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Progress</span>
                <span>{completedCount} / {tasks.length} completed</span>
              </div>
              <ProgressBar value={project.progress} />
            </div>
          </div>

          {isAdmin && (
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => setEditOpen(true)} className="btn-secondary">
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => setDeleteProjectOpen(true)} className="btn-danger">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Tasks', value: tasks.length, color: 'text-slate-700' },
          { label: 'Completed', value: completedCount, color: 'text-green-600' },
          { label: 'Overdue', value: overdueCount, color: overdueCount > 0 ? 'text-red-600' : 'text-slate-700' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {[
          { key: 'tasks', label: `Tasks (${tasks.length})` },
          { key: 'members', label: `Members (${project.members?.length ?? 0})` },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
              ${tab === t.key
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tasks tab */}
      {tab === 'tasks' && (
        <div className="space-y-4">
          {isAdmin && (
            <div className="flex justify-end">
              <button onClick={() => { setEditingTask(null); setTaskFormOpen(true); }} className="btn-primary">
                <Plus size={16} /> Add Task
              </button>
            </div>
          )}
          {tasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks yet"
              message="Add tasks to start tracking work in this project."
              action={isAdmin && (
                <button onClick={() => setTaskFormOpen(true)} className="btn-primary">
                  <Plus size={16} /> Add Task
                </button>
              )}
            />
          ) : (
            <div className="card overflow-hidden divide-y divide-slate-50">
              {tasks.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={(t) => { setEditingTask(t); setTaskFormOpen(true); }}
                  onDelete={setDeletingTask}
                  onUpdated={handleTaskSaved}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Members tab */}
      {tab === 'members' && (
        <div className="space-y-4">
          {isAdmin && (
            <div className="flex justify-end">
              <button onClick={() => setMemberModalOpen(true)} className="btn-primary">
                <UserPlus size={16} /> Add Member
              </button>
            </div>
          )}
          <div className="card divide-y divide-slate-50">
            {project.members?.length === 0 && (
              <EmptyState icon={Users} title="No members" message="Add team members to collaborate on this project." />
            )}
            {project.members?.map(member => (
              <div key={member.id} className="flex items-center justify-between px-5 py-4 hover:bg-surface-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700">
                    {member.first_name?.[0]}{member.last_name?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-700">{member.full_name}</p>
                      {member.id === project.created_by?.id && (
                        <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                          <Crown size={11} /> Owner
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge value={member.role} />
                  {isAdmin && member.id !== project.created_by?.id && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={memberLoading}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <UserMinus size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add member modal */}
      <Modal open={memberModalOpen} onClose={() => setMemberModalOpen(false)} title="Add Member" size="sm">
        <div className="space-y-2">
          {nonMembers.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">All users are already members.</p>
          ) : (
            nonMembers.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-brand-200 hover:bg-brand-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-700">{u.full_name}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                <button
                  onClick={() => { handleAddMember(u.id); setMemberModalOpen(false); }}
                  disabled={memberLoading}
                  className="btn-primary py-1.5 text-xs"
                >
                  <UserPlus size={13} /> Add
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Modals */}
      <ProjectForm open={editOpen} onClose={() => setEditOpen(false)} project={project} onSaved={(p) => { setProject(p); }} />
      <TaskForm open={taskFormOpen} onClose={() => { setTaskFormOpen(false); setEditingTask(null); }} task={editingTask} projectId={parseInt(id)} onSaved={handleTaskSaved} />
      <ConfirmDialog open={!!deletingTask} onClose={() => setDeletingTask(null)} onConfirm={handleDeleteTask} title="Delete Task" message={`Delete "${deletingTask?.title}"?`} loading={deleteTaskLoading} />
      <ConfirmDialog open={deleteProjectOpen} onClose={() => setDeleteProjectOpen(false)} onConfirm={handleDeleteProject} title="Delete Project" message={`Delete "${project.title}" and all its tasks? This cannot be undone.`} loading={deleteProjectLoading} />
    </div>
  );
}
