import { Card, Chip, SectionTitle, ProgressBar } from "./UI";
import ConfidenceRing from "./ConfidenceRing";
import RiskGauge from "./RiskGauge";
import { Wheat, Calendar, Droplet } from "./Icons";

const toneFor = (c) => (c > 70 ? "emerald" : c > 40 ? "amber" : "danger");

export default function CropCard({ data }) {
  if (!data?.recommendations) return null;
  const risks = data.risks || {};
  const fungal = risks.fungal?.score ?? 0;
  const drought = risks.drought?.score ?? 0;

  return (
    <Card className="overflow-hidden card-elev slide-up">
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
        <div>
          <div className="eyebrow flex items-center gap-1.5" style={{ color: "var(--text-dim)" }}>
            <Wheat size={11} /> Recommendation
          </div>
          <div className="font-display text-lg font-extrabold mt-1">Best crops for you</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {data.season && <Chip tone="emerald">{data.season}</Chip>}
            {data.soil_type && <Chip tone="amber">{data.soil_type.replace("_", " ")}</Chip>}
            {data.location && <Chip>{data.location}</Chip>}
          </div>
        </div>
      </div>

      <div className="divider" />

      <div className="p-3 space-y-2 stagger">
        {data.recommendations.slice(0, 5).map((r, i) => {
          const c = Math.round((r.confidence || 0) * 100);
          const tone = toneFor(c);
          const top = i === 0;
          return (
            <div key={i} className="rounded-xl p-3 flex items-center gap-3 transition-all card-interactive"
                 style={{
                   background: top ? "var(--primary-soft)" : "var(--surface-2)",
                   border: `1px solid ${top ? "color-mix(in srgb, var(--primary) 28%, transparent)" : "var(--border)"}`,
                 }}>
              <ConfidenceRing value={c} tone={tone} size={56} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[15px] font-extrabold" style={{ color: "var(--text)" }}>{r.crop}</span>
                  {top && <Chip tone="emerald" className="chip-dot">Top pick</Chip>}
                </div>
                <div className="flex gap-3 mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {r.growth_days && <span className="inline-flex items-center gap-1"><Calendar size={11} /> {r.growth_days}d</span>}
                  {r.water_need_mm_day && <span className="inline-flex items-center gap-1"><Droplet size={11} /> {r.water_need_mm_day} mm/day</span>}
                </div>
                <div className="mt-2"><ProgressBar value={c} tone={tone} /></div>
              </div>
            </div>
          );
        })}
      </div>

      {(fungal > 0 || drought > 0) && (
        <>
          <div className="divider" />
          <div className="p-3">
            <SectionTitle>Risk dashboard</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <RiskGauge value={fungal} label="Fungal"
                         tone={fungal > 0.6 ? "danger" : fungal > 0.3 ? "amber" : "emerald"}
                         level={risks.fungal?.level} />
              <RiskGauge value={drought} label="Drought"
                         tone={drought > 0.6 ? "danger" : drought > 0.3 ? "amber" : "emerald"}
                         level={risks.drought?.level} />
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
