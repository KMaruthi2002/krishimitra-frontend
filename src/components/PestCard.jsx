import { Card, Chip, SectionTitle } from "./UI";

export default function PestCard({ data }) {
  if (!data) return null;
  const pests = data.risks?.pests || [];
  const diseases = data.risks?.diseases || [];
  const recs = data.recommendations || [];
  const wins = data.spray_windows || [];

  return (
    <Card className="overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="section-title">Pest &amp; disease</div>
        <div className="font-display text-lg font-bold mt-1">{data.crop}</div>
      </div>
      <div className="divider" />

      <div className="p-3 space-y-3">
        {(pests.length > 0 || diseases.length > 0) && (
          <div className="rounded-xl p-3" style={{ background: "var(--danger-soft)", border: "1px solid #fecaca" }}>
            <SectionTitle>Active threats</SectionTitle>
            <div className="space-y-1.5">
              {pests.map((p, i) => {
                const pct = Math.round(p.probability * 100);
                return (
                  <div key={`p${i}`} className="flex items-center gap-2 text-xs">
                    <span>🐛</span>
                    <span style={{ color: "var(--text)" }}>{p.pest.replace(/_/g, " ")}</span>
                    <Chip tone={pct > 60 ? "danger" : "amber"}>{pct}%</Chip>
                  </div>
                );
              })}
              {diseases.map((d, i) => {
                const pct = Math.round(d.probability * 100);
                return (
                  <div key={`d${i}`} className="flex items-center gap-2 text-xs">
                    <span>🦠</span>
                    <span style={{ color: "var(--text)" }}>{d.disease.replace(/_/g, " ")}</span>
                    <Chip tone={pct > 60 ? "danger" : "amber"}>{pct}%</Chip>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {recs.slice(0, 3).map((r, i) => (
          <div key={i} className="rounded-xl p-3" style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="font-semibold text-sm" style={{ color: "var(--text)" }}>{r.pesticide}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                  💊 {r.dosage}/L · {r.for_threat?.replace(/_/g, " ")} · 🌧 {r.rain_free_hours}h
                </div>
              </div>
              <Chip tone={r.safe_to_spray ? "emerald" : "amber"}>{r.safe_to_spray ? "Safe" : "Caution"}</Chip>
            </div>
          </div>
        ))}

        {wins.length > 0 && (
          <div>
            <SectionTitle>Spray calendar (this week)</SectionTitle>
            <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
              {wins.map((w, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-14 rounded-lg py-2 text-center text-[10px]"
                  style={{
                    background: w.safe ? "var(--primary-soft)" : "var(--danger-soft)",
                    border: `1px solid ${w.safe ? "#b8ead2" : "#fecaca"}`,
                    color:  w.safe ? "var(--primary-700)" : "#991b1b",
                  }}
                >
                  <div className="font-bold">{w.day?.slice(0, 3)}</div>
                  <div className="text-sm mt-0.5">{w.safe ? "✓" : "✗"}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
