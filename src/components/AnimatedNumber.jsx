import { useAnimatedNumber } from "../hooks/useAnimatedNumber";

export default function AnimatedNumber({ value, decimals = 0, duration = 900, className = "", style }) {
  const v = useAnimatedNumber(Number(value) || 0, { duration, decimals });
  return <span className={`metric-num ${className}`} style={style}>{v}</span>;
}
