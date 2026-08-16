"use client";

import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "view" | "book";

/**
 * Subtle custom cursor for fine-pointer (desktop) devices only.
 * Updates via direct style mutation on mousemove (no persistent rAF loop),
 * so there is zero cost while the pointer is idle.
 */
export default function CustomCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    // client-only feature detection; SSR can't know pointer capability, so
    // this necessarily resolves one tick after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(fine.matches);
    const onChange = () => setEnabled(fine.matches);
    fine.addEventListener?.("change", onChange);
    return () => fine.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.body.classList.add("pc-cursor-active");

    const handleMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      const target = e.target as HTMLElement;
      const viewEl = target.closest("[data-cursor='view']");
      const bookEl = target.closest("[data-cursor='book']");
      if (bookEl) {
        setMode("book");
        setLabel("BOOK →");
      } else if (viewEl) {
        setMode("view");
        setLabel("VIEW");
      } else {
        setMode("default");
        setLabel("");
      }
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.body.classList.remove("pc-cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wrapRef} className={`pc-cursor pc-cursor--${mode}`} aria-hidden="true">
      <div className="pc-cursor__dot">{label}</div>
    </div>
  );
}
