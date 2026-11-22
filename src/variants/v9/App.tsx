import { useRef, useState } from "react";
import { EMAIL, socials, services, portfolio, brands, steps, faqs, formats, type VideoItem } from "../../v2/data";
import type { Img } from "../images";
import { gsap, SplitText, useMotion, useCopy } from "../kit";
import { Shell } from "../Shell";
import { EleHero, Letters } from "../EleHero";
import { Shot } from "../parts";

type P = { hero: Img; portrait: Img };
const kicker = "text-[11px] font-medium uppercase tracking-[0.28em] text-ink-soft";

function Hero({ hero, onMenu, onContact }: { hero: Img; onMenu: () => void; onContact: () => void }) {
  return (
    <EleHero
      hero={hero}
      onMenu={onMenu}
      onContact={onContact}
      title={<Letters />}
      back={
        <>
          <div aria-hidden className="v2-glow" />
          {[1.55, 1.3, 1.08].map((s, i) => (
            <div key={i} aria-hidden data-ring className="ar-ring" style={{ ["--s" as string]: s, opacity: 0.35 + i * 0.2 }} />
          ))}
          <div aria-hidden data-arch className="v2-arch" />
        </>
      }
      motion={(root) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.from(root, { clipPath: "inset(100% 0 0 0 round 52px)", duration: 1.3, ease: "expo.inOut" })
          .from(root.querySelectorAll("[data-ring], [data-arch]"), { scaleY: 0, transformOrigin: "50% 100%", duration: 1.8, stagger: 0.12 }, 0.4)
          .from(root.querySelectorAll("[data-l]"), { yPercent: 50, opacity: 0, duration: 1.4, stagger: 0.07 }, 0.7)
          .from(root.querySelector("[data-fig]"), { yPercent: 10, opacity: 0, duration: 1.8 }, 0.9)
          .from(root.querySelectorAll("[data-in]"), { opacity: 0, y: -12, duration: 1, stagger: 0.06 }, 1.5);
        root.querySelectorAll("[data-ring]").forEach((r, i) => gsap.to(r, { scale: 1.25 + i * 0.15, opacity: 0, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: 0.6 } }));
      }}
    />
  );
}

function Card({ img, item, cat, id }: { img: Img; item: VideoItem; cat: string; id?: string }) {
  return (
    <figure id={id} className="group scroll-mt-24">
      <div className="relative aspect-[9/14] overflow-hidden rounded-t-full shadow-[0_40px_60px_-40px_rgba(42,27,22,0.6)]">
        <Shot img={img} item={item} sizes="(min-width:1024px) 30vw, 48vw" className="absolute inset-0 transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]" />
        <p className="absolute inset-x-3 bottom-4 text-center"><span className="box-decoration-clone rounded-md bg-cream/90 px-2 py-0.5 text-[13px] font-semibold leading-[1.8] text-ink">{item.hook}</span></p>
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between gap-3">
        <span className="font-display text-[19px] leading-tight">{item.brand}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink-soft">{cat} · {item.duration}</span>
      </figcaption>
    </figure>
  );
}

function Gallery({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const flat = services.flatMap((s) => portfolio[s.id].map((item, k) => ({ s, item, first: k === 0 })));
  const cols = [0, 1, 2].map((c) => flat.filter((_, i) => i % 3 === c));
  useMotion(ref, (root) => {
    const s = new SplitText(root.querySelector("[data-h]")!, { type: "words,chars" });
    gsap.from(s.chars, { yPercent: 60, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.025, scrollTrigger: { trigger: root, start: "top 75%", once: true } });
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      root.querySelectorAll<HTMLElement>("[data-col]").forEach((c, i) => {
        gsap.fromTo(c, { yPercent: [8, -4, 14][i] }, { yPercent: [-10, 6, -16][i], ease: "none", scrollTrigger: { trigger: root.querySelector("[data-cols]"), start: "top bottom", end: "bottom top", scrub: 0.6 } });
      });
    });
    root.querySelectorAll("figure").forEach((f) => gsap.from(f.firstElementChild, { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0px 0px)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: f, start: "top 92%", once: true } }));
    return () => {
      s.revert();
      mm.revert();
    };
  });
  return (
    <section ref={ref} id="portafolio" aria-labelledby="ga-title" className="overflow-hidden px-5 py-[clamp(120px,15vw,220px)] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px] text-center">
        <p className={kicker}>Portafolio</p>
        <h2 id="ga-title" data-h className="mt-6 font-display text-[clamp(52px,8.4vw,140px)] leading-[0.92] tracking-[-0.02em]">Bajo el <em className="text-oxblood">mismo arco</em></h2>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {services.map((s) => <li key={s.id}><a href={`#${s.id}`} className="inline-flex rounded-t-full rounded-b-md border border-ink/15 px-5 pb-2 pt-3 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors hover:bg-ink hover:text-cream">{s.name}</a></li>)}
        </ul>
      </div>
      <div data-cols className="mx-auto mt-20 grid max-w-[1200px] grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
        {cols.map((col, ci) => (
          <div key={ci} data-col className={`flex flex-col gap-10 ${ci === 2 ? "col-span-2 grid grid-cols-2 gap-4 md:col-span-1 md:flex md:gap-10" : ""}`}>
            {col.map(({ s, item, first }) => <Card key={item.brand} img={portrait} item={item} cat={s.name} id={first ? s.id : undefined} />)}
          </div>
        ))}
      </div>
    </section>
  );
}

function Portal({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    const win = root.querySelector("[data-win]")!;
    gsap.timeline({ scrollTrigger: { trigger: root, start: "top top", end: "+=110%", pin: true, scrub: 0.6 } })
      .fromTo(win, { clipPath: "inset(16% 33% 0% 33% round 999px 999px 0px 0px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease: "none" })
      .fromTo(win.querySelector("img"), { scale: 1.15 }, { scale: 1, ease: "none" }, 0)
      .fromTo(root.querySelector("[data-q]"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "none" }, 0.5);
  });
  return (
    <section ref={ref} aria-label="Mi mundo" className="relative h-[100svh] overflow-hidden">
      <div data-win className="absolute inset-0" style={{ background: "#d6c3a9" }}>
        <img src={portrait.src} srcSet={portrait.srcSet} sizes="100vw" alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[50%_12%] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(30,14,12,0.55)] via-transparent to-transparent" />
      </div>
      <p data-q className="absolute inset-x-0 bottom-[12%] px-5 text-center font-display text-[clamp(44px,7vw,120px)] leading-[0.95] text-cream">Mi mundo, <em>a tu medida.</em></p>
    </section>
  );
}

function Colonnade() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    root.querySelectorAll<HTMLElement>("[data-arc]").forEach((a, i) => {
      gsap.fromTo(a.querySelector("[data-fill]"), { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: a, start: "top 85%", end: "top 40%", scrub: 0.5 } });
      gsap.from(a, { y: 60, opacity: 0, duration: 1.3, ease: "expo.out", delay: i * 0.08, scrollTrigger: { trigger: a, start: "top 90%", once: true } });
    });
  });
  return (
    <section ref={ref} id="proceso" aria-labelledby="co-title" className="mx-auto max-w-[1280px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <p className={kicker}>Cómo trabajo</p>
      <h2 id="co-title" className="mt-6 max-w-[14ch] font-display text-[clamp(52px,7vw,116px)] leading-[0.92] tracking-[-0.02em]">Cuatro <em className="text-oxblood">pilares</em></h2>
      <ol className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <li key={s.n} data-arc className="relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-t-full border border-ink/15 p-7 pt-24 text-center">
            <span data-fill aria-hidden className="absolute inset-0 -z-0 origin-bottom bg-gradient-to-t from-[#e6d6bf] to-[#f4eee3]" />
            <div className="relative">
              <p className="font-display text-[64px] italic leading-none text-oxblood">{s.n}</p>
              <h3 className="mt-4 font-display text-[34px] leading-none">{s.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-ink/15 pt-8">
        {formats.map((f) => <span key={f.name} title={f.note} className="font-display text-[20px] italic text-ink-soft">{f.name}</span>)}
      </div>
    </section>
  );
}

function Brands() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.from(root.querySelectorAll("[data-b]"), { opacity: 0, y: 20, duration: 1, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: root, start: "top 70%", once: true } });
  });
  return (
    <section ref={ref} aria-labelledby="br-title" className="px-5 sm:px-8">
      <div className="mx-auto max-w-[900px] rounded-t-full bg-ink px-6 pb-20 pt-[clamp(120px,14vw,200px)] text-center text-cream sm:px-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-cream/60">Han confiado en mí</p>
        <h2 id="br-title" className="mt-5 font-display text-[clamp(40px,5vw,76px)] italic leading-none">Marcas</h2>
        <ul className="mt-12 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {brands.map((b) => <li key={b} data-b className="font-display text-[clamp(22px,2.4vw,32px)]">{b}</li>)}
        </ul>
      </div>
    </section>
  );
}

function About({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (root) => {
    gsap.fromTo(root.querySelector("[data-key] img"), { yPercent: -10 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: 0.6 } });
    const s = new SplitText(root.querySelector("[data-txt]")!, { type: "lines", mask: "lines" });
    gsap.from(s.lines, { yPercent: 100, duration: 1.3, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root.querySelector("[data-txt]"), start: "top 85%", once: true } });
    return () => s.revert();
  });
  return (
    <section ref={ref} id="sobre-mi" aria-labelledby="ab-title" className="mx-auto max-w-[1200px] px-5 py-[clamp(110px,14vw,200px)] sm:px-8 lg:px-12">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <div>
          <p className={kicker}>Sobre mí</p>
          <h2 id="ab-title" className="mt-6 font-display text-[clamp(52px,6.4vw,104px)] leading-[0.92] tracking-[-0.02em]">Detrás <em className="text-oxblood">del arco</em></h2>
          <p data-txt className="mt-8 text-[19px] leading-[1.75]">Soy Steff. Creo contenido que se siente como la recomendación de una amiga, no como un anuncio. Moda, belleza y el día a día de una mamá real, grabado en casa con luz natural, con cuidado y mucha cercanía.</p>
        </div>
        <div data-key className="relative mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-t-full border-[10px] border-[#fbf8f2] shadow-[0_50px_80px_-50px_rgba(42,27,22,0.6)]" style={{ background: "#d6c3a9" }}>
          <img src={portrait.src} srcSet={portrait.srcSet} sizes="420px" alt="Retrato de Steff Ramírez" loading="lazy" className="absolute inset-0 h-[120%] w-full object-cover object-top mix-blend-multiply" />
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby="fq-title" className="bg-[#ece3d5] py-[clamp(110px,14vw,200px)]">
      <div className="mx-auto max-w-[1000px] px-5 sm:px-8">
        <p className={`${kicker} text-center`}>Preguntas</p>
        <h2 id="fq-title" className="mt-6 text-center font-display text-[clamp(48px,6vw,96px)] leading-[0.95]">Lo que <em className="text-oxblood">quizá</em> te preguntas</h2>
        <ul className="mt-14">
          {faqs.map((f, i) => (
            <li key={f.q} className="border-t border-ink/15 last:border-b">
              <h3>
                <button type="button" aria-expanded={open === i} aria-controls={`aq${i}`} onClick={() => setOpen(open === i ? null : i)} className="group flex w-full cursor-pointer items-center gap-5 py-6 text-left">
                  <span aria-hidden className={`grid h-11 w-9 shrink-0 place-items-center rounded-t-full border text-[14px] transition-colors ${open === i ? "border-oxblood bg-oxblood text-cream" : "border-ink/25"}`}>{open === i ? "−" : "+"}</span>
                  <span className={`flex-1 font-display text-[clamp(22px,2.4vw,32px)] leading-tight ${open === i ? "italic text-oxblood" : "group-hover:text-oxblood"}`}>{f.q}</span>
                </button>
              </h3>
              <div id={`aq${i}`} role="region" className="faq-panel" data-open={open === i} inert={open !== i}>
                <div><p className="max-w-[40rem] pb-7 pl-14 text-[16px] leading-relaxed text-ink-soft">{f.a}</p></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Contact({ onContact }: { onContact: () => void }) {
  const { copy, done } = useCopy(EMAIL);
  return (
    <section id="contacto" aria-labelledby="c-title" className="v2-frame">
      <div className="grain v2-radius relative flex min-h-[90svh] items-end justify-center overflow-hidden px-5 pt-24" style={{ background: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)" }}>
        <div className="flex w-full max-w-[720px] flex-col items-center rounded-t-full bg-[#f8f3ea] px-6 pb-16 pt-[clamp(110px,14vw,180px)] text-center shadow-[0_-30px_60px_-40px_rgba(42,27,22,0.4)]">
          <p className={kicker}>Contacto</p>
          <h2 id="c-title" className="mt-5 font-display text-[clamp(52px,8vw,128px)] leading-[0.9] tracking-[-0.02em]">Pasa, <em className="text-oxblood">hablemos</em></h2>
          <button type="button" onClick={onContact} className="group mt-10 inline-flex h-14 cursor-pointer items-center gap-5 rounded-full bg-ink pl-7 pr-2 text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition-colors hover:bg-oxblood">
            Escríbeme<span className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 group-hover:rotate-45">↗</span>
          </button>
          <p className="mt-6 text-[14px] text-ink-soft"><a href={`mailto:${EMAIL}`} className="underline decoration-ink/30 underline-offset-4">{EMAIL}</a> · <button type="button" onClick={copy} className="cursor-pointer underline decoration-ink/30 underline-offset-4">{done ? "copiado" : "copiar"}</button></p>
          <ul className="mt-8 flex gap-6 text-[11px] font-medium uppercase tracking-[0.24em]">
            {socials.map((s) => <li key={s.label}><a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-oxblood">{s.label} ↗<span className="sr-only"> (se abre en una pestaña nueva)</span></a></li>)}
          </ul>
          <p className="mt-12 text-[12px] text-ink-soft">© 2026 Steff Ramírez · UGC Creator</p>
        </div>
      </div>
    </section>
  );
}

export default function App({ hero, portrait }: P) {
  return (
    <Shell>
      {({ openMenu, openContact }) => (
        <>
          <Hero hero={hero} onMenu={openMenu} onContact={openContact} />
          <Gallery portrait={portrait} />
          <Portal portrait={portrait} />
          <Colonnade />
          <Brands />
          <About portrait={portrait} />
          <Faq />
          <Contact onContact={openContact} />
        </>
      )}
    </Shell>
  );
}
