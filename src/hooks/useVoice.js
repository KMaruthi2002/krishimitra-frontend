import { useCallback, useEffect, useRef, useState } from "react";
import { LANGUAGES } from "../lib/constants";

export function useVoice(langCode) {
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Pre-load voice list (some browsers need this triggered once)
  useEffect(() => { window.speechSynthesis?.getVoices(); }, []);

  const speak = useCallback((text) => {
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const lang = LANGUAGES.find((l) => l.code === langCode);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang?.voice || "en-IN";
    u.rate = 0.95;
    u.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const match =
      voices.find((v) => v.lang === (lang?.voice || "en-IN")) ||
      voices.find((v) => v.lang.startsWith(langCode));
    if (match) u.voice = match;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [langCode]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const startListening = useCallback((onResult) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    const lang = LANGUAGES.find((l) => l.code === langCode);
    r.lang = lang?.voice || "en-IN";
    r.continuous = false;
    r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onResult(text);
      setListening(false);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recognitionRef.current = r;
    r.start();
  }, [langCode]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { speak, stopSpeaking, speaking, startListening, stopListening, listening };
}
