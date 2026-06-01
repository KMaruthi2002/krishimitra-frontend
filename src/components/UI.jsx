// Lightweight UI primitives shared across views.
import { useEffect, useRef } from "react";

export function Select({ value, onChange, options, label, hint }) {
  return (
    <label className="block">
      {label && <span className="field-label">{label}</span>}
      <select
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
      {hint && <span className="block mt-1.5 text-[11px] text-[color:var(--text-dim)]">{hint}</span>}
    </label>
  );
}

export function Button({ children, onClick, variant = "primary", loading, full = true, type = "button" }) {
  const cls = { primary: "btn btn-primary", warm: "btn btn-warm", ghost: "btn btn-ghost" }[variant] || "btn btn-primary";
  return (
    <button type={type} onClick={onClick} disabled={loading} className={`${cls} ${full ? "w-full" : ""}`}>
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          Analysing…
        </span>
      ) : children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function SectionTitle({ children, right }) {
  return (
    <div className="flex items-end justify-between mb-2">
      <span className="section-title">{children}</span>
      {right}
    </div>
  );
}

export function Chip({ tone = "neutral", children }) {
  const cls = { neutral: "chip", emerald: "chip chip-emerald", amber: "chip chip-amber", sky: "chip chip-sky", danger: "chip chip-danger" }[tone] || "chip";
  return <span className={cls}>{children}</span>;
}

export function MetricTile({ label, value, unit, tone = "neutral" }) {
  const map = {
    neutral: { bg: "var(--surface-2)", fg: "var(--text)",    sub: "var(--text-dim)" },
    emerald: { bg: "var(--primary-soft)", fg: "var(--primary-700)", sub: "var(--primary-700)" },
    amber:   { bg: "var(--accent-soft)",  fg: "#92400e",             sub: "#92400e" },
    sky:     { bg: "var(--sky-soft)",     fg: "#0c4a6e",             sub: "#0c4a6e" },
    danger:  { bg: "var(--danger-soft)",  fg: "#991b1b",             sub: "#991b1b" },
  }[tone];
  return (
    <div className="rounded-xl p-3 text-center" style={{ background: map.bg }}>
      <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: map.sub, opacity: .8 }}>{label}</div>
      <div className="text-xl font-bold metric-num mt-0.5" style={{ color: map.fg }}>{value}</div>
      {unit && <div className="text-[10px]" style={{ color: map.sub, opacity: .7 }}>{unit}</div>}
    </div>
  );
}

export function ProgressBar({ value, tone = "emerald" }) {
  const colors = {
    emerald: "linear-gradient(90deg, #10b981, #047857)",
    amber:   "linear-gradient(90deg, #f59e0b, #b45309)",
    danger:  "linear-gradient(90deg, #ef4444, #b91c1c)",
  };
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
      <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: colors[tone] }} />
    </div>
  );
}

export function ScrollToBottom({ trigger }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [trigger]);
  return <div ref={ref} />;
}
