import type { CSSProperties } from "react";
import type { VideoItem } from "../v2/data";
import type { Img } from "./images";

export const crops: Record<string, CSSProperties> = {
  face: { objectPosition: "50% 0%", transform: "scale(2.1)", transformOrigin: "50% 18%" },
  torso: { objectPosition: "50% 0%", transform: "scale(1.35)", transformOrigin: "50% 28%" },
  full: { objectPosition: "50% 0%" },
};

export const baseTones: Record<string, string> = {
  cream: "#ece3d4",
  sand: "#d9c6aa",
  blush: "#e6cfc2",
  hero: "#d6c3a9",
  rose: "#c4a096",
  oxblood: "#5c1a1f",
};

/**
 * The portrait multiplied onto a colour field: the white backdrop takes the tone,
 * oxblood turns it into a duotone. `className` must position the box (absolute / relative).
 */
export function Shot({
  img,
  item,
  sizes,
  className = "relative",
  tones = baseTones,
  extra,
}: {
  img: Img;
  item: Pick<VideoItem, "tone" | "crop">;
  sizes: string;
  className?: string;
  tones?: Record<string, string>;
  extra?: CSSProperties;
}) {
  const dark = item.tone === "oxblood";
  return (
    <div className={`overflow-hidden ${className}`} style={{ background: tones[item.tone] }}>
      <img
        src={img.src}
        srcSet={img.srcSet}
        sizes={sizes}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
        style={{ ...crops[item.crop], filter: dark ? "grayscale(1) contrast(1.12) brightness(1.2)" : "saturate(0.9)", ...extra }}
      />
    </div>
  );
}

export const HERO_BG = "linear-gradient(165deg, #dccab2 0%, #d3bfa5 48%, #c7af93 100%)";
export const cardRadius = "rounded-[28px] sm:rounded-[40px] lg:rounded-[52px]";
export const framePad = "p-3 sm:p-4 lg:p-5";
