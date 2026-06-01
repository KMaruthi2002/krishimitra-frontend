import { Card, Chip, SectionTitle } from "./UI";
import { Beaker, Calendar, Check, X, ChevronRight } from "./Icons";

export default function FertCard({ data }) {
  if (!data) return null;

  return (
    <Card className="overflow-hidden card-elev slide-up">
      <div className="px-4 pt-4 pb-3">
        <div className="eyebrow flex items-center gap-1.5" style={{ color: "var(--text-dim)" }}>
          <Beaker size={11} /> Fertilizer
        </div>
        <div className="font-display text-lg font-extrabold mt-1">{data.crop} nutrition plan</div>
        <div className="mt-1.5 flex gap-1.5">
          {data.growth_stage && <Chip tone="violet">{data.growth_stage.replace(/_/g, " ")}</Chip>}
        </div>
      </div>
      <div className="divider" />

      <div className="p-3 space-y-2.5 stagger">
        {data.options?.map((f, i) => (
          <div key={i} className="rounded-xl p-3 flex items-center gap-3 card-interactive" style={{
            background: "var(--surface-2)",
            border: `1px solid ${f.safe_to_apply ? "color-mix(in srgb, var(--primary) 25%, transparent)" : "color-mix(in srgb, var(--danger) 25%, transparent)"}`,
          }}>
            <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center font-display"
                 style={{
                   background: f.safe_to_apply ? "var(--primary-soft)" : "var(--danger-soft)",
                   color: f.safe_to_apply ? "var(--primary)" : "var(--danger)",
                 }}>
              <div className="text-[8px] font-bold">NPK</div>
              <div className="text-[10px] font-extrabold metric-num leading-tight">{f.npk.join("-")}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm" style={{ color: "var(--text)" }}>{f.fertilizer}</div>
              <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                <span className="metric-num font-semibold">{f.dosage_kg_per_ha} kg/ha</span> · {f.timing_advisory}
              </div>
            </div>
            <Chip tone={f.safe_to_apply ? "emerald" : "danger"} className="chip-dot">
              {f.safe_to_apply ? "Apply" : "Wait"}
            </Chip>
          </div>
        ))}

        {data.daily_plan?.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={13} style={{ color: "var(--primary)" }} />
              <SectionTitle>Next 7 days</SectionTitle>
            </div>
            <div className="space-y-1.5">
              {data.daily_plan.slice(0, 7).map((d, i) => {
                const apply = d.action.includes("APPLY");
                const skip  = d.action.includes("SKIP");
                const bg = apply ? "var(--primary-soft)" : skip ? "var(--danger-soft)" : "var(--surface-2)";
                const bd = apply ? "color-mix(in srgb, var(--primary) 25%, transparent)" : skip ? "color-mix(in srgb, var(--danger) 25%, transparent)" : "var(--border)";
                const fg = apply ? "var(--primary)" : skip ? "var(--danger)" : "var(--text-muted)";
                return (
                  <div key={i} className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs"
                       style={{ background: bg, border: `1px solid ${bd}`, animation: `fadeUp .35s ${i * 60}ms var(--ease-smooth) both` }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ color: fg }}>
                      {apply ? <Check size={12} /> : skip ? <X size={12} /> : <ChevronRight size={12} />}
                    </div>
                    <span className="w-16 font-bold metric-num" style={{ color: "var(--text)" }}>
                      {d.day?.slice(0, 3)} {d.date?.slice(5)}
                    </span>
                    <span className="metric-num" style={{ color: "var(--text-dim)" }}>{d.rain_mm}mm</span>
                    <span className="flex-1 font-semibold leading-snug" style={{ color: fg }}>{d.action}</span>
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
