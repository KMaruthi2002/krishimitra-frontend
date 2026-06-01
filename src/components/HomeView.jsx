import { Card } from "./UI";
import Hero from "./Hero";
import WeatherWidget from "./WeatherWidget";
import { Wheat, Shield, Beaker, Droplet, Chat, ArrowRight, Mic, Sparkle } from "./Icons";
import { useT } from "../lib/I18nContext";

const TILES = [
  { id: "crop",  titleKey: "home.crop_advisor.title", subKey: "home.crop_advisor.subtitle", Icon: Wheat,
    grad: "linear-gradient(135deg, var(--primary-600), var(--primary-800))",
    soft: "color-mix(in srgb, var(--primary) 10%, var(--surface))", fg: "var(--primary)" },
  { id: "pest",  titleKey: "home.pest_guard.title",   subKey: "home.pest_guard.subtitle",   Icon: Shield,
    grad: "linear-gradient(135deg, #d97706, #92400e)",
    soft: "color-mix(in srgb, var(--accent) 10%, var(--surface))", fg: "var(--accent)" },
  { id: "fert",  titleKey: "home.fertilizer.title",   subKey: "home.fertilizer.subtitle",   Icon: Beaker,
    grad: "linear-gradient(135deg, #7c3aed, #4c1d95)",
    soft: "color-mix(in srgb, var(--violet) 10%, var(--surface))", fg: "var(--violet)" },
  { id: "water", titleKey: "home.irrigation.title",   subKey: "home.irrigation.subtitle",   Icon: Droplet,
    grad: "linear-gradient(135deg, var(--sky-600), #075985)",
    soft: "color-mix(in srgb, var(--sky) 10%, var(--surface))", fg: "var(--sky)" },
];

export default function HomeView({ weather, onTab, currentLang }) {
  const { t } = useT();
  return (
    <div className="space-y-3 fade-up">
      <Hero weather={weather} />
      {weather && <WeatherWidget data={weather} />}

      <div className="grid grid-cols-2 gap-2.5 stagger">
        {TILES.map((tile) => (
          <button
            key={tile.id}
            onClick={() => onTab(tile.id)}
            className="text-left rounded-2xl p-4 transition-all active:scale-[0.98] hover:-translate-y-1 group card-interactive"
            style={{ background: tile.soft, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                 style={{ background: tile.grad, boxShadow: "var(--shadow-sm)" }}>
              <tile.Icon size={18} />
            </div>
            <div className="mt-3 font-display text-[15px] font-extrabold leading-tight" style={{ color: "var(--text)" }}>
              {t(tile.titleKey)}
            </div>
            <div className="text-[11px] mt-1 leading-snug" style={{ color: "var(--text-muted)" }}>
              {t(tile.subKey)}
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold transition-all"
                 style={{ color: tile.fg, opacity: 0 }}
                 onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                 onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}>
              {t("home.open")} <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>

      <Card className="card-interactive">
        <button onClick={() => onTab("chat")} className="w-full text-left p-4 flex items-center gap-3 rounded-[14px]">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
               style={{ background: "var(--primary-soft)", color: "var(--primary)" }}>
            <Chat size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-display text-sm font-bold" style={{ color: "var(--text)" }}>{t("home.ask_title")}</div>
              <span className="chip chip-emerald chip-dot">{t("home.ai_badge")}</span>
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              {t("home.ask_subtitle", { lang: currentLang.label })}
            </div>
          </div>
          <div style={{ color: "var(--primary)" }}><Mic size={18} /></div>
        </button>
      </Card>

      <div className="pt-2 px-1 flex items-center justify-between text-[10px]" style={{ color: "var(--text-dim)" }}>
        <div className="flex items-center gap-1.5">
          <Sparkle size={10} /> {t("home.powered_by")}
        </div>
        <div>v2.0</div>
      </div>
    </div>
  );
}
