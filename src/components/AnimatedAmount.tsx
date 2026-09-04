"use client";

import { useEffect, useRef, useState } from "react";
import { AUD } from "@/lib/format";

// Tween a number toward `target` with easeOutCubic. Skips the initial render
// and honours the user's `prefers-reduced-motion` setting (duration collapses
// to 0, so the update lands in the very next animation frame).
function useAnimatedNumber(target: number, ms = 420) {
  const [value, setValue] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    const from = currentRef.current;
    if (from === target) return;

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const duration = reduced ? 0 : ms;

    const startTime = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = duration === 0 ? 1 : Math.min(1, (t - startTime) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const next = from + (target - from) * eased;
      currentRef.current = next;
      setValue(next);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return value;
}

export function AnimatedAmount({ value, digits = 0 }: { value: number; digits?: number }) {
  return <>{AUD(useAnimatedNumber(value), digits)}</>;
}
