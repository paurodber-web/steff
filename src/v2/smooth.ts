import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger, registerGsap } from "./anim";

let lenis: Lenis | null = null;

/** Scroll to an element or y position, smoothly when allowed. */
export function scrollToTarget(target: string | HTMLElement | number) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (el === null) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement | number, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof el === "number") window.scrollTo({ top: el });
  else el.scrollIntoView({ block: "start" });
}

/**
 * Inertial smooth scrolling (Lenis) wired into GSAP's ticker so ScrollTrigger stays in sync.
 * Off for reduced motion and for touch devices, which keep their native scrolling.
 */
export function useSmoothScroll() {
  useEffect(() => {
    registerGsap();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const instance = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95 });
    lenis = instance;
    document.documentElement.classList.add("lenis-on");
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // in-page anchors glide instead of jumping
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      const id = a.getAttribute("href")!;
      const el = id === "#top" ? 0 : document.querySelector<HTMLElement>(id);
      if (el === null) return;
      e.preventDefault();
      instance.scrollTo(el as HTMLElement | number, { duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    // overlays lock the page: stop the inertia while one is open
    const mo = new MutationObserver(() => {
      if (document.documentElement.style.overflow === "hidden") instance.stop();
      else instance.start();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });

    return () => {
      document.removeEventListener("click", onClick);
      mo.disconnect();
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
      document.documentElement.classList.remove("lenis-on");
    };
  }, []);
}
