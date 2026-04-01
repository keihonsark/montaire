"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const LETTERS = "MONTAIRE".split("");
const PARTICLE_COUNT = 12;

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 50 + 25,
    startY: Math.random() * 30 + 35,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 4 + 4,
    delay: Math.random() * 1.5,
    xDrift: (Math.random() - 0.5) * 30,
    opacity: Math.random() * 0.15 + 0.15,
  }));
}

export default function Intro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const beamGlowRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const glowBgRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const skipRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [shouldRender, setShouldRender] = useState(true);
  const [particles] = useState(createParticles);

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
    const beam = beamRef.current;
    const beamGlow = beamGlowRef.current;
    const trail = trailRef.current;
    const textContainer = textContainerRef.current;
    const glowBg = glowBgRef.current;
    const skip = skipRef.current;
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    const particleEls = particlesRef.current.filter(Boolean) as HTMLDivElement[];

    if (!overlay || !beam || !beamGlow || !trail || !textContainer || !glowBg || !skip) return;

    // Initialize everything hidden
    gsap.set(letters, { opacity: 0, filter: "brightness(0)" });
    gsap.set([beam, beamGlow], { x: "-110vw" });
    gsap.set(trail, { opacity: 0 });
    gsap.set(glowBg, { opacity: 0, scale: 0.5 });
    gsap.set(skip, { opacity: 0, pointerEvents: "none" });
    gsap.set(particleEls, { opacity: 0 });

    const tl = gsap.timeline({ onComplete: dismiss });
    tlRef.current = tl;

    // ================================================================
    // BEAT 1: Darkness (0.0s - 1.0s)
    // Pure black. Nothing. Let it sit.
    // ================================================================
    tl.to({}, { duration: 1.0 });

    // Fade in skip button at 1.0s
    tl.to(skip, {
      opacity: 0.25,
      pointerEvents: "auto",
      duration: 0.4,
      ease: "power1.in",
    }, 1.0);

    // ================================================================
    // BEAT 2: Light Sweep (1.0s - 1.8s)
    // Thin beam + soft glow sweep left to right
    // ================================================================
    tl.to(beam, {
      x: "110vw",
      duration: 0.8,
      ease: "power2.inOut",
    }, 1.0);

    tl.to(beamGlow, {
      x: "110vw",
      duration: 0.8,
      ease: "power2.inOut",
    }, 1.0);

    // Trail appears as beam passes center, then lingers and fades over 2s
    tl.to(trail, {
      opacity: 0.5,
      duration: 0.3,
      ease: "power1.in",
    }, 1.3);

    tl.to(trail, {
      opacity: 0,
      duration: 2.0,
      ease: "power2.out",
    }, 1.8);

    // Start particles during beat 2 — they persist throughout
    particleEls.forEach((p, i) => {
      const data = particles[i];
      if (!data) return;
      tl.fromTo(p,
        { y: 0, x: 0, opacity: 0 },
        {
          y: -(100 + Math.random() * 80),
          x: data.xDrift,
          opacity: data.opacity,
          duration: data.duration,
          ease: "none",
          repeat: -1,
        },
        1.0 + data.delay
      );
    });

    // ================================================================
    // BEAT 3: Text Reveal (1.8s - 3.5s)
    // Letters fade in one at a time, 0.2s stagger
    // Each: brightness 0 → flash to 2.5 + opacity 1 → settle to 1
    // ================================================================
    letters.forEach((letter, i) => {
      const t = 1.8 + i * 0.2;

      // Flash ON: opacity 0→1, brightness 0→2.5 (the spotlight hit)
      tl.to(letter, {
        opacity: 1,
        filter: "brightness(2.5)",
        duration: 0.1,
        ease: "power4.out",
      }, t);

      // Settle: brightness 2.5→1 over 0.3s
      tl.to(letter, {
        filter: "brightness(1)",
        duration: 0.3,
        ease: "power2.out",
      }, t + 0.1);
    });

    // ================================================================
    // BEAT 4: Hold + Glow (3.5s - 4.5s)
    // Golden glow builds behind text, text-shadow intensifies
    // ================================================================
    tl.to(glowBg, {
      opacity: 1,
      scale: 1.5,
      duration: 1.0,
      ease: "power2.out",
    }, 3.5);

    // Add text-shadow to each letter for warm glow
    tl.to(letters, {
      textShadow: "0 0 30px rgba(201,168,76,0.3), 0 0 80px rgba(201,168,76,0.15)",
      duration: 0.8,
      ease: "power2.out",
    }, 3.5);

    // Subtle camera shake — the "weight" of the sign lighting up
    tl.to(textContainer, {
      x: "random(-1, 1)",
      y: "random(-1, 1)",
      duration: 0.05,
      repeat: 5,
      yoyo: true,
      ease: "none",
    }, 3.5);

    // ================================================================
    // BEAT 5: Fade Out (4.5s - 5.5s)
    // Everything fades out over 1 full second
    // ================================================================
    tl.to(overlay, {
      opacity: 0,
      duration: 1.0,
      ease: "power2.inOut",
    }, 4.5);

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
      {/* ---- Light Beam (thin bright line) ---- */}
      <div
        ref={beamRef}
        className="absolute top-1/2 left-0 -translate-y-1/2"
        style={{
          width: "100vw",
          height: 3,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 30%, rgba(201,168,76,0.8) 47%, rgba(255,255,255,0.95) 50%, rgba(201,168,76,0.8) 53%, rgba(255,255,255,0) 70%, transparent 100%)",
          zIndex: 10,
        }}
      />

      {/* ---- Beam Glow (soft spread behind beam) ---- */}
      <div
        ref={beamGlowRef}
        className="absolute top-1/2 left-0 -translate-y-1/2"
        style={{
          width: "100vw",
          height: 28,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0) 25%, rgba(201,168,76,0.15) 45%, rgba(255,255,255,0.12) 50%, rgba(201,168,76,0.15) 55%, rgba(255,255,255,0) 75%, transparent 100%)",
          filter: "blur(10px)",
          zIndex: 9,
        }}
      />

      {/* ---- Lingering Trail (fades over 2s) ---- */}
      <div
        ref={trailRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 w-full"
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent 5%, rgba(201,168,76,0.25) 20%, rgba(201,168,76,0.4) 50%, rgba(201,168,76,0.25) 80%, transparent 95%)",
          opacity: 0,
          zIndex: 8,
        }}
      />

      {/* ---- Text Container (centered) ---- */}
      <div
        ref={textContainerRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ zIndex: 20 }}
      >
        {/* Glow background behind text — radial gradient */}
        <div
          ref={glowBgRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 700,
            height: 400,
            background:
              "radial-gradient(circle, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.06) 40%, transparent 60%)",
            opacity: 0,
            zIndex: -1,
          }}
        />

        {/* Actual text — letter by letter, 120px desktop / 60px mobile */}
        <h1
          className="font-cormorant text-[60px] md:text-[120px] font-normal uppercase select-none whitespace-nowrap"
          style={{ letterSpacing: "0.12em", color: "#C9A84C" }}
        >
          {LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => {
                lettersRef.current[i] = el;
              }}
              className="inline-block"
              style={{
                opacity: 0,
                willChange: "transform, filter, opacity",
                textShadow: "none",
              }}
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

      {/* ---- Skip Button (appears at 1.0s) ---- */}
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
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.25")}
        data-cursor="pointer"
      >
        Skip
      </button>
    </div>
  );
}
