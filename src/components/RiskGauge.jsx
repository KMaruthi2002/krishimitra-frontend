// Semi-circular gauge for risk levels (drought, fungal, frost, spray-safe, etc).

const TONE = {
  emerald: "var(--primary)",
  amber:   "var(--accent)",
  danger:  "var(--danger)",
  sky:     "var(--sky)",
  violet:  "var(--violet)",
};

export default function RiskGauge({ value = 0, label, tone = "emerald", level }) {
  const v = Math.max(0, Math.min(1, value)) * 100;
  const W = 110;
  const H = 64;
  const cx = W / 2;
  const cy = H - 8;
  const r = 44;
  const stroke = 8;

  // semi-circle path
  const startX = cx - r;
  const startY = cy;
  const endX = cx + r;
  const endY = cy;

  // arc length of the visible portion
  const arcLen = Math.PI * r;
  const dashOffset = arcLen - (v / 100) * arcLen;

  const color = TONE[tone];

  return (
    <div className="flex flex-col items-center px-2 py-2 rounded-xl"
         style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ overflow: "visible" }}>
        {/* Track */}
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Value */}
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={arcLen}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset .8s cubic-bezier(.2,.7,.2,1)" }}
        />
        {/* Center number */}
        <text x={cx} y={cy - 4} textAnchor="middle"
              fontFamily="Plus Jakarta Sans, Inter, sans-serif"
              fontWeight="800" fontSize="20"
              style={{ fill: color, letterSpacing: "-0.02em" }}>
          {Math.round(v)}
          <tspan fontSize="10" dy="-6">%</tspan>
        </text>
      </svg>
      <div className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "var(--text-dim)" }}>
        {label}
      </div>
      {level && (
        <div className="text-[10px] font-semibold mt-0.5" style={{ color }}>
          {level}
        </div>
      )}
    </div>
  );
}
