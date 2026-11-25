import { useRef } from "react";
import { portfolio, services } from "../../v2/data";
import type { Img } from "../images";
import { gsap, useMotion } from "../kit";
import { Shot } from "../parts";
import { photos } from "./data";
import { EASE } from "./common";

/** 3 · Portafolio: cada sector es un bloque visible, uno tras otro. Sin selector. */
export function Portfolio({ portrait }: { portrait: Img }) {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (root) => {
    gsap.from(root.querySelector("[data-h]"), { opacity: 0, y: 20, duration: 0.8, ease: EASE, scrollTrigger: { trigger: root, start: "top 85%", once: true } });
    root.querySelectorAll<HTMLElement>("[data-block]").forEach((block) => {
      const st = { trigger: block, start: "top 85%", once: true };
      gsap.from(block.querySelectorAll("[data-item]"), { x: 80, opacity: 0, duration: 0.85, stagger: 0.07, ease: EASE, clearProps: "transform,opacity", scrollTrigger: st });
      gsap.from(block.querySelectorAll("[data-scale]"), { scale: 1.12, duration: 1, stagger: 0.07, ease: EASE, clearProps: "transform", scrollTrigger: st });
    });
  });

  return (
    <section ref={ref} id="portafolio" aria-labelledby="v13-porta-h" className="v13-sec v13-cream py-14 sm:py-16 lg:py-20">
      <div className="v13-wrap">
        <h2 data-h id="v13-porta-h" className="v13-caps mb-6 text-ink-soft lg:mb-8">
          Portafolio
        </h2>

        {services.map((s, si) => {
          const vids = portfolio[s.id].slice(0, 3);
          const pics = photos[s.id].slice(0, 3);
          const videoItems = vids.map((v, i) => ({ kind: "video" as const, v, key: `v${i}` }));
          const photoItems = pics.map((p, i) => ({ kind: "photo" as const, p, key: `p${i}` }));
          const items = si % 2 === 0 ? [...videoItems, ...photoItems] : [...photoItems, ...videoItems];
          return (
            <div key={s.id} data-block className="v13-psec">
              <div className="v13-phead">
                <h3 className="font-display text-[30px] leading-[1.1] tracking-[-0.015em] sm:text-[36px] lg:text-[40px]">{s.name}</h3>
                <span className="v13-phead__count">{vids.length} videos · {pics.length} fotos</span>
              </div>
              <ul tabIndex={0} aria-label={`Trabajos de ${s.name}`} className="v13-prow">
                {items.map((it) => (
                  <li key={it.key} data-item data-kind={it.kind} className="v13-pitem">
                    <div className="v13-pframe">
                      {it.kind === "video" ? (
                        it.v.src ? (
                          // TODO: video real (ver nota en src/v2/data.ts)
                          <video src={it.v.src} poster={it.v.poster} controls preload="none" playsInline />
                        ) : (
                          <div data-scale aria-hidden className="absolute inset-0">
                            <Shot img={portrait} item={it.v} sizes="(min-width: 700px) 260px, 180px" className="absolute inset-0" />
                          </div>
                        )
                      ) : (
                        <div data-scale aria-hidden className="absolute inset-0">
                          <Shot img={portrait} item={it.p} sizes="(min-width: 700px) 320px, 250px" className="absolute inset-0" />
                        </div>
                      )}
                    </div>
                    <p className="v13-pcap">
                      {it.kind === "video" ? (
                        <>
                          <b>{it.v.brand}</b>
                          <span>
                            {it.v.format} · <span aria-hidden>▶</span>
                            <span className="sr-only">video de </span> {it.v.duration}
                          </span>
                        </>
                      ) : (
                        <>
                          <b>{it.p.label}</b>
                          <span>Foto</span>
                        </>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
