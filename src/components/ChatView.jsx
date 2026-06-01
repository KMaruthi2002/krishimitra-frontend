import { useEffect, useRef } from "react";
import { Card } from "./UI";
import WeatherWidget from "./WeatherWidget";
import CropCard from "./CropCard";
import PestCard from "./PestCard";
import FertCard from "./FertCard";
import IrrigCard from "./IrrigCard";

const SUGGESTIONS = [
  "What crop for Mandya?",
  "Rice pest risk in Shimoga",
  "Fertilizer wheat flowering",
  "Maize water Pune",
  "Weather Bangalore",
];

export default function ChatView({ history, loading, chatInput, setChatInput, onSend, voice, currentLang }) {
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
    <div className="space-y-3 fade-up pb-28">
      {history.length === 0 && (
        <Card className="p-6 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl"
               style={{ background: "var(--primary-soft)", color: "var(--primary-700)" }}>🌱</div>
          <div className="font-display text-base font-bold mt-3" style={{ color: "var(--text)" }}>
            Ask me anything about farming
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Voice or text · {currentLang.label}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
            {SUGGESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => setChatInput(q)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                style={{ background: "var(--primary-soft)", color: "var(--primary-700)", border: "1px solid #b8ead2" }}
              >
                {q}
              </button>
            ))}
          </div>

          <button
            onClick={handleMic}
            className="mt-5 w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl text-white relative transition-transform active:scale-95"
            style={{ background: "linear-gradient(135deg, #059669, #047857)", boxShadow: "0 12px 30px -10px rgba(4,120,87,.55)" }}
          >
            🎤
            {voice.listening && (
              <span className="absolute inset-0 rounded-full border-2 pulse-ring" style={{ borderColor: "var(--primary)" }} />
            )}
          </button>
          <div className="text-[11px] mt-2" style={{ color: "var(--text-dim)" }}>
            Tap to speak in {currentLang.label}
          </div>
        </Card>
      )}

      {history.map((m, i) => (
        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} fade-up`}>
          <div
            className="max-w-[88%] px-3.5 py-2.5 rounded-2xl"
            style={
              m.role === "user"
                ? { background: "linear-gradient(135deg, #059669, #047857)", color: "#ecfdf5", borderBottomRightRadius: 6 }
                : { background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", borderBottomLeftRadius: 6, boxShadow: "var(--shadow-sm)" }
            }
          >
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>

            {m.role === "agent" && m.text && (
              <button
                onClick={() => voice.speaking ? voice.stopSpeaking() : voice.speak(m.text)}
                className="mt-2 px-2 py-1 rounded-md text-[10px] font-semibold inline-flex items-center gap-1"
                style={{ background: "var(--primary-soft)", color: "var(--primary-700)" }}
              >
                {voice.speaking ? "⏹ Stop" : "🔊 Listen"}
              </button>
            )}

            {m.data?.weather && <div className="mt-3"><WeatherWidget data={m.data.weather} /></div>}
            {m.data?.advisories?.crop && <div className="mt-3"><CropCard data={m.data.advisories.crop} /></div>}
            {m.data?.advisories?.pesticide && <div className="mt-3"><PestCard data={m.data.advisories.pesticide} /></div>}
            {m.data?.advisories?.fertilizer && <div className="mt-3"><FertCard data={m.data.advisories.fertilizer} /></div>}
            {m.data?.advisories?.irrigation && <div className="mt-3"><IrrigCard data={m.data.advisories.irrigation} /></div>}
          </div>
        </div>
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="px-3.5 py-2.5 rounded-2xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <span className="text-sm inline-flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500/30 border-t-emerald-600 animate-spin" />
              KrishiMitra is thinking…
            </span>
          </div>
        </div>
      )}

      <div ref={endRef} />

      <div className="fixed bottom-14 inset-x-0 px-3 pt-2 pb-2 glass safe-bottom z-40">
        <div className="max-w-lg mx-auto flex gap-2 items-center">
          <button
            onClick={handleMic}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform active:scale-90 relative"
            style={{
              background: voice.listening ? "#dc2626" : "var(--surface)",
              border: `1px solid ${voice.listening ? "#dc2626" : "var(--border)"}`,
              color: voice.listening ? "#fff" : "var(--primary-700)",
            }}
          >
            {voice.listening ? "■" : "🎤"}
            {voice.listening && <span className="absolute inset-0 rounded-xl border-2 pulse-ring" style={{ borderColor: "#dc2626" }} />}
          </button>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onSend(); }}
            placeholder={`Speak or type in ${currentLang.label}…`}
            className="input"
          />
          <button
            onClick={() => onSend()}
            disabled={loading || !chatInput.trim()}
            className="btn btn-primary px-4"
            style={{ minWidth: 70 }}
          >Send</button>
        </div>
      </div>
    </div>
  );
}
