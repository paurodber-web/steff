import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Flip } from "gsap/Flip";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats, type VideoItem } from "../../v2/data";
import type { Img } from "../images";
import { gsap, ScrollTrigger, SplitText, useMotion, useLenis, useCopy, useReduced } from "../kit";

gsap.registerPlugin(Flip);

type P = { hero: Img; portrait: Img };
const tone: Record<string, string> = { cream: "#efe6d6", sand: "#d8c29f", blush: "#e5c9bb", hero: "#d6c3a9", rose: "#c09389", oxblood: "#5c1a1f" };
const crop: Record<string, CSSProperties> = {
  face: { objectPosition: "50% 0%", transform: "scale(2.1)", transformOrigin: "50% 18%" },
  torso: { objectPosition: "50% 0%", transform: "scale(1.35)", transformOrigin: "50% 28%" },
  full: { objectPosition: "50% 0%" },
};
const mono = "font-mono text-[11px] uppercase tracking-[0.08em]";

function Shot({ img, item, sizes }: { img: Img; item: VideoItem; sizes: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: tone[item.tone] }}>
      <img src={img.src} srcSet={img.srcSet} sizes={sizes} alt="" loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover mix-blend-multiply grayscale-[0.2]" style={{ ...crop[item.crop], filter: item.tone === "oxblood" ? "grayscale(1) contrast(1.2) brightness(1.2)" : "contrast(1.05)" }} />
    </div>
  );
}

/** Mono label that scrambles into place when it enters. */
function Scr({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useMotion(ref, (el) => {
    gsap.to(el, { duration: 1.1, scrambleText: { text: children, chars: "01#/—+", speed: 0.6 }, scrollTrigger: { trigger: el, start: "top 95%", once: true } });
  });
  return <span ref={ref} className={className}>{children}</span>;
}

function Clock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    f();
    const id = window.setInterval(f, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t}</span>;
}

/* ------------------------------------------------------------------ HERO */
function Hero({ hero }: { hero: Img }) {
  const ref = useRef<HTMLElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  useMotion(ref, (root) => {
    const big = root.querySelectorAll("[data-big]");
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(root.querySelector("[data-card]"), { clipPath: "inset(50% 0% 50% 0% round 52px)", duration: 1.1, ease: "power4.inOut" })
      .from(root.querySelectorAll("[data-gl]"), { scaleY: 0, duration: 0.9, stagger: 0.03, transformOrigin: "top" }, 0.5)
      .from(big, { fontStretch: "125%", opacity: 0, yPercent: 30, duration: 1.3, stagger: 0.12 }, 0.6)
      .from(root.querySelector("[data-fig]"), { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" }, 0.8)
      .from(root.querySelectorAll("[data-meta]"), { opacity: 0, duration: 0.01, stagger: 0.08 }, 1.2);
    root.querySelectorAll<HTMLElement>("[data-meta] [data-s]").forEach((el, i) => {
      tl.to(el, { duration: 0.9, scrambleText: { text: el.textContent ?? "", chars: "01#/", speed: 0.7 } }, 1.2 + i * 0.08);
    });
    gsap.to(big[0], { xPercent: -12, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(big[1], { xPercent: 12, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } });
  });
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (pct.current) pct.current.textContent = String(Math.round((scrollY / Math.max(max, 1)) * 100)).padStart(3, "0");
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  return (
    <section ref={ref} id="top" className="p-3 sm:p-4 lg:p-5">
      <div data-card className="b-card relative h-[calc(100svh-24px)] min-h-[560px] overflow-hidden rounded-[28px] sm:h-[calc(100svh-32px)] sm:rounded-[40px] lg:h-[calc(100svh-40px)] lg:rounded-[52px]">
        {/* the grid */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 grid grid-cols-4 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} data-gl className={`border-l border-ink/10 last:border-r ${i > 3 ? "hidden lg:block" : ""}`} />
          ))}
        </div>

        <h1 className="absolute inset-x-0 top-[12%] z-10 flex flex-col items-center text-center leading-[0.78] sm:top-[10%]">
          <span className="sr-only">Steff Ramírez, UGC Creator</span>
          <span aria-hidden data-big className="b-display block text-[29vw] text-ink lg:text-[24vw]">STEFF</span>
        </h1>
        <img
          data-fig
          src={hero.src}
          srcSet={hero.srcSet}
          sizes="(min-width:1024px) 560px, 90vw"
          width={hero.width}
          height={hero.height}
          alt="Steff Ramírez, creadora de contenido UGC"
          fetchPriority="high"
          className="absolute bottom-0 left-1/2 z-20 h-[78%] w-auto max-w-none -translate-x-1/2"
        />
        <p aria-hidden className="absolute inset-x-0 bottom-[6%] z-30 text-center leading-[0.8]">
          <span data-big className="b-display b-outline block text-[17vw] lg:text-[13vw]">RAMÍREZ</span>
        </p>

        {/* corners */}
        <div className="absolute inset-x-0 top-0 z-40 flex items-start justify-between px-5 pt-5 sm:px-8 sm:pt-7 lg:px-12">
          <p data-meta className={mono}><span data-s>UGC CREATOR</span><br /><span className="text-ink/55">Nº 001 / 2026</span></p>
          <nav aria-label="Principal" className={`${mono} hidden gap-6 md:flex`}>
            {[["trabajo", "Trabajo"], ["servicios", "Servicios"], ["proceso", "Proceso"], ["contacto", "Contacto"]].map(([id, n]) => (
              <a key={id} href={`#${id}`} className="b-hl">[{n}]</a>
            ))}
          </nav>
          <p data-meta className={`${mono} text-right`}><span data-s>HORA LOCAL</span><br /><Clock /></p>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-40 flex items-end justify-between px-5 pb-5 sm:px-8 sm:pb-7 lg:px-12">
          <p data-meta className={`${mono} max-w-[10rem]`}><span data-s>MODA / BELLEZA</span><br /><span data-s>LIFESTYLE / MOMLIFE</span></p>
          <p data-meta className={`${mono} text-right`}>SCROLL ↓<br /><span ref={pct} className="tabular-nums">000</span>%</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ TICKER */
function Ticker() {
  const words = ["DISPONIBLE PARA COLABORACIONES", "UGC", "MODA", "BELLEZA", "LIFESTYLE", "MOMLIFE", "9:16"];
  const row = (k: string) => (
    <div className="b-tick flex shrink-0 items-center" aria-hidden={k === "b" || undefined} key={k}>
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="b-display px-6 text-[clamp(40px,6vw,88px)] leading-none">{w}</span>
          <span className="text-[clamp(24px,3vw,40px)] text-[#e6b3a6]">✺</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="-rotate-2 overflow-hidden bg-oxblood py-4 text-cream sm:py-5">
      <div className="flex w-max">{row("a")}{row("b")}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ WORK with filter (Flip) */
function Work({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const grid = useRef<HTMLUListElement>(null);
  const reduced = useReduced();
  const [filter, setFilter] = useState<string>("todo");
  const all = services.flatMap((s) => portfolio[s.id].map((item) => ({ s, item })));
  const flipState = useRef<Flip.FlipState | null>(null);

  const choose = (f: string) => {
    if (f === filter) return;
    if (grid.current && !reduced) flipState.current = Flip.getState(grid.current.querySelectorAll("[data-card]"));
    setFilter(f);
  };
  useEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.7,
      ease: "power4.inOut",
      stagger: 0.03,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power4.out" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.4 }),
    });
    flipState.current = null;
    ScrollTrigger.refresh();
  }, [filter]);

  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-h]")!, { type: "words,chars" });
    gsap.from(s.chars, { yPercent: 100, duration: 0.8, ease: "power4.out", stagger: 0.025, scrollTrigger: { trigger: root, start: "top 75%", once: true } });
    gsap.from(root.querySelectorAll("[data-card]"), { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "power4.inOut", stagger: 0.05, scrollTrigger: { trigger: grid.current, start: "top 85%", once: true } });
    return () => s.revert();
  });

  const shown = all.filter((a) => filter === "todo" || a.s.id === filter);
  return (
    <section ref={ref} id="trabajo" aria-labelledby="w-title" className="mx-auto max-w-[1480px] px-5 pb-24 pt-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid gap-6 border-b-2 border-ink pb-6 lg:grid-cols-12 lg:items-end">
        <p className={`${mono} lg:col-span-2`}><Scr>(01) Trabajo</Scr></p>
        <h2 id="w-title" className="overflow-hidden lg:col-span-7"><span data-h className="b-display block text-[clamp(64px,12vw,200px)] leading-[0.8]">ARCHIVO</span></h2>
        <p className="max-w-[22rem] text-[15px] leading-snug lg:col-span-3">Doce piezas verticales. Filtra por mundo: el resto se aparta.</p>
      </div>
      <div role="group" aria-label="Filtrar por categoría" className="mt-6 flex flex-wrap gap-2">
        {[{ id: "todo", name: "Todo" }, ...services].map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => choose(f.id)}
            className={`${mono} cursor-pointer border-2 border-ink px-4 py-2.5 transition-colors ${filter === f.id ? "bg-ink text-cream" : "hover:bg-oxblood hover:text-cream hover:border-oxblood"}`}
          >
            {f.name} <span className="opacity-60">{f.id === "todo" ? all.length : portfolio[f.id as keyof typeof portfolio].length}</span>
          </button>
        ))}
      </div>
      <ul ref={grid} className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {shown.map(({ s, item }) => {
          const n = all.findIndex((a) => a.item === item) + 1;
          return (
            <li key={item.brand} data-card data-flip-id={item.brand} className="group relative">
              <div className="relative aspect-[9/16] overflow-hidden">
                <Shot img={portrait} item={item} sizes="(min-width:1024px) 25vw, 50vw" />
                <span className={`${mono} absolute left-2 top-2 bg-cream px-1.5 py-0.5 text-ink`}>{String(n).padStart(2, "0")}</span>
                <div className="absolute inset-0 flex flex-col justify-end bg-ink/0 p-3 text-cream transition-colors duration-300 group-hover:bg-ink/55">
                  <p className="b-display translate-y-3 text-[clamp(22px,2.4vw,34px)] leading-[0.9] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">“{item.hook}”</p>
                </div>
              </div>
              <div className={`${mono} mt-2 flex justify-between gap-2 border-t-2 border-ink pt-2`}>
                <span className="truncate font-semibold">{item.brand}</span>
                <span className="shrink-0 text-ink/60">{s.name} · {item.duration}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ SERVICES blocks */
function Services() {
  const ref = useRef<HTMLElement>(null);
  const looks = ["bg-ink text-cream", "bg-oxblood text-cream", "bg-sand text-ink", "bg-cream text-ink"];
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-blk]"), { clipPath: "inset(0% 100% 0% 0%)", duration: 1, ease: "power4.inOut", stagger: 0.1, scrollTrigger: { trigger: root, start: "top 75%", once: true } });
  });
  return (
    <section ref={ref} id="servicios" aria-labelledby="s-title" className="mx-auto max-w-[1480px] px-5 py-24 sm:px-8 lg:px-12">
      <div className="flex items-end justify-between border-b-2 border-ink pb-6">
        <h2 id="s-title" className="b-display text-[clamp(48px,7vw,110px)] leading-[0.85]">LO QUE HAGO</h2>
        <p className={mono}><Scr>(02) Servicios</Scr></p>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-4">
        {services.map((s, i) => (
          <li key={s.id} data-blk className={`group relative flex min-h-[280px] flex-col justify-between overflow-hidden p-6 sm:min-h-[360px] sm:p-8 ${looks[i]}`}>
            <div className={`${mono} flex justify-between`}><span>{s.n}/04</span><span>{portfolio[s.id].length} piezas</span></div>
            <div>
              <h3 className="b-display text-[clamp(64px,10vw,170px)] leading-[0.8] transition-[font-stretch] duration-500 group-hover:[font-stretch:110%]">{s.name.toUpperCase()}</h3>
              <p className="mt-4 text-[16px] opacity-80">{s.desc}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-16 grid gap-x-10 sm:grid-cols-2">
        {formats.map((f, i) => (
          <p key={f.name} className="flex items-baseline gap-4 border-b border-ink/25 py-3">
            <span className={`${mono} text-ink/55`}>{String(i + 1).padStart(2, "0")}</span>
            <span className="b-display text-[28px] leading-none">{f.name.toUpperCase()}</span>
            <span className="ml-auto text-right text-[13px] text-ink/70">{f.note}</span>
          </p>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ PROCESS */
function Process() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-bar]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.querySelector("[data-steps]"), start: "top 85%", end: "bottom 50%", scrub: true } });
    root.querySelectorAll<HTMLElement>("[data-num]").forEach((el) => {
      gsap.from(el, { textContent: 0, duration: 1.2, ease: "power2.out", snap: { textContent: 1 }, scrollTrigger: { trigger: el, start: "top 90%", once: true }, onUpdate() { el.textContent = String(Math.round(Number(el.textContent))).padStart(2, "0"); } });
    });
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="p-title" className="bg-ink py-[clamp(100px,12vw,180px)] text-cream">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between border-b-2 border-cream pb-6">
          <h2 id="p-title" className="b-display text-[clamp(48px,7vw,110px)] leading-[0.85]">PROCESO</h2>
          <p className={mono}><Scr>(03) 4 pasos</Scr></p>
        </div>
        <div data-steps className="relative mt-10">
          <span data-bar aria-hidden className="absolute left-0 right-0 top-0 h-[3px] origin-left bg-[#e6b3a6]" />
          <ol className="grid border-l border-cream/20 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.n} className="border-b border-r border-cream/20 p-6 pt-10 sm:p-8 sm:pt-12">
                <span aria-hidden data-num className="b-display block text-[clamp(90px,10vw,160px)] leading-[0.8] text-[#e6b3a6]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="b-display mt-8 text-[40px] leading-none">{s.title.toUpperCase()}</h3>
                <p className="mt-4 text-[15px] leading-relaxed text-cream/75">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ CLIENTS */
function Clients() {
  return (
    <section aria-labelledby="c-title" className="mx-auto max-w-[1480px] px-5 py-[clamp(100px,12vw,180px)] sm:px-8 lg:px-12">
      <div className="flex items-end justify-between border-b-2 border-ink pb-6">
        <h2 id="c-title" className="b-display text-[clamp(48px,7vw,110px)] leading-[0.85]">MARCAS</h2>
        <p className={mono}><Scr>(04) Han confiado</Scr></p>
      </div>
      <ul className="columns-1 gap-10 sm:columns-2">
        {brands.map((b, i) => (
          <li key={b} className="b-row group relative flex break-inside-avoid items-baseline justify-between border-b border-ink/25 py-3">
            <span className="b-display relative z-10 text-[clamp(40px,5vw,72px)] leading-none transition-colors duration-300 group-hover:text-cream">{b.toUpperCase()}</span>
            <span className={`${mono} relative z-10 transition-colors group-hover:text-cream`}>{String(i + 1).padStart(2, "0")}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------ ABOUT */
function About({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelector("[data-ph]"), { clipPath: "inset(0% 0% 100% 0%)", duration: 1.3, ease: "power4.inOut", scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    gsap.fromTo(root.querySelector("[data-ph] img"), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true } });
  });
  return (
    <section ref={ref} aria-labelledby="a-title" className="border-y-2 border-ink">
      <div className="mx-auto grid max-w-[1480px] lg:grid-cols-2">
        <div data-ph className="relative aspect-square overflow-hidden bg-oxblood lg:aspect-auto">
          <img src={portrait.src} srcSet={portrait.srcSet} sizes="(min-width:1024px) 50vw, 100vw" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-[116%] w-full object-cover object-top mix-blend-multiply grayscale contrast-125" />
        </div>
        <div className="flex flex-col justify-between gap-12 p-6 sm:p-10 lg:p-14">
          <p className={mono}><Scr>(05) Sobre mí</Scr></p>
          <h2 id="a-title" className="b-display text-[clamp(56px,7vw,120px)] leading-[0.82]">HOLA, SOY <span className="text-oxblood">STEFF.</span></h2>
          <p className="max-w-[34rem] text-[clamp(18px,1.6vw,22px)] leading-snug">Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado con cuidado y mucha cercanía.</p>
          <dl className={`${mono} grid grid-cols-3 border-t-2 border-ink`}>
            {[["Idioma", "Español"], ["Luz", "Natural"], ["Formato", "9:16"]].map(([k, v]) => (
              <div key={k} className="border-r border-ink/25 pt-3 pr-3 last:border-0"><dt className="text-ink/55">{k}</dt><dd className="mt-1 text-[14px] font-semibold">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ FAQ */
function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section aria-labelledby="f-title" className="mx-auto max-w-[1480px] px-5 py-[clamp(100px,12vw,180px)] sm:px-8 lg:px-12">
      <div className="flex items-end justify-between border-b-2 border-ink pb-6">
        <h2 id="f-title" className="b-display text-[clamp(48px,7vw,110px)] leading-[0.85]">FAQ</h2>
        <p className={mono}><Scr>(06) Dudas</Scr></p>
      </div>
      {faqs.map((f, i) => (
        <div key={f.q} className="border-b-2 border-ink">
          <h3>
            <button type="button" aria-expanded={open === i} aria-controls={`bq${i}`} onClick={() => setOpen(open === i ? null : i)} className={`flex w-full cursor-pointer items-center gap-4 py-5 text-left transition-colors ${open === i ? "bg-ink px-4 text-cream" : "hover:bg-sand"}`}>
              <span className={`${mono} w-10 shrink-0`}>Q{String(i + 1).padStart(2, "0")}</span>
              <span className="b-display flex-1 text-[clamp(24px,2.8vw,40px)] leading-[0.95]">{f.q.toUpperCase()}</span>
              <span aria-hidden className="b-display text-[36px] leading-none">{open === i ? "−" : "+"}</span>
            </button>
          </h3>
          <div id={`bq${i}`} hidden={open !== i} className="py-6 pl-14 pr-4">
            <p className="max-w-[44rem] text-[17px] leading-relaxed">{f.a}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------ CONTACT */
function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { copy, done } = useCopy(EMAIL);
  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-mail]")!, { type: "words,chars" });
    gsap.from(s.chars, { yPercent: -120, duration: 0.7, ease: "power4.out", stagger: 0.02, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
    return () => s.revert();
  });
  const [user, domain] = EMAIL.split("@");
  return (
    <section ref={ref} id="contacto" aria-labelledby="ct-title" className="p-3 sm:p-4 lg:p-5">
      <div className="b-card relative overflow-hidden rounded-[28px] px-5 pb-8 pt-16 sm:rounded-[40px] sm:px-8 lg:rounded-[52px] lg:px-12">
        <div className="flex items-end justify-between border-b-2 border-ink pb-6">
          <h2 id="ct-title" className="b-display text-[clamp(48px,7vw,110px)] leading-[0.85]">¿HABLAMOS?</h2>
          <p className={mono}><Scr>(07) Contacto</Scr></p>
        </div>
        <a href={`mailto:${EMAIL}`} className="group mt-10 block overflow-hidden text-center">
          <span data-mail className="b-display block text-[clamp(28px,8.6vw,190px)] leading-[0.85] transition-colors group-hover:text-oxblood">{user.toUpperCase()}@<br className="sm:hidden" />{domain.toUpperCase()}</span>
        </a>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={copy} className={`${mono} cursor-pointer border-2 border-ink bg-ink px-5 py-3 text-cream transition-colors hover:border-oxblood hover:bg-oxblood`}>{done ? "Copiado ✓" : "Copiar correo"}</button>
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className={`${mono} border-2 border-ink px-5 py-3 transition-colors hover:bg-ink hover:text-cream`}>{s.label} ↗<span className="sr-only"> (se abre en una pestaña nueva)</span></a>
          ))}
        </div>
        <div className={`${mono} mt-20 flex justify-between border-t-2 border-ink pt-4`}><span>© 2026 STEFF RAMÍREZ</span><span>HORA LOCAL <Clock /></span></div>
      </div>
    </section>
  );
}

export default function App({ hero, portrait }: P) {
  useLenis({ lerp: 0.14 });
  return (
    <main className="overflow-x-clip">
      <Hero hero={hero} />
      <div className="py-16"><Ticker /></div>
      <Work portrait={portrait} />
      <Services />
      <Process />
      <Clients />
      <About portrait={portrait} />
      <Faq />
      <Contact />
    </main>
  );
}
