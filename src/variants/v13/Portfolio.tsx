import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { portfolio, services } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion } from "../kit";
import { Shot } from "../parts";
import { photos, type SectorId } from "./data";
import { motionOk, EASE } from "./common";

const RAIL = 6;

/** Entrada del carrete: los elementos entran desde la derecha y su imagen escala 1.15 → 1 dentro del marco. */
function slideIn(items: Element[], opts: gsap.TweenVars = {}) {
  gsap.fromTo(items, { x: 90, opacity: 0 }, { x: 0, opacity: 1, duration: 0.85, stagger: 0.07, ease: EASE, clearProps: "transform,opacity", ...opts });
  gsap.fromTo(
    items.map((i) => i.querySelector("[data-scale]")).filter(Boolean),
    { scale: 1.15 },
    { scale: 1, duration: 1, stagger: 0.07, ease: EASE, clearProps: "transform", ...(opts.scrollTrigger ? { scrollTrigger: opts.scrollTrigger } : {}) },
  );
}

/** 3 · Portafolio: selector tipográfico + carrete horizontal que sangra por la derecha. */
export function Portfolio({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);
  const reel = useRef<HTMLUListElement>(null);
  const [sector, setSector] = useState<SectorId>("moda");
  const [idx, setIdx] = useState(0);
  const [end, setEnd] = useState(false);
  const first = useRef(true);

  const vids = portfolio[sector].slice(0, 3);
  const pics = photos[sector].slice(0, 3);
  const items = [0, 1, 2].flatMap((i) => [
    { kind: "video" as const, v: vids[i] },
    { kind: "photo" as const, p: pics[i] },
  ]);

  // entrada al llegar a la sección
  useMotion(ref, (root) => {
    const els = Array.from(root.querySelectorAll("[data-item]"));
    gsap.set(els, { opacity: 0 });
    gsap.from(root.querySelectorAll("[data-tabs] > *"), { opacity: 0, y: 20, duration: 0.7, stagger: 0.06, ease: EASE, clearProps: "opacity,transform", scrollTrigger: { trigger: root, start: "top 85%", once: true } });
    slideIn(els, { scrollTrigger: { trigger: root.querySelector("[data-reel]"), start: "top 88%", once: true } });
  });

  // cambio de sector
  useLayoutEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = reel.current;
    if (!el) return;
    el.scrollLeft = 0;
    setIdx(0);
    if (motionOk()) slideIn(Array.from(el.querySelectorAll("[data-item]")));
  }, [sector]);

  const measure = useCallback(() => {
    const el = reel.current;
    if (!el) return;
    const kids = Array.from(el.querySelectorAll<HTMLElement>("[data-item]"));
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    let best = 0;
    let bd = Infinity;
    kids.forEach((k, i) => {
      const d = Math.abs(k.offsetLeft - pad - el.scrollLeft);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 3;
    if (atEnd) best = kids.length - 1;
    setIdx(best);
    setEnd(atEnd);
  }, []);

  useEffect(() => {
    const el = reel.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [measure, sector]);

  // arrastre con ratón (solo punteros finos)
  useEffect(() => {
    const el = reel.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let down = false;
    let moved = false;
    let sx = 0;
    let sl = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      moved = false;
      sx = e.clientX;
      sl = el.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.classList.add("is-drag");
        el.setPointerCapture?.(e.pointerId);
      }
      if (moved) el.scrollLeft = sl - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (moved) el.classList.remove("is-drag");
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = reel.current;
    if (!el) return;
    const kids = Array.from(el.querySelectorAll<HTMLElement>("[data-item]"));
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const starts = kids.map((k) => k.offsetLeft - pad);
    const cur = el.scrollLeft;
    let left = cur;
    if (dir === 1) left = starts.find((x) => x > cur + 4) ?? cur;
    else left = [...starts].reverse().find((x) => x < cur - 4) ?? 0;
    el.scrollTo({ left, behavior: motionOk() ? "smooth" : "auto" });
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") (e.preventDefault(), go(1));
    if (e.key === "ArrowLeft") (e.preventDefault(), go(-1));
  };

  const onTabKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + services.length) % services.length;
    setSector(services[n].id);
    (e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus();
  };

  return (
    <section ref={ref} id="portafolio" aria-labelledby="v13-porta-h" className="v13-sec v13-cream py-14 sm:py-16 lg:py-20">
      <div className="v13-wrap">
        <h2 id="v13-porta-h" className="v13-caps mb-3 text-ink-soft">
          Portafolio
        </h2>
        <div data-tabs role="tablist" aria-label="Sector" className="v13-tabs">
          {services.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              id={`v13-tab-${s.id}`}
              aria-selected={sector === s.id}
              aria-controls="v13-reel"
              tabIndex={sector === s.id ? 0 : -1}
              className="v13-tab"
              onClick={() => setSector(s.id)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div data-reel className="mt-8 lg:mt-10">
        <div id="v13-reel" role="tabpanel" aria-labelledby={`v13-tab-${sector}`}>
        <ul ref={reel} aria-label="Trabajos del sector" tabIndex={0} onKeyDown={onKey} className="v13-reel">
          {items.map((it, i) => (
            <li key={`${sector}-${i}`} data-item data-kind={it.kind} className="v13-item">
              <div className="v13-frame">
                {it.kind === "video" ? (
                  it.v.src ? (
                    // TODO: video real (ver nota en src/v2/data.ts)
                    <video src={it.v.src} poster={it.v.poster} controls preload="none" playsInline />
                  ) : (
                    <div data-scale aria-hidden>
                      <Shot img={portrait} item={it.v} sizes="(min-width: 640px) 320px, 240px" className="absolute inset-0" />
                    </div>
                  )
                ) : (
                  <div data-scale aria-hidden>
                    <Shot img={portrait} item={it.p} sizes="(min-width: 640px) 440px, 340px" className="absolute inset-0" />
                  </div>
                )}
              </div>
              <p className="v13-cap">
                {it.kind === "video" ? (
                  <>
                    <b>{it.v.brand}</b>
                    <span>
                      {it.v.format} · <span aria-hidden className="inline">▶</span>
                      <span className="sr-only">video de </span> {it.v.duration}
                    </span>
                  </>
                ) : (
                  <>
                    <b>{it.p.label}</b>
                    <span>Foto · 4:5</span>
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>
        </div>
      </div>

      <div className="v13-wrap">
        <div className="v13-ctl mt-6">
          <button type="button" onClick={() => go(-1)} disabled={idx === 0} aria-label="Anterior">
            ← Anterior
          </button>
          <button type="button" onClick={() => go(1)} disabled={end || idx >= RAIL - 1} aria-label="Siguiente">
            Siguiente →
          </button>
          <p className="v13-count ml-auto" aria-live="polite" aria-atomic>
            {String(idx + 1).padStart(2, "0")} / {String(RAIL).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}
