import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { EMAIL } from "../../v2/data";
import { gsap, useMotion } from "../kit";
import { Band, Em, Folio, h2Big, headMotion } from "./common";
import { SLOTS } from "./data";

// TODO: conectar con Calendly/Cal.com si se prefiere

const WEEK = ["L", "M", "X", "J", "V", "S", "D"];
const WEEK_LONG = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const fmtMonth = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" });
const fmtLong = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" });
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** 42 cells (6 weeks, Monday first) so the calendar never changes height. */
function monthCells(first: Date) {
  const lead = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => new Date(first.getFullYear(), first.getMonth(), 1 - lead + i));
}

const Chevron = ({ dir }: { dir: "l" | "r" }) => (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={dir === "l" ? "M10 3 5 8l5 5" : "M6 3l5 5-5 5"} />
  </svg>
);

export function Reserva() {
  const ref = useRef<HTMLElement>(null);
  const [today, setToday] = useState<Date | null>(null);
  const [month, setMonth] = useState<Date | null>(null);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [sent, setSent] = useState<null | { when: string; mail: string }>(null);
  const [f, setF] = useState({ nombre: "", email: "", marca: "", mensaje: "" });

  // date-dependent UI only after mount, so SSR and hydration agree
  useEffect(() => {
    const t = startOfDay(new Date());
    setToday(t);
    setMonth(new Date(t.getFullYear(), t.getMonth(), 1));
  }, []);

  useMotion(ref, (root) => {
    const off = headMotion(root, "top 85%", "mask");
    const at = { trigger: root.querySelector("[data-grid]"), start: "top 88%", once: true } as const;
    gsap.from(root.querySelectorAll("[data-info] > *"), { opacity: 0, y: 18, duration: 0.7, stagger: 0.08, ease: "power2.out", scrollTrigger: at });
    gsap.from(root.querySelectorAll("[data-cal]"), { opacity: 0, x: -32, duration: 0.8, ease: "expo.out", scrollTrigger: at });
    gsap.from(root.querySelectorAll("[data-side]"), { opacity: 0, x: 32, duration: 0.8, delay: 0.1, ease: "expo.out", scrollTrigger: at });
    gsap.from(root.querySelectorAll("[data-day]"), { opacity: 0, scale: 0.7, duration: 0.4, stagger: { each: 0.008, from: "start" }, delay: 0.25, ease: "power2.out", clearProps: "opacity,scale", scrollTrigger: at });
    return off;
  });

  const cells = useMemo(() => (month ? monthCells(month) : []), [month]);
  const canPrev = !!(today && month && month > new Date(today.getFullYear(), today.getMonth(), 1));

  const slotsFor = (d: Date) => {
    if (!today || !sameDay(d, today)) return [...SLOTS];
    const now = new Date();
    return SLOTS.filter((s) => {
      const [h, m] = s.split(":").map(Number);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m) > now;
    });
  };
  const free = day ? slotsFor(day) : [];

  const shift = (n: number) => {
    if (!month) return;
    setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  };

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const ready = !!(day && slot);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!day || !slot) return;
    const when = `${cap(fmtLong.format(day))} a las ${slot}`;
    const body = [
      "Hola Steff,",
      "",
      `Me gustaría reservar una llamada el ${when}.`,
      "",
      `Nombre: ${f.nombre}`,
      `Email: ${f.email}`,
      `Marca: ${f.marca || "-"}`,
      "",
      f.mensaje || "(Sin mensaje)",
    ].join("\n");
    const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(`Reserva de llamada · ${when}`)}&body=${encodeURIComponent(body)}`;
    setSent({ when, mail });
    window.location.href = mail;
  };

  const reset = () => {
    setSent(null);
    setDay(null);
    setSlot(null);
    setF({ nombre: "", email: "", marca: "", mensaje: "" });
  };

  return (
    <Band id="reserva" labelledBy="v12-reserva-h" innerRef={ref} tone="paper">
      <Folio n="07">Reserva una llamada</Folio>
      <header>
        <h2 id="v12-reserva-h" data-h2 className={`${h2Big} max-w-[16ch] sm:max-w-none`}>
          Hablemos de tu <Em>próxima campaña</Em>
        </h2>
      </header>

      <div data-grid className="mt-10 grid gap-x-8 gap-y-10 lg:mt-12 lg:grid-cols-12">
        <aside data-info className="md:grid md:grid-cols-12 md:gap-x-8 lg:col-span-3 lg:block">
          <p className="max-w-[34ch] text-[16px] leading-[1.6] text-ink-soft sm:text-[17px] md:col-span-5 lg:max-w-none">
            Elige un día y una hora: una conversación sin compromiso para ver cómo puedo ayudarte.
          </p>
          <div className="mt-6 md:col-span-7 md:mt-0 lg:mt-8">
            <h3 className="v12-caps text-ink">Qué hablaremos</h3>
            <ol className="mt-3">
              {[
                "Tu marca, tu producto y a quién quieres llegar.",
                "Qué formatos, ganchos y plataformas encajan mejor.",
                "Plazos, presupuesto orientativo y siguientes pasos.",
              ].map((t, i) => (
                <li key={t} className="hair-t flex gap-4 py-3 text-[15.5px] leading-snug text-ink-soft">
                  <span aria-hidden className="v12-caps w-6 shrink-0 pt-0.5 text-oxblood">
                    0{i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
            <p className="hair-t v12-caps pt-4 text-ink-soft" aria-label="Detalles de la llamada">
              20 min <span aria-hidden>·</span> Videollamada <span aria-hidden>·</span> Gratis
            </p>
          </div>
        </aside>

        <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:col-span-9 lg:grid-cols-9">
          {/* calendar: a typographic grid, rows ruled with hairlines */}
          <div data-cal className="lg:col-span-5">
            <div className="flex items-center justify-between">
              <h3 aria-live="polite" className="font-display text-[28px] leading-none text-ink sm:text-[32px]">
                {month ? cap(fmtMonth.format(month).replace(" de ", " ")) : " "}
              </h3>
              <div className="-mr-3 flex">
                <button type="button" aria-label="Mes anterior" disabled={!canPrev} onClick={() => shift(-1)} className="v12-arrow-btn">
                  <Chevron dir="l" />
                </button>
                <button type="button" aria-label="Mes siguiente" disabled={!month} onClick={() => shift(1)} className="v12-arrow-btn">
                  <Chevron dir="r" />
                </button>
              </div>
            </div>
            <div role="group" aria-label="Elige un día" className="mt-4">
              <div aria-hidden className="v12-caps grid grid-cols-7 pb-2 text-center text-[11px] text-ink-soft">
                {WEEK.map((w) => (
                  <span key={w}>{w}</span>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((d, i) => {
                  const wd = (d.getDay() + 6) % 7;
                  const out = month ? d.getMonth() !== month.getMonth() : true;
                  if (out) return <span key={i} aria-hidden className="hair-t h-11" />;
                  const off = !today || d < today || wd > 4;
                  const on = !!day && sameDay(d, day);
                  return (
                    <button
                      key={i}
                      type="button"
                      data-day
                      disabled={off}
                      aria-pressed={on}
                      aria-label={`${WEEK_LONG[wd]} ${d.getDate()} de ${new Intl.DateTimeFormat("es-ES", { month: "long" }).format(d)}`}
                      onClick={() => {
                        setDay(d);
                        setSlot(null);
                      }}
                      className="v12-day"
                    >
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 text-[14px] text-ink-soft">Disponible de lunes a viernes.</p>
          </div>

          {/* slots + form */}
          <div data-side className="lg:col-span-4">
            {sent ? (
              <div role="status" className="v12-pop flex h-full min-h-[300px] flex-col items-start justify-center gap-4">
                <p className="v12-caps text-oxblood">Reserva enviada</p>
                <h3 className="font-display text-[34px] leading-[1.05] text-ink sm:text-[42px]">
                  Casi listo, <Em>{f.nombre.split(" ")[0] || "gracias"}</Em>.
                </h3>
                <p className="max-w-[44ch] text-[16px] leading-[1.6] text-ink-soft">
                  Se ha abierto tu correo con la reserva para el <strong className="font-semibold text-ink">{sent.when}</strong>. Envíalo y te confirmaré la llamada lo antes posible.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <a href={sent.mail} className="v12-ul inline-flex min-h-11 items-center text-[15px] font-semibold text-ink">
                    Abrir el correo de nuevo
                  </a>
                  <button type="button" onClick={reset} className="v12-ul inline-flex min-h-11 cursor-pointer items-center text-[15px] font-semibold text-ink">
                    Reservar otro día
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-6">
                <fieldset>
                  <legend className="v12-caps text-ink-soft">{day ? cap(fmtLong.format(day)) : "Elige primero un día"}</legend>
                  <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-4" role="group" aria-label="Horarios disponibles">
                    {SLOTS.map((s) => {
                      const ok = free.includes(s);
                      return (
                        <button key={s} type="button" disabled={!day || !ok} aria-pressed={slot === s} onClick={() => setSlot(s)} className="v12-slot">
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  {day && !free.length && <p className="mt-2 text-[14px] text-ink-soft">Hoy ya no quedan huecos. Prueba con otro día.</p>}
                </fieldset>

                <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                  <label className="v12-field">
                    <span>Nombre</span>
                    <input required name="nombre" autoComplete="name" value={f.nombre} onChange={set("nombre")} />
                  </label>
                  <label className="v12-field">
                    <span>Email</span>
                    <input required type="email" name="email" autoComplete="email" value={f.email} onChange={set("email")} />
                  </label>
                  <label className="v12-field col-span-2">
                    <span>Marca</span>
                    <input name="marca" autoComplete="organization" value={f.marca} onChange={set("marca")} />
                  </label>
                  <label className="v12-field col-span-2">
                    <span>Mensaje breve</span>
                    <textarea name="mensaje" rows={2} value={f.mensaje} onChange={set("mensaje")} />
                  </label>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:flex-col md:items-stretch lg:flex-col">
                  <p className="text-[14px] text-ink-soft" aria-live="polite">
                    {ready ? `${day && cap(fmtLong.format(day))} · ${slot}` : "Elige día y hora para continuar."}
                  </p>
                  <button type="submit" disabled={!ready} className="v12-btn">
                    Confirmar reserva
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Band>
  );
}
