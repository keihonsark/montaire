"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Intro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const svgTextRef = useRef<SVGTextElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Session check - skip if already seen
    if (typeof window !== "undefined" && sessionStorage.getItem("montaire-intro-seen")) {
      setShouldRender(false);
      return;
    }

    const svgText = svgTextRef.current;
    const overlay = overlayRef.current;
    const glow = glowRef.current;
    if (!svgText || !overlay || !glow) return;

    // Get the text length for stroke animation
    const length = svgText.getComputedTextLength();
    svgText.style.strokeDasharray = `${length}`;
    svgText.style.strokeDashoffset = `${length}`;

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("montaire-intro-seen", "true");
        setShouldRender(false);
      },
    });

    // 1. Draw in stroke (0 -> 2s)
    tl.to(svgText, {
      strokeDashoffset: 0,
      duration: 2,
      ease: "power2.inOut",
    })
      // 2. Fill in the text
      .to(
        svgText,
        {
          fill: "#C9A84C",
          duration: 0.6,
          ease: "power1.in",
        },
        "-=0.3"
      )
      // 3. Gold glow pulse
      .to(
        glow,
        {
          opacity: 0.6,
          scale: 1.2,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(glow, {
        opacity: 0,
        scale: 1.5,
        duration: 0.5,
        ease: "power2.in",
      })
      // 4. Hold briefly then fade overlay
      .to(overlay, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        delay: 0.3,
      });

    return () => {
      tl.kill();
    };
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem("montaire-intro-seen", "true");
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => setShouldRender(false),
      });
    }
  };

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] flex items-center justify-center"
      style={{ backgroundColor: "var(--montaire-black)" }}
    >
      {/* Gold glow behind text */}
      <div
        ref={glowRef}
        className="absolute"
        style={{
          width: 400,
          height: 120,
          background: "radial-gradient(ellipse, rgba(201, 168, 76, 0.4) 0%, transparent 70%)",
          opacity: 0,
          filter: "blur(30px)",
        }}
      />

      {/* SVG Text */}
      <svg
        viewBox="0 0 600 80"
        className="w-[80vw] max-w-[600px] h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          ref={svgTextRef}
          x="50%"
          y="60"
          textAnchor="middle"
          className="font-cormorant"
          style={{
            fontSize: "72px",
            fontWeight: 400,
            letterSpacing: "0.12em",
            fill: "transparent",
            stroke: "#C9A84C",
            strokeWidth: 1,
          }}
        >
          MONTAIRE
        </text>
      </svg>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 font-outfit text-[13px] uppercase tracking-[0.15em] transition-opacity duration-300"
        style={{ color: "var(--montaire-white)", opacity: 0.4 }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.4")}
        data-cursor="pointer"
      >
        Skip
      </button>
    </div>
  );
}
