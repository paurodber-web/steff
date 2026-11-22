import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, registerGsap } from "./anim";

/** Film grain over the whole page: static, GPU-cheap, gives every surface the same tactile paper. */
export function Grain() {
  return <div aria-hidden className="v2-page-grain" />;
}

/**
 * Magazine folio: running section name bottom-left and reading progress bottom-right (desktop).
 * Sections opt in with data-folio="Nº 02 — Portafolio".
 */
export function Folio() {
  const [label, setLabel] = useState("Nº 00 — Portada");
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGsap();
    const triggers = Array.from(document.querySelectorAll<HTMLElement>("[data-folio]")).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && setLabel(el.dataset.folio ?? ""),
      }),
    );
    const progress = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const p = Math.round(self.progress * 100);
        if (pct.current) pct.current.textContent = String(p).padStart(3, "0");
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
      },
    });
    return () => {
      triggers.forEach((t) => t.kill());
      progress.kill();
    };
  }, []);

  return (
    <div aria-hidden className="v2-folio pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden items-end justify-between px-12 pb-6 text-[10px] font-medium uppercase tracking-[0.3em] lg:flex">
      <span key={label} className="v2-folio__label">
        {label}
      </span>
      <span className="flex items-center gap-4 tabular-nums">
        <span className="relative block h-px w-24 overflow-hidden bg-current/30">
          <span ref={bar} className="absolute inset-0 origin-left bg-current" style={{ transform: "scaleX(0)" }} />
        </span>
        <span ref={pct}>000</span>
      </span>
    </div>
  );
}

/**
 * Cursor companion (fine pointers only): a ring that trails the pointer and opens into a
 * labelled disc over anything marked data-cursor="Label". The native cursor stays visible.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const ok = window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(ok);
  }, []);

  useEffect(() => {
    if (!enabled || !ring.current) return;
    const el = ring.current;
    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let label = "";
    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      const next = t?.dataset.cursor ?? "";
      if (next !== label) {
        label = next;
        if (text.current && next) text.current.textContent = next;
        el.dataset.state = next ? "label" : "idle";
      }
      el.style.opacity = "1";
    };
    const leave = () => (el.style.opacity = "0");
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ring} aria-hidden data-state="idle" className="v2-cursor" style={{ opacity: 0 }}>
      <span className="v2-cursor__disc">
        <span ref={text} className="v2-cursor__text" />
      </span>
    </div>
  );
}
