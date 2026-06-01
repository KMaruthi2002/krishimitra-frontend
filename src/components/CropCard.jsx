import { Card, Chip, ProgressBar } from "./UI";

export default function CropCard({ data }) {
  if (!data?.recommendations) return null;

  return (
    <Card className="overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
        <div>
          <div className="section-title">Recommended crops</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {data.season && <Chip tone="emerald">{data.season}</Chip>}
            {data.soil_type && <Chip tone="amber">{data.soil_type.replace("_", " ")}</Chip>}
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="p-3 space-y-2">
        {data.recommendations.slice(0, 5).map((r, i) => {
          const c = Math.round((r.confidence || 0) * 100);
          const tone = c > 70 ? "emerald" : c > 40 ? "amber" : "danger";
          return (
            <div
              key={i}
              className="rounded-xl p-3"
              style={{
                background: i === 0 ? "var(--primary-soft)" : "var(--surface-2)",
                border: `1px solid ${i === 0 ? "#b8ead2" : "var(--border)"}`,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-7 h-7 inline-flex items-center justify-center rounded-lg font-bold text-xs"
                        style={{ background: i === 0 ? "var(--primary-700)" : "var(--surface)", color: i === 0 ? "#ecfdf5" : "var(--text-muted)", border: i === 0 ? "none" : "1px solid var(--border)" }}>
                    {i + 1}
                  </span>
                  <span className="font-semibold text-sm truncate" style={{ color: "var(--text)" }}>{r.crop}</span>
                </div>
                <span className="text-lg font-extrabold metric-num" style={{ color: tone === "emerald" ? "var(--primary-700)" : tone === "amber" ? "#b45309" : "#991b1b" }}>{c}%</span>
              </div>
              <div className="mt-2"><ProgressBar value={c} tone={tone} /></div>
              <div className="flex gap-3 mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
                {r.growth_days && <span>📅 {r.growth_days} days</span>}
                {r.water_need_mm_day && <span>💧 {r.water_need_mm_day} mm/day</span>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
