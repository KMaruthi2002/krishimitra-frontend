import { Card, MetricTile, SectionTitle } from "./UI";

export default function IrrigCard({ data }) {
  if (!data) return null;
  const a = data.analysis || {};
  const def = a.irrigation_deficit_mm || 0;
  const tone = def > 5 ? "danger" : def > 2 ? "amber" : "emerald";
  const headline = a.recommendation || "";

  return (
    <Card className="overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="section-title">Irrigation plan</div>
        <div className="font-display text-lg font-bold mt-1">
          {data.crop}{" "}
          <span className="text-[11px] font-semibold align-middle ml-1" style={{ color: "var(--text-dim)" }}>
            · {data.growth_stage?.replace(/_/g, " ")}
          </span>
        </div>
      </div>
      <div className="divider" />

      <div className="p-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <MetricTile label="Crop need" value={a.crop_water_need_mm ?? "–"} unit="mm/day" tone="sky" />
          <MetricTile label="Deficit"   value={def}                          unit="mm/day" tone={tone} />
        </div>

        <div className="rounded-xl px-3 py-2.5 text-sm font-medium" style={{
          background: tone === "danger" ? "var(--danger-soft)" : tone === "amber" ? "var(--accent-soft)" : "var(--primary-soft)",
          color:      tone === "danger" ? "#991b1b" : tone === "amber" ? "#92400e" : "var(--primary-700)",
          border: `1px solid ${tone === "danger" ? "#fecaca" : tone === "amber" ? "#fde6a3" : "#b8ead2"}`,
        }}>{headline}</div>

        {data.daily_schedule?.length > 0 && (
          <div>
            <SectionTitle>Daily schedule</SectionTitle>
            <div className="space-y-1">
              {data.daily_schedule.slice(0, 7).map((d, i) => {
                const needs = d.irrigate_mm > 1;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-[11px]"
                    style={{
                      background: needs ? "var(--sky-soft)" : "var(--surface-2)",
                      border: `1px solid ${needs ? "#bae6fd" : "var(--border)"}`,
                    }}
                  >
                    <span>{needs ? "💧" : "✓"}</span>
                    <span className="w-16 font-semibold metric-num" style={{ color: "var(--text)" }}>
                      {d.day?.slice(0, 3)} {d.date?.slice(5)}
                    </span>
                    <span className="metric-num" style={{ color: "var(--text-dim)" }}>🌧 {d.rain_mm}mm</span>
                    <span className="flex-1 font-semibold metric-num" style={{ color: needs ? "#0369a1" : "var(--primary-700)" }}>
                      {needs ? `Irrigate ${d.irrigate_mm}mm` : "No irrigation"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
