import { TABS } from "../lib/constants";

function Icon({ name, active }) {
  const stroke = active ? "var(--primary-700)" : "var(--text-dim)";
  const props = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "Home":  return <svg {...props}><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>;
    case "Crop":  return <svg {...props}><path d="M12 2v10"/><path d="M7 6c2 0 5 2 5 5"/><path d="M17 6c-2 0-5 2-5 5"/><path d="M5 14c4 0 7 3 7 8"/><path d="M19 14c-4 0-7 3-7 8"/></svg>;
    case "Pest":  return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>;
    case "Fert":  return <svg {...props}><path d="M9 3h6v4H9z"/><path d="M7 7h10l-2 14H9z"/></svg>;
    case "Water": return <svg {...props}><path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z"/></svg>;
    case "Chat":  return <svg {...props}><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-4.2-1L3 21l1.1-4.8A8.4 8.4 0 1 1 21 11.5Z"/></svg>;
    default: return null;
  }
}

export default function BottomNav({ tab, onChange }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 glass safe-bottom">
      <div className="max-w-lg mx-auto flex">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="flex-1 py-2.5 flex flex-col items-center gap-1 transition-transform active:scale-95"
            >
              <Icon name={t.icon} active={active} />
              <span className="text-[10px] font-semibold" style={{ color: active ? "var(--primary-700)" : "var(--text-dim)" }}>{t.label}</span>
              <span className="w-5 h-[3px] rounded-full mt-0.5" style={{ background: active ? "var(--primary)" : "transparent" }} />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
