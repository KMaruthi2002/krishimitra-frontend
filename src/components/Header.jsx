import { useEffect, useState } from "react";
import { LANGUAGES } from "../lib/constants";
import { Leaf, Globe, Volume, VolumeX, Sun, Moon, ChevronDown } from "./Icons";

export default function Header({ lang, setLang, voiceEnabled, setVoiceEnabled, onSpeakGreeting, theme, setTheme }) {
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white relative overflow-hidden"
               style={{ background: "linear-gradient(135deg, var(--primary-600), var(--primary-800))",
                        boxShadow: "0 10px 22px -10px color-mix(in srgb, var(--primary) 60%, transparent), inset 0 1px 0 rgba(255,255,255,.15)" }}>
            <Leaf size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-[17px] font-extrabold tracking-tight leading-none">KrishiMitra</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] font-semibold uppercase tracking-[.16em]" style={{ color: "var(--text-dim)" }}>कृषि मित्र</span>
              <span className="w-1 h-1 rounded-full" style={{ background: "var(--text-faint)" }} />
              <span className="text-[10px] font-semibold uppercase tracking-[.12em]" style={{ color: "var(--text-dim)" }}>Farming advisor</span>
            </div>
          </div>
        </div>

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
                      style={{ background: active ? "var(--primary-soft)" : "transparent", color: active ? "var(--primary-700)" : "var(--text)" }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--hover)"; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                    >
                      <span className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold"
                            style={{ background: active ? "var(--primary)" : "var(--surface-2)", color: active ? "#fff" : "var(--text-muted)" }}>
                        {l.flag}
                      </span>
                      <span className="text-sm font-semibold flex-1">{l.label}</span>
                      {active && <span className="text-[10px] font-bold" style={{ color: "var(--primary)" }}>SELECTED</span>}
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
