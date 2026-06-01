import { useState } from "react";

const PAD = { l: 36, r: 16, t: 18, b: 38 };

function smoothPath(points) {
  if (points.length < 2) return "";
  const d = [`M ${points[0][0]} ${points[0][1]}`];
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const cx = (x0 + x1) / 2;
    d.push(`C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`);
  }
  return d.join(" ");
}

export default function WeatherChart({ daily = [], height = 220 }) {
  const [hover, setHover] = useState(null);
  if (!daily.length) return null;

  const W = 560;
  const H = height;
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b - 38;

  const temps = daily.flatMap((d) => [d.temp_min, d.temp_max]);
  const tMin = Math.floor(Math.min(...temps) - 1);
  const tMax = Math.ceil(Math.max(...temps) + 1);
  const tRange = Math.max(1, tMax - tMin);
  const rMax = Math.max(8, ...daily.map((d) => d.rainfall || 0));

  const x = (i) => PAD.l + (innerW * i) / Math.max(1, daily.length - 1);
  const yT = (t) => PAD.t + innerH - ((t - tMin) / tRange) * innerH;
  const yR = (r) => 38 - Math.min(36, (r / rMax) * 36);

  const maxPts = daily.map((d, i) => [x(i), yT(d.temp_max)]);
  const minPts = daily.map((d, i) => [x(i), yT(d.temp_min)]);

  const maxPath = smoothPath(maxPts);
  const minPath = smoothPath(minPts);
  const reversedMin = [...minPts].reverse();
  const bandPath =
    `${smoothPath(maxPts)} L ${reversedMin[0][0]} ${reversedMin[0][1]} ` +
    reversedMin.slice(1).map((p, idx) => {
      const prev = idx === 0 ? reversedMin[0] : reversedMin[idx];
      const next = reversedMin[idx + 1] || p;
      const cx = (prev[0] + next[0]) / 2;
      return `C ${cx} ${prev[1]}, ${cx} ${next[1]}, ${next[0]} ${next[1]}`;
    }).join(" ") + " Z";

  const ticks = [];
  for (let v = Math.ceil(tMin); v <= tMax; v++) {
    if ((v - Math.ceil(tMin)) % Math.max(1, Math.round(tRange / 4)) === 0) ticks.push(v);
  }

  const handleMove = (e) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const { x: localX } = pt.matrixTransform(svg.getScreenCTM().inverse());
    const idx = Math.round(((localX - PAD.l) / innerW) * (daily.length - 1));
    if (idx >= 0 && idx < daily.length) setHover(idx);
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      preserveAspectRatio="none"
      style={{ display: "block" }}
      role="img"
      aria-label="7-day weather forecast"
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id="tempGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="rainGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--sky)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--sky)" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      <g className="chart-grid">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yT(v)} y2={yT(v)} strokeDasharray="3 4" />
            <text x={PAD.l - 6} y={yT(v) + 3} textAnchor="end" className="chart-axis">{v}°</text>
          </g>
        ))}
      </g>

      <path d={bandPath} fill="url(#tempGradient)" opacity="0.7" />
      <path d={maxPath} className="chart-line" stroke="var(--accent)"  style={{ animation: "fadeIn .8s ease-out both" }} />
      <path d={minPath} className="chart-line" stroke="var(--primary)" style={{ animation: "fadeIn .8s .15s ease-out both" }} />

      {maxPts.map(([cx, cy], i) => (
        <circle key={`mx${i}`} cx={cx} cy={cy} r={hover === i ? 5 : 3} className="chart-dot" stroke="var(--accent)" />
      ))}
      {minPts.map(([cx, cy], i) => (
        <circle key={`mn${i}`} cx={cx} cy={cy} r={hover === i ? 4.5 : 2.5} className="chart-dot" stroke="var(--primary)" />
      ))}

      <g transform={`translate(0 ${H - PAD.b})`}>
        {daily.map((d, i) => {
          const cx = x(i);
          const barW = Math.min(18, (innerW / daily.length) * 0.5);
          const h = 36 - yR(d.rainfall || 0);
          return (
            <g key={`r${i}`}>
              <rect
                x={cx - barW / 2}
                y={yR(d.rainfall || 0)}
                width={barW}
                height={Math.max(0.5, h)}
                rx={2}
                fill="url(#rainGradient)"
                style={{ opacity: hover === null || hover === i ? 1 : 0.55, transition: "opacity .15s ease" }}
              />
              {d.rainfall > 0.5 && (
                <text x={cx} y={yR(d.rainfall) - 4} textAnchor="middle" className="chart-axis" style={{ fontSize: 9 }}>
                  {d.rainfall.toFixed(1)}
                </text>
              )}
            </g>
          );
        })}
      </g>

      <g transform={`translate(0 ${H - 6})`}>
        {daily.map((d, i) => (
          <text key={i} x={x(i)} y="0" textAnchor="middle" className="chart-axis"
                style={{ fill: hover === i ? "var(--text)" : "var(--text-dim)", fontWeight: hover === i ? 800 : 600 }}>
            {(d.day_name || "").slice(0, 3)}
          </text>
        ))}
      </g>

      {/* Hover tooltip */}
      {hover !== null && (() => {
        const d = daily[hover];
        const cx = x(hover);
        const top = yT(d.temp_max) - 8;
        const flip = cx > W - 100;
        return (
          <g pointerEvents="none">
            <line x1={cx} x2={cx} y1={PAD.t} y2={H - PAD.b - 38} stroke="var(--text-dim)" strokeDasharray="2 3" opacity="0.5" />
            <g transform={`translate(${flip ? cx - 110 : cx + 8} ${top - 50})`}>
              <rect width="100" height="58" rx="8" fill="var(--surface)" stroke="var(--border)" />
              <text x="8" y="16" fontSize="10" fontWeight="700" fill="var(--text-dim)" letterSpacing="0.05em">{(d.day_name || "").toUpperCase()}</text>
              <text x="8" y="32" fontSize="13" fontWeight="800" fill="var(--accent)">High {d.temp_max}°</text>
              <text x="8" y="46" fontSize="11" fontWeight="700" fill="var(--primary)">Low {d.temp_min}°</text>
              <text x="58" y="32" fontSize="11" fontWeight="700" fill="var(--sky)">{d.rainfall}mm</text>
              <text x="58" y="46" fontSize="10" fontWeight="600" fill="var(--text-dim)">{d.humidity}%</text>
            </g>
          </g>
        );
      })()}

      <g transform={`translate(${PAD.l} 12)`}>
        <circle cx="4" cy="0" r="3" fill="var(--accent)" />
        <text x="12" y="3" className="chart-axis">High</text>
        <circle cx="50" cy="0" r="3" fill="var(--primary)" />
        <text x="58" y="3" className="chart-axis">Low</text>
        <rect x="92" y="-3" width="6" height="6" rx="1" fill="var(--sky)" />
        <text x="102" y="3" className="chart-axis">Rain (mm)</text>
      </g>
    </svg>
  );
}
