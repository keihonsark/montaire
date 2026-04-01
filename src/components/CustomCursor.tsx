"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(true);
  const [hoverText, setHoverText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(isTouchDevice);
    if (isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      const cursorTextEl = target.closest("[data-cursor-text]") as HTMLElement | null;

      if (cursorTextEl) {
        setIsHovering(true);
        setHoverText(cursorTextEl.getAttribute("data-cursor-text") || "");
      } else if (cursorEl?.getAttribute("data-cursor") === "pointer") {
        setIsHovering(true);
        setHoverText("");
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        width: isHovering ? 60 : 8,
        height: isHovering ? 60 : 8,
        borderRadius: "50%",
        border: `1px solid ${isHovering ? "var(--montaire-gold)" : "var(--montaire-gold)"}`,
        backgroundColor: isHovering ? "rgba(201, 168, 76, 0.1)" : "transparent",
        transition: "width 0.3s ease, height 0.3s ease, background-color 0.3s ease",
        mixBlendMode: "difference",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {hoverText && (
        <span
          className="font-outfit text-[11px] uppercase tracking-[0.15em] text-montaire-gold"
          style={{
            opacity: isHovering ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          {hoverText}
        </span>
      )}
    </div>
  );
}
