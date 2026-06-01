import { useRef, useState } from "react";
import { MapPin, WxSunny, WxCloud, WxRain, WxStorm, WxPartly, Sparkle } from "./Icons";
import { Chip } from "./UI";
import AnimatedNumber from "./AnimatedNumber";
import { useT } from "../lib/I18nContext";

function bigIcon(rain, humidity) {
  if (rain > 20) return <WxStorm size={60} />;
  if (rain > 5)  return <WxRain  size={60} />;
  if (rain > 0.5) return <WxPartly size={60} />;
  if (humidity > 70) return <WxCloud size={60} />;
  return <WxSunny size={60} />;
}

function summariseKey(s, rain) {
  if (rain > 20) return "hero.heavy_rain";
  if (rain > 5)  return "hero.wet_week";
  if (rain > 0.5) return "hero.mixed";
  if ((s.humidity_avg ?? 0) > 70) return "hero.cloudy_humid";
  return "hero.clear_dry";
}

export default function Hero({ weather }) {
  const { t } = useT();
  const [glow, setGlow] = useState({ x: 50, y: 30 });
  const ref = useRef(null);

  if (!weather?.summary) return null;
  const s = weather.summary;
  const today = weather.daily?.[0] || {};
  const rain = today.rainfall ?? 0;
  const live = weather.source === "open_meteo_live";

  const handleMove = (e) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setGlow({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setGlow({ x: 50, y: 30 })}
      className="card-hero fade-up"
      style={{
        background: `linear-gradient(135deg,
          color-mix(in srgb, var(--primary) 8%, var(--surface)) 0%,
          var(--surface) 50%,
          color-mix(in srgb, var(--accent) 5%, var(--surface)) 100%)`,
      }}
    >
      {/* Mouse-tracking glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(280px circle at ${glow.x}% ${glow.y}%, color-mix(in srgb, var(--primary) 18%, transparent), transparent 70%)`,
          transition: "background .15s ease",
        }}
      />
      {/* Grid pattern */}
      <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: .14 }}>
        <defs>
          <pattern id="heroGrid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrid)" style={{ color: "var(--primary)" }} />
      </svg>

      <div className="relative px-5 pt-5 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 eyebrow" style={{ color: "var(--text-dim)" }}>
            <MapPin size={12} /> {weather.location}
          </div>
          <Chip tone={live ? "emerald" : "amber"} className="chip-dot">
            {live ? t("weather.live") : t("weather.estimate")}
          </Chip>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black leading-none" style={{ fontSize: 64, color: "var(--text)" }}>
                <AnimatedNumber value={today.temp_max ?? s.temp_avg ?? 0} />
              </span>
              <span className="font-display font-black metric-num" style={{ fontSize: 30, color: "var(--text-dim)" }}>°C</span>
            </div>
            <div className="text-[11px] mt-1 metric-num" style={{ color: "var(--text-muted)" }}>
              {t("hero.feels_low", {
                min: Math.round(today.temp_min ?? s.temp_min ?? 0),
                humid: Math.round(today.humidity ?? s.humidity_avg ?? 0),
              })}
            </div>
          </div>
          <div style={{ color: "var(--accent)" }} className="float-y">
            {bigIcon(rain, today.humidity ?? s.humidity_avg ?? 0)}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-xl slide-up"
             style={{ background: "color-mix(in srgb, var(--primary) 6%, var(--surface))", border: "1px solid var(--border)" }}>
          <Sparkle size={14} style={{ color: "var(--primary)" }} />
          <p className="text-[12.5px] font-semibold leading-snug" style={{ color: "var(--text)" }}>
            {t(summariseKey(s, rain))}
          </p>
        </div>
      </div>
    </div>
  );
}
