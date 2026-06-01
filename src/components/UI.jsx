import { useEffect, useRef } from "react";

export function Select({ value, onChange, options, label, hint, icon: Icon }) {
  return (
    <label className="block">
      {label && (
        <span className="field-label flex items-center gap-1.5">
          {Icon && <Icon size={12} />} {label}
        </span>
      )}
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
      {hint && <span className="block mt-1.5 text-[11px]" style={{ color: "var(--text-dim)" }}>{hint}</span>}
    </label>
  );
}

function rippleMouseMove(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Button({ children, onClick, variant = "primary", loading, full = true, type = "button", iconRight: IconRight, iconLeft: IconLeft }) {
  const cls = { primary: "btn btn-primary", warm: "btn btn-warm", ghost: "btn btn-ghost" }[variant] || "btn btn-primary";
  return (
    <button
      type={type}
      onClick={onClick}
      onMouseMove={rippleMouseMove}
      disabled={loading}
      className={`${cls} ${full ? "w-full" : ""}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: "spinSlow .8s linear infinite" }} />
          Analysing…
        </span>
      ) : (
        <>
          {IconLeft && <IconLeft size={16} />}
          {children}
          {IconRight && <IconRight size={16} />}
        </>
      )}
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

export function Chip({ tone = "neutral", children, className = "" }) {
  const cls = {
    neutral: "chip",
    emerald: "chip chip-emerald",
    amber:   "chip chip-amber",
    sky:     "chip chip-sky",
    violet:  "chip chip-violet",
    danger:  "chip chip-danger",
  }[tone] || "chip";
  return <span className={`${cls} ${className}`}>{children}</span>;
}

export function ProgressBar({ value, tone = "emerald" }) {
  const colors = {
    emerald: "linear-gradient(90deg, var(--primary-600), var(--primary-700))",
    amber:   "linear-gradient(90deg, var(--accent-600), var(--accent))",
    sky:     "linear-gradient(90deg, var(--sky-600), var(--sky))",
    danger:  "linear-gradient(90deg, #ef4444, var(--danger))",
  };
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden relative" style={{ background: "var(--surface-3)" }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: colors[tone],
          transition: "width .9s cubic-bezier(.2,.8,.2,1)",
        }}
      />
    </div>
  );
}

export function Skeleton({ className = "h-4 w-full" }) {
  return <div className={`skeleton ${className}`} />;
}

export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: "currentColor", animation: `bounce-dot 1.2s ${i * 0.15}s infinite ease-in-out` }}
        />
      ))}
    </span>
  );
}

export function ScrollToBottom({ trigger }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [trigger]);
  return <div ref={ref} />;
}
