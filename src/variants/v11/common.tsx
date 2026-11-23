import type { ReactNode, RefObject } from "react";
import { gsap, SplitText } from "../kit";

/** Hero frame padding + hero radius scale; the tone decides the surface (cream / paper / sand / dark / oxblood). */
export type Tone = "cream" | "paper" | "sand" | "dark" | "oxblood";
const SHAPE =
  "v11-wrap scroll-mt-4 rounded-[28px] px-5 py-12 sm:rounded-[40px] sm:px-10 sm:py-16 lg:rounded-[52px] lg:px-14 lg:py-14 xl:px-16";
const SURFACE: Record<Tone, string> = {
  cream: "v11-panel",
  paper: "v11-panel v11-panel--paper",
  sand: "v11-panel v11-panel--sand",
  dark: "v11-dark v11-grain",
  oxblood: "v11-dark v11-dark--ox v11-grain",
};
export const FRAME = "px-3 pb-3 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5";
export const EASE = "expo.out";

export function Panel({
  id,
  labelledBy,
  innerRef,
  className = "",
  tone = "cream",
  children,
}: {
  id: string;
  labelledBy: string;
  innerRef: RefObject<HTMLElement | null>;
  className?: string;
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <div className={FRAME}>
      <section ref={innerRef} id={id} aria-labelledby={labelledBy} className={`${SURFACE[tone]} ${SHAPE} ${className}`}>
        {children}
      </section>
    </div>
  );
}

export function Eyebrow({ children, className = "", dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <p data-eyebrow className={`text-[11px] font-medium uppercase tracking-[0.26em] ${dark ? "v11-gold" : "text-ink-soft"} ${className}`}>
      <span className={`mr-3 inline-block h-px w-8 translate-y-[-3px] ${dark ? "bg-[#c9a87c]/60" : "bg-ink/30"}`} />
      {children}
    </p>
  );
}

export const h2Cls =
  "mt-5 font-display text-[clamp(34px,5.2vw,56px)] leading-[1.04] tracking-[-0.01em] text-ink lg:text-[clamp(34px,3.3vw,50px)]";
/** Oversized editorial display heading. */
export const h2Big =
  "mt-5 font-display text-[clamp(42px,11vw,68px)] leading-[0.98] tracking-[-0.02em] text-balance sm:text-[clamp(52px,9vw,84px)] md:text-[clamp(48px,7.4vw,72px)] lg:text-[clamp(60px,6.6vw,104px)]";
export const leadCls = "mt-4 max-w-[38ch] text-[15px] leading-relaxed text-ink-soft sm:text-base";

/** Italic oxblood accent word, as in "Contenido que se siente *real*". */
export function Em({ children }: { children: ReactNode }) {
  return <span className="italic text-oxblood">{children}</span>;
}
/** Italic gold accent word for dark sections. */
export function Gold({ children }: { children: ReactNode }) {
  return <span className="v11-gold italic">{children}</span>;
}

export type HeadMode = "lines" | "words" | "chars" | "mask";

/** Eyebrow + split headline + lead reveal. Returns the cleanup. `mode` varies the heading reveal. */
export function headMotion(root: HTMLElement, start = "top 85%", mode: HeadMode = "lines") {
  const h2 = root.querySelector<HTMLElement>("[data-h2]");
  if (!h2) return () => {};
  const at = { trigger: h2, start, once: true } as const;
  const eyebrow = root.querySelector("[data-eyebrow]");
  const lead = root.querySelector("[data-lead]");
  if (eyebrow) gsap.from(eyebrow, { opacity: 0, y: 10, duration: 0.6, ease: "power2.out", scrollTrigger: at });
  let revert = () => {};
  if (mode === "words") {
    const s = SplitText.create(h2, { type: "words" });
    gsap.from(s.words, { opacity: 0, y: 26, filter: "blur(10px)", duration: 0.8, stagger: 0.06, ease: EASE, scrollTrigger: at });
    revert = () => s.revert();
  } else if (mode === "chars") {
    const s = SplitText.create(h2, { type: "words,chars" });
    gsap.from(s.chars, { opacity: 0, yPercent: 45, rotate: 4, duration: 0.7, stagger: 0.022, ease: EASE, scrollTrigger: at });
    revert = () => s.revert();
  } else if (mode === "mask") {
    const s = SplitText.create(h2, { type: "lines", mask: "lines" });
    gsap.from(s.lines, { yPercent: 110, duration: 0.95, stagger: 0.1, ease: EASE, scrollTrigger: at });
    revert = () => s.revert();
  } else {
    const s = SplitText.create(h2, { type: "lines" });
    gsap.from(s.lines, { yPercent: 60, opacity: 0, filter: "blur(8px)", duration: 0.85, stagger: 0.1, ease: EASE, scrollTrigger: at });
    revert = () => s.revert();
  }
  if (lead) gsap.from(lead, { opacity: 0, y: 14, duration: 0.7, delay: 0.2, ease: "power2.out", scrollTrigger: at });
  return revert;
}

/** Image / frame clip-path reveal, once on entry. */
export function clipReveal(el: Element | null, trigger: Element | null = el, from = "inset(0% 0% 100% 0% round 28px)", start = "top 88%") {
  if (!el) return;
  gsap.from(el, { clipPath: from, duration: 1, ease: EASE, scrollTrigger: { trigger: trigger ?? el, start, once: true } });
}

/** Count up numbers marked with data-count (+ optional data-dec decimals). */
export function countUp(root: HTMLElement, sel = "[data-count]", start = "top 95%") {
  root.querySelectorAll<HTMLElement>(sel).forEach((n) => {
    const end = Number(n.dataset.count);
    const dec = Number(n.dataset.dec ?? 0);
    const o = { v: 0 };
    const fmt = (v: number) => v.toFixed(dec).replace(".", ",");
    n.textContent = fmt(0);
    gsap.to(o, { v: end, duration: 1.4, ease: "power2.out", onUpdate: () => (n.textContent = fmt(o.v)), scrollTrigger: { trigger: n, start, once: true } });
  });
}
