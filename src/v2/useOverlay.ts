import { useEffect, type RefObject } from "react";

/** Escape closes; focus moves to the close button when the overlay opens. */
export function useOverlay(open: boolean, onClose: () => void, closeRef: RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => closeRef.current?.focus(), 120);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose, closeRef]);
}
