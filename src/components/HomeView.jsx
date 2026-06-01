import { Card } from "./UI";
import Hero from "./Hero";
import WeatherWidget from "./WeatherWidget";
import { Wheat, Shield, Beaker, Droplet, Chat, ArrowRight, Mic, Sparkle } from "./Icons";

const TILES = [
  { id: "crop",  title: "Crop Advisor",   subtitle: "Best plants for your soil + season", Icon: Wheat,
    grad: "linear-gradient(135deg, var(--primary-600), var(--primary-800))",
    soft: "color-mix(in srgb, var(--primary) 10%, var(--surface))", fg: "var(--primary-700)" },
  { id: "pest",  title: "Pest Guard",     subtitle: "Threat detection + spray windows",   Icon: Shield,
    grad: "linear-gradient(135deg, #d97706, #92400e)",
    soft: "color-mix(in srgb, var(--accent) 10%, var(--surface))", fg: "var(--accent)" },
  { id: "fert",  title: "Fertilizer",     subtitle: "Rain-aware NPK schedule",            Icon: Beaker,
    grad: "linear-gradient(135deg, #7c3aed, #4c1d95)",
    soft: "color-mix(in srgb, var(--violet) 10%, var(--surface))", fg: "var(--violet)" },
  { id: "water", title: "Irrigation",     subtitle: "Daily deficit + water plan",         Icon: Droplet,
    grad: "linear-gradient(135deg, var(--sky-600), #075985)",
    soft: "color-mix(in srgb, var(--sky) 10%, var(--surface))", fg: "var(--sky)" },
];

export default function HomeView({ weather, onTab, currentLang }) {
  return (
    <div className="space-y-3 fade-up">
      <Hero weather={weather} />
      {weather && <WeatherWidget data={weather} />}

      <div className="grid grid-cols-2 gap-2.5 stagger">
        {TILES.map((t) => (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            className="text-left rounded-2xl p-4 transition-all active:scale-[0.98] hover:-translate-y-1 group card-interactive"
            style={{ background: t.soft, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                 style={{ background: t.grad, boxShadow: "var(--shadow-sm)" }}>
              <t.Icon size={18} />
            </div>
            <div className="mt-3 font-display text-[15px] font-extrabold leading-tight" style={{ color: "var(--text)" }}>
              {t.title}
            </div>
            <div className="text-[11px] mt-1 leading-snug" style={{ color: "var(--text-muted)" }}>
              {t.subtitle}
            </div>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold transition-all"
                 style={{ color: t.fg, opacity: 0 }}
                 onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                 onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}>
              Open <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>

      <Card className="card-interactive">
        <button onClick={() => onTab("chat")} className="w-full text-left p-4 flex items-center gap-3 rounded-[14px]">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
               style={{ background: "var(--primary-soft)", color: "var(--primary-700)" }}>
            <Chat size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-display text-sm font-bold" style={{ color: "var(--text)" }}>Ask KrishiMitra</div>
              <span className="chip chip-emerald chip-dot">AI</span>
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
              Voice &amp; text in {currentLang.label} — personalised advice in seconds
            </div>
          </div>
          <div style={{ color: "var(--primary-700)" }}><Mic size={18} /></div>
        </button>
      </Card>

      <div className="pt-2 px-1 flex items-center justify-between text-[10px]" style={{ color: "var(--text-dim)" }}>
        <div className="flex items-center gap-1.5">
          <Sparkle size={10} /> Powered by Open-Meteo, FastAPI, XGBoost
        </div>
        <div>v2.0</div>
      </div>
    </div>
  );
}
