import { Card, Chip, SectionTitle, ProgressBar } from "./UI";
import ConfidenceRing from "./ConfidenceRing";
import RiskGauge from "./RiskGauge";
import { Wheat, Calendar, Droplet } from "./Icons";
import { useT } from "../lib/I18nContext";

const toneFor = (c) => (c > 70 ? "emerald" : c > 40 ? "amber" : "danger");

export default function CropCard({ data }) {
  const { t } = useT();
  if (!data?.recommendations) return null;
  const risks = data.risks || {};
  const fungal = risks.fungal?.score ?? 0;
  const drought = risks.drought?.score ?? 0;

  return (
    <Card className="overflow-hidden card-elev slide-up">
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-2">
        <div>
          <div className="eyebrow flex items-center gap-1.5" style={{ color: "var(--text-dim)" }}>
            <Wheat size={11} /> {t("crop.recommendation")}
          </div>
          <div className="font-display text-lg font-extrabold mt-1">{t("crop.best_for_you")}</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {data.season && <Chip tone="emerald">{data.season}</Chip>}
            {data.soil_type && <Chip tone="amber">{t(`soil.${data.soil_type}`)}</Chip>}
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
                  {top && <Chip tone="emerald" className="chip-dot">{t("crop.top_pick")}</Chip>}
                </div>
                <div className="flex gap-3 mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {r.growth_days && <span className="inline-flex items-center gap-1"><Calendar size={11} /> {t("crop.days_suffix", { n: r.growth_days })}</span>}
                  {r.water_need_mm_day && <span className="inline-flex items-center gap-1"><Droplet size={11} /> {t("crop.water_unit", { mm: r.water_need_mm_day })}</span>}
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
            <SectionTitle>{t("crop.risk_dashboard")}</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              <RiskGauge value={fungal} label={t("risk.fungal")}
                         tone={fungal > 0.6 ? "danger" : fungal > 0.3 ? "amber" : "emerald"}
                         level={risks.fungal?.level} />
              <RiskGauge value={drought} label={t("risk.drought")}
                         tone={drought > 0.6 ? "danger" : drought > 0.3 ? "amber" : "emerald"}
                         level={risks.drought?.level} />
            </div>
          </div>
        </>
      )}
    </Card>
  );
}
