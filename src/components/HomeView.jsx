import { Card } from "./UI";
import WeatherWidget from "./WeatherWidget";

const TILES = [
  { id: "crop",  title: "Crop Advisor", subtitle: "What to plant",  grad: "linear-gradient(135deg, #059669, #047857)", glyph: "🌾" },
  { id: "pest",  title: "Pest Guard",   subtitle: "Protect crops",  grad: "linear-gradient(135deg, #b45309, #92400e)", glyph: "🛡️" },
  { id: "fert",  title: "Fertilizer",   subtitle: "When to apply",  grad: "linear-gradient(135deg, #7c3aed, #5b21b6)", glyph: "🧪" },
  { id: "water", title: "Irrigation",   subtitle: "Water plan",     grad: "linear-gradient(135deg, #0369a1, #075985)", glyph: "💧" },
];

export default function HomeView({ weather, onTab, currentLang }) {
  return (
    <div className="space-y-3 fade-up">
      {weather && <WeatherWidget data={weather} />}

      <div className="grid grid-cols-2 gap-2">
        {TILES.map((t) => (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            className="text-left rounded-2xl p-4 transition-transform active:scale-[0.98] hover:-translate-y-0.5"
            style={{ background: t.grad, color: "#fff", boxShadow: "0 10px 30px -12px rgba(15,26,20,.25)" }}
          >
            <div className="text-2xl">{t.glyph}</div>
            <div className="mt-3 font-display text-base font-bold">{t.title}</div>
            <div className="text-[11px] opacity-80 mt-0.5">{t.subtitle}</div>
          </button>
        ))}
      </div>

      <Card>
        <button
          onClick={() => onTab("chat")}
          className="w-full text-left p-4 flex items-center gap-3 rounded-[14px]"
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
               style={{ background: "var(--primary-soft)", color: "var(--primary-700)" }}>💬</div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm font-bold" style={{ color: "var(--text)" }}>Ask KrishiMitra</div>
            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Voice &amp; text in {currentLang.label}
            </div>
          </div>
          <div className="text-lg" style={{ color: "var(--primary-700)" }}>🎤</div>
        </button>
      </Card>
    </div>
  );
}
