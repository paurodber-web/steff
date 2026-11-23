import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { portfolio, services, type VideoItem } from "../../v2/data";
import { PlayIcon } from "../../v2/Icons";
import type { Img } from "../images";
import { gsap, useMotion, useReduced } from "../kit";
import { Shot } from "../parts";
import { Em, Eyebrow, Panel, h2Cls, headMotion } from "./common";
import { photos, type SectorId } from "./data";

function VideoCard({ item, portrait }: { item: VideoItem; portrait: Img }) {
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

  return (
    <li
      data-pi
      className="v11-tile group relative aspect-[9/16] w-[64vw] max-w-[270px] shrink-0 snap-start overflow-hidden rounded-[22px] bg-[#e4d8c6] sm:rounded-[28px] md:w-auto md:max-w-none lg:rounded-[32px]"
      onMouseEnter={() => vref.current?.play().catch(() => {})}
    >
      {item.src ? (
        <video ref={vref} src={item.src} poster={item.poster} muted loop playsInline preload="none" className="v11-img absolute inset-0 h-full w-full object-cover" />
      ) : (
        <Shot img={portrait} item={item} sizes="(min-width: 1024px) 300px, (min-width: 768px) 30vw, 64vw" className="v11-img absolute inset-0" />
      )}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
      <span className="absolute left-3 top-3 rounded-full bg-cream/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink backdrop-blur-sm">
        {item.format}
      </span>
      {!item.src && (
        <span aria-hidden className="absolute left-1/2 top-[44%] grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream/75 text-ink backdrop-blur-sm transition-transform duration-500 group-hover:scale-110">
          <PlayIcon className="ml-0.5 h-4 w-4" />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4 text-cream sm:p-5">
        <p className="font-display text-[22px] leading-none sm:text-[24px]">{item.brand}</p>
        <p className="mt-2 text-[12px] tracking-wide text-cream/80">
          {item.format} <span aria-hidden>·</span> <span className="sr-only">duración </span>
          {item.duration}
        </p>
      </div>
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
    const off = headMotion(root);
    const items = gsap.utils.toArray<HTMLElement>("[data-pi]", root);
    gsap.from(root.querySelectorAll("[data-tabs] > *"), { opacity: 0, y: 10, duration: 0.5, stagger: 0.06, ease: "power2.out", scrollTrigger: { trigger: root.querySelector("[data-tabs]"), start: "top 90%", once: true } });
    gsap.from(items, {
      opacity: 0,
      scale: 0.94,
      clipPath: "inset(10% 6% 0% 6% round 24px)",
      duration: 0.85,
      stagger: 0.08,
      ease: "expo.out",
      clearProps: "clipPath,scale",
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
    gsap.to(items, { opacity: 0, scale: 0.96, duration: 0.18, stagger: 0.02, ease: "power2.in", onComplete: () => t === token.current && setShown(id) });
  };

  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const items = panel.current?.querySelectorAll("[data-pi]");
    if (!items?.length || reduced) return;
    gsap.fromTo(items, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.06, ease: "power3.out", clearProps: "scale,opacity" });
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
    <Panel id="portafolio" labelledBy="v11-portafolio-h" innerRef={ref}>
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Portafolio</Eyebrow>
          <h2 id="v11-portafolio-h" data-h2 className={h2Cls}>
            Mira cómo se <Em>ve</Em> mi trabajo
          </h2>
        </div>
        <div data-tabs role="tablist" aria-label="Sector" className="flex flex-wrap gap-2">
          {services.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`v11-tab-${s.id}`}
              aria-selected={tab === s.id}
              aria-controls="v11-portfolio-panel"
              tabIndex={tab === s.id ? 0 : -1}
              onClick={() => select(s.id)}
              onKeyDown={(e) => onKey(e, i)}
              className="v11-pill"
            >
              {s.name}
            </button>
          ))}
        </div>
      </header>

      <div ref={panel} id="v11-portfolio-panel" role="tabpanel" aria-labelledby={`v11-tab-${tab}`} className="mt-7 lg:mt-9">
        <div key={shown} className="grid gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-5">
          <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:-mx-10 sm:px-10 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 lg:col-span-9 lg:gap-5" aria-label="Videos">
            {vids.slice(0, 3).map((v) => (
              <VideoCard key={v.brand} item={v} portrait={portrait} />
            ))}
          </ul>
          <div className="lg:relative lg:col-span-3">
            <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:absolute lg:inset-0 lg:grid-cols-2 lg:grid-rows-4 lg:gap-5" aria-label="Fotos">
              {pics.slice(0, 3).map((p, i) => (
                <li
                  key={p.label}
                  data-pi
                  className={`v11-tile group relative overflow-hidden rounded-[22px] sm:rounded-[28px] lg:min-h-0 lg:rounded-[32px] ${
                    i === 0 ? "col-span-2 aspect-[16/10] md:col-span-1 md:aspect-[4/5] lg:col-span-2 lg:row-span-2 lg:aspect-auto" : "aspect-[4/5] lg:row-span-2 lg:aspect-auto"
                  }`}
                >
                  <Shot img={portrait} item={p} sizes="(min-width: 1024px) 300px, (min-width: 768px) 30vw, 50vw" className="v11-img absolute inset-0" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-cream/85 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink backdrop-blur-sm">
                    {p.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Panel>
  );
}
