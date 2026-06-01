// Lucide-style inline SVG icon set. No external dependency.
// Every emoji in the app was replaced with one of these.

const base = {
  width: 20, height: 20, viewBox: "0 0 24 24",
  fill: "none", stroke: "currentColor", strokeWidth: 2,
  strokeLinecap: "round", strokeLinejoin: "round",
};

const Make = (paths) => ({ size = 20, className, style, ...rest }) => (
  <svg {...base} width={size} height={size} className={className} style={style} {...rest}>
    {paths}
  </svg>
);

// ── Brand ──
export const Leaf = Make(<>
  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.5 2c1 1.5 2 5 1 9.5-1 5-5 8.5-9.5 8.5Z" />
  <path d="M2 21c0-3 1.85-5.36 5.08-6" />
</>);

// ── Navigation ──
export const Home    = Make(<><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>);
export const Wheat   = Make(<><path d="M12 22v-10" /><path d="M7 7c2 0 5 2 5 5" /><path d="M17 7c-2 0-5 2-5 5" /><path d="M5 13c4 0 7 3 7 9" /><path d="M19 13c-4 0-7 3-7 9" /><path d="M12 2v6" /></>);
export const Shield  = Make(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></>);
export const Beaker  = Make(<><path d="M4 22h16" /><path d="M9 2v6L4 22h16L15 8V2" /><path d="M9 2h6" /></>);
export const Droplet = Make(<><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></>);
export const Chat    = Make(<><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-4.2-1L3 21l1.1-4.8A8.4 8.4 0 1 1 21 11.5Z" /></>);

// ── Status / actions ──
export const MapPin  = Make(<><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>);
export const Mic     = Make(<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>);
export const MicOff  = Make(<><line x1="2" y1="2" x2="22" y2="22" /><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" /><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>);
export const Volume  = Make(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></>);
export const VolumeX = Make(<><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>);
export const Send    = Make(<><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>);
export const Stop    = Make(<><rect x="6" y="6" width="12" height="12" rx="2" /></>);
export const Sun     = Make(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>);
export const Moon    = Make(<><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" /></>);
export const Bell    = Make(<><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></>);
export const Globe   = Make(<><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" /></>);
export const Sparkle = Make(<><path d="M12 2l1.7 5.3L19 9l-5.3 1.7L12 16l-1.7-5.3L5 9l5.3-1.7L12 2Z" /></>);
export const Calendar = Make(<><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>);
export const Check   = Make(<><polyline points="20 6 9 17 4 12" /></>);
export const X       = Make(<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>);
export const Alert   = Make(<><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>);
export const ChevronDown  = Make(<><polyline points="6 9 12 15 18 9" /></>);
export const ChevronRight = Make(<><polyline points="9 18 15 12 9 6" /></>);
export const ArrowRight   = Make(<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>);
export const TrendingUp   = Make(<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>);
export const Wind         = Make(<><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" /></>);
export const Thermometer  = Make(<><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0Z" /></>);
export const Activity     = Make(<><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>);
export const Layers       = Make(<><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>);

// ── Weather (used by chart + widget) ──
export const WxSunny = Make(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></>);
export const WxCloud = Make(<><path d="M17.5 19A4.5 4.5 0 1 0 17 10a7 7 0 0 0-13.5 2.5A4.5 4.5 0 0 0 5 19h12.5Z" /></>);
export const WxRain  = Make(<><path d="M16 13a4 4 0 1 0 0-8 6 6 0 0 0-11.5 2A4 4 0 0 0 6 13" /><line x1="8" y1="19" x2="8" y2="21" /><line x1="12" y1="19" x2="12" y2="22" /><line x1="16" y1="19" x2="16" y2="21" /></>);
export const WxStorm = Make(<><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" /><polyline points="13 11 9 17 13 17 11 23" /></>);
export const WxPartly = Make(<><circle cx="8" cy="8" r="3" /><path d="M14 14a4 4 0 1 1 4 4h-9a3 3 0 0 1-1-5.83" /></>);
