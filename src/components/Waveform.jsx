// Animated bar visualization for voice listening state.
const BARS = 5;

export default function Waveform({ active, color = "currentColor", size = 18 }) {
  return (
    <div className="inline-flex items-end gap-[2px]" style={{ height: size }}>
      {Array.from({ length: BARS }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 2.5,
            height: "100%",
            background: color,
            borderRadius: 999,
            transformOrigin: "bottom",
            animation: active ? `waveform 1s ease-in-out ${i * 0.12}s infinite` : "none",
            opacity: active ? 1 : 0.35,
            transform: active ? undefined : "scaleY(0.4)",
          }}
        />
      ))}
    </div>
  );
}
