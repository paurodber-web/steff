import { services, steps } from "../../v2/data";

export type SectorId = (typeof services)[number]["id"];

/* ---------------- Cómo funciono ----------------
   Los títulos salen de `steps` (src/v2/data.ts); aquí se añade el paso de Edición
   y una descripción corta para cada uno. */
const stepText: Record<string, { text: string; when: string }> = {
  Brief: { text: "Me cuentas producto, audiencia y objetivo. Sin brief, lo armamos juntas.", when: "Día 0" },
  Guion: { text: "Te propongo ganchos y estructura. Aprobamos el enfoque antes de grabar.", when: "Día 1-2" },
  Grabación: { text: "En casa, con luz natural y un tono cercano. Natural, sin parecer anuncio.", when: "Día 3" },
  Edición: { text: "Montaje ágil, subtítulos y ritmo pensado para scroll rápido, en vertical 9:16.", when: "Día 4-5" },
  Entrega: { text: "Recibes los videos listos para publicar, con una ronda de revisión incluida.", when: "Día 5-7" },
};

const base = steps.map((s) => s.title);
const order = [...base.slice(0, 3), "Edición", ...base.slice(3)];

export const proceso = order.map((title, i) => ({
  n: String(i + 1).padStart(2, "0"),
  title,
  ...(stepText[title] ?? { text: "", when: "" }),
}));

/* ---------------- Portfolio: fotos ---------------- */
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
  {
    quote: "Proceso muy fácil: brief, guion aprobado y videos listos para publicar. Repetiremos la próxima temporada.",
    name: "Andrea Pons",
    role: "Directora creativa",
    brand: "Cala Studio",
  },
];

/* ---------------- Marcas: cifras clave ---------------- */
// TODO: sustituir por cifras reales
export const figures = [
  { value: 120, dec: 0, prefix: "+", suffix: "", label: "videos entregados" },
  { value: 35, dec: 0, prefix: "", suffix: "", label: "marcas colaboradas" },
  { value: 4.8, dec: 1, prefix: "", suffix: "M", label: "visualizaciones" },
];

/* ---------------- Sobre mí ---------------- */
// TODO: sustituir por cifras reales
export const stats = [
  { value: 3, prefix: "+", suffix: "", label: "Años creando" },
  { value: 98, prefix: "", suffix: "%", label: "Entregas a tiempo" },
  { value: 24, prefix: "", suffix: " h", label: "Respuesta máxima" },
];

/* ---------------- Reserva ---------------- */
export const SLOTS = ["10:00", "11:30", "16:00", "17:30"] as const;
