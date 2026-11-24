import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { portfolio, services, type VideoItem } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion, useReduced } from "../kit";
import { Shot } from "../parts";
import { Band, Em, Folio, h2Mid, headMotion } from "./common";
import { photos, type SectorId } from "./data";

/** Small inline "▶ 0:24" label, set below the media (never over it). */
function Duration({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 tabular-nums">
      <svg viewBox="0 0 10 10" width="9" height="9" aria-hidden className="fill-current">
        <path d="M2 1 9 5 2 9Z" />
      </svg>
      <span className="sr-only">duración </span>
      {value}
    </span>
  );
}

function VideoTile({ item, portrait, className = "" }: { item: VideoItem; portrait: Img; className?: string }) {
  const vref = useRef<HTMLVideoElement>(null);
  const reduced = useReduced();

  // real videos: muted loop, play while in view (and on hover), pause otherwise
  useEffect(() => {
    const v = vref.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.5 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduced, item.src]);

  const toggle = () => {
    // TODO: abrir un visor / enlace real; de momento reproduce o pausa el video si existe
    const v = vref.current;
    if (v) v.paused ? v.play().catch(() => {}) : v.pause();
  };

  return (
    <li data-pi className={`v12-tile w-[62vw] max-w-[260px] shrink-0 snap-start md:w-auto md:max-w-none ${className}`} onMouseEnter={() => vref.current?.play().catch(() => {})}>
      <div className="relative aspect-[9/16] overflow-hidden rounded-[4px] bg-[#e4d8c6]" onClick={toggle}>
        {item.src ? (
          <video ref={vref} src={item.src} poster={item.poster} muted loop playsInline preload="none" className="v12-img absolute inset-0 h-full w-full object-cover" />
        ) : (
          <Shot img={portrait} item={item} sizes="(min-width: 1024px) 300px, (min-width: 768px) 30vw, 62vw" className="v12-img absolute inset-0" />
        )}
      </div>
      <p className="mt-3 font-display text-[22px] leading-none text-ink">{item.brand}</p>
      <p className="v12-caps mt-2 flex flex-wrap items-center gap-x-2 text-[11px] text-ink-soft">
        <span>{item.format}</span>
        <span aria-hidden>·</span>
        <Duration value={item.duration} />
      </p>
    </li>
  );
}

export function Portfolio({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [tab, setTab] = useState<SectorId>("moda");
  const [shown, setShown] = useState<SectorId>("moda");
  const token = useRef(0);
  const first = useRef(true);
  const reduced = useReduced();

  useMotion(ref, (root) => {
    const off = headMotion(root, "top 85%", "words");
    const items = gsap.utils.toArray<HTMLElement>("[data-pi]", root);
    gsap.from(root.querySelectorAll("[data-tabs] > *"), { opacity: 0, y: 10, duration: 0.5, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: root.querySelector("[data-tabs]"), start: "top 90%", once: true } });
    gsap.from(items, {
      opacity: 0,
      y: 28,
      clipPath: "inset(0% 0% 12% 0%)",
      duration: 0.85,
      stagger: 0.08,
      ease: "expo.out",
      clearProps: "clipPath,transform",
      scrollTrigger: { trigger: panel.current, start: "top 88%", once: true },
    });
    return off;
  });

  const select = (id: SectorId) => {
    if (id === tab) return;
    setTab(id);
    const t = ++token.current;
    const items = panel.current?.querySelectorAll("[data-pi]");
    if (!items?.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(id);
      return;
    }
    gsap.killTweensOf(items);
    gsap.to(items, { opacity: 0, y: 10, duration: 0.18, stagger: 0.02, ease: "power2.in", onComplete: () => t === token.current && setShown(id) });
  };

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const items = panel.current?.querySelectorAll("[data-pi]");
    if (!items?.length || reduced) return;
    gsap.fromTo(items, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power3.out", clearProps: "transform,opacity" });
  }, [shown]); // eslint-disable-line react-hooks/exhaustive-deps

  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const j = e.key === "Home" ? 0 : e.key === "End" ? services.length - 1 : (i + d + services.length) % services.length;
    if (!d && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    select(services[j].id);
    tabs.current[j]?.focus();
  };

  const vids = portfolio[shown];
  const pics = photos[shown];

  return (
    <Band id="portafolio" labelledBy="v12-portafolio-h" innerRef={ref} tone="paper">
      <Folio n="03">Portafolio</Folio>
      <header className="md:grid md:grid-cols-12 md:items-end md:gap-x-8">
        <h2 id="v12-portafolio-h" data-h2 className={`${h2Mid} md:col-span-7`}>
          Mira cómo se <Em>ve</Em> mi trabajo
        </h2>
        <div data-tabs role="tablist" aria-label="Sector" className="no-scrollbar -mx-5 mt-6 flex flex-nowrap gap-x-6 overflow-x-auto px-5 sm:-mx-8 sm:px-8 md:col-span-5 md:mx-0 md:mt-0 md:justify-end md:overflow-visible md:px-0">
          {services.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`v12-tab-${s.id}`}
              aria-selected={tab === s.id}
              aria-controls="v12-portfolio-panel"
              tabIndex={tab === s.id ? 0 : -1}
              onClick={() => select(s.id)}
              onKeyDown={(e) => onKey(e, i)}
              className="v12-tab"
            >
              {s.name}
            </button>
          ))}
        </div>
      </header>

      <div ref={panel} id="v12-portfolio-panel" role="tabpanel" aria-labelledby={`v12-tab-${tab}`} className="mt-6 lg:mt-8">
        <div key={shown} className="hair-t grid gap-y-8 pt-6 lg:grid-cols-12 lg:gap-x-8 lg:pt-8">
          <ul className="no-scrollbar -mx-5 flex scroll-px-5 snap-x snap-mandatory gap-4 sm:scroll-px-8 overflow-x-auto px-5 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-3 md:items-start md:gap-5 md:overflow-visible md:px-0 lg:col-span-9 lg:gap-8" aria-label="Videos">
            {vids.slice(0, 3).map((v) => (
              <VideoTile key={v.brand} item={v} portrait={portrait} />
            ))}
          </ul>
          <ul className="grid grid-cols-3 gap-x-4 gap-y-6 md:gap-x-5 lg:col-span-3 lg:grid-cols-2 lg:content-start lg:gap-x-5" aria-label="Fotos">
            {pics.slice(0, 3).map((p, i) => (
              <li key={p.label} data-pi className={`v12-tile ${i === 0 ? "lg:col-span-2" : ""}`}>
                <div className={`relative overflow-hidden rounded-[4px] ${i === 0 ? "aspect-[4/5] lg:aspect-[4/3]" : "aspect-[4/5]"}`}>
                  <Shot img={portrait} item={p} sizes="(min-width: 1024px) 300px, (min-width: 768px) 30vw, 33vw" className="v12-img absolute inset-0" />
                </div>
                <p className="v12-caps mt-2 text-[11px] text-ink-soft">{p.label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Band>
  );
}
