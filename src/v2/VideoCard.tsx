import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "./cn";
import { PlayIcon, SoundIcon } from "./Icons";
import type { Tone, VideoItem } from "./data";

const tones: Record<Tone, { bg: string; dark: boolean }> = {
  sand: { bg: "linear-gradient(165deg,#e3d5bf 0%,#d6c3a9 100%)", dark: false },
  cream: { bg: "linear-gradient(165deg,#f9f4ec 0%,#e8ddcb 100%)", dark: false },
  hero: { bg: "linear-gradient(165deg,#dccab2 0%,#d3bfa5 48%,#c7af93 100%)", dark: false },
  ink: { bg: "linear-gradient(170deg,#4d392f 0%,#2a1b16 100%)", dark: true },
  soft: { bg: "linear-gradient(170deg,#80695a 0%,#5b4a3f 100%)", dark: true },
};

export function VideoCard({ item, category }: { item: VideoItem; category: string }) {
  const tone = tones[item.tone];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const hasVideo = Boolean(item.src);

  // play only while on screen
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.45 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  return (
    <article
      data-clip
      aria-label={`Video de ${category} para ${item.brand}: ${item.format}`}
      className={cn(
        "grain group relative isolate aspect-[9/16] w-full overflow-hidden rounded-[28px] shadow-[0_30px_50px_-34px_rgba(42,27,22,0.55)]",
        item.tone === "cream" && "ring-1 ring-inset ring-ink/10",
        tone.dark ? "text-cream" : "text-ink",
      )}
      style={{ background: tone.bg } as CSSProperties}
    >
      <div data-media className="absolute inset-0">
        <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]">
          {hasVideo ? (
            <video
              ref={videoRef}
              src={item.src}
              poster={item.poster}
              muted
              loop
              playsInline
              preload="none"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <div
                aria-hidden
                className="absolute inset-x-[14%] bottom-0 h-[64%] rounded-t-full border border-b-0 border-current/15"
                style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.28), rgba(255,255,255,0.06), transparent)", opacity: tone.dark ? 0.35 : 1 }}
              />
              <div
                aria-hidden
                className="absolute left-1/2 top-[38%] h-[70%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: "radial-gradient(closest-side, rgba(255,247,235,0.5), rgba(255,247,235,0))", opacity: tone.dark ? 0.18 : 0.8 }}
              />
            </>
          )}
        </div>
      </div>

      {!hasVideo && (
        <div aria-hidden className="absolute left-1/2 top-[44%] z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-current/25 bg-current/[0.07] backdrop-blur-[6px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110">
          <PlayIcon className="ml-0.5 h-5 w-5" />
        </div>
      )}

      {hasVideo && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-pressed={!muted}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
          className="absolute right-4 top-4 z-20 grid h-11 w-11 cursor-pointer place-items-center rounded-full bg-ink/40 text-cream backdrop-blur-sm transition-colors hover:bg-ink/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
        >
          <SoundIcon muted={muted} className="h-[18px] w-[18px]" />
        </button>
      )}

      {/* label */}
      <div className={cn("absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6", hasVideo && "bg-gradient-to-t from-ink/70 to-transparent pt-16 text-cream")}>
        <p className="font-display text-[22px] leading-tight">
          <span className="italic opacity-70">para</span> {item.brand}
        </p>
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.2em] opacity-70 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-70 group-focus-within:translate-y-0 group-focus-within:opacity-70">
          {item.format} · {item.duration}
        </p>
      </div>
    </article>
  );
}
