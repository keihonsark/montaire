"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const LETTERS = "MONTAIRE".split("");

export default function Intro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const skipRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [shouldRender, setShouldRender] = useState(true);

  const dismiss = useCallback(() => {
    sessionStorage.setItem("montaire-intro-seen", "true");
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = "none";
      overlayRef.current.style.display = "none";
    }
    setShouldRender(false);
  }, []);

  const handleSkip = useCallback(() => {
    if (tlRef.current) tlRef.current.kill();
    sessionStorage.setItem("montaire-intro-seen", "true");
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: dismiss,
      });
    }
  }, [dismiss]);

  useEffect(() => {
    if (sessionStorage.getItem("montaire-intro-seen")) {
      setShouldRender(false);
      return;
    }

    const overlay = overlayRef.current;
    const text = textRef.current;
    const skip = skipRef.current;
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];

    if (!overlay || !text || !skip) return;

    gsap.set(letters, { opacity: 0 });
    gsap.set(text, { opacity: 0 });
    gsap.set(skip, { opacity: 0, pointerEvents: "none" });

    const tl = gsap.timeline({ onComplete: dismiss });
    tlRef.current = tl;

    // 0.0s - 1.0s: Pure black darkness
    tl.to({}, { duration: 1.0 });

    // Show skip at 1.0s
    tl.to(skip, { opacity: 0.2, pointerEvents: "auto", duration: 0.3 }, 1.0);

    // 1.5s - 3.0s: Text fades in letter by letter
    tl.to(text, { opacity: 1, duration: 0.3 }, 1.5);

    letters.forEach((letter, i) => {
      tl.to(
        letter,
        { opacity: 1, duration: 0.4, ease: "power2.out" },
        1.5 + i * 0.12
      );
    });

    // 3.5s - 4.5s: Hold
    tl.to({}, { duration: 1.0 }, 3.5);

    // 4.5s - 5.5s: Fade out
    tl.to(overlay, {
      opacity: 0,
      duration: 1.0,
      ease: "power2.inOut",
    }, 4.5);

    return () => { tl.kill(); };
  }, [dismiss]);

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* Text */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <h1
          className="font-bodoni text-[52px] md:text-[100px] font-normal uppercase select-none whitespace-nowrap"
          style={{
            letterSpacing: "0.12em",
            color: "#F5F5F0",
            textShadow: "0 0 40px rgba(255,255,255,0.15)",
          }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => { lettersRef.current[i] = el; }}
              className="inline-block"
              style={{ opacity: 0 }}
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>

      {/* Skip */}
      <button
        ref={skipRef}
        onClick={handleSkip}
        className="absolute bottom-8 right-8 font-outfit text-[11px] uppercase transition-opacity duration-200"
        style={{
          letterSpacing: "0.2em",
          color: "#F5F5F0",
          opacity: 0,
          zIndex: 30,
          pointerEvents: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.2")}
        data-cursor="pointer"
      >
        Skip
      </button>
    </div>
  );
}
