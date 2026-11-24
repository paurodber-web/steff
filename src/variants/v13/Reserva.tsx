import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { EMAIL } from "../../v2/data";
import { gsap, ScrollTrigger, useMotion } from "../kit";
import { SLOTS } from "./data";
import { Em, EASE, motionOk } from "./common";

// TODO: conectar con Calendly/Cal.com si se prefiere
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Horas libres de un día: hoy solo las que aún no han pasado. */
const slotsFor = (d: Date) =>
  SLOTS.filter((s) => {
    const now = new Date();
    if (!sameDay(d, now)) return true;
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m > now.getHours() * 60 + now.getMinutes();
  });

/** Próximos 10 días laborables (si hoy ya no quedan horas, empieza mañana). */
function nextDays(): Date[] {
  const today = startOfDay(new Date());
  const out: Date[] = [];
  const d = new Date(today);
  while (out.length < 10) {
    const wd = d.getDay();
    if (wd !== 0 && wd !== 6 && (!sameDay(d, today) || slotsFor(d).length > 0)) out.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type Sent = { when: string; nombre: string };

/** 7 · Reserva: tira de días + horas grandes + formulario en forma de frase. */
export function Reserva() {
  const ref = useRef<HTMLElement>(null);
  const [days, setDays] = useState<Date[]>([]);
  const [day, setDay] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [f, setF] = useState({ nombre: "", marca: "", email: "", proyecto: "" });
  const [sent, setSent] = useState<Sent | null>(null);

  // calculado tras el montaje: el HTML del servidor no depende de la fecha
  useEffect(() => setDays(nextDays()), []);

  const short = useMemo(() => new Intl.DateTimeFormat("es-ES", { weekday: "short" }), []);
  const month = useMemo(() => new Intl.DateTimeFormat("es-ES", { month: "short" }), []);
  const long = useMemo(() => new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }), []);
  const clean = (s: string) => s.replace(".", "");

  const ready = days.length > 0;
  const free = day ? slotsFor(day) : [];
  const off = !day || !slot;

  useMotion(
    ref,
    (root) => {
      gsap.from(root.querySelector("[data-h]"), { opacity: 0, y: 22, duration: 0.8, ease: EASE, scrollTrigger: { trigger: root, start: "top 85%", once: true } });
      if (!ready) return;
      gsap.from(root.querySelectorAll("[data-day]"), {
        opacity: 0,
        x: -26,
        y: 14,
        rotate: -5,
        duration: 0.7,
        stagger: 0.06,
        ease: EASE,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: root.querySelector("[data-days]"), start: "top 90%", once: true },
      });
    },
    [ready],
  );

  const pickDay = (d: Date) => {
    setDay(d);
    setSlot((cur) => (cur && slotsFor(d).includes(cur as (typeof SLOTS)[number]) ? cur : null));
  };

  // la frase se revela palabra a palabra al elegir hora
  useEffect(() => {
    const root = ref.current;
    if (!root || !slot || !motionOk()) return;
    const ws = root.querySelectorAll("[data-w]");
    const t = gsap.fromTo(ws, { opacity: 0.12, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", clearProps: "opacity,transform" });
    return () => {
      t.kill();
    };
  }, [slot, day]);

  // el numeral elegido "salta" a cursiva/oxblood
  useEffect(() => {
    const root = ref.current;
    if (!root || !day || !motionOk()) return;
    const el = root.querySelector('button.v13-day[aria-pressed="true"] b');
    if (el) gsap.fromTo(el, { yPercent: 14, scale: 0.92 }, { yPercent: 0, scale: 1, duration: 0.5, ease: "back.out(2)", clearProps: "transform" });
  }, [day]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setF((cur) => ({ ...cur, [k]: v }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!day || !slot) return;
    const when = `${long.format(day)} a las ${slot}`;
    const subject = `Reserva de llamada: ${f.nombre}${f.marca ? ` (${f.marca})` : ""}`;
    const body = [
      "Hola Steff,",
      "",
      `Quiero reservar una llamada de 20 min el ${when}.`,
      "",
      `Nombre: ${f.nombre}`,
      `Marca: ${f.marca || "-"}`,
      `Email: ${f.email}`,
      `Proyecto: ${f.proyecto || "-"}`,
    ].join("\n");
    setSent({ when, nombre: f.nombre });
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // el formulario y el mensaje de éxito tienen alturas distintas: recalcular los disparadores de debajo
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 50);
    return () => window.clearTimeout(id);
  }, [sent]);

  const reset = () => {
    setSent(null);
    setSlot(null);
    setDay(null);
  };

  const inp = (k: keyof typeof f, label: string, ph: string, type = "text", auto?: string) => (
    <input
      data-w
      className="v13-in"
      name={k}
      type={type}
      aria-label={label}
      placeholder={ph}
      value={f[k]}
      onChange={set(k)}
      disabled={off}
      required={k === "nombre" || k === "email"}
      autoComplete={auto}
      style={{ width: `${Math.max(f[k].length, ph.length) + 1}ch` }}
    />
  );

  // palabras sueltas: cada una se revela por separado
  const W = ({ children }: { children: string }) => (
    <>
      {children.split(" ").map((w, i) => (
        <span key={i}>
          <span data-w className="inline-block">
            {w}
          </span>{" "}
        </span>
      ))}
    </>
  );

  return (
    <section ref={ref} id="reserva" aria-labelledby="v13-reserva-h" className="v13-sec v13-cream py-14 sm:py-16 lg:py-14">
      <div className="v13-wrap">
        <header data-h className="mb-8 lg:mb-8">
          <h2 id="v13-reserva-h" className="font-display text-[clamp(38px,10vw,54px)] leading-[1.05] tracking-[-0.022em] sm:text-[clamp(44px,6.4vw,60px)] lg:text-[clamp(48px,4.4vw,68px)]">
            Elige un día y <Em>hablamos</Em>
          </h2>
          <p className="mt-3 max-w-[44ch] text-ink-soft">Llamada de 20 min por videollamada, sin coste. Días laborables.</p>
        </header>

        {sent ? (
          <div role="status" className="py-6">
            <p className="font-display text-[clamp(34px,8vw,64px)] leading-[1.08] tracking-[-0.02em]">
              Casi listo, {sent.nombre.split(" ")[0] || "gracias"}. <Em>Falta enviar el correo.</Em>
            </p>
            <p className="mt-4 max-w-[52ch] text-[17px] text-ink-soft">
              Se abrió tu correo con la reserva para el {sent.when}. Envíalo para confirmar. Si no se abrió, escríbeme a{" "}
              <a className="v13-link text-ink underline" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
              .
            </p>
            <button type="button" onClick={reset} className="v13-btn mt-7">
              Reservar otro día
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <p id="v13-days-l" className="v13-caps mb-3 text-ink-soft">
              1 · Día
            </p>
            <ul data-days role="group" aria-labelledby="v13-days-l" className="v13-days">
              {ready
                ? days.map((d) => {
                    const on = !!day && sameDay(d, day);
                    return (
                      <li key={d.toISOString()} data-day>
                        <button type="button" className="v13-day" aria-pressed={on} aria-label={cap(long.format(d))} onClick={() => pickDay(d)}>
                          <small aria-hidden>{clean(short.format(d))}</small>
                          <b aria-hidden>{d.getDate()}</b>
                          <small aria-hidden>{clean(month.format(d))}</small>
                        </button>
                      </li>
                    );
                  })
                : Array.from({ length: 10 }, (_, i) => (
                    <li key={i} aria-hidden>
                      <span className="v13-day" style={{ opacity: 0.35 }}>
                        <small>&nbsp;</small>
                        <b>·</b>
                        <small>&nbsp;</small>
                      </span>
                    </li>
                  ))}
            </ul>

            <p id="v13-times-l" className="v13-caps mb-2 mt-8 text-ink-soft">
              2 · Hora
            </p>
            <ul role="group" aria-labelledby="v13-times-l" className="v13-times">
              {SLOTS.map((s) => {
                const ok = !!day && free.includes(s);
                return (
                  <li key={s}>
                    <button type="button" className="v13-time" aria-pressed={slot === s} disabled={!ok} data-past={!!day && !ok} onClick={() => setSlot(s)}>
                      {s}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p aria-live="polite" className="v13-sum mt-1 min-h-[1.6em]">
              {day ? (slot ? `${cap(long.format(day))} a las ${slot}` : "Elige una hora") : "Elige primero un día"}
            </p>

            <p className="v13-caps mb-3 mt-8 text-ink-soft">3 · Cuéntame</p>
            <p className="v13-mad" data-off={off}>
              <W>Hola Steff, soy</W>
              {inp("nombre", "Tu nombre", "tu nombre", "text", "name")}{" "}
              <W>de</W>
              {inp("marca", "Tu marca", "tu marca", "text", "organization")}
              <span data-w>.</span> <W>Escríbeme a</W>
              {inp("email", "Tu email", "tu@email.com", "email", "email")}{" "}
              <W>para hablar de</W>
              {inp("proyecto", "Tu proyecto, en pocas palabras", "tu proyecto")}
              <span data-w>.</span>
            </p>

            <div className="mt-8">
              <button type="submit" className="v13-btn" disabled={off}>
                Reservar llamada
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
