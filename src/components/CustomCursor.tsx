"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(true);
  const [hoverText, setHoverText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouch(isTouchDevice);
    if (isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTextEl = target.closest(
        "[data-cursor-text]"
      ) as HTMLElement | null;
      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      const interactive = target.closest("a, button");

      if (cursorTextEl) {
        setIsHovering(true);
        setHoverText(cursorTextEl.getAttribute("data-cursor-text") || "");
      } else if (
        cursorEl?.getAttribute("data-cursor") === "pointer" ||
        interactive
      ) {
        setIsHovering(true);
        setHoverText("");
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.12;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.12;

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
        width: isHovering ? 48 : 6,
        height: isHovering ? 48 : 6,
        borderRadius: "50%",
        border: isHovering ? "1px solid rgba(201, 168, 76, 0.4)" : "none",
        backgroundColor: "transparent",
        transition:
          "width 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), height 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), border 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Inner diamond shape */}
      <div
        style={{
          width: isHovering ? 4 : 6,
          height: isHovering ? 4 : 6,
          borderRadius: 1,
          transform: "rotate(45deg)",
          animation: "prismatic 4s ease-in-out infinite",
          transition:
            "width 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), height 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      />

      {hoverText && (
        <span
          className="font-outfit text-[10px] uppercase tracking-[0.15em] absolute"
          style={{
            color: "#C9A84C",
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
