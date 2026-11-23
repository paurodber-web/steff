import type { ReactNode, RefObject } from "react";
import { gsap, SplitText } from "../kit";

/** Same cream panel as Servicios: hero frame padding + hero radius scale. */
export const PANEL =
  "v11-panel v11-wrap scroll-mt-4 rounded-[28px] px-5 py-12 sm:rounded-[40px] sm:px-10 sm:py-16 lg:rounded-[52px] lg:px-14 lg:py-14 xl:px-16";
export const FRAME = "px-3 pb-3 sm:px-4 sm:pb-4 lg:px-5 lg:pb-5";
export const EASE = "expo.out";

export function Panel({
  id,
  labelledBy,
  innerRef,
  className = "",
  children,
}: {
  id: string;
  labelledBy: string;
  innerRef: RefObject<HTMLElement | null>;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={FRAME}>
      <section ref={innerRef} id={id} aria-labelledby={labelledBy} className={`${PANEL} ${className}`}>
        {children}
      </section>
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p data-eyebrow className={`text-[11px] font-medium uppercase tracking-[0.26em] text-ink-soft ${className}`}>
      <span className="mr-3 inline-block h-px w-8 translate-y-[-3px] bg-ink/30" />
      {children}
    </p>
  );
}

export const h2Cls =
  "mt-5 font-display text-[clamp(34px,5.2vw,56px)] leading-[1.04] tracking-[-0.01em] text-ink lg:text-[clamp(34px,3.3vw,50px)]";
export const leadCls = "mt-4 max-w-[38ch] text-[15px] leading-relaxed text-ink-soft sm:text-base";

/** Italic oxblood accent word, as in "Contenido que se siente *real*". */
export function Em({ children }: { children: ReactNode }) {
  return <span className="italic text-oxblood">{children}</span>;
}

/** Eyebrow + split-lines headline + lead reveal. Returns the cleanup. */
export function headMotion(root: HTMLElement, start = "top 85%") {
  const h2 = root.querySelector<HTMLElement>("[data-h2]");
  if (!h2) return () => {};
  const at = { trigger: h2, start, once: true } as const;
  const split = SplitText.create(h2, { type: "lines" });
  const eyebrow = root.querySelector("[data-eyebrow]");
  const lead = root.querySelector("[data-lead]");
  if (eyebrow) gsap.from(eyebrow, { opacity: 0, y: 10, duration: 0.6, ease: "power2.out", scrollTrigger: at });
  gsap.from(split.lines, { yPercent: 60, opacity: 0, filter: "blur(8px)", duration: 0.85, stagger: 0.1, ease: EASE, scrollTrigger: at });
  if (lead) gsap.from(lead, { opacity: 0, y: 14, duration: 0.7, delay: 0.2, ease: "power2.out", scrollTrigger: at });
  return () => split.revert();
}
