const variants = {
  // Status
  pending:     'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  in_progress: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  completed:   'bg-green-50 text-green-700 ring-1 ring-green-200',
  cancelled:   'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  on_hold:     'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  planning:    'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  active:      'bg-green-50 text-green-700 ring-1 ring-green-200',
  // Priority
  high:   'bg-red-50 text-red-700 ring-1 ring-red-200',
  medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  low:    'bg-slate-50 text-slate-600 ring-1 ring-slate-200',
  // Role
  admin:  'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  member: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
};

const labels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  on_hold: 'On Hold',
  planning: 'Planning',
  active: 'Active',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  admin: 'Admin',
  member: 'Member',
};

export default function Badge({ value, className = '' }) {
  const style = variants[value] ?? 'bg-slate-100 text-slate-600';
  const label = labels[value] ?? value;

  return (
    <span className={`badge ${style} ${className}`}>
      {label}
    </span>
  );
}
