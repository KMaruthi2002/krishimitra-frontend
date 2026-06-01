import { useEffect, useState } from "react";
import { LANGUAGES, LOCATIONS } from "../lib/constants";
import { Leaf, Globe, Volume, VolumeX, Sun, Moon, ChevronDown, MapPin } from "./Icons";
import { useT } from "../lib/I18nContext";

function LocationPicker({ loc, setLoc }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    function onDoc(e) {
      if (!e.target.closest?.("[data-loc-pop]")) { setOpen(false); setFilter(""); }
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const matches = LOCATIONS.filter((l) => l.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="relative" data-loc-pop>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
        style={{
          background: "var(--primary-soft)",
          color: "var(--primary)",
          border: "1px solid color-mix(in srgb, var(--primary) 28%, transparent)",
          height: 38,
        }}
        aria-label="Change location"
      >
        <MapPin size={13} />
        <span className="truncate max-w-[120px]">{loc}</span>
        <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .25s ease" }} />
      </button>

      {open && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-[260px] slide-up glass-strong"
             style={{ borderRadius: 14, boxShadow: "var(--shadow-md)", zIndex: 60 }}>
          <div className="p-2">
            <div className="relative">
              <MapPin size={12} style={{ position: "absolute", left: 10, top: 11, color: "var(--text-dim)" }} />
              <input
                value={filter}
                autoFocus
                onChange={(e) => setFilter(e.target.value)}
                placeholder={t("header.search_location")}
                className="w-full pl-7 pr-2 py-1.5 text-[12px] font-medium rounded-lg"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", outline: "none" }}
              />
            </div>
          </div>
          <div className="max-h-[280px] overflow-y-auto py-1 stagger">
            {matches.length === 0 && (
              <div className="px-3 py-3 text-[11px]" style={{ color: "var(--text-dim)" }}>{t("header.no_matches")}</div>
            )}
            {matches.map((l) => {
              const active = l === loc;
              return (
                <button
                  key={l}
                  onClick={() => { setLoc(l); setOpen(false); setFilter(""); }}
                  className="w-full px-3 py-2 text-left flex items-center gap-2.5 text-sm font-semibold transition-colors"
                  style={{
                    background: active ? "var(--primary-soft)" : "transparent",
                    color: active ? "var(--primary)" : "var(--text)",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--hover)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <MapPin size={13} style={{ color: active ? "var(--primary)" : "var(--text-dim)" }} />
                  <span className="flex-1">{l}</span>
                  {active && <span className="text-[10px] font-bold" style={{ color: "var(--primary)" }}>{t("header.selected")}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header({ lang, setLang, voiceEnabled, setVoiceEnabled, onSpeakGreeting, theme, setTheme, loc, setLoc }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function onDoc(e) {
      if (!e.target.closest?.("[data-lang-pop]")) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white relative overflow-hidden"
               style={{ background: "linear-gradient(135deg, var(--primary-600), var(--primary-800))",
                        boxShadow: "0 10px 22px -10px color-mix(in srgb, var(--primary) 60%, transparent), inset 0 1px 0 rgba(255,255,255,.15)" }}>
            <Leaf size={20} />
          </div>
          <div className="min-w-0 hidden xs:block">
            <h1 className="font-display text-[17px] font-extrabold tracking-tight leading-none">KrishiMitra</h1>
            <div className="hidden sm:flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-semibold uppercase tracking-[.16em]" style={{ color: "var(--text-dim)" }}>{t("brand.kana")}</span>
              <span className="w-1 h-1 rounded-full" style={{ background: "var(--text-faint)" }} />
              <span className="text-[10px] font-semibold uppercase tracking-[.12em]" style={{ color: "var(--text-dim)" }}>{t("brand.subtitle")}</span>
            </div>
          </div>
        </div>

        {/* Centralized location pill */}
        {loc && setLoc && (
          <div className="ml-1 sm:ml-2">
            <LocationPicker loc={loc} setLoc={setLoc} />
          </div>
        )}

        <div className="flex-1" />

        <div className="relative" data-lang-pop>
          <button onClick={() => setOpen(!open)} className="btn-icon px-2.5 gap-1.5" style={{ width: "auto", height: 38 }}>
            <Globe size={15} />
            <span className="text-xs font-semibold hidden sm:inline">{current.label}</span>
            <span className="text-xs font-semibold sm:hidden">{current.flag}</span>
            <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .25s ease" }} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-64 slide-up glass-strong" style={{ borderRadius: 14, boxShadow: "var(--shadow-md)" }}>
              <div className="p-1.5 grid grid-cols-1 gap-1 stagger">
                {LANGUAGES.map((l) => {
                  const active = l.code === lang;
                  return (
                    <button key={l.code}
                      onClick={() => { setLang(l.code); setOpen(false); onSpeakGreeting?.(l); }}
                      className="px-3 py-2 rounded-lg text-left flex items-center gap-2.5 transition-colors"
                      style={{ background: active ? "var(--primary-soft)" : "transparent", color: active ? "var(--primary)" : "var(--text)" }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--hover)"; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold"
                            style={{ background: active ? "var(--primary)" : "var(--surface-2)", color: active ? "#fff" : "var(--text-muted)" }}>
                        {l.flag}
                      </span>
                      <span className="text-sm font-semibold flex-1">{l.label}</span>
                      {active && <span className="text-[10px] font-bold" style={{ color: "var(--primary)" }}>{t("header.selected")}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <button onClick={() => setVoiceEnabled(!voiceEnabled)} aria-label="Toggle voice" className={`btn-icon ${voiceEnabled ? "btn-icon-active" : ""}`}>
          {voiceEnabled ? <Volume size={16} /> : <VolumeX size={16} />}
        </button>

        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme" className="btn-icon" style={{ position: "relative", overflow: "hidden" }}>
          <span style={{
            display: "inline-flex", transition: "transform .4s var(--ease-spring), opacity .25s ease",
            transform: theme === "dark" ? "rotate(0deg)" : "rotate(180deg) scale(.6)",
            opacity: theme === "dark" ? 1 : 0, position: "absolute"
          }}>
            <Sun size={16} />
          </span>
          <span style={{
            display: "inline-flex", transition: "transform .4s var(--ease-spring), opacity .25s ease",
            transform: theme === "dark" ? "rotate(-180deg) scale(.6)" : "rotate(0deg)",
            opacity: theme === "dark" ? 0 : 1,
          }}>
            <Moon size={16} />
          </span>
        </button>
      </div>
    </header>
  );
}
