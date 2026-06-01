import { useCallback, useEffect, useState } from "react";

import Header from "./components/Header";
import BottomNav, { SideNav } from "./components/BottomNav";
import HomeView from "./components/HomeView";
import ChatView from "./components/ChatView";
import WeatherWidget from "./components/WeatherWidget";
import CropCard from "./components/CropCard";
import PestCard from "./components/PestCard";
import FertCard from "./components/FertCard";
import IrrigCard from "./components/IrrigCard";
import { Button, Card, Select } from "./components/UI";
import { Wheat, Shield, Beaker, Droplet, ArrowRight } from "./components/Icons";

import { useVoice } from "./hooks/useVoice";
import { get, post } from "./lib/api";
import { CROPS, LANGUAGES, SOILS, STAGES } from "./lib/constants";
import { I18nProvider, useT } from "./lib/I18nContext";

const THEME_KEY = "km-theme";

export default function App() {
  const [lang, setLang] = useState("en");
  return (
    <I18nProvider lang={lang}>
      <AppShell lang={lang} setLang={setLang} />
    </I18nProvider>
  );
}

function AppShell({ lang, setLang }) {
  const { t } = useT();
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [weather, setWeather] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const [loc, setLoc]   = useState("Mandya");
  const [crop, setCrop] = useState("Rice");
  const [soil, setSoil] = useState("loamy");
  const [stage, setStage] = useState("development");

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem(THEME_KEY) || (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  // Persist + apply theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const voice = useVoice(lang);
  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const fetchWeather = useCallback(async (location) => {
    try { setWeather(await get(`/api/weather/${location}?days=7`)); } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => { fetchWeather(loc); }, [loc, fetchWeather]);

  const run = async (endpoint, body) => {
    setLoading(true); setResult(null);
    try {
      const data = await post(`/api/${endpoint}`, { ...body, language: lang });
      setResult({ type: endpoint.split("/")[0], data });
      await fetchWeather(body.location || loc);
    } catch (e) { /* swallow */ }
    setLoading(false);
  };

  const sendChat = async (textArg) => {
    const msg = (typeof textArg === "string" ? textArg : chatInput).trim();
    if (!msg) return;
    setChatInput("");
    setChatHistory((h) => [...h, { role: "user", text: msg }]);
    setLoading(true);
    try {
      const r = await post("/api/query", { message: msg, language: lang });
      const aiText = r.ai_response || (r.type === "clarification" ? r.response : "");
      setChatHistory((h) => [...h, { role: "agent", text: aiText || t("chat.fallback_response"), data: r }]);
      if (r.weather) setWeather(r.weather);
      // No auto-speak — user can tap the "Listen" button on each agent message.
    } catch (e) {
      setChatHistory((h) => [...h, { role: "agent", text: t("chat.connection_error") }]);
    }
    setLoading(false);
  };

  const handleTabChange = (next) => {
    if (next === tab) return;
    setTab(next);
    setResult(null);
  };

  return (
    <div className="min-h-screen pb-24 sm:pb-6" style={{ color: "var(--text)" }}>
      <Header
        lang={lang}
        setLang={setLang}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        onSpeakGreeting={(l) => voiceEnabled && voice.speak(l.greeting)}
        theme={theme}
        setTheme={setTheme}
        loc={loc}
        setLoc={setLoc}
      />

      <div className="max-w-5xl mx-auto sm:flex sm:gap-4 px-3 sm:px-6 sm:pt-2">
        <SideNav tab={tab} onChange={handleTabChange} />

        <main className="flex-1 min-w-0 py-3 space-y-3">
          <div key={tab} className="tab-enter">
            {tab === "home" && (
              <HomeView weather={weather} onTab={handleTabChange} currentLang={currentLang} />
            )}

            {tab === "crop" && (
              <div className="space-y-3">
                <Card className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                         style={{ background: "linear-gradient(135deg, var(--primary-600), var(--primary-800))" }}>
                      <Wheat size={16} />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-extrabold leading-none">{t("crop.find_title")}</h2>
                      <p className="text-[11px] mt-1" style={{ color: "var(--text-dim)" }}>{t("crop.find_subtitle")}</p>
                    </div>
                  </div>
                  <Select value={soil} onChange={setSoil} options={SOILS.map(([v]) => [v, t(`soil.${v}`)])} label={t("crop.soil_type")} />
                  <Button onClick={() => run("crop/recommend", { location: loc, soil_type: soil })} loading={loading} iconRight={ArrowRight}>
                    {t("crop.analyse")}
                  </Button>
                </Card>
                {weather && <WeatherWidget data={weather} />}
                {result?.type === "crop" && <CropCard data={result.data} />}
              </div>
            )}

            {tab === "pest" && (
              <div className="space-y-3">
                <Card className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                         style={{ background: "linear-gradient(135deg, #d97706, #92400e)" }}>
                      <Shield size={16} />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-extrabold leading-none">{t("pest.title")}</h2>
                      <p className="text-[11px] mt-1" style={{ color: "var(--text-dim)" }}>{t("pest.subtitle")}</p>
                    </div>
                  </div>
                  <Select value={crop} onChange={setCrop} options={CROPS} label={t("pest.your_crop")} />
                  <Button variant="warm" onClick={() => run("pesticide/advise", { crop, location: loc })} loading={loading} iconRight={ArrowRight}>
                    {t("pest.check_threats")}
                  </Button>
                </Card>
                {result?.type === "pesticide" && <PestCard data={result.data} />}
              </div>
            )}

            {tab === "fert" && (
              <div className="space-y-3">
                <Card className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                         style={{ background: "linear-gradient(135deg, #7c3aed, #4c1d95)" }}>
                      <Beaker size={16} />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-extrabold leading-none">{t("fert.title")}</h2>
                      <p className="text-[11px] mt-1" style={{ color: "var(--text-dim)" }}>{t("fert.subtitle")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Select value={crop} onChange={setCrop} options={CROPS} label={t("fert.crop")} />
                    <Select value={stage} onChange={setStage} options={STAGES.map(([v]) => [v, t(`stage.${v}`)])} label={t("fert.stage")} />
                  </div>
                  <Button onClick={() => run("fertilizer/schedule", { crop, growth_stage: stage, location: loc })} loading={loading} iconRight={ArrowRight}>
                    {t("fert.get_schedule")}
                  </Button>
                </Card>
                {result?.type === "fertilizer" && <FertCard data={result.data} />}
              </div>
            )}

            {tab === "water" && (
              <div className="space-y-3">
                <Card className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                         style={{ background: "linear-gradient(135deg, var(--sky-600), #075985)" }}>
                      <Droplet size={16} />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-extrabold leading-none">{t("irrig.title")}</h2>
                      <p className="text-[11px] mt-1" style={{ color: "var(--text-dim)" }}>{t("irrig.subtitle")}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Select value={crop} onChange={setCrop} options={CROPS} label={t("fert.crop")} />
                    <Select value={stage} onChange={setStage} options={STAGES.map(([v]) => [v, t(`stage.${v}`)])} label={t("fert.stage")} />
                  </div>
                  <Button onClick={() => run("irrigation/plan", { crop, growth_stage: stage, location: loc })} loading={loading} iconRight={ArrowRight}>
                    {t("irrig.calculate")}
                  </Button>
                </Card>
                {result?.type === "irrigation" && <IrrigCard data={result.data} />}
              </div>
            )}

            {tab === "chat" && (
              <ChatView
                history={chatHistory}
                loading={loading}
                chatInput={chatInput}
                setChatInput={setChatInput}
                onSend={sendChat}
                voice={voice}
                currentLang={currentLang}
              />
            )}
          </div>
        </main>
      </div>

      <BottomNav tab={tab} onChange={handleTabChange} />
    </div>
  );
}
