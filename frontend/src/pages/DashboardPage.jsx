import { useEffect, useState } from 'react';
import { tasksApi } from '../api';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { FolderKanban, CheckSquare, Clock, AlertCircle, TrendingUp, ListTodo, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

const COLORS = { completed: '#22c55e', in_progress: '#6172f3', pending: '#f59e0b' };

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tasksApi.dashboard()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="animate-spin w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!data) return <p className="text-slate-500">Failed to load dashboard.</p>;

  const pieData = [
    { name: 'Completed', value: data.completed_tasks, key: 'completed' },
    { name: 'In Progress', value: data.in_progress_tasks, key: 'in_progress' },
    { name: 'Pending', value: data.pending_tasks, key: 'pending' },
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'High', value: data.by_priority?.high ?? 0 },
    { name: 'Medium', value: data.by_priority?.medium ?? 0 },
    { name: 'Low', value: data.by_priority?.low ?? 0 },
  ];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Overview</h2>
          <p className="text-sm text-slate-400">{format(new Date(), 'EEEE, MMMM d yyyy')}</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-700">Live</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={FolderKanban} label="Projects"    value={data.total_projects}   color="brand"  />
        <StatCard icon={ListTodo}     label="Total Tasks" value={data.total_tasks}       color="blue"   />
        <StatCard icon={CheckSquare}  label="Completed"   value={data.completed_tasks}   color="green"  />
        <StatCard icon={Clock}        label="In Progress" value={data.in_progress_tasks} color="purple" />
        <StatCard icon={Activity}     label="Pending"     value={data.pending_tasks}     color="amber"  />
        <StatCard icon={AlertCircle}  label="Overdue"     value={data.overdue_tasks}     color="red"    />
      </div>

      {/* Completion rate */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">Overall Completion Rate</p>
            <p className="text-xs text-slate-400">Based on all tasks assigned to you</p>
          </div>
          <span className="text-2xl font-bold text-slate-800">{data.completion_rate}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-green-500 transition-all duration-700"
            style={{ width: `${data.completion_rate}%` }}
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Pie chart */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-brand-600" /> Tasks by Status
          </h3>
          {pieData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {pieData.map((entry) => (
                      <Cell key={entry.key} fill={COLORS[entry.key]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v, '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {pieData.map(d => (
                  <div key={d.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm" style={{ background: COLORS[d.key] }} />
                      <span className="text-xs text-slate-600">{d.name}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-10">No task data yet</p>
          )}
        </div>

        {/* Bar chart by priority */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <AlertCircle size={15} className="text-brand-600" /> Tasks by Priority
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="value" name="Tasks" fill="#6172f3" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent tasks */}
      {data.recent_tasks?.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">Recent Tasks</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {data.recent_tasks.map(task => (
              <div key={task.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-surface-50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{task.title}</p>
                  <p className="text-xs text-slate-400">{task.project_title}</p>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <Badge value={task.priority} />
                  <Badge value={task.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
