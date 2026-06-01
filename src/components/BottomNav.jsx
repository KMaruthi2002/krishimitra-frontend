import { useEffect, useRef, useState } from "react";
import { TABS } from "../lib/constants";
import { Home, Wheat, Shield, Beaker, Droplet, Chat } from "./Icons";
import { useT } from "../lib/I18nContext";

const ICONS = { Home, Crop: Wheat, Pest: Shield, Fert: Beaker, Water: Droplet, Chat };

export default function BottomNav({ tab, onChange }) {
  const { t } = useT();
  const refs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = refs.current[tab];
    if (el) {
      const rect = el.getBoundingClientRect();
      const parent = el.parentElement.getBoundingClientRect();
      setIndicator({ left: rect.left - parent.left + rect.width / 2 - 14, width: 28 });
    }
  }, [tab]);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 glass safe-bottom mobile-only">
      <div className="max-w-lg mx-auto flex relative">
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 6, left: indicator.left, width: indicator.width, height: 3,
            background: "var(--primary)", borderRadius: 999,
            transition: "left .35s var(--ease-spring), width .25s ease",
          }}
        />
        {TABS.map((tab_) => {
          const active = tab === tab_.id;
          const Icon = ICONS[tab_.icon] || Home;
          const label = t(tab_.labelKey);
          return (
            <button
              key={tab_.id}
              ref={(el) => (refs.current[tab_.id] = el)}
              onClick={() => onChange(tab_.id)}
              className="flex-1 py-2.5 pt-3 flex flex-col items-center gap-1 transition-transform active:scale-95"
              aria-label={label}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={20} style={{ color: active ? "var(--primary)" : "var(--text-dim)", transition: "color .25s ease, transform .25s var(--ease-spring)", transform: active ? "scale(1.08)" : "scale(1)" }} />
              <span className="text-[10px] font-bold tracking-wide" style={{ color: active ? "var(--primary)" : "var(--text-dim)" }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// Desktop sidebar
export function SideNav({ tab, onChange }) {
  const { t } = useT();
  return (
    <aside className="desktop-only sticky top-[68px] h-[calc(100vh-68px)] w-[210px] flex-shrink-0 flex-col gap-1 py-4 px-3 hidden sm:flex">
      <div className="eyebrow mb-2 px-2" style={{ color: "var(--text-dim)" }}>{t("nav.workspace")}</div>
      {TABS.map((tab_) => {
        const active = tab === tab_.id;
        const Icon = ICONS[tab_.icon] || Home;
        return (
          <button
            key={tab_.id}
            onClick={() => onChange(tab_.id)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left relative"
            style={{
              background: active ? "var(--primary-soft)" : "transparent",
              color: active ? "var(--primary)" : "var(--text-muted)",
              transition: "background .25s ease, color .25s ease",
            }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--hover)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            aria-current={active ? "page" : undefined}
          >
            {active && <span style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, background: "var(--primary)", borderRadius: 999 }} />}
            <Icon size={18} />
            {t(tab_.labelKey)}
          </button>
        );
      })}
      <div className="mt-auto px-2 pb-2 text-[10px]" style={{ color: "var(--text-dim)" }}>
        <div className="font-semibold">KrishiMitra v2.0</div>
        <div className="mt-0.5 opacity-80">Open-Meteo · FastAPI</div>
      </div>
    </aside>
  );
}
