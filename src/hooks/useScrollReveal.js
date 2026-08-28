import { useEffect, useRef } from "react";

// Attach ref to any element with className="reveal" (see styles/index.css)
// and it will fade/scale/blur into view the first time it enters the viewport.
// This powers "14. Scroll Reveal Sections" from the design reference.
export function useScrollReveal(options = { threshold: 0.15 }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view", "revealed");
          entry.target.querySelectorAll(".reveal").forEach((el) => {
            el.classList.add("in-view", "revealed");
          });
          observer.unobserve(entry.target);
        }
      });
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
