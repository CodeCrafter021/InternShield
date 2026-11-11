import { useEffect, useState } from "react";

const QUERY = "(pointer: coarse), (prefers-reduced-motion: reduce)";

export function useConserveMotion() {
  const [conserveMotion, setConserveMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const update = () => setConserveMotion(mediaQuery.matches);
    update();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", update);
      return () => mediaQuery.removeEventListener("change", update);
    }

    mediaQuery.addListener(update);
    return () => mediaQuery.removeListener(update);
  }, []);

  return conserveMotion;
}
