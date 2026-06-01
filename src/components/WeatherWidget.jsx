import { Card, Chip, MetricTile } from "./UI";

function WxIcon({ rain, humidity }) {
  if (rain > 20) return "⛈";
  if (rain > 5)  return "🌧";
  if (rain > 0.5) return "🌦";
  if (humidity > 70) return "⛅";
  return "☀️";
}

export default function WeatherWidget({ data }) {
  if (!data?.daily) return null;
  const s = data.summary || {};
  const live = data.source === "open_meteo_live";

  return (
    <Card className="overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex items-start justify-between">
        <div className="min-w-0">
          <div className="section-title">Weather forecast</div>
          <div className="font-display text-lg font-bold mt-1 truncate">{data.location}</div>
        </div>
        <Chip tone={live ? "emerald" : "amber"}>
          <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ background: live ? "#059669" : "#b45309" }} />
          {live ? "Live" : "Estimate"}
        </Chip>
      </div>

      <div className="px-4 pb-3 grid grid-cols-4 gap-2">
        <MetricTile label="Temp"   value={`${s.temp_min ?? "–"}°–${s.temp_max ?? "–"}°`} unit="C"     tone="amber" />
        <MetricTile label="Humid"  value={`${s.humidity_avg ?? "–"}%`}                                 tone="emerald" />
        <MetricTile label="Rain"   value={`${s.rainfall_total ?? "–"}`}                  unit="mm"     tone="sky" />
        <MetricTile label="Wind"   value={`${s.wind_speed_avg ?? "–"}`}                  unit="km/h"   tone="neutral" />
      </div>

      <div className="px-3 pb-3 overflow-x-auto hide-scrollbar">
        <div className="flex gap-1.5">
          {data.daily.slice(0, 7).map((d, i) => {
            const wet = d.rainfall > 0.5;
            return (
              <div
                key={i}
                className="flex-shrink-0 w-[64px] rounded-xl p-2 text-center"
                style={{
                  background: wet ? "var(--sky-soft)" : "var(--surface-2)",
                  border: `1px solid ${wet ? "#bae6fd" : "var(--border)"}`,
                }}
              >
                <div className="text-[10px] font-bold tracking-wide" style={{ color: "var(--text-dim)" }}>{d.day_name?.slice(0, 3)}</div>
                <div className="text-xl my-1"><WxIcon rain={d.rainfall} humidity={d.humidity} /></div>
                <div className="text-xs font-bold metric-num" style={{ color: "var(--text)" }}>{d.temp_max}°</div>
                <div className="text-[10px] metric-num" style={{ color: "var(--text-dim)" }}>{d.temp_min}°</div>
                {wet && <div className="mt-0.5 text-[10px] font-bold metric-num" style={{ color: "#0369a1" }}>{d.rainfall}mm</div>}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
