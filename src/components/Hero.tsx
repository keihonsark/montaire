"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DiamondCaustics from "@/components/DiamondCaustics";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power2.out" }
      );

      gsap.to(titleRef.current, {
        y: -150,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "40% top",
          scrub: true,
        },
      });

      gsap.to(taglineRef.current, {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "35% top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(26, 26, 26, 0.5) 0%, #0A0A0A 70%)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
          zIndex: 2,
        }}
      />

      <div className="ambient-glow ambient-glow-gold" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)', zIndex: 1 }} />

      <DiamondCaustics variant="default" />

      {/* Content */}
      <div className="relative text-center" style={{ zIndex: 3 }}>
        <h1
          ref={titleRef}
          className="gradient-text font-bodoni text-[48px] md:text-[80px] lg:text-[100px] font-normal"
          style={{
            letterSpacing: "0.1em",
            willChange: "transform, opacity",
          }}
        >
          MONTAIRE
        </h1>
        <p
          ref={taglineRef}
          className="font-outfit text-[13px] uppercase mt-6"
          style={{
            letterSpacing: "0.2em",
            color: "var(--montaire-gold)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        >
          Fine jewelry, made yours
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2" style={{ zIndex: 3 }}>
        <div
          className="w-[1px] h-[40px] overflow-hidden"
          style={{ backgroundColor: "rgba(201, 168, 76, 0.15)" }}
        >
          <div
            className="w-full h-full scroll-indicator-line"
            style={{ backgroundColor: "var(--montaire-gold)" }}
          />
        </div>
      </div>
    </section>
  );
}
