export default function StatCard({ icon: Icon, label, value, color = 'brand', trend }) {
  const colors = {
    brand:  { bg: 'bg-brand-50',  icon: 'text-brand-600',  border: 'border-brand-100' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-600',  border: 'border-green-100' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  border: 'border-amber-100' },
    red:    { bg: 'bg-red-50',    icon: 'text-red-600',    border: 'border-red-100' },
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   border: 'border-blue-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-100' },
  };
  const c = colors[color] ?? colors.brand;

  return (
    <div className={`card p-5 border ${c.border} hover:shadow-card-hover transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-3xl font-bold text-slate-800">{value ?? '—'}</p>
          {trend && <p className="text-xs text-slate-400 mt-1">{trend}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={20} className={c.icon} />
        </div>
      </div>
    </div>
  );
}
