import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Draggable } from "gsap/Draggable";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats, type VideoItem } from "../../v2/data";
import type { Img } from "../images";
import { gsap, SplitText, useMotion, useLenis, useCopy, useFinePointer } from "../kit";

type P = { hero: Img; portrait: Img };
const tone: Record<string, string> = { cream: "#efe5d5", sand: "#dcc7a8", blush: "#ecd2c6", hero: "#d6c3a9", rose: "#d1a79c", oxblood: "#6b2228" };
const crop: Record<string, CSSProperties> = {
  face: { objectPosition: "50% 0%", transform: "scale(2.1)", transformOrigin: "50% 18%" },
  torso: { objectPosition: "50% 0%", transform: "scale(1.35)", transformOrigin: "50% 28%" },
  full: { objectPosition: "50% 0%" },
};
const rot = [-4, 3, -2, 5, -3, 2, -5, 4, -1, 3, -4, 2];

/* hand-drawn strokes (drawn in with stroke-dashoffset) */
const Scribble = {
  circle: "M12 52C8 26 52 8 104 9c56 1 92 18 90 43-2 27-54 40-104 38C44 88 6 74 9 48 11 30 40 18 70 14",
  under: "M4 14C40 6 90 4 150 8s96 6 120 2",
  arrow: "M6 10C30 40 60 58 104 62M104 62l-16-14M104 62l-20 8",
  check: "M4 18l10 10L36 4",
  wave: "M2 20C40 2 70 38 110 20s70-18 108 0 70 18 108 0",
};
function Draw({ d, className, w = 2.4, vb = "0 0 200 100", stroke = "currentColor" }: { d: string; className?: string; w?: number; vb?: string; stroke?: string }) {
  return (
    <svg aria-hidden viewBox={vb} className={className} fill="none" preserveAspectRatio="none">
      <path data-draw d={d} stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} style={{ strokeDasharray: 1 }} />
    </svg>
  );
}

/** Animates every [data-draw] path inside root when it enters. */
function drawIn(root: Element, start = "top 80%") {
  root.querySelectorAll<SVGPathElement>("[data-draw]").forEach((p, i) => {
    gsap.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", delay: i * 0.08, scrollTrigger: { trigger: p.closest("svg") ?? root, start, once: true } });
  });
}

function useDraggables(scope: React.RefObject<HTMLElement | null>, selector: string, enabled: boolean) {
  useEffect(() => {
    const root = scope.current;
    if (!root || !enabled) return;
    gsap.registerPlugin(Draggable);
    let z = 50;
    const ds = Draggable.create(root.querySelectorAll(selector), {
      bounds: root,
      onPress() {
        gsap.set(this.target, { zIndex: ++z });
        gsap.to(this.target, { scale: 1.06, rotate: "+=4", duration: 0.25, ease: "back.out(3)" });
      },
      onRelease() {
        gsap.to(this.target, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      },
    });
    return () => ds.forEach((d) => d.kill());
  }, [scope, selector, enabled]);
}

function Sticker({ children, className, style, bg = "#5c1a1f", fg = "#f4eee3" }: { children: ReactNode; className?: string; style?: CSSProperties; bg?: string; fg?: string }) {
  return (
    <span data-sticker className={`c-sticker absolute z-30 grid cursor-grab select-none place-items-center text-center active:cursor-grabbing ${className ?? ""}`} style={{ background: bg, color: fg, ...style }}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ HERO */
function Hero({ hero }: { hero: Img }) {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  useDraggables(ref, "[data-sticker]", fine);
  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-title]")!, { type: "words,chars" });
    const tl = gsap.timeline();
    tl.from(root.querySelector("[data-card]"), { scale: 0.9, rotate: -2, opacity: 0, duration: 1.2, ease: "elastic.out(1, 0.7)" })
      .from(s.chars, { yPercent: 80, rotate: (i) => (i % 2 ? 14 : -14), opacity: 0, duration: 1.1, ease: "back.out(2.2)", stagger: 0.07 }, 0.4)
      .from(root.querySelector("[data-fig]"), { yPercent: 30, opacity: 0, duration: 1.3, ease: "back.out(1.4)" }, 0.6)
      .from(root.querySelectorAll("[data-sticker]"), { scale: 0, rotate: (i) => (i % 2 ? 90 : -90), duration: 0.9, ease: "back.out(2.6)", stagger: 0.09 }, 1.1)
      .from(root.querySelectorAll("[data-in]"), { y: 16, opacity: 0, duration: 0.8, ease: "back.out(2)", stagger: 0.08 }, 1.2);
    root.querySelectorAll<SVGPathElement>("[data-draw]").forEach((p, i) => tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, 1.6 + i * 0.2));
    // stickers float gently
    root.querySelectorAll("[data-sticker] > *").forEach((el, i) => gsap.to(el, { y: i % 2 ? 6 : -6, rotate: i % 2 ? 3 : -3, duration: 2.4 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    return () => s.revert();
  });

  return (
    <section ref={ref} id="top" className="p-3 sm:p-4 lg:p-5">
      <div data-card className="c-card relative flex h-[calc(100svh-24px)] min-h-[600px] flex-col items-center overflow-hidden rounded-[28px] sm:h-[calc(100svh-32px)] sm:rounded-[40px] lg:h-[calc(100svh-40px)] lg:rounded-[52px]">
        <header data-in className="relative z-40 flex w-full items-center justify-between px-5 pt-5 sm:px-8 sm:pt-7 lg:px-12">
          <a href="#top" className="font-hand text-[30px] leading-none">steff ♡</a>
          <nav aria-label="Principal" className="hidden gap-2 md:flex">
            {[["diario", "Diario"], ["como", "Cómo"], ["carta", "Sobre mí"], ["contacto", "Contacto"]].map(([id, n]) => (
              <a key={id} href={`#${id}`} className="rounded-full bg-cream/70 px-4 py-2 text-[14px] font-medium transition-transform hover:-rotate-3 hover:scale-105">{n}</a>
            ))}
          </nav>
          <a href={`mailto:${EMAIL}`} className="rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-cream transition-transform hover:rotate-3 hover:scale-105">Escríbeme ✉</a>
        </header>

        <p data-in className="relative z-20 mt-[3svh] text-center text-[15px] font-medium sm:text-[16px]">
          creadora de contenido <span className="relative inline-block px-1">UGC<Draw d={Scribble.circle} className="absolute -inset-x-3 -inset-y-2 h-[calc(100%+16px)] w-[calc(100%+24px)] text-oxblood" /></span>
        </p>
        <h1 className="relative z-10 mt-[1svh] text-center">
          <span className="sr-only">Steff Ramírez, UGC Creator</span>
          <span aria-hidden data-title className="c-hero-title block font-display italic leading-[0.8]">Steff</span>
        </h1>
        <img data-fig src={hero.src} srcSet={hero.srcSet} sizes="(min-width:1024px) 520px, 85vw" width={hero.width} height={hero.height} alt="Steff Ramírez, creadora de contenido UGC" fetchPriority="high" className="absolute bottom-0 left-1/2 z-20 h-[70%] w-auto max-w-none -translate-x-1/2 drop-shadow-[0_24px_30px_rgba(70,45,30,0.25)]" />

        <Sticker className="left-[6%] top-[42%] h-[92px] w-[92px] rounded-full sm:left-[14%] sm:h-[118px] sm:w-[118px]" bg="#5c1a1f"><span className="font-display text-[19px] italic leading-tight sm:text-[23px]">moda<br />✦</span></Sticker>
        <Sticker className="right-[5%] top-[36%] h-[84px] w-[110px] rotate-6 rounded-[18px] sm:right-[14%] sm:h-[96px] sm:w-[130px]" bg="#f4eee3" fg="#2a1b16"><span className="text-[15px] font-semibold leading-tight">belleza<br /><span className="font-hand text-[24px] font-normal text-oxblood">& skincare</span></span></Sticker>
        <Sticker className="bottom-[16%] left-[8%] h-[80px] w-[124px] -rotate-6 rounded-full sm:left-[20%]" bg="#e9cfc2" fg="#2a1b16"><span className="font-hand text-[26px] leading-none">lifestyle ☀</span></Sticker>
        <Sticker className="bottom-[20%] right-[6%] h-[100px] w-[100px] rotate-12 rounded-[28px] sm:right-[20%] sm:h-[112px] sm:w-[112px]" bg="#2a1b16"><span className="text-[13px] font-semibold uppercase leading-tight tracking-wider">mom<br />life<br />♡</span></Sticker>

        <div data-in className="absolute bottom-6 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-cream px-4 py-2 text-[13px] font-medium shadow-md sm:flex">
          {fine ? "arrastra las pegatinas ✋" : "desliza ↓"}
        </div>
        <p className="pointer-events-none absolute right-[22%] top-[22%] z-30 hidden rotate-[8deg] font-hand text-[28px] text-oxblood lg:block">¡hola, marca!<Draw d={Scribble.arrow} vb="0 0 110 70" className="ml-6 mt-1 h-[60px] w-[100px]" /></p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ DIARIO (polaroid board) */
function Polaroid({ img, item, i, cat }: { img: Img; item: VideoItem; i: number; cat: string }) {
  return (
    <figure data-pol className="c-pol relative cursor-grab bg-[#fbf8f2] p-2.5 pb-4 active:cursor-grabbing" style={{ rotate: `${rot[i % rot.length]}deg` }}>
      <span aria-hidden className="c-tape" style={{ rotate: `${-rot[i % rot.length] * 2}deg` }} />
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: tone[item.tone] }}>
        <img src={img.src} srcSet={img.srcSet} sizes="(min-width:1024px) 22vw, 70vw" alt="" loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover mix-blend-multiply" style={{ ...crop[item.crop], filter: item.tone === "oxblood" ? "grayscale(1) contrast(1.1) brightness(1.25)" : "saturate(0.9)" }} />
        <span className="absolute bottom-2 left-2 rounded-full bg-cream/90 px-2 py-0.5 text-[11px] font-semibold">{item.format} · {item.duration}</span>
      </div>
      <figcaption className="mt-3 px-1">
        <p className="font-hand text-[26px] leading-[1]">“{item.hook}”</p>
        <p className="mt-1.5 text-[13px] text-ink-soft">para <strong className="font-semibold text-ink">{item.brand}</strong> · {cat}</p>
      </figcaption>
    </figure>
  );
}

function Diary({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  useDraggables(board, "[data-pol]", fine);
  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-h]")!, { type: "words" });
    gsap.from(s.words, { y: 40, rotate: (i) => (i % 2 ? 8 : -8), opacity: 0, duration: 1, ease: "back.out(2)", stagger: 0.08, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    root.querySelectorAll("[data-col]").forEach((col) => {
      gsap.from(col.querySelectorAll("[data-pol], [data-note]"), { y: -120, x: () => gsap.utils.random(-60, 60), rotate: () => gsap.utils.random(-30, 30), opacity: 0, duration: 1.1, ease: "back.out(1.6)", stagger: 0.12, scrollTrigger: { trigger: col, start: "top 80%", once: true } });
    });
    drawIn(root);
    return () => s.revert();
  });
  const notes = ["#f6d9a8", "#ecd2c6", "#dfe0c9", "#f1c9c3"];
  return (
    <section ref={ref} id="diario" aria-labelledby="d-title" className="relative px-5 pb-28 pt-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px] text-center">
        <p className="font-hand text-[30px] text-oxblood">página 01</p>
        <h2 id="d-title" data-h className="mx-auto mt-2 max-w-[16ch] font-display text-[clamp(48px,7.4vw,124px)] leading-[0.95] tracking-[-0.02em]">Mi diario de <em className="relative italic text-oxblood">trabajo<Draw d={Scribble.under} vb="0 0 280 20" className="absolute -bottom-2 left-0 h-[18px] w-full" /></em></h2>
        <p className="mx-auto mt-6 max-w-[30rem] text-[17px] text-ink-soft">Doce videos, cuatro mundos. {fine ? "Muévelos, son tuyos un ratito." : "Desliza y mira."}</p>
      </div>
      <div ref={board} className="relative mx-auto mt-16 grid max-w-[1400px] gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, ci) => (
          <div key={s.id} id={s.id} data-col className="flex flex-col items-center gap-10">
            <div data-note className="c-note w-[200px] p-4 text-left" style={{ background: notes[ci], rotate: `${ci % 2 ? 3 : -3}deg` }}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-soft">{s.n}</p>
              <h3 className="font-display text-[36px] italic leading-none">{s.name}</h3>
              <p className="mt-1 font-hand text-[22px] leading-[1.05]">{s.desc}</p>
            </div>
            {portfolio[s.id].map((item, k) => (
              <div key={item.brand} className={`w-full max-w-[300px] ${k % 2 ? "lg:translate-x-4" : "lg:-translate-x-3"}`}>
                <Polaroid img={portrait} item={item} i={ci * 3 + k} cat={s.name} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CÓMO (checklist + sticky notes) */
function How() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    drawIn(root, "top 85%");
    gsap.from(root.querySelectorAll("[data-step]"), { scale: 0.6, rotate: (i) => (i % 2 ? 12 : -12), opacity: 0, duration: 0.9, ease: "back.out(2.4)", stagger: 0.15, scrollTrigger: { trigger: root.querySelector("[data-steps]"), start: "top 80%", once: true } });
  });
  return (
    <section ref={ref} id="como" aria-labelledby="h-title" className="c-paper relative py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-12">
        <p className="font-hand text-[30px] text-oxblood">página 02</p>
        <h2 id="h-title" className="mt-2 font-display text-[clamp(48px,7vw,116px)] leading-[0.95] tracking-[-0.02em]">Cómo <em className="italic">trabajamos</em></h2>
        <div data-steps className="relative mt-16">
          <Draw d={Scribble.wave} vb="0 0 330 40" w={1.6} className="absolute left-[6%] right-[6%] top-[46%] hidden h-[40px] w-[88%] text-oxblood/60 lg:block" />
          <ol className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.n} data-step className="c-note mx-auto w-full max-w-[290px] p-6" style={{ background: ["#f6d9a8", "#ecd2c6", "#dfe0c9", "#f1c9c3"][i], rotate: `${[-3, 2, -2, 3][i]}deg` }}>
                <p className="font-hand text-[44px] leading-none text-oxblood">{i + 1}.</p>
                <h3 className="mt-2 font-display text-[34px] italic leading-none">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mx-auto mt-24 max-w-[760px]">
          <h3 className="font-display text-[clamp(34px,4vw,56px)] italic leading-none">Lo que te puedo grabar</h3>
          <ul className="mt-8">
            {formats.map((f) => (
              <li key={f.name} className="c-line flex items-start gap-4 py-3">
                <span className="relative mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-md border-2 border-ink/70">
                  <Draw d={Scribble.check} vb="0 0 40 32" w={4} className="h-5 w-6 text-oxblood" />
                </span>
                <span><span className="font-display text-[24px] leading-tight">{f.name}</span> <span className="font-hand text-[24px] text-ink-soft">— {f.note.toLowerCase()}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ MARCAS (stamps) */
function Stamps() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-stamp]"), { scale: 2.2, opacity: 0, rotate: () => gsap.utils.random(-40, 40), duration: 0.55, ease: "power4.in", stagger: 0.1, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
  });
  return (
    <section ref={ref} aria-labelledby="st-title" className="bg-oxblood py-[clamp(100px,12vw,180px)] text-cream">
      <div className="mx-auto max-w-[1300px] px-5 text-center sm:px-8">
        <p className="font-hand text-[30px] text-[#f1c9c3]">página 03</p>
        <h2 id="st-title" className="mt-2 font-display text-[clamp(44px,6vw,100px)] italic leading-none">Marcas amigas</h2>
        <ul className="mt-16 flex flex-wrap justify-center gap-5 sm:gap-7">
          {brands.map((b, i) => (
            <li key={b} data-stamp className="c-stamp grid h-[132px] w-[132px] place-items-center rounded-full p-3 text-center sm:h-[150px] sm:w-[150px]" style={{ rotate: `${rot[i]}deg` }}>
              <span className="font-display text-[19px] italic leading-tight sm:text-[21px]">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CARTA (about as a letter) */
function Letter({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelector("[data-pic]"), { rotate: -18, y: 80, opacity: 0, duration: 1.2, ease: "back.out(1.6)", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    const s = new SplitText(root.querySelector("[data-letter]")!, { type: "lines" });
    gsap.from(s.lines, { opacity: 0, x: -20, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: root.querySelector("[data-letter]"), start: "top 80%", once: true } });
    drawIn(root, "top 75%");
    return () => s.revert();
  });
  return (
    <section ref={ref} id="carta" aria-labelledby="l-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <figure data-pic className="c-pol relative mx-auto w-full max-w-[360px] -rotate-3 bg-[#fbf8f2] p-3 pb-14">
          <span aria-hidden className="c-tape" />
          <div className="relative aspect-[4/5] overflow-hidden bg-[#d6c3a9]"><img src={portrait.src} srcSet={portrait.srcSet} sizes="360px" alt="Steff Ramírez" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply" /></div>
          <figcaption className="absolute bottom-3 left-0 right-0 text-center font-hand text-[30px]">yo, grabando ♡</figcaption>
        </figure>
        <div className="c-letter relative p-7 sm:p-12">
          <p className="font-hand text-[30px] text-oxblood">página 04</p>
          <h2 id="l-title" className="mt-1 font-display text-[clamp(38px,4.6vw,68px)] italic leading-none">Querida marca,</h2>
          <div data-letter className="mt-6 space-y-4 text-[18px] leading-[1.75]">
            <p>Soy Steff. Creo contenido que se siente como la recomendación de una amiga, no como un anuncio.</p>
            <p>Moda, belleza y el día a día de una mamá real, grabado en casa con luz natural, con cuidado y mucha cercanía. Si tu producto merece que alguien pare el scroll, cuéntamelo.</p>
          </div>
          <p className="mt-8 font-hand text-[40px] leading-none text-oxblood">con cariño, Steff</p>
          <Draw d={Scribble.under} vb="0 0 280 20" className="mt-1 h-[16px] w-[220px] text-oxblood" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ */
function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section aria-labelledby="q-title" className="c-paper py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[900px] px-5 sm:px-8">
        <p className="text-center font-hand text-[30px] text-oxblood">página 05</p>
        <h2 id="q-title" className="mt-2 text-center font-display text-[clamp(44px,6vw,96px)] leading-[0.95]">Preguntas que <em className="italic">me hacen</em></h2>
        <ul className="mt-14 space-y-4">
          {faqs.map((f, i) => (
            <li key={f.q} className="c-note bg-[#fbf8f2] transition-transform duration-500" style={{ rotate: open === i ? "0deg" : `${i % 2 ? 0.8 : -0.8}deg` }}>
              <h3>
                <button type="button" aria-expanded={open === i} aria-controls={`cq${i}`} onClick={() => setOpen(open === i ? null : i)} className="flex w-full cursor-pointer items-center gap-4 p-5 text-left sm:p-6">
                  <span className="font-hand text-[30px] leading-none text-oxblood">{i + 1}</span>
                  <span className="flex-1 font-display text-[clamp(21px,2.2vw,28px)] leading-tight">{f.q}</span>
                  <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-cream transition-transform duration-500 ${open === i ? "rotate-45" : ""}`}>+</span>
                </button>
              </h3>
              <div id={`cq${i}`} hidden={open !== i} className="px-5 pb-6 pl-16 sm:px-6 sm:pl-[72px]"><p className="text-[17px] leading-relaxed text-ink-soft">{f.a}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CONTACT */
function Contact() {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const { copy, done } = useCopy(EMAIL);
  useDraggables(ref, "[data-sticker]", fine);
  useMotion(ref, (root) => {
    gsap.from(root.querySelector("[data-env]"), { y: 120, rotate: 8, opacity: 0, duration: 1.2, ease: "back.out(1.5)", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    gsap.from(root.querySelectorAll("[data-sticker]"), { scale: 0, duration: 0.8, ease: "back.out(2.6)", stagger: 0.12, delay: 0.6, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    drawIn(root, "top 60%");
  });
  return (
    <section ref={ref} id="contacto" aria-labelledby="ct-title" className="p-3 sm:p-4 lg:p-5">
      <div className="c-card relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden rounded-[28px] px-5 py-24 text-center sm:rounded-[40px] lg:rounded-[52px]">
        <div data-env className="relative z-10">
          <p className="font-hand text-[30px] text-oxblood">última página</p>
          <h2 id="ct-title" className="mt-2 font-display text-[clamp(56px,10vw,170px)] italic leading-[0.9]">¿Me escribes?</h2>
          <a href={`mailto:${EMAIL}`} className="group relative mt-10 inline-block font-display text-[clamp(22px,3.4vw,46px)]">
            {EMAIL}
            <Draw d={Scribble.under} vb="0 0 280 20" className="absolute -bottom-3 left-0 h-[16px] w-full text-oxblood" />
          </a>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={copy} className="cursor-pointer rounded-full bg-ink px-6 py-3 text-[15px] font-medium text-cream transition-transform hover:-rotate-2 hover:scale-105">{done ? "¡copiado! ✓" : "copiar correo"}</button>
            {socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-cream px-6 py-3 text-[15px] font-medium transition-transform hover:rotate-2 hover:scale-105">{s.label} ↗<span className="sr-only"> (se abre en una pestaña nueva)</span></a>
            ))}
          </div>
        </div>
        <Sticker className="left-[6%] top-[12%] h-[100px] w-[100px] rounded-full sm:left-[12%]" bg="#5c1a1f"><span className="font-hand text-[26px] leading-none">¡hola!</span></Sticker>
        <Sticker className="bottom-[12%] right-[6%] h-[96px] w-[120px] rotate-6 rounded-[20px] sm:right-[12%]" bg="#f4eee3" fg="#2a1b16"><span className="font-hand text-[24px] leading-none">respondo<br />rápido ♡</span></Sticker>
        <p className="absolute bottom-6 left-0 right-0 text-[13px] text-ink-soft">© 2026 Steff Ramírez · hecho con cariño</p>
      </div>
    </section>
  );
}

export default function App({ hero, portrait }: P) {
  useLenis({ lerp: 0.1 });
  return (
    <main className="overflow-x-clip">
      <Hero hero={hero} />
      <Diary portrait={portrait} />
      <How />
      <Stamps />
      <Letter portrait={portrait} />
      <Faq />
      <Contact />
    </main>
  );
}
