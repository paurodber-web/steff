import { services, steps } from "../../v2/data";

export type SectorId = (typeof services)[number]["id"];

/* ---------------- Servicios: formatos por sector ---------------- */
export const sectorFormats: Record<SectorId, string[]> = {
  moda: ["Try-on", "Reseña", "Lookbook"],
  belleza: ["Rutina", "Unboxing", "Tutorial"],
  lifestyle: ["Un día conmigo", "Reseña"],
  momlife: ["Testimonial", "Hooks"],
};

export const sectorLook = {
  moda: { tone: "sand", crop: "torso" },
  belleza: { tone: "blush", crop: "face" },
  lifestyle: { tone: "cream", crop: "full" },
  momlife: { tone: "rose", crop: "torso" },
} as const;

/* ---------------- Cómo funciono ---------------- */
const when: Record<string, string> = {
  Brief: "Día 0",
  Guion: "Día 1-2",
  Grabación: "Día 3",
  Edición: "Día 4-5",
  Entrega: "Día 5-7",
};
const base = steps.map((s) => s.title);
const order = [...base.slice(0, 3), "Edición", ...base.slice(3)];
export const proceso = order.map((title, i) => ({ n: String(i + 1).padStart(2, "0"), title, when: when[title] ?? "" }));

/* ---------------- Portafolio: fotos ---------------- */
export type PhotoLook = { tone: "cream" | "sand" | "blush" | "hero" | "rose" | "oxblood"; crop: "face" | "torso" | "full"; label: string };

// Fotos de EJEMPLO (composiciones con el retrato). TODO: sustituir por fotos reales.
export const photos: Record<SectorId, PhotoLook[]> = {
  moda: [
    { tone: "cream", crop: "full", label: "Editorial" },
    { tone: "blush", crop: "face", label: "Detalle" },
    { tone: "oxblood", crop: "torso", label: "Campaña" },
  ],
  belleza: [
    { tone: "rose", crop: "face", label: "Textura" },
    { tone: "cream", crop: "torso", label: "Rutina" },
    { tone: "sand", crop: "face", label: "Producto" },
  ],
  lifestyle: [
    { tone: "sand", crop: "full", label: "Día a día" },
    { tone: "hero", crop: "torso", label: "Momentos" },
    { tone: "blush", crop: "face", label: "Detalle" },
  ],
  momlife: [
    { tone: "blush", crop: "full", label: "En casa" },
    { tone: "cream", crop: "torso", label: "Rutinas" },
    { tone: "oxblood", crop: "face", label: "Retrato" },
  ],
};

/* ---------------- Marcas: cifras clave ---------------- */
// TODO: sustituir por cifras reales
export const figures = [
  { value: 120, dec: 0, prefix: "+", suffix: "", label: "videos entregados" },
  { value: 35, dec: 0, prefix: "", suffix: "", label: "marcas colaboradas" },
  { value: 4.8, dec: 1, prefix: "", suffix: "M", label: "visualizaciones" },
];

/* ---------------- Testimonios ---------------- */
// TODO: sustituir por testimonios reales
export const testimonials = [
  {
    quote: "Steff entendió el producto a la primera. El video no parece un anuncio, parece la recomendación de una amiga, y por eso funciona.",
    name: "Carla Montoya",
    role: "Brand Manager",
    brand: "Lumé Skin",
  },
  {
    quote: "Nos entregó tres ganchos distintos y todos nos sirvieron para testear. Cercana, puntual y con muy buen ojo para la luz.",
    name: "Marta Vidal",
    role: "Fundadora",
    brand: "Maison Aurea",
  },
  {
    quote: "Contó nuestra marca con una honestidad que no se consigue con guion. Los comentarios de las mamás lo dicen todo.",
    name: "Lucía Ferrer",
    role: "Responsable de marketing",
    brand: "Pequeño Mundo",
  },
];

/* ---------------- Reserva ---------------- */
export const SLOTS = ["10:00", "11:30", "16:00", "17:30"] as const;
