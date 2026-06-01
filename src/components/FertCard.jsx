import { Card, Chip, SectionTitle } from "./UI";

export default function FertCard({ data }) {
  if (!data) return null;

  return (
    <Card className="overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="section-title">Fertilizer plan</div>
        <div className="font-display text-lg font-bold mt-1">
          {data.crop}{" "}
          <span className="text-[11px] font-semibold align-middle ml-1" style={{ color: "var(--text-dim)" }}>
            · {data.growth_stage?.replace(/_/g, " ")}
          </span>
        </div>
      </div>
      <div className="divider" />

      <div className="p-3 space-y-2">
        {data.options?.map((f, i) => (
          <div key={i} className="rounded-xl p-3" style={{
            background: "var(--surface-2)",
            border: `1px solid ${f.safe_to_apply ? "#b8ead2" : "#fecaca"}`,
          }}>
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{f.fertilizer}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                  NPK {f.npk.join("-")} · {f.dosage_kg_per_ha} kg/ha
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{f.timing_advisory}</div>
              </div>
              <Chip tone={f.safe_to_apply ? "emerald" : "danger"}>
                {f.safe_to_apply ? "Apply" : "Wait"}
              </Chip>
            </div>
          </div>
        ))}

        {data.daily_plan?.length > 0 && (
          <div>
            <SectionTitle>Next 7 days</SectionTitle>
            <div className="space-y-1">
              {data.daily_plan.slice(0, 7).map((d, i) => {
                const apply = d.action.includes("APPLY");
                const skip  = d.action.includes("SKIP");
                const bg = apply ? "var(--primary-soft)" : skip ? "var(--danger-soft)" : "var(--surface-2)";
                const bd = apply ? "#b8ead2" : skip ? "#fecaca" : "var(--border)";
                const fg = apply ? "var(--primary-700)" : skip ? "#991b1b" : "var(--text-muted)";
                return (
                  <div key={i} className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg text-[11px]"
                       style={{ background: bg, border: `1px solid ${bd}` }}>
                    <span className="text-xs">{apply ? "✓" : skip ? "✗" : "·"}</span>
                    <span className="w-16 font-semibold metric-num" style={{ color: "var(--text)" }}>
                      {d.day?.slice(0, 3)} {d.date?.slice(5)}
                    </span>
                    <span style={{ color: "var(--text-dim)" }} className="metric-num">🌧 {d.rain_mm}mm</span>
                    <span className="flex-1 font-medium" style={{ color: fg }}>{d.action}</span>
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
