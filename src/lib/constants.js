export const CROPS = [
  "Rice","Wheat","Maize","Sugarcane","Cotton","Jowar","Bajra","Ragi",
  "Groundnut","Sunflower","Soybean","Pulses","Barley","Millets",
];

export const SOILS = [
  ["alluvial","Alluvial"],
  ["black_cotton","Black Cotton"],
  ["red_laterite","Red Laterite"],
  ["sandy","Sandy"],
  ["clayey","Clay"],
  ["loamy","Loam"],
  ["saline","Saline"],
];

export const LOCATIONS = [
  "Mandya","Bangalore","Mysore","Dharwad","Raichur","Shimoga","Mangalore",
  "Coimbatore","Vijayawada","Pune","Hyderabad","Chennai","Mumbai","Delhi",
  "Kolkata","Lucknow","Jaipur","Bhopal","Patna","Kochi","Madurai","Nagpur","Indore",
];

export const STAGES = [
  ["initial","Seedling"],
  ["development","Vegetative"],
  ["mid_season","Flowering"],
  ["late_season","Maturity"],
];

export const LANGUAGES = [
  { code: "en", label: "English",  voice: "en-IN", flag: "EN", greeting: "Hello! I'm KrishiMitra, your farming advisor." },
  { code: "hi", label: "हिन्दी",   voice: "hi-IN", flag: "हि", greeting: "नमस्ते! मैं कृषिमित्र हूँ, आपका कृषि सलाहकार।" },
  { code: "te", label: "తెలుగు",  voice: "te-IN", flag: "తె", greeting: "నమస్కారం! నేను కృషిమిత్ర, మీ వ్యవసాయ సలహాదారు." },
  { code: "kn", label: "ಕನ್ನಡ",   voice: "kn-IN", flag: "ಕ",  greeting: "ನಮಸ್ಕಾರ! ನಾನು ಕೃಷಿಮಿತ್ರ, ನಿಮ್ಮ ಕೃಷಿ ಸಲಹೆಗಾರ." },
  { code: "ta", label: "தமிழ்",   voice: "ta-IN", flag: "த",  greeting: "வணக்கம்! நான் கிருஷிமித்ரா, உங்கள் விவசாய ஆலோசகர்." },
  { code: "mr", label: "मराठी",    voice: "mr-IN", flag: "म",  greeting: "नमस्कार! मी कृषिमित्र, तुमचा शेती सल्लागार." },
];

// `labelKey` resolves through the i18n dictionary so tab labels translate.
// `label` is kept as a hardcoded English fallback in case i18n is bypassed.
export const TABS = [
  { id: "home",  icon: "Home",   labelKey: "tabs.home",    label: "Home"    },
  { id: "crop",  icon: "Crop",   labelKey: "tabs.crops",   label: "Crops"   },
  { id: "pest",  icon: "Pest",   labelKey: "tabs.protect", label: "Protect" },
  { id: "fert",  icon: "Fert",   labelKey: "tabs.fert",    label: "Fert"    },
  { id: "water", icon: "Water",  labelKey: "tabs.water",   label: "Water"   },
  { id: "chat",  icon: "Chat",   labelKey: "tabs.ask",     label: "Ask"     },
];
