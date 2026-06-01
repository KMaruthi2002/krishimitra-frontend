import { Card, Chip, SectionTitle } from "./UI";
import RiskGauge from "./RiskGauge";
import AnimatedNumber from "./AnimatedNumber";
import { Droplet, Calendar, Activity, TrendingUp, Check } from "./Icons";
import { useT } from "../lib/I18nContext";

export default function IrrigCard({ data }) {
  const { t } = useT();
  if (!data) return null;
  const a = data.analysis || {};
  const def = a.irrigation_deficit_mm || 0;
  const need = a.crop_water_need_mm || 0;
  const tone = def > 5 ? "danger" : def > 2 ? "amber" : "emerald";
  const sufficiency = Math.max(0, Math.min(1, 1 - def / Math.max(0.1, need)));

  const toneColor =
    tone === "danger" ? "var(--danger)" :
    tone === "amber"  ? "var(--accent)" : "var(--primary)";

  return (
    <Card className="overflow-hidden card-elev slide-up">
      <div className="px-4 pt-4 pb-3">
        <div className="eyebrow flex items-center gap-1.5" style={{ color: "var(--text-dim)" }}>
          <Droplet size={11} /> {t("irrig.irrigation")}
        </div>
        <div className="font-display text-lg font-extrabold mt-1">{t("irrig.water_plan", { crop: data.crop })}</div>
        <div className="mt-1.5 flex gap-1.5 flex-wrap">
          {data.growth_stage && <Chip tone="sky">{t(`stage.${data.growth_stage}`)}</Chip>}
          {data.et0 && <Chip>ET₀ {data.et0} mm/d</Chip>}
        </div>
      </div>
      <div className="divider" />

      <div className="p-3 space-y-3">
        <div className="grid grid-cols-3 gap-2 stagger">
          <div className="rounded-xl p-3 card-interactive" style={{ background: "var(--sky-soft)", border: "1px solid color-mix(in srgb, var(--sky) 25%, transparent)" }}>
            <div className="flex items-center gap-1.5">
              <Droplet size={11} style={{ color: "var(--sky)" }} />
              <div className="eyebrow" style={{ color: "var(--sky)" }}>{t("irrig.need")}</div>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-2xl font-extrabold metric-num" style={{ color: "var(--sky)" }}>
                <AnimatedNumber value={need} decimals={1} />
              </span>
              <span className="text-[10px] font-semibold" style={{ color: "var(--sky)" }}>mm/day</span>
            </div>
          </div>

          <div className="rounded-xl p-3 card-interactive" style={{
            background: tone === "danger" ? "var(--danger-soft)" : tone === "amber" ? "var(--accent-soft)" : "var(--primary-soft)",
            border: `1px solid color-mix(in srgb, ${toneColor} 25%, transparent)`,
          }}>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={11} style={{ color: toneColor }} />
              <div className="eyebrow" style={{ color: toneColor }}>{t("irrig.deficit")}</div>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-2xl font-extrabold metric-num" style={{ color: toneColor }}>
                <AnimatedNumber value={def} decimals={1} />
              </span>
              <span className="text-[10px] font-semibold" style={{ color: toneColor }}>mm/day</span>
            </div>
          </div>

          <RiskGauge
            value={sufficiency}
            label={t("irrig.sufficiency")}
            tone={sufficiency > 0.7 ? "emerald" : sufficiency > 0.4 ? "amber" : "danger"}
          />
        </div>

        <div className="rounded-xl px-3 py-3 text-sm font-semibold flex items-center gap-2 slide-up" style={{
          background: tone === "danger" ? "var(--danger-soft)" : tone === "amber" ? "var(--accent-soft)" : "var(--primary-soft)",
          color: toneColor,
          border: `1px solid color-mix(in srgb, ${toneColor} 25%, transparent)`,
        }}>
          <Activity size={14} />
          {a.recommendation}
        </div>

        {data.daily_schedule?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={13} style={{ color: "var(--primary)" }} />
              <SectionTitle>{t("irrig.daily_schedule")}</SectionTitle>
            </div>
            <div className="space-y-1.5">
              {data.daily_schedule.slice(0, 7).map((d, i) => {
                const needs = d.irrigate_mm > 1;
                return (
                  <div key={i} className="flex items-center gap-2 py-2 px-3 rounded-lg text-xs"
                       style={{
                         background: needs ? "var(--sky-soft)" : "var(--surface-2)",
                         border: `1px solid ${needs ? "color-mix(in srgb, var(--sky) 25%, transparent)" : "var(--border)"}`,
                         animation: `fadeUp .35s ${i * 60}ms var(--ease-smooth) both`,
                       }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ color: needs ? "var(--sky)" : "var(--primary)" }}>
                      {needs ? <Droplet size={12} /> : <Check size={12} />}
                    </div>
                    <span className="w-16 font-bold metric-num" style={{ color: "var(--text)" }}>
                      {d.day?.slice(0, 3)} {d.date?.slice(5)}
                    </span>
                    <span className="metric-num" style={{ color: "var(--text-dim)" }}>{d.rain_mm}mm</span>
                    <span className="flex-1 font-semibold metric-num" style={{ color: needs ? "var(--sky)" : "var(--primary)" }}>
                      {needs ? t("irrig.irrigate_mm", { mm: d.irrigate_mm }) : t("irrig.no_irrigation")}
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
