import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "./cn";
import { portfolio, services } from "./data";
import type { HeroImage } from "./Hero";
import { Clip } from "./Clip";
import { SplitTitle, useSectionAnim, gsap, ScrollTrigger, registerGsap } from "./anim";

/** Each category is a "world": the whole stage takes its colours while its clips are on screen. */
const worlds: Record<string, { bg: string; fg: string; soft: string; line: string }> = {
  moda: { bg: "#f4eee3", fg: "#2a1b16", soft: "#5b4a3f", line: "rgba(42,27,22,0.14)" },
  belleza: { bg: "#ecd7cb", fg: "#2a1b16", soft: "#6a4a42", line: "rgba(42,27,22,0.14)" },
  lifestyle: { bg: "#e3d1b8", fg: "#2a1b16", soft: "#5b4a3f", line: "rgba(42,27,22,0.14)" },
  momlife: { bg: "#5c1a1f", fg: "#f4eee3", soft: "rgba(244,238,227,0.7)", line: "rgba(244,238,227,0.18)" },
};

const STEP = 72; // svh of scroll per clip

const eyebrow = "text-[11px] font-medium uppercase tracking-[0.2em] sm:tracking-[0.28em]";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export const Feed = memo(function Feed({ portrait }: { portrait: HeroImage }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // flatten: every clip knows its category and its index inside it
  const clips = useMemo(
    () =>
      services.flatMap((s, ci) =>
        portfolio[s.id].map((item, k) => ({ item, cat: s, ci, k })),
      ),
    [],
  );
  const starts = useMemo(() => services.map((s) => clips.findIndex((c) => c.cat.id === s.id)), [clips]);
  const N = clips.length;

  useSectionAnim(ref);

  return (
    <section ref={ref} id="portafolio" data-folio="Nº 02 — Portafolio" aria-labelledby="portafolio-title" className="relative">
      <header className="mx-auto w-full max-w-[1320px] px-5 pb-[clamp(56px,8vw,112px)] pt-[clamp(112px,15vw,220px)] sm:px-8 lg:px-12">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <div className="lg:col-span-8">
            <p data-fade className={cn(eyebrow, "text-ink-soft")}>
              Nº 02 — Portafolio
            </p>
            <h2
              id="portafolio-title"
              className="mt-6 font-display text-[clamp(50px,9.6vw,150px)] font-normal leading-[0.92] tracking-[-0.03em] text-ink"
            >
              <SplitTitle parts={[{ t: "Videos que " }, { t: "detienen", em: true }, { t: " el scroll." }]} />
            </h2>
          </div>
          <div className="mt-8 lg:col-span-4 lg:mt-0 lg:pb-4">
            <p data-fade data-delay="0.15" className="max-w-[24rem] text-[clamp(16px,1.5vw,18px)] leading-relaxed text-ink-soft">
              {N === 12 ? "Doce" : N} piezas, cuatro mundos. Baja despacio: esto es mi feed.
            </p>
          </div>
        </div>
      </header>

      {reduced ? <StaticGrid portrait={portrait} /> : <Stage portrait={portrait} clips={clips} starts={starts} />}
    </section>
  );
});

type FlatClip = { item: (typeof portfolio)["moda"][number]; cat: (typeof services)[number]; ci: number; k: number };

function Stage({ portrait, clips, starts }: { portrait: HeroImage; clips: FlatClip[]; starts: number[] }) {
  const N = clips.length;
  const track = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const ghost = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const cur = clips[active];
  const world = worlds[cur.cat.id];

  useEffect(() => {
    registerGsap();
    const el = track.current;
    const s = strip.current;
    if (!el || !s) return;
    const items = Array.from(s.children) as HTMLElement[];
    let last = -1;

    // rest on every clip, then swipe to the next one, like a thumb on a phone
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const v = Math.min(self.progress * N, N - 0.0001);
        const base = Math.floor(v);
        const f = v - base;
        const t = Math.min(Math.max((f - 0.58) / 0.42, 0), 1);
        const eased = t * t * (3 - 2 * t);
        const pos = Math.min(base + eased, N - 1);
        s.style.transform = `translate3d(0, ${(-pos * 100) / N}%, 0)`;
        for (let i = Math.max(0, base - 1); i <= Math.min(N - 1, base + 2); i++) {
          const d = i - pos;
          const a = Math.min(Math.abs(d), 1);
          items[i].style.transform = `scale(${1 - a * 0.12})`;
          items[i].style.filter = `brightness(${1 - a * 0.35})`;
        }
        if (ghost.current) ghost.current.style.transform = `translate3d(${(0.5 - self.progress) * 12}%, 0, 0)`;
        if (bar.current) bar.current.style.transform = `scaleY(${self.progress})`;
        const idx = Math.round(pos);
        if (idx !== last) {
          last = idx;
          setActive(idx);
          // the page behind (scrollbar gutter, overscroll) follows the current world
          document.documentElement.style.setProperty("--page", worlds[clips[idx].cat.id].bg);
        }
      },
      onLeaveBack: () => document.documentElement.style.setProperty("--page", worlds.moda.bg),
    });

    // the phone arrives: rises and straightens as the stage scrolls in
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (phone.current) {
        gsap.fromTo(
          phone.current,
          { yPercent: 18, rotate: -7, scale: 0.86 },
          { yPercent: 0, rotate: 0, scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top top", scrub: 0.6 } },
        );
      }
    });

    // gentle 3D tilt towards the pointer (fine pointers)
    const fine = window.matchMedia("(pointer: fine)").matches;
    const t = tilt.current;
    let onMove: ((e: PointerEvent) => void) | null = null;
    if (fine && t) {
      const rx = gsap.quickTo(t, "rotateX", { duration: 0.8, ease: "power3.out" });
      const ry = gsap.quickTo(t, "rotateY", { duration: 0.8, ease: "power3.out" });
      onMove = (e: PointerEvent) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        rx(-y * 8);
        ry(x * 10);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    return () => {
      st.kill();
      mm.revert();
      if (onMove) window.removeEventListener("pointermove", onMove);
    };
  }, [N, clips]);

  const vars = { "--w-bg": world.bg, "--w-fg": world.fg, "--w-soft": world.soft, "--w-line": world.line } as CSSProperties;

  return (
    <div ref={track} className="relative" style={{ height: `calc(${N * STEP}svh + 100svh)` }}>
      {/* anchors for the hero / menu links: land on the first clip of each category */}
      {services.map((s, i) => (
        <span key={s.id} id={s.id} aria-hidden className="absolute left-0 h-px w-px" style={{ top: `${starts[i] * STEP + (starts[i] ? STEP * 0.2 : 0)}svh` }} />
      ))}

      <div className="v2-stage-world sticky top-0 h-[100svh] overflow-hidden" style={vars}>
        {/* giant outlined category word drifting behind the phone */}
        <div ref={ghost} aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
          {services.map((s) => (
            <span key={s.id} className={cn("v2-stage-ghost absolute inset-x-0 -translate-y-1/2", s.id === cur.cat.id && "is-on")}>
              {s.name}
            </span>
          ))}
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-[1440px] flex-col items-center justify-center gap-5 px-5 pb-6 pt-20 sm:px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-14 lg:px-12 lg:py-0">
          {/* LEFT: category */}
          <div className="w-full text-center lg:self-center lg:text-left">
            <p className={cn(eyebrow, "text-[var(--w-soft)] transition-colors duration-700")}>
              Mundo <span className="tabular-nums">{String(cur.ci + 1).padStart(2, "0")}</span> / {String(services.length).padStart(2, "0")}
            </p>
            <div className="relative mt-3 h-[1.02em] overflow-hidden font-display text-[clamp(52px,8.4vw,150px)] leading-none tracking-[-0.03em] lg:mt-5">
              {services.map((s, i) => (
                <span
                  key={s.id}
                  aria-hidden={i !== cur.ci}
                  className="v2-roll absolute inset-x-0 top-0 block"
                  data-state={i === cur.ci ? "on" : i < cur.ci ? "past" : "next"}
                >
                  {i % 2 === 1 ? <em className="italic">{s.name}</em> : s.name}
                </span>
              ))}
            </div>
            <p key={cur.cat.id} className="v2-swap mt-5 hidden max-w-[22rem] text-[17px] leading-relaxed text-[var(--w-soft)] lg:block">
              {cur.cat.desc}
            </p>
            <nav aria-label="Mundos del portafolio" className="mt-10 hidden lg:block">
              <ul className="flex flex-col gap-2.5">
                {services.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      data-cursor="Ir"
                      className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                    >
                      <span className={cn("h-px bg-current transition-all duration-700", i === cur.ci ? "w-10" : "w-4 opacity-40 group-hover:w-7")} />
                      <span className={cn("transition-opacity duration-500", i === cur.ci ? "opacity-100" : "opacity-45 group-hover:opacity-80")}>{s.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* CENTER: the phone */}
          <div className="relative [perspective:1400px]">
            <div ref={phone} className="relative">
              <div ref={tilt} className="v2-phone" data-cursor="Mi feed">
                <div className="v2-phone__screen">
                  <div ref={strip} className="absolute inset-x-0 top-0 will-change-transform" style={{ height: `${N * 100}%` }}>
                    {clips.map((c, i) => (
                      <div key={c.item.brand} className="relative origin-center" style={{ height: `${100 / N}%` }}>
                        <Clip item={c.item} category={c.cat.name} portrait={portrait} active={i === active} bare />
                      </div>
                    ))}
                  </div>
                  <span aria-hidden className="v2-phone__island" />
                </div>
              </div>
              {/* scroll hint under the phone, only on the first clip */}
              <p
                aria-hidden
                className={cn(
                  "absolute -bottom-9 left-1/2 hidden -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--w-soft)] transition-opacity duration-500 lg:flex",
                  active === 0 ? "opacity-100" : "opacity-0",
                )}
              >
                <span className="v2-hint-dot" /> Sigue bajando
              </p>
            </div>
          </div>

          {/* RIGHT: the clip on screen */}
          <div className="flex w-full items-end justify-between gap-6 lg:block lg:self-center">
            <div className="flex items-baseline gap-2 font-display leading-none lg:gap-3">
              <span className="relative block h-[1em] overflow-hidden text-[clamp(30px,4.6vw,84px)] italic tabular-nums">
                <span key={active} className="v2-swap-up block">
                  {String(active + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="text-[clamp(14px,1.4vw,22px)] text-[var(--w-soft)]">/ {String(N).padStart(2, "0")}</span>
            </div>
            <div key={active} className="v2-swap min-w-0 text-right lg:mt-8 lg:text-left">
              <p className="font-display text-[clamp(20px,2.4vw,40px)] leading-tight">
                <span className="italic text-[var(--w-soft)]">para</span> {cur.item.brand}
              </p>
              <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--w-soft)] lg:text-[11px]">
                {cur.item.format} · {cur.item.duration}
              </p>
              <p className="mt-6 hidden max-w-[18rem] font-display text-[22px] italic leading-snug lg:block">“{cur.item.hook}”</p>
            </div>
            {/* index ticks */}
            <ol aria-hidden className="mt-10 hidden gap-[5px] lg:flex">
              {clips.map((c, i) => (
                <li
                  key={c.item.brand}
                  className={cn(
                    "h-7 w-[3px] origin-bottom rounded-full bg-current transition-[transform,opacity] duration-500",
                    i === active ? "scale-y-100 opacity-100" : "scale-y-50 opacity-25",
                    c.k === 0 && i > 0 && "ml-3",
                  )}
                />
              ))}
            </ol>
          </div>
        </div>

        {/* vertical progress on the right edge */}
        <span aria-hidden className="absolute right-5 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-[var(--w-line)] lg:block">
          <span ref={bar} className="absolute inset-0 origin-top bg-current" style={{ transform: "scaleY(0)" }} />
        </span>
      </div>
    </div>
  );
}

/** Reduced motion: the same clips, laid out as a calm grid with anchors. */
function StaticGrid({ portrait }: { portrait: HeroImage }) {
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-20 px-5 pb-24 sm:px-8 lg:px-12">
      {services.map((s) => (
        <div key={s.id} id={s.id} className="scroll-mt-20">
          <h3 className="font-display text-[clamp(44px,6vw,88px)] leading-none tracking-[-0.02em] text-ink">{s.name}</h3>
          <p className="mt-3 text-[16px] text-ink-soft">{s.desc}</p>
          <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {portfolio[s.id].map((item) => (
              <li key={item.brand} className="aspect-[9/16]">
                <Clip item={item} category={s.name} portrait={portrait} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
