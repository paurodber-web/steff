import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export const EASE = "expo.out";
const FROM_TOP = "inset(0 0 100% 0)";
const FULL = "inset(0 0 0% 0)";

/**
 * Scroll-driven reveals for a section, driven by data attributes (hidden state is applied by GSAP,
 * so content stays visible if JS fails or the user prefers reduced motion).
 *   data-fade          fade down
 *   data-title         words/letters fall with blur ([data-w] children)
 *   data-clip          clip-path unfolds from the top (+ inner [data-media] settles from a slight zoom)
 * `extra(root, mm)` adds section-specific timelines via mm.add("(prefers-reduced-motion: no-preference) and ...", fn).
 */
export function useSectionAnim(
  ref: RefObject<HTMLElement | null>,
  extra?: (root: HTMLElement, mm: gsap.MatchMedia) => void,
) {
  const extraRef = useRef(extra);
  extraRef.current = extra;
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    registerGsap();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const once = (trigger: Element, start = "top 88%") => ({ trigger, start, once: true });

      root.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: -18,
          duration: 1,
          ease: EASE,
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: once(el),
        });
      });

      root.querySelectorAll<HTMLElement>("[data-title]").forEach((el) => {
        const chars = el.querySelectorAll("[data-w]");
        gsap.from(chars, {
          opacity: 0,
          yPercent: -55,
          filter: "blur(8px)",
          duration: 1.2,
          ease: EASE,
          stagger: Number(el.dataset.stagger ?? 0.07),
          scrollTrigger: once(el, "top 85%"),
        });
      });

      root.querySelectorAll<HTMLElement>("[data-clip]").forEach((el) => {
        const delay = Number(el.dataset.delay ?? 0);
        gsap.fromTo(
          el,
          { clipPath: FROM_TOP },
          { clipPath: FULL, duration: 1.3, ease: "power3.out", delay, scrollTrigger: once(el, "top 90%"), clearProps: "clipPath" },
        );
        const media = el.querySelector<HTMLElement>("[data-media]");
        if (media) {
          gsap.from(media, { scale: 1.1, duration: 1.8, ease: EASE, delay, scrollTrigger: once(el, "top 90%") });
        }
      });

    });
    // section-specific timelines register their own media queries (always include the reduced-motion guard)
    extraRef.current?.(root, mm);
    // refresh once fonts/images settle so triggers are measured correctly
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, [ref]);
}

/** Split into words, each word into letters, for falling-letter titles. Parts allow italic emphasis. */
export type Part = { t: string; em?: boolean };

export function SplitTitle({ parts, letters = false }: { parts: Part[]; letters?: boolean }) {
  const text = parts.map((p) => p.t).join("");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden data-title data-stagger={letters ? 0.09 : 0.07}>
        {parts.map((p, pi) =>
          p.t
            .split(/(\s+)/)
            .filter((w) => w !== "")
            .map((w, wi) =>
              /^\s+$/.test(w) ? (
                " "
              ) : (
                <span key={`${pi}-${wi}`} className="inline-block whitespace-nowrap">
                  {letters ? (
                    w.split("").map((c, ci) => (
                      <span key={ci} data-w className={p.em ? "inline-block italic text-oxblood" : "inline-block"}>
                        {c}
                      </span>
                    ))
                  ) : (
                    <span data-w className={p.em ? "inline-block italic text-oxblood" : "inline-block"}>
                      {w}
                    </span>
                  )}
                </span>
              ),
            ),
        )}
      </span>
    </>
  );
}

/**
 * Sections carrying data-scene="#hex" tint the whole page while they sit under the middle of the
 * screen. Colour only (no movement), cross-faded by CSS, so it never gets in the way of reading.
 */
export function useScenes() {
  useEffect(() => {
    registerGsap();
    const root = document.documentElement;
    const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]")).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) root.style.setProperty("--page", el.dataset.scene ?? "");
        },
      }),
    );
    return () => {
      triggers.forEach((t) => t.kill());
      root.style.removeProperty("--page");
    };
  }, []);
}

export { gsap, ScrollTrigger };
