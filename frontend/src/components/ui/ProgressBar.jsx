export default function ProgressBar({ value = 0, className = '', showLabel = true }) {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct >= 75 ? 'bg-green-500' : pct >= 40 ? 'bg-brand-500' : 'bg-amber-500';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold text-slate-500 w-9 text-right">{pct}%</span>
      )}
    </div>
  );
}
