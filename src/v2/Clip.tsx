import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "./cn";
import { SoundIcon } from "./Icons";
import type { Crop, Tone, VideoItem } from "./data";
import type { HeroImage } from "./Hero";

const tones: Record<Tone, { bg: string; filter: string }> = {
  cream: { bg: "#ece2d2", filter: "saturate(0.9)" },
  sand: { bg: "#d8c2a3", filter: "saturate(0.85) contrast(1.02)" },
  blush: { bg: "#e7cbbd", filter: "saturate(0.8)" },
  hero: { bg: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)", filter: "saturate(0.9)" },
  rose: { bg: "#b88a7f", filter: "grayscale(0.35) contrast(1.05)" },
  oxblood: { bg: "#5c1a1f", filter: "grayscale(1) contrast(1.12) brightness(1.18)" },
};

const crops: Record<Crop, CSSProperties> = {
  face: { objectPosition: "50% 0%", transform: "scale(2.25)", transformOrigin: "50% 17%" },
  torso: { objectPosition: "50% 0%", transform: "scale(1.38)", transformOrigin: "50% 26%" },
  full: { objectPosition: "50% 0%", transform: "scale(1.02)", transformOrigin: "50% 0%" },
};

const Rail = () => (
  <div aria-hidden className="absolute bottom-[22%] right-3 z-20 flex flex-col items-center gap-4 text-cream drop-shadow-[0_1px_6px_rgba(42,27,22,0.45)]">
    {[
      "M12 20.3s-7.3-4.4-9.4-9C1.2 8.2 3 4.8 6.4 4.5c2-.2 3.6 1 4.6 2.6 1-1.6 2.6-2.8 4.6-2.6 3.4.3 5.2 3.7 3.8 6.8-2.1 4.6-9.4 9-9.4 9Z",
      "M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.4-4.2A8 8 0 1 1 20 11.5Z",
      "M6.5 3.5h11v17l-5.5-4-5.5 4z",
      "M14 4.5 20 10l-6 5.5V12c-5 0-8 1.6-10 5 0-5 3-9.5 10-9.5z",
    ].map((d) => (
      <svg key={d} viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        <path d={d} />
      </svg>
    ))}
  </div>
);

type Props = {
  item: VideoItem;
  category: string;
  portrait: HeroImage;
  active?: boolean;
  className?: string;
  /** inside the feed phone the frame provides the rounding */
  bare?: boolean;
};

/** A vertical clip: colour field + portrait (multiplied, so it takes the colour) + creator UI. */
export function Clip({ item, category, portrait, active = false, className, bare = false }: Props) {
  const tone = tones[item.tone];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const hasVideo = Boolean(item.src);
  const secs = Number(item.duration.split(":")[1] ?? 20) + Number(item.duration.split(":")[0]) * 60;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) void v.play().catch(() => {});
    else v.pause();
  }, [active]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  return (
    <article
      aria-label={`Video de ${category} para ${item.brand}: ${item.format}, ${item.duration}. «${item.hook}»`}
      data-active={active}
      className={cn("v2-clip relative isolate h-full w-full overflow-hidden", !bare && "rounded-[22px]", className)}
      style={{ background: tone.bg }}
    >
      {hasVideo ? (
        <video ref={videoRef} src={item.src} poster={item.poster} muted loop playsInline preload="none" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div aria-hidden className="v2-clip__media absolute inset-0">
          <img
            src={portrait.src}
            srcSet={portrait.srcSet}
            sizes="(min-width: 1024px) 420px, 70vw"
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
            style={{ ...crops[item.crop], filter: tone.filter }}
          />
        </div>
      )}

      {/* legibility veil */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[46%] bg-gradient-to-t from-[rgba(30,14,12,0.62)] via-[rgba(30,14,12,0.18)] to-transparent" />

      {/* format chip */}
      <div aria-hidden className="absolute left-3 top-3 z-20 rounded-full bg-[rgba(30,14,12,0.28)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-cream backdrop-blur-md">
        {item.format} · {item.duration}
      </div>

      {/* the hook, as it would be burned into the video */}
      <p aria-hidden className="v2-clip__hook absolute inset-x-4 top-[24%] z-20 text-center">
        <span className="box-decoration-clone rounded-[6px] bg-cream px-2 py-[3px] text-[clamp(12px,1.15vw,15px)] font-semibold leading-[1.75] text-ink">
          {item.hook}
        </span>
      </p>

      <Rail />

      <div aria-hidden className="absolute inset-x-0 bottom-0 z-20 px-4 pb-5 text-cream">
        <p className="text-[12px] font-semibold tracking-[0.01em]">@stefframirez</p>
        <p className="mt-1 font-display text-[clamp(17px,1.5vw,21px)] leading-tight">
          <span className="italic opacity-75">para</span> {item.brand}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[10px] opacity-75">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
            <path d="M9 18.5a3 3 0 1 1-2-2.83V5l12-2v12.5a3 3 0 1 1-2-2.83V6.4L9 7.8z" />
          </svg>
          sonido original
        </p>
      </div>

      {/* playback bar: runs while the clip is the one on screen */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 z-30 h-[2px] bg-cream/25">
        <span className="v2-clip__bar block h-full origin-left bg-cream" style={{ animationDuration: `${secs}s` }} />
      </div>

      {hasVideo && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-pressed={!muted}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
          className="absolute right-3 top-3 z-30 grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-ink/40 text-cream backdrop-blur-sm transition-colors hover:bg-ink/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
        >
          <SoundIcon muted={muted} className="h-[18px] w-[18px]" />
        </button>
      )}
    </article>
  );
}
