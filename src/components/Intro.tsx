"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const LETTERS = "MONTAIRE".split("");
const PARTICLE_COUNT = 18;

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 60 + 20, // 20-80% range, clustered around center
    startY: Math.random() * 40 + 30, // start around vertical center
    size: Math.random() * 1.5 + 1.5, // 1.5-3px
    duration: Math.random() * 3 + 3, // 3-6s drift
    delay: Math.random() * 2,
    xDrift: (Math.random() - 0.5) * 40,
    opacity: Math.random() * 0.2 + 0.2, // 0.2-0.4
  }));
}

export default function Intro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const beamGlowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const flareRef = useRef<HTMLDivElement>(null);
  const textGlowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [shouldRender, setShouldRender] = useState(true);
  const [particles] = useState(createParticles);

  const dismiss = useCallback(() => {
    sessionStorage.setItem("montaire-intro-seen", "true");
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = "none";
    }
    setShouldRender(false);
  }, []);

  const handleSkip = useCallback(() => {
    if (tlRef.current) {
      tlRef.current.kill();
    }
    gsap.killTweensOf("*");
    sessionStorage.setItem("montaire-intro-seen", "true");
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
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
    const beam = beamRef.current;
    const beamGlow = beamGlowRef.current;
    const trail = trailRef.current;
    const flare = flareRef.current;
    const textGlow = textGlowRef.current;
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    const particleEls = particlesRef.current.filter(Boolean) as HTMLDivElement[];

    if (!overlay || !beam || !beamGlow || !trail || !flare || !textGlow) return;

    // Initialize states
    gsap.set(letters, { opacity: 0, scale: 1.2, filter: "brightness(3)" });
    gsap.set([beam, beamGlow], { xPercent: -120 });
    gsap.set(trail, { opacity: 0 });
    gsap.set(flare, { opacity: 0, scale: 0.5 });
    gsap.set(textGlow, { opacity: 0 });

    const tl = gsap.timeline({
      onComplete: dismiss,
    });
    tlRef.current = tl;

    // === BEAT 1: Darkness (0 - 0.5s) ===
    tl.to({}, { duration: 0.5 });

    // === BEAT 2: Light Sweep (0.5 - 1.5s) ===
    tl.to(
      [beam, beamGlow],
      {
        xPercent: 120,
        duration: 1.0,
        ease: "power2.inOut",
      },
      0.5
    )
      .to(
        trail,
        {
          opacity: 0.4,
          duration: 0.4,
          ease: "power1.in",
        },
        0.8
      )
      .to(
        trail,
        {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        1.3
      );

    // === BEAT 3: Text Reveal (1.5 - 3.5s) ===
    // Each letter flashes in: bright white flash → settles to gold
    letters.forEach((letter, i) => {
      const startTime = 1.5 + i * 0.15;

      tl.to(
        letter,
        {
          opacity: 1,
          scale: 1,
          filter: "brightness(3)",
          duration: 0.08,
          ease: "power4.out",
        },
        startTime
      ).to(
        letter,
        {
          filter: "brightness(1)",
          duration: 0.4,
          ease: "power2.out",
        },
        startTime + 0.08
      );
    });

    // Lens flare pulses behind text during reveal
    tl.to(
      flare,
      {
        opacity: 0.6,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      1.5
    ).to(
      flare,
      {
        opacity: 0.2,
        scale: 1.1,
        duration: 1.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      },
      2.3
    );

    // Start floating particles during text reveal
    particleEls.forEach((p, i) => {
      const data = particles[i];
      if (!data) return;

      tl.fromTo(
        p,
        {
          y: 0,
          x: 0,
          opacity: 0,
        },
        {
          y: -(80 + Math.random() * 60),
          x: data.xDrift,
          opacity: data.opacity,
          duration: data.duration,
          ease: "none",
          repeat: -1,
          delay: data.delay,
        },
        1.5
      );
    });

    // === BEAT 4: Hold + Glow (3.5 - 4.2s) ===
    tl.to(
      textGlow,
      {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      3.5
    ).to(
      flare,
      {
        opacity: 0.35,
        scale: 1.2,
        duration: 0.7,
        ease: "power1.inOut",
      },
      3.5
    );

    // === BEAT 5: Fade Out (4.2 - 5.0s) ===
    tl.to(
      overlay,
      {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      },
      4.2
    );

    return () => {
      tl.kill();
      particleEls.forEach((p) => gsap.killTweensOf(p));
    };
  }, [dismiss, particles]);

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* ---- Light Sweep Beam ---- */}
      <div
        ref={beamRef}
        className="absolute top-1/2 left-0 -translate-y-1/2"
        style={{
          width: "100vw",
          height: 4,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(201,168,76,0.8) 48%, rgba(255,255,255,0.9) 50%, rgba(201,168,76,0.8) 52%, rgba(255,255,255,0) 70%, transparent 100%)",
          zIndex: 10,
        }}
      />

      {/* ---- Beam Glow (soft gaussian blur behind beam) ---- */}
      <div
        ref={beamGlowRef}
        className="absolute top-1/2 left-0 -translate-y-1/2"
        style={{
          width: "100vw",
          height: 30,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 25%, rgba(201,168,76,0.2) 45%, rgba(255,255,255,0.2) 50%, rgba(201,168,76,0.2) 55%, rgba(255,255,255,0) 75%, transparent 100%)",
          filter: "blur(12px)",
          zIndex: 9,
        }}
      />

      {/* ---- Beam Trail (golden glow that lingers) ---- */}
      <div
        ref={trailRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full"
        style={{
          height: 2,
          background:
            "linear-gradient(90deg, transparent 5%, rgba(201,168,76,0.3) 20%, rgba(201,168,76,0.5) 50%, rgba(201,168,76,0.3) 80%, transparent 95%)",
          opacity: 0,
          zIndex: 8,
        }}
      />

      {/* ---- Lens Flare behind text ---- */}
      <div
        ref={flareRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 600,
          height: 300,
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, rgba(201,168,76,0.08) 30%, transparent 65%)",
          opacity: 0,
          zIndex: 5,
        }}
      />

      {/* ---- Text Container ---- */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 20 }}
      >
        {/* Text glow layer (multi-layer text-shadow simulation) */}
        <div
          ref={textGlowRef}
          className="absolute inset-0 flex items-center justify-center font-cormorant text-[48px] md:text-[80px] lg:text-[100px] font-normal uppercase select-none"
          style={{
            letterSpacing: "0.15em",
            color: "transparent",
            textShadow:
              "0 0 20px rgba(201,168,76,0.3), 0 0 60px rgba(201,168,76,0.15), 0 0 120px rgba(201,168,76,0.08)",
            WebkitTextStroke: "0px transparent",
            opacity: 0,
          }}
          aria-hidden="true"
        >
          {"MONTAIRE".split("").map((ch, i) => (
            <span key={i} style={{ color: "#C9A84C" }}>
              {ch}
            </span>
          ))}
        </div>

        {/* Actual text — letter by letter */}
        <h1
          className="font-cormorant text-[48px] md:text-[80px] lg:text-[100px] font-normal uppercase select-none whitespace-nowrap"
          style={{ letterSpacing: "0.15em", color: "#C9A84C" }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => {
                lettersRef.current[i] = el;
              }}
              className="inline-block"
              style={{ opacity: 0, willChange: "transform, filter, opacity" }}
            >
              {letter}
            </span>
          ))}
        </h1>
      </div>

      {/* ---- Floating Particles ---- */}
      {particles.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => {
            particlesRef.current[i] = el;
          }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: "#C9A84C",
            left: `${p.left}%`,
            top: `${p.startY}%`,
            opacity: 0,
            zIndex: 15,
            willChange: "transform, opacity",
          }}
        />
      ))}

      {/* ---- Skip Button ---- */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 font-outfit text-[11px] uppercase transition-opacity duration-300"
        style={{
          letterSpacing: "0.2em",
          color: "#F5F5F0",
          opacity: 0.3,
          zIndex: 30,
          pointerEvents: "auto",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.3")}
        data-cursor="pointer"
      >
        Skip
      </button>
    </div>
  );
}
