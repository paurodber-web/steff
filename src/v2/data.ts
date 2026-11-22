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
  { kind: "anchor" as const, id: "portafolio", n: "01", name: "Portafolio", desc: "Moda, belleza, lifestyle y momlife" },
  { kind: "anchor" as const, id: "proceso", n: "02", name: "Cómo trabajo", desc: "Formatos, pasos y tiempos" },
  { kind: "anchor" as const, id: "sobre-mi", n: "03", name: "Sobre mí", desc: "Quién está detrás de la cámara" },
  { kind: "anchor" as const, id: "faq", n: "04", name: "Preguntas", desc: "Derechos, envíos y tarifas" },
  { kind: "contact" as const, id: "contacto", n: "05", name: "Contacto", desc: "Escríbeme tu idea" },
];

/* ---------------- Portfolio ----------------
   TODO (Steff): para añadir un video real a una tarjeta, sube el .mp4 (vertical 9:16, ligero, sin audio pesado)
   a `public/videos/` y un póster .jpg a `public/videos/posters/`, y rellena `src` y `poster` con
   `${import.meta.env.BASE_URL}videos/nombre.mp4`. Sin `src` se muestra el placeholder elegante. */
export type Tone = "sand" | "cream" | "ink" | "hero" | "soft";

export type VideoItem = {
  brand: string; // TODO: sustituir por marcas reales
  format: string;
  duration: string;
  tone: Tone;
  src?: string;
  poster?: string;
};

export const portfolio: Record<(typeof services)[number]["id"], VideoItem[]> = {
  moda: [
    { brand: "Maison Aurea", format: "Try-on", duration: "0:24", tone: "sand" },
    { brand: "Atelier Nube", format: "Lookbook", duration: "0:18", tone: "ink" },
    { brand: "Hilo & Lino", format: "Reseña", duration: "0:31", tone: "cream" },
  ],
  belleza: [
    { brand: "Lumé Skin", format: "Rutina", duration: "0:36", tone: "hero" },
    { brand: "Casa Rosal", format: "Unboxing", duration: "0:22", tone: "cream" },
    { brand: "Alba Beauty", format: "Tutorial", duration: "0:42", tone: "soft" },
  ],
  lifestyle: [
    { brand: "Cala Studio", format: "Un día conmigo", duration: "0:28", tone: "cream" },
    { brand: "Tierra Viva", format: "Reseña", duration: "0:20", tone: "sand" },
    { brand: "Mesa Norte", format: "Hooks", duration: "0:15", tone: "ink" },
  ],
  momlife: [
    { brand: "Pequeño Mundo", format: "Testimonial", duration: "0:33", tone: "hero" },
    { brand: "Brote Kids", format: "Unboxing", duration: "0:26", tone: "cream" },
    { brand: "Nido Baby", format: "Reseña", duration: "0:29", tone: "soft" },
  ],
};

// TODO (Steff): sustituir por las marcas reales con las que has trabajado (o por logos).
export const brands = [
  "Maison Aurea",
  "Lumé Skin",
  "Atelier Nube",
  "Casa Rosal",
  "Cala Studio",
  "Pequeño Mundo",
  "Alba Beauty",
  "Hilo & Lino",
  "Tierra Viva",
  "Nido Baby",
];

/* ---------------- Proceso ---------------- */
export const formats = ["Unboxing", "Reseña", "Tutorial / rutina", "Try-on", "Testimonial", "Hooks alternativos", "Material en bruto"];

export const steps = [
  { n: "01", title: "Brief", text: "Me cuentas el producto, tu audiencia y lo que quieres lograr. Si no tienes brief, lo armamos juntas." },
  { n: "02", title: "Guion", text: "Te propongo ideas, ganchos y estructura. Aprobamos el enfoque antes de grabar." },
  { n: "03", title: "Grabación", text: "Grabo en casa con luz natural y un tono cercano. Natural, sin parecer anuncio." },
  { n: "04", title: "Entrega", text: "Recibes los videos editados, listos para publicar, en vertical 9:16 y con subtítulos." },
];

// TODO (Steff): confirmar plazos y número de revisiones.
export const processMeta = ["Entrega en 5 - 7 días", "1 ronda de revisión incluida"];

/* ---------------- FAQ ---------------- */
export const faqs = [
  {
    q: "¿Qué derechos de uso incluye el contenido?",
    a: "Los derechos de uso se acuerdan según el proyecto: dónde se publica, durante cuánto tiempo y en qué canales. Lo dejamos claro antes de empezar, sin sorpresas.",
  },
  {
    q: "¿Puedo usar los videos en anuncios de pago?",
    a: "Sí. Puedo entregarte el contenido para que lo uses en paid ads o con whitelisting desde mi perfil. Es una extensión de derechos que acordamos de antemano.",
  },
  {
    q: "¿Cómo me envías el producto?",
    a: "Me lo haces llegar a mi dirección, o puedo comprarlo yo y lo reembolsas. Lo hablamos en el brief y lo organizamos de la forma más sencilla para ti.",
  },
  {
    q: "¿Cuánto tardas en entregar?",
    a: "Normalmente entre 5 y 7 días desde que recibo el producto y apruebas el guion. Si tienes una fecha de lanzamiento, dímelo y lo vemos.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Las tarifas son a medida según el proyecto: formato, número de videos y derechos de uso. Cuéntame qué necesitas y te envío una propuesta clara.",
  },
  {
    q: "¿En qué idiomas y mercados trabajas?",
    a: "Creo contenido en español, con acento y expresiones cercanas para el público hispanohablante. Si buscas otro mercado o idioma, escríbeme y lo valoramos.",
  },
];
