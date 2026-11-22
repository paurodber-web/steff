import { getImage } from "astro:assets";
import heroSrc from "../assets/steff-hero.png";
import portraitSrc from "../assets/steff.webp";

export type Img = { src: string; srcSet: string; width: number; height: number };

async function build(src: ImageMetadata, widths: number[], quality: number): Promise<Img> {
  const out = await Promise.all(widths.map((width) => getImage({ src, format: "webp", quality, width })));
  const last = out[out.length - 1];
  return {
    src: last.src,
    srcSet: out.map((v, i) => `${v.src} ${widths[i]}w`).join(", "),
    width: Number(last.attributes.width ?? src.width),
    height: Number(last.attributes.height ?? src.height),
  };
}

/** Cut-out hero figure + full portrait, responsive webp sets. */
export async function loadImages() {
  const [hero, portrait] = await Promise.all([build(heroSrc, [360, 540, 701], 82), build(portraitSrc, [320, 560, 900], 80)]);
  return { hero, portrait };
}
