import { useEffect, useRef } from "react";
import { Card, TypingDots } from "./UI";
import WeatherWidget from "./WeatherWidget";
import CropCard from "./CropCard";
import PestCard from "./PestCard";
import FertCard from "./FertCard";
import IrrigCard from "./IrrigCard";
import Waveform from "./Waveform";
import { Mic, Stop, Send, Volume, Sparkle, Leaf } from "./Icons";
import { useT } from "../lib/I18nContext";

const SUGGEST_KEYS = ["chat.suggest.crop", "chat.suggest.pest", "chat.suggest.fert", "chat.suggest.water", "chat.suggest.weather"];

export default function ChatView({ history, loading, chatInput, setChatInput, onSend, voice, currentLang }) {
  const { t } = useT();
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history, loading]);

  const handleMic = () => {
    if (voice.listening) { voice.stopListening(); return; }
    voice.startListening((text) => {
      setChatInput(text);
      setTimeout(() => onSend(text), 250);
    });
  };

  return (
    <div className="space-y-3 fade-up pb-32 sm:pb-24">
      {history.length === 0 && (
        <Card className="px-6 py-8 text-center card-elev slide-up">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white relative overflow-hidden"
               style={{ background: "linear-gradient(135deg, var(--primary-600), var(--primary-800))", boxShadow: "var(--shadow-lg)" }}>
            <Leaf size={28} />
            <span className="shine-sweep" style={{ animation: "shineSweep 3.5s ease-in-out infinite" }} />
          </div>
          <div className="font-display text-lg font-extrabold mt-4" style={{ color: "var(--text)" }}>
            {t("chat.ask_anything")}
          </div>
          <div className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>
            {t("chat.voice_or_text", { lang: currentLang.label })}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-5 justify-center stagger">
            {SUGGEST_KEYS.map((key, i) => {
              const q = t(key);
              return (
                <button key={i} onClick={() => setChatInput(q)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:-translate-y-0.5"
                  style={{
                    background: "var(--primary-soft)", color: "var(--primary)",
                    border: "1px solid color-mix(in srgb, var(--primary) 28%, transparent)",
                  }}>
                  {q}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleMic}
            className="mt-6 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white relative transition-transform active:scale-95 hover:scale-105"
            style={{
              background: voice.listening
                ? "linear-gradient(135deg, var(--danger), #991b1b)"
                : "linear-gradient(135deg, var(--primary-600), var(--primary-800))",
              boxShadow: "0 16px 36px -10px color-mix(in srgb, var(--primary) 55%, transparent)",
            }}
            aria-label="Voice input"
          >
            {voice.listening ? <Waveform active color="#fff" size={22} /> : <Mic size={22} />}
            {voice.listening && <span className="absolute inset-0 rounded-full border-2 pulse-ring" style={{ borderColor: "var(--danger)" }} />}
          </button>
          <div className="text-[11px] mt-2.5" style={{ color: "var(--text-dim)" }}>
            {t("chat.tap_to_speak", { lang: currentLang.label })}
          </div>
        </Card>
      )}

      {history.map((m, i) => (
        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} slide-up`}>
          <div
            className="max-w-[88%] px-3.5 py-2.5 rounded-2xl"
            style={
              m.role === "user"
                ? { background: "linear-gradient(135deg, var(--primary-600), var(--primary-800))", color: "#ecfdf5", borderBottomRightRadius: 6, boxShadow: "var(--shadow-sm)" }
                : { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", borderBottomLeftRadius: 6, boxShadow: "var(--shadow-sm)" }
            }
          >
            {m.role === "agent" && (
              <div className="flex items-center gap-1.5 mb-1.5 -mt-0.5">
                <Sparkle size={12} style={{ color: "var(--primary)" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>
                  KrishiMitra
                </span>
              </div>
            )}
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>

            {m.role === "agent" && m.text && (
              <button
                onClick={() => voice.speaking ? voice.stopSpeaking() : voice.speak(m.text)}
                className="mt-2 px-2 py-1 rounded-md text-[10px] font-semibold inline-flex items-center gap-1.5 transition-colors"
                style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
              >
                {voice.speaking ? <><Stop size={11} /> {t("chat.stop")}</> : <><Volume size={11} /> {t("chat.listen")}</>}
              </button>
            )}

            {/* Only attach the weather widget when the user actually asked about weather */}
            {m.data?.weather && m.data?.intent === "weather_forecast" && (
              <div className="mt-3"><WeatherWidget data={m.data.weather} /></div>
            )}
            {m.data?.advisories?.crop && <div className="mt-3"><CropCard data={m.data.advisories.crop} /></div>}
            {m.data?.advisories?.pesticide && <div className="mt-3"><PestCard data={m.data.advisories.pesticide} /></div>}
            {m.data?.advisories?.fertilizer && <div className="mt-3"><FertCard data={m.data.advisories.fertilizer} /></div>}
            {m.data?.advisories?.irrigation && <div className="mt-3"><IrrigCard data={m.data.advisories.irrigation} /></div>}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start fade-in">
          <div className="px-3.5 py-2.5 rounded-2xl flex items-center gap-2"
               style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", color: "var(--primary)" }}>
            <Sparkle size={12} style={{ color: "var(--primary)" }} />
            <span className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>{t("chat.thinking")}</span>
            <TypingDots />
          </div>
        </div>
      )}

      <div ref={endRef} />

      <div className="fixed bottom-14 sm:bottom-3 inset-x-0 px-3 pt-2 pb-2 safe-bottom z-40 glass">
        <div className="max-w-3xl mx-auto flex gap-2 items-center">
          <button onClick={handleMic}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform active:scale-90 relative flex-shrink-0"
            style={{
              background: voice.listening ? "var(--danger)" : "var(--surface)",
              border: `1px solid ${voice.listening ? "var(--danger)" : "var(--border)"}`,
              color: voice.listening ? "#fff" : "var(--primary)",
            }}
            aria-label={voice.listening ? "Stop listening" : "Voice input"}
          >
            {voice.listening ? <Waveform active color="#fff" size={18} /> : <Mic size={18} />}
            {voice.listening && <span className="absolute inset-0 rounded-xl border-2 pulse-ring" style={{ borderColor: "var(--danger)" }} />}
          </button>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSend(); }}
            placeholder={t("chat.speak_or_type", { lang: currentLang.label })}
            className="input"
          />
          <button onClick={() => onSend()} disabled={loading || !chatInput.trim()}
            className="btn btn-primary px-4 flex-shrink-0" style={{ minWidth: 56 }} aria-label="Send">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
