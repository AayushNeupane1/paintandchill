"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A quiet dot cursor for fine-pointer devices.
 *
 * It swells slightly over anything clickable and carries no text label —
 * labels ("BOOK →", "VIEW") competed with the real buttons and made the
 * page feel cluttered.
 *
 * Position is written straight to `style.transform` on mousemove rather than
 * held in React state, so hovering never triggers a re-render, and there is
 * no persistent animation frame loop when the pointer is still.
 */
export default function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("pc-cursor-active");

    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(
        'a, button, [role="button"], input, select, textarea'
      );
      el.classList.toggle("pc-cursor--active", interactive);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("pc-cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wrapRef} className="pc-cursor" aria-hidden="true">
      <div className="pc-cursor__dot" />
    </div>
  );
}
