import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Draggable } from "gsap/Draggable";
import Lenis from "lenis";

let ready = false;
export function reg() {
  if (ready || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, Draggable);
  ready = true;
}

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Run GSAP code for a component root, only when motion is allowed, and revert everything on unmount.
 * Content is never hidden by CSS: GSAP sets the initial states, so no-JS and reduced motion stay readable.
 */
export function useMotion(ref: RefObject<HTMLElement | null>, fn: (root: HTMLElement) => void | (() => void), deps: unknown[] = []) {
  useIso(() => {
    const root = ref.current;
    if (!root) return;
    reg();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => fn(root));
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Lenis smooth scroll for fine pointers; anchors glide. */
export function useLenis(opts: { lerp?: number } = {}) {
  useEffect(() => {
    reg();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(pointer: fine)").matches) return;
    const lenis = new Lenis({ lerp: opts.lerp ?? 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    document.documentElement.style.scrollBehavior = "auto";
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      const el = id === "#top" ? 0 : document.querySelector<HTMLElement>(id);
      if (el === null) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement | number, { duration: 1.5, easing: (x) => 1 - Math.pow(1 - x, 4) });
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function useReduced() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(mq.matches);
    const on = () => setR(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return r;
}

export function useFinePointer() {
  const [f, setF] = useState(false);
  useEffect(() => setF(window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  return f;
}

/** Copy-to-clipboard with a short-lived confirmation label. */
export function useCopy(text: string) {
  const [done, setDone] = useState(false);
  const t = useRef<number | undefined>(undefined);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      window.clearTimeout(t.current);
      t.current = window.setTimeout(() => setDone(false), 1800);
    } catch {
      window.location.href = `mailto:${text}`;
    }
  };
  return { copy, done };
}

export { gsap, ScrollTrigger, SplitText };
