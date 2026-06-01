import { useState } from "react";
import { LANGUAGES } from "../lib/constants";

export default function Header({ lang, setLang, voiceEnabled, setVoiceEnabled, onSpeakGreeting }) {
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
             style={{ background: "linear-gradient(135deg, #059669, #047857)", boxShadow: "0 8px 20px -8px rgba(4,120,87,.55)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c4 4 6 8 6 12a6 6 0 1 1-12 0c0-4 2-8 6-12Z" />
            <path d="M12 22V12" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-base font-extrabold leading-tight">KrishiMitra</h1>
          <p className="text-[11px] -mt-0.5" style={{ color: "var(--text-dim)" }}>कृषि मित्र · Your farming advisor</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
        >
          <span className="font-bold mr-1" style={{ color: "var(--primary)" }}>{current.flag}</span>
          {current.label}
        </button>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          aria-label="Toggle voice"
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: voiceEnabled ? "var(--primary-soft)" : "var(--surface)",
            border: `1px solid ${voiceEnabled ? "#b8ead2" : "var(--border)"}`,
            color: voiceEnabled ? "var(--primary-700)" : "var(--text-dim)",
          }}
        >
          {voiceEnabled ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19 12c0-2-1-4-3-5"/><path d="M22 12c0-4-2-7-5-8"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
          )}
        </button>
      </div>

      {open && (
        <div className="max-w-lg mx-auto px-4 pb-3 fade-up">
          <div className="grid grid-cols-3 gap-1.5">
            {LANGUAGES.map((l) => {
              const active = l.code === lang;
              return (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setOpen(false); onSpeakGreeting?.(l); }}
                  className="py-2 rounded-lg text-xs font-semibold transition-all active:scale-95"
                  style={{
                    background: active ? "var(--primary-soft)" : "var(--surface)",
                    border: `1px solid ${active ? "#b8ead2" : "var(--border)"}`,
                    color: active ? "var(--primary-700)" : "var(--text-muted)",
                  }}
                >
                  <span className="font-bold mr-1" style={{ color: active ? "var(--primary-700)" : "var(--text-muted)" }}>{l.flag}</span>
                  {l.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
