import { useState } from "react";

// Layout constants — keep each region in its own vertical band.
const PAD = { l: 38, r: 18, t: 26, b: 60 };
const BAR_H = 36;          // max bar height
const BAR_GAP = 10;        // gap between temp chart and bars
const LABEL_OFFSET = 16;   // distance below bars for day labels

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

export default function WeatherChart({ daily = [], height = 240 }) {
  const [hover, setHover] = useState(null);
  if (!daily.length) return null;

  const W = 560;
  const H = height;
  const innerW = W - PAD.l - PAD.r;

  // Vertical bands (top → bottom):
  // 1. Legend strip (PAD.t height)
  // 2. Temperature chart (tempH height)
  // 3. Gap (BAR_GAP)
  // 4. Bar area (BAR_H)
  // 5. Day-label strip (PAD.b - BAR_H - BAR_GAP)
  const TEMP_TOP    = PAD.t;
  const TEMP_BOTTOM = H - PAD.b;                  // temp chart ends here
  const tempH       = TEMP_BOTTOM - TEMP_TOP;
  const BAR_TOP     = TEMP_BOTTOM + BAR_GAP;      // bars start (top edge)
  const BAR_BOTTOM  = BAR_TOP + BAR_H;            // bars baseline
  const LABEL_Y     = BAR_BOTTOM + LABEL_OFFSET;  // day labels

  // Domains
  const temps = daily.flatMap((d) => [d.temp_min, d.temp_max]);
  const tMin = Math.floor(Math.min(...temps) - 1);
  const tMax = Math.ceil(Math.max(...temps) + 1);
  const tRange = Math.max(1, tMax - tMin);
  const rMax = Math.max(8, ...daily.map((d) => d.rainfall || 0));

  const x = (i) => PAD.l + (innerW * i) / Math.max(1, daily.length - 1);
  const yT = (t) => TEMP_TOP + tempH - ((t - tMin) / tRange) * tempH;
  const barHeight = (r) => Math.min(BAR_H, (r / rMax) * BAR_H);

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

  // Y gridlines (degrees)
  const tickStep = Math.max(1, Math.round(tRange / 4));
  const ticks = [];
  for (let v = Math.ceil(tMin); v <= tMax; v += tickStep) ticks.push(v);

  const handleMove = (e) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const { x: localX } = pt.matrixTransform(svg.getScreenCTM().inverse());
    const idx = Math.round(((localX - PAD.l) / innerW) * (daily.length - 1));
    if (idx >= 0 && idx < daily.length) setHover(idx);
    else setHover(null);
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", overflow: "visible" }}
      role="img"
      aria-label="7-day weather forecast"
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id="tempGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="var(--accent)"  stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id="rainGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%"  stopColor="var(--sky-600)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--sky)"    stopOpacity="0.55" />
        </linearGradient>
      </defs>

      {/* Legend */}
      <g transform={`translate(${PAD.l} 12)`}>
        <circle cx="4" cy="0" r="3" fill="var(--accent)" />
        <text x="12" y="4" className="chart-axis">High</text>
        <circle cx="52" cy="0" r="3" fill="var(--primary)" />
        <text x="60" y="4" className="chart-axis">Low</text>
        <rect x="94" y="-3" width="6" height="6" rx="1" fill="var(--sky)" />
        <text x="104" y="4" className="chart-axis">Rain (mm)</text>
      </g>

      {/* Gridlines + degree labels */}
      <g className="chart-grid">
        {ticks.map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yT(v)} y2={yT(v)} strokeDasharray="3 4" />
            <text x={PAD.l - 6} y={yT(v) + 3} textAnchor="end" className="chart-axis">{v}°</text>
          </g>
        ))}
      </g>

      {/* Temperature band */}
      <path d={bandPath} fill="url(#tempGradient)" opacity="0.7" />
      <path d={maxPath} className="chart-line" stroke="var(--accent)"  style={{ animation: "fadeIn .8s ease-out both" }} />
      <path d={minPath} className="chart-line" stroke="var(--primary)" style={{ animation: "fadeIn .8s .15s ease-out both" }} />

      {maxPts.map(([cx, cy], i) => (
        <circle key={`mx${i}`} cx={cx} cy={cy} r={hover === i ? 5 : 3} className="chart-dot" stroke="var(--accent)" />
      ))}
      {minPts.map(([cx, cy], i) => (
        <circle key={`mn${i}`} cx={cx} cy={cy} r={hover === i ? 4.5 : 2.5} className="chart-dot" stroke="var(--primary)" />
      ))}

      {/* Precipitation bars */}
      {daily.map((d, i) => {
        const cx = x(i);
        const barW = Math.min(20, (innerW / daily.length) * 0.55);
        const h = barHeight(d.rainfall || 0);
        const y = BAR_BOTTOM - h;
        const dim = hover !== null && hover !== i;
        return (
          <g key={`r${i}`}>
            <rect
              x={cx - barW / 2}
              y={y}
              width={barW}
              height={Math.max(0.5, h)}
              rx={3}
              fill="url(#rainGradient)"
              style={{ opacity: dim ? 0.4 : 1, transition: "opacity .15s ease" }}
            />
            {d.rainfall > 0.5 && (
              <text
                x={cx} y={y - 4}
                textAnchor="middle"
                style={{ fontSize: 9, fontWeight: 700, fill: "var(--sky)", opacity: dim ? 0.4 : 1, transition: "opacity .15s ease" }}
              >
                {d.rainfall.toFixed(1)}
              </text>
            )}
          </g>
        );
      })}

      {/* Day labels — own band, below bars */}
      {daily.map((d, i) => (
        <text
          key={`lbl${i}`}
          x={x(i)} y={LABEL_Y}
          textAnchor="middle"
          className="chart-axis"
          style={{
            fill: hover === i ? "var(--text)" : "var(--text-dim)",
            fontWeight: hover === i ? 800 : 600,
            transition: "fill .15s ease",
          }}
        >
          {(d.day_name || "").slice(0, 3)}
        </text>
      ))}

      {/* Hover tooltip */}
      {hover !== null && (() => {
        const d = daily[hover];
        const cx = x(hover);
        const top = Math.max(PAD.t + 8, yT(d.temp_max) - 12);
        const flip = cx > W - 120;
        const boxX = flip ? cx - 122 : cx + 10;
        return (
          <g pointerEvents="none">
            <line x1={cx} x2={cx} y1={PAD.t} y2={BAR_BOTTOM} stroke="var(--text-dim)" strokeDasharray="2 3" opacity="0.45" />
            <g transform={`translate(${boxX} ${top - 56})`}>
              <rect width="112" height="64" rx="10" fill="var(--surface)" stroke="var(--border)" filter="url(#tooltipShadow)" />
              <text x="10" y="16" fontSize="10" fontWeight="700" fill="var(--text-dim)" letterSpacing="0.05em">{(d.day_name || "").toUpperCase()}</text>
              <line x1="10" x2="102" y1="20" y2="20" stroke="var(--border)" />
              <text x="10" y="34" fontSize="12" fontWeight="800" fill="var(--accent)">High {d.temp_max}°</text>
              <text x="10" y="48" fontSize="11" fontWeight="700" fill="var(--primary)">Low {d.temp_min}°</text>
              <text x="10" y="60" fontSize="10" fontWeight="700" fill="var(--sky)">{d.rainfall}mm rain · {d.humidity}% RH</text>
            </g>
          </g>
        );
      })()}

      <defs>
        <filter id="tooltipShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="0" dy="3" />
          <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
}
