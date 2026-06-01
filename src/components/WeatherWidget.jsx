import { Card, Chip } from "./UI";
import { MapPin, WxSunny, WxCloud, WxRain, WxStorm, WxPartly, Wind, Droplet, Thermometer, Activity } from "./Icons";
import WeatherChart from "./WeatherChart";
import AnimatedNumber from "./AnimatedNumber";

function WxIcon({ rain, humidity, size = 18 }) {
  if (rain > 20) return <WxStorm size={size} className="fg-sky" />;
  if (rain > 5)  return <WxRain  size={size} className="fg-sky" />;
  if (rain > 0.5) return <WxPartly size={size} className="fg-sky" />;
  if (humidity > 70) return <WxCloud size={size} className="fg-sky" />;
  return <WxSunny size={size} className="fg-accent" />;
}

function Stat({ icon: Icon, label, value, unit, tone = "neutral", anim = true, isRange }) {
  const colors = { neutral: "var(--text)", emerald: "var(--primary)", amber: "var(--accent)", sky: "var(--sky)" }[tone];
  return (
    <div className="flex-1 min-w-0 px-3 py-2.5 rounded-xl card-interactive"
         style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-1.5">
        <Icon size={13} style={{ color: colors }} />
        <div className="eyebrow" style={{ color: "var(--text-dim)" }}>{label}</div>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-display text-xl font-extrabold metric-num" style={{ color: colors }}>
          {anim && typeof value === "number" ? <AnimatedNumber value={value} /> : value}
        </span>
        {unit && <span className="text-[10px] font-semibold" style={{ color: "var(--text-dim)" }}>{unit}</span>}
      </div>
    </div>
  );
}

export default function WeatherWidget({ data }) {
  if (!data?.daily) return null;
  const s = data.summary || {};
  const live = data.source === "open_meteo_live";

  return (
    <Card className="overflow-hidden card-elev fade-up">
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 eyebrow" style={{ color: "var(--text-dim)" }}>
            <MapPin size={12} /> Forecast
          </div>
          <div className="font-display text-xl font-extrabold mt-1 truncate">{data.location}</div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--text-dim)" }}>
            {data.forecast_days}-day outlook · Open-Meteo
          </div>
        </div>
        <Chip tone={live ? "emerald" : "amber"} className="chip-dot">
          {live ? "Live" : "Est."}
        </Chip>
      </div>

      <div className="px-3 pb-3 flex gap-2 stagger">
        <Stat icon={Thermometer} label="Range"    value={`${s.temp_min ?? "–"}–${s.temp_max ?? "–"}°`} anim={false} tone="amber" />
        <Stat icon={Droplet}     label="Humidity" value={s.humidity_avg ?? 0}   unit="%"     tone="emerald" />
        <Stat icon={Activity}    label="Rain"     value={s.rainfall_total ?? 0} unit="mm"    tone="sky" />
        <Stat icon={Wind}        label="Wind"     value={s.wind_speed_avg ?? 0} unit="km/h" />
      </div>

      <div className="px-2 pb-1">
        <WeatherChart daily={data.daily.slice(0, 7)} />
      </div>

      <div className="px-3 pb-3 pt-1 overflow-x-auto hide-scrollbar">
        <div className="flex gap-1.5 stagger">
          {data.daily.slice(0, 7).map((d, i) => {
            const wet = d.rainfall > 0.5;
            return (
              <div
                key={i}
                className="flex-shrink-0 w-[70px] rounded-xl p-2.5 text-center transition-all card-interactive cursor-pointer"
                style={{
                  background: wet ? "var(--sky-soft)" : "var(--surface-2)",
                  border: `1px solid ${wet ? "color-mix(in srgb, var(--sky) 25%, transparent)" : "var(--border)"}`,
                }}
              >
                <div className="eyebrow" style={{ color: "var(--text-dim)" }}>{d.day_name?.slice(0, 3)}</div>
                <div className="my-1.5 flex justify-center"><WxIcon rain={d.rainfall} humidity={d.humidity} size={22} /></div>
                <div className="text-sm font-bold metric-num" style={{ color: "var(--text)" }}>{d.temp_max}°</div>
                <div className="text-[10px] metric-num" style={{ color: "var(--text-dim)" }}>{d.temp_min}°</div>
                {wet && (
                  <div className="mt-1 inline-flex items-center gap-0.5 text-[10px] font-bold metric-num" style={{ color: "var(--sky)" }}>
                    {d.rainfall}<span className="text-[8px] font-semibold opacity-70">mm</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
