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
   TODO (Steff): para añadir un video real a una tarjeta, sube el .mp4 (vertical 9:16, ligero)
   a `public/videos/` y un póster .jpg a `public/videos/posters/`, y rellena `src` y `poster` con
   `${import.meta.env.BASE_URL}videos/nombre.mp4`. Sin `src` se muestra la composición con tu foto.
   Las marcas, hooks y formatos de abajo son de EJEMPLO: sustitúyelos por los reales. */
export type Tone = "cream" | "sand" | "blush" | "hero" | "rose" | "oxblood";
/** framing of the portrait used as placeholder: face, waist-up or full figure */
export type Crop = "face" | "torso" | "full";

export type VideoItem = {
  brand: string; // TODO: sustituir por marcas reales
  format: string;
  duration: string;
  hook: string; // texto de gancho que aparece sobre el video
  tone: Tone;
  crop: Crop;
  src?: string;
  poster?: string;
};

export const portfolio: Record<(typeof services)[number]["id"], VideoItem[]> = {
  moda: [
    { brand: "Maison Aurea", format: "Try-on", duration: "0:24", hook: "3 looks con un solo blazer", tone: "sand", crop: "torso" },
    { brand: "Atelier Nube", format: "Lookbook", duration: "0:18", hook: "Lo que me pongo un lunes", tone: "oxblood", crop: "full" },
    { brand: "Hilo & Lino", format: "Reseña", duration: "0:31", hook: "¿Vale la pena el lino?", tone: "cream", crop: "face" },
  ],
  belleza: [
    { brand: "Lumé Skin", format: "Rutina", duration: "0:36", hook: "Mi piel en 5 minutos", tone: "blush", crop: "face" },
    { brand: "Casa Rosal", format: "Unboxing", duration: "0:22", hook: "Abro esto contigo", tone: "rose", crop: "torso" },
    { brand: "Alba Beauty", format: "Tutorial", duration: "0:42", hook: "El labial que no se mueve", tone: "hero", crop: "face" },
  ],
  lifestyle: [
    { brand: "Cala Studio", format: "Un día conmigo", duration: "0:28", hook: "Un martes cualquiera", tone: "cream", crop: "full" },
    { brand: "Tierra Viva", format: "Reseña", duration: "0:20", hook: "Probé esto 30 días", tone: "sand", crop: "torso" },
    { brand: "Mesa Norte", format: "Hooks", duration: "0:15", hook: "No compres esto sin ver", tone: "oxblood", crop: "face" },
  ],
  momlife: [
    { brand: "Pequeño Mundo", format: "Testimonial", duration: "0:33", hook: "Lo que nadie te cuenta", tone: "blush", crop: "torso" },
    { brand: "Brote Kids", format: "Unboxing", duration: "0:26", hook: "Su primer día de cole", tone: "oxblood", crop: "full" },
    { brand: "Nido Baby", format: "Reseña", duration: "0:29", hook: "Mamá real, opinión real", tone: "hero", crop: "face" },
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
export const formats = [
  { name: "Unboxing", note: "La primera impresión, sin guion aparente" },
  { name: "Reseña", note: "Opinión honesta, con pros y matices" },
  { name: "Tutorial / rutina", note: "Paso a paso, fácil de copiar" },
  { name: "Try-on", note: "Tallas, caídas y combinaciones" },
  { name: "Testimonial", note: "Mi experiencia, contada a cámara" },
  { name: "Hooks alternativos", note: "Varias aperturas para testear" },
  { name: "Material en bruto", note: "Tomas extra para tu equipo" },
];

export const steps = [
  { n: "I", title: "Brief", text: "Me cuentas el producto, tu audiencia y lo que quieres lograr. Si no tienes brief, lo armamos juntas." },
  { n: "II", title: "Guion", text: "Te propongo ideas, ganchos y estructura. Aprobamos el enfoque antes de grabar." },
  { n: "III", title: "Grabación", text: "Grabo en casa con luz natural y un tono cercano. Natural, sin parecer anuncio." },
  { n: "IV", title: "Entrega", text: "Recibes los videos editados, listos para publicar, en vertical 9:16 y con subtítulos." },
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
