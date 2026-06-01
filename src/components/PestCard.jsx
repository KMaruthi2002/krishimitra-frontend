import { Card, Chip, SectionTitle } from "./UI";
import { Shield, Alert, Calendar, Check, X } from "./Icons";

export default function PestCard({ data }) {
  if (!data) return null;
  const pests = data.risks?.pests || [];
  const diseases = data.risks?.diseases || [];
  const recs = data.recommendations || [];
  const wins = data.spray_windows || [];

  return (
    <Card className="overflow-hidden card-elev slide-up">
      <div className="px-4 pt-4 pb-3">
        <div className="eyebrow flex items-center gap-1.5" style={{ color: "var(--text-dim)" }}>
          <Shield size={11} /> Protection
        </div>
        <div className="font-display text-lg font-extrabold mt-1">{data.crop} threats &amp; spray plan</div>
      </div>
      <div className="divider" />

      <div className="p-3 space-y-3 stagger">
        {(pests.length > 0 || diseases.length > 0) && (
          <div className="rounded-xl p-3" style={{ background: "var(--danger-soft)", border: "1px solid color-mix(in srgb, var(--danger) 25%, transparent)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Alert size={14} style={{ color: "var(--danger)" }} />
              <SectionTitle>Active threats</SectionTitle>
            </div>
            <div className="space-y-2">
              {pests.map((p, i) => {
                const pct = Math.round(p.probability * 100);
                return (
                  <div key={`p${i}`} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: pct > 60 ? "var(--danger)" : "var(--accent)" }} />
                    <span className="font-semibold capitalize flex-1" style={{ color: "var(--text)" }}>{p.pest.replace(/_/g, " ")}</span>
                    <Chip tone={pct > 60 ? "danger" : "amber"} className="metric-num">{pct}%</Chip>
                  </div>
                );
              })}
              {diseases.map((d, i) => {
                const pct = Math.round(d.probability * 100);
                return (
                  <div key={`d${i}`} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: pct > 60 ? "var(--danger)" : "var(--accent)" }} />
                    <span className="font-semibold capitalize flex-1" style={{ color: "var(--text)" }}>{d.disease.replace(/_/g, " ")}</span>
                    <Chip tone={pct > 60 ? "danger" : "amber"} className="metric-num">{pct}%</Chip>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {recs.slice(0, 3).map((r, i) => (
          <div key={i} className="rounded-xl p-3 card-interactive"
               style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="font-display font-bold text-[14px]" style={{ color: "var(--text)" }}>{r.pesticide}</div>
                <div className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                  <span className="font-semibold metric-num">{r.dosage}/L</span> · {r.category?.replace(/_/g, " ")} · for {r.for_threat?.replace(/_/g, " ")}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--text-dim)" }}>
                  Rain-free needed: <span className="metric-num font-semibold">{r.rain_free_hours}h</span>
                </div>
              </div>
              <Chip tone={r.safe_to_spray ? "emerald" : "amber"} className="chip-dot">
                {r.safe_to_spray ? "Safe now" : "Caution"}
              </Chip>
            </div>
          </div>
        ))}

        {wins.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={13} style={{ color: "var(--primary)" }} />
              <SectionTitle>Spray calendar — this week</SectionTitle>
            </div>
            <div className="grid grid-cols-7 gap-1.5 stagger">
              {wins.map((w, i) => (
                <div key={i} className="rounded-lg py-2 text-center transition-transform hover:scale-105"
                     style={{
                       background: w.safe ? "var(--primary-soft)" : "var(--danger-soft)",
                       border: `1px solid ${w.safe ? "color-mix(in srgb, var(--primary) 25%, transparent)" : "color-mix(in srgb, var(--danger) 25%, transparent)"}`,
                       color: w.safe ? "var(--primary)" : "var(--danger)",
                     }}>
                  <div className="text-[10px] font-bold uppercase tracking-wide">{w.day?.slice(0, 3)}</div>
                  <div className="mt-1 flex justify-center">{w.safe ? <Check size={14} /> : <X size={14} />}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
