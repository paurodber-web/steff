import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";
import { EMAIL } from "./data";

/**
 * Small inline "Copiar" text button. Shows "Copiado ✓" for 2s only on success;
 * if copying fails, it selects the email text (targetId) so the user can copy manually.
 */
export function CopyEmail({ targetId, className }: { targetId?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const selectTarget = () => {
    const el = targetId ? document.getElementById(targetId) : null;
    if (!el) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  const copy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(EMAIL);
      ok = true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = EMAIL;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2000);
    } else {
      selectTarget();
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copiar email"
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center rounded-sm px-1 text-[12px] font-medium uppercase tracking-[0.16em] text-cream/70 transition-colors hover:text-cream active:text-cream focus-visible:text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream",
        className,
      )}
    >
      <span aria-live="polite">{copied ? "Copiado ✓" : "Copiar"}</span>
    </button>
  );
}
