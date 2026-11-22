export const services = [
  { id: "moda", n: "01", name: "Moda", desc: "Looks, lookbooks y try-on" },
  { id: "belleza", n: "02", name: "Belleza", desc: "Skincare, makeup y rutinas" },
  { id: "lifestyle", n: "03", name: "Lifestyle", desc: "El día a día con intención" },
  { id: "momlife", n: "04", name: "Momlife", desc: "Maternidad real, sin filtro" },
] as const;

export type Service = (typeof services)[number];

export const EMAIL = "collabs@stefframirez.com";

// TODO: confirmar handles reales
export const socials = [
  { label: "Instagram", handle: "@stefframirez", url: "https://www.instagram.com/stefframirez" },
  { label: "TikTok", handle: "@stefframirez", url: "https://www.tiktok.com/@stefframirez" },
] as const;

export const menuItems = [
  ...services.map((s) => ({ kind: "anchor" as const, id: s.id, n: s.n, name: s.name, desc: s.desc })),
  { kind: "anchor" as const, id: "sobre-mi", n: "05", name: "Sobre mí", desc: "Quién soy y cómo trabajo" },
  { kind: "contact" as const, id: "contacto", n: "06", name: "Contacto", desc: "Escríbeme tu idea" },
];
