// Animated circular progress ring used for crop-recommendation confidence.

export default function ConfidenceRing({ value = 0, size = 56, stroke = 5, tone = "emerald", label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  const offset = c - (v / 100) * c;

  const palette = {
    emerald: { stroke: "var(--primary)", soft: "color-mix(in srgb, var(--primary) 15%, transparent)" },
    amber:   { stroke: "var(--accent)",  soft: "color-mix(in srgb, var(--accent) 18%, transparent)"  },
    danger:  { stroke: "var(--danger)",  soft: "color-mix(in srgb, var(--danger) 18%, transparent)"  },
  }[tone];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={palette.soft} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={palette.stroke} strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .8s cubic-bezier(.2,.7,.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-extrabold metric-num leading-none"
              style={{ fontSize: size * 0.32, color: palette.stroke }}>
          {Math.round(v)}
        </span>
        {label && (
          <span className="text-[8px] font-semibold uppercase tracking-wider mt-0.5"
                style={{ color: "var(--text-dim)" }}>{label}</span>
        )}
      </div>
    </div>
  );
}
