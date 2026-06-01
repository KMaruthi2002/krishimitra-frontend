import { useCallback, useEffect, useState } from "react";

import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import HomeView from "./components/HomeView";
import ChatView from "./components/ChatView";
import WeatherWidget from "./components/WeatherWidget";
import CropCard from "./components/CropCard";
import PestCard from "./components/PestCard";
import FertCard from "./components/FertCard";
import IrrigCard from "./components/IrrigCard";
import { Button, Card, Select } from "./components/UI";

import { useVoice } from "./hooks/useVoice";
import { get, post } from "./lib/api";
import { CROPS, LANGUAGES, LOCATIONS, SOILS, STAGES } from "./lib/constants";

export default function App() {
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

  const [lang, setLang] = useState("en");
  const [voiceEnabled, setVoiceEnabled] = useState(true);

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
    } catch (e) { /* surfaced in UI through absence of result */ }
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
      setChatHistory((h) => [...h, { role: "agent", text: aiText || "Here's what I found from your latest weather and farm data.", data: r }]);
      if (r.weather) setWeather(r.weather);
      if (voiceEnabled && aiText) voice.speak(aiText);
    } catch (e) {
      setChatHistory((h) => [...h, { role: "agent", text: "Connection error. Please try again." }]);
    }
    setLoading(false);
  };

  const handleTabChange = (next) => { setTab(next); if (next !== tab) setResult(null); };

  return (
    <div className="min-h-screen pb-24" style={{ color: "var(--text)" }}>
      <Header
        lang={lang}
        setLang={setLang}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        onSpeakGreeting={(l) => voiceEnabled && voice.speak(l.greeting)}
      />

      <main className="max-w-lg mx-auto px-4 py-3 space-y-3">
        <div>
          <Select value={loc} onChange={setLoc} options={LOCATIONS} label="Location" />
        </div>

        {tab === "home" && (
          <HomeView weather={weather} onTab={handleTabChange} currentLang={currentLang} />
        )}

        {tab === "crop" && (
          <div className="space-y-3 fade-up">
            <Card className="p-4 space-y-3">
              <h2 className="font-display text-base font-bold">Find the best crops</h2>
              <Select value={soil} onChange={setSoil} options={SOILS} label="Soil type" />
              <Button onClick={() => run("crop/recommend", { location: loc, soil_type: soil })} loading={loading}>
                Analyse
              </Button>
            </Card>
            {weather && <WeatherWidget data={weather} />}
            {result?.type === "crop" && <CropCard data={result.data} />}
          </div>
        )}

        {tab === "pest" && (
          <div className="space-y-3 fade-up">
            <Card className="p-4 space-y-3">
              <h2 className="font-display text-base font-bold">Pest &amp; disease check</h2>
              <Select value={crop} onChange={setCrop} options={CROPS} label="Your crop" />
              <Button variant="warm" onClick={() => run("pesticide/advise", { crop, location: loc })} loading={loading}>
                Check threats
              </Button>
            </Card>
            {result?.type === "pesticide" && <PestCard data={result.data} />}
          </div>
        )}

        {tab === "fert" && (
          <div className="space-y-3 fade-up">
            <Card className="p-4 space-y-3">
              <h2 className="font-display text-base font-bold">Fertilizer plan</h2>
              <div className="grid grid-cols-2 gap-2.5">
                <Select value={crop} onChange={setCrop} options={CROPS} label="Crop" />
                <Select value={stage} onChange={setStage} options={STAGES} label="Stage" />
              </div>
              <Button onClick={() => run("fertilizer/schedule", { crop, growth_stage: stage, location: loc })} loading={loading}>
                Get schedule
              </Button>
            </Card>
            {result?.type === "fertilizer" && <FertCard data={result.data} />}
          </div>
        )}

        {tab === "water" && (
          <div className="space-y-3 fade-up">
            <Card className="p-4 space-y-3">
              <h2 className="font-display text-base font-bold">Irrigation plan</h2>
              <div className="grid grid-cols-2 gap-2.5">
                <Select value={crop} onChange={setCrop} options={CROPS} label="Crop" />
                <Select value={stage} onChange={setStage} options={STAGES} label="Stage" />
              </div>
              <Button onClick={() => run("irrigation/plan", { crop, growth_stage: stage, location: loc })} loading={loading}>
                Calculate
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
      </main>

      <BottomNav tab={tab} onChange={handleTabChange} />
    </div>
  );
}
