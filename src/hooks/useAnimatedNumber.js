import { useEffect, useRef, useState } from "react";

// Animates a number from its previous value to the target value smoothly.
// Uses requestAnimationFrame with easeOutCubic.
export function useAnimatedNumber(target, { duration = 900, decimals = 0 } = {}) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (target === value) return;
    fromRef.current = value;
    startRef.current = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const next = fromRef.current + (target - fromRef.current) * eased;
      setValue(next);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return decimals === 0 ? Math.round(value) : Number(value.toFixed(decimals));
}
