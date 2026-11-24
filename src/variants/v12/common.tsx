import type { ReactNode, RefObject } from "react";
import { gsap, SplitText } from "../kit";

/** Full-bleed colour bands that meet edge to edge; the colour change is the only divider. */
export type Tone = "cream" | "paper" | "sand" | "dark" | "oxblood";
const SURFACE: Record<Tone, string> = {
  cream: "v12-tone-cream",
  paper: "v12-tone-paper",
  sand: "v12-tone-sand",
  dark: "v12-tone-dark",
  oxblood: "v12-tone-oxblood",
};
export const EASE = "expo.out";

/** Section band: full-bleed colour + a 12-column editorial wrapper (max 1360px). */
export function Band({
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
    <section ref={innerRef} id={id} aria-labelledby={labelledBy} className={`v12-sec ${SURFACE[tone]} scroll-mt-0 py-14 sm:py-16 lg:py-20 ${className}`}>
      <div className="v12-wrap">{children}</div>
    </section>
  );
}

/** Folio line: hairline that draws in, section number left, name right. */
export function Folio({ n, children, className = "" }: { n: string; children: ReactNode; className?: string }) {
  return (
    <div data-eyebrow className={`mb-8 lg:mb-10 ${className}`}>
      <span data-rule aria-hidden className="v12-rule block h-px w-full origin-left" />
      <p className="v12-folio mt-3 flex items-baseline justify-between gap-4">
        <span>{children}</span>
        <span aria-hidden className="v12-folio-n">{n}</span>
      </p>
    </div>
  );
}

/** Oversized editorial display heading (Fraunces). */
export const h2Big =
  "font-display text-[clamp(40px,10.6vw,60px)] leading-[1.02] tracking-[-0.022em] text-balance sm:text-[clamp(50px,8.4vw,76px)] md:text-[clamp(46px,7.2vw,68px)] lg:text-[clamp(56px,5.6vw,92px)]";
export const h2Mid =
  "font-display text-[clamp(36px,9.4vw,52px)] leading-[1.04] tracking-[-0.02em] text-balance sm:text-[clamp(44px,7vw,64px)] md:text-[clamp(40px,6vw,56px)] lg:text-[clamp(44px,4.4vw,70px)]";
export const leadCls = "text-[16px] leading-[1.6] text-ink-soft sm:text-[17px]";

/** Italic accent word. */
export function Em({ children }: { children: ReactNode }) {
  return <span className="italic text-oxblood">{children}</span>;
}
/** Italic gold accent word for dark sections. */
export function Gold({ children }: { children: ReactNode }) {
  return <span className="v12-gold italic">{children}</span>;
}

export type HeadMode = "lines" | "words" | "chars" | "mask";

/** Eyebrow + split headline + lead reveal. Returns the cleanup. `mode` varies the heading reveal. */
export function headMotion(root: HTMLElement, start = "top 85%", mode: HeadMode = "lines") {
  const h2 = root.querySelector<HTMLElement>("[data-h2]");
  if (!h2) return () => {};
  const at = { trigger: h2, start, once: true } as const;
  const eyebrow = root.querySelector("[data-eyebrow]");
  const rule = root.querySelector("[data-rule]");
  if (rule) gsap.from(rule, { scaleX: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: rule, start: "top 92%", once: true } });
  const lead = root.querySelector("[data-lead]");
  if (eyebrow) gsap.from(eyebrow.querySelector(".v12-folio"), { opacity: 0, y: 10, duration: 0.6, ease: "power2.out", scrollTrigger: at });
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
export function clipReveal(el: Element | null, trigger: Element | null = el, from = "inset(0% 0% 100% 0%)", start = "top 88%") {
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
