"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // On-load animations
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0, delay: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        taglineRef.current,
        { opacity: 0 },
        { opacity: 0.7, duration: 0.8, delay: 1.2, ease: "power2.out" }
      );

      // Scroll parallax
      gsap.to(contentRef.current, {
        y: -120,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "40% top",
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
      style={{ background: "#0A0A0A" }}
    >
      <div ref={contentRef} className="flex flex-col items-center" style={{ willChange: "transform, opacity" }}>
        {/* Wordmark + Reflection container */}
        <div ref={titleRef} className="flex flex-col items-center" style={{ opacity: 0 }}>
          {/* Main wordmark */}
          <h1
            className="gradient-text font-bodoni text-[56px] md:text-[90px] lg:text-[120px] xl:text-[140px] font-normal uppercase select-none"
            style={{
              letterSpacing: "0.12em",
              lineHeight: 1,
            }}
          >
            MONTAIRE
          </h1>

          {/* Reflective surface line */}
          <div
            className="w-full max-w-[600px] mx-auto"
            style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent 0%, rgba(201, 168, 76, 0.2) 20%, rgba(255, 255, 255, 0.15) 50%, rgba(201, 168, 76, 0.2) 80%, transparent 100%)",
              marginTop: "4px",
            }}
          />

          {/* Reflection text */}
          <div
            className="relative overflow-hidden select-none pointer-events-none"
            aria-hidden="true"
            style={{
              height: "80px",
              marginTop: "2px",
            }}
          >
            <p
              className="font-bodoni text-[56px] md:text-[90px] lg:text-[120px] xl:text-[140px] font-normal uppercase"
              style={{
                letterSpacing: "0.12em",
                lineHeight: 1,
                transform: "scaleY(-1)",
                background: "linear-gradient(90deg, #C9A84C 0%, #C9A84C 35%, #FFFFFF 48%, #F5F5F0 50%, #FFFFFF 52%, #C9A84C 65%, #C9A84C 100%)",
                backgroundSize: "300% auto",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 80%)",
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 80%)",
                filter: "blur(0.5px)",
              }}
            >
              MONTAIRE
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-outfit text-[11px] md:text-[13px] uppercase mt-10"
          style={{
            letterSpacing: "0.3em",
            color: "var(--montaire-gold)",
            opacity: 0,
          }}
        >
          Fine Jewelry, Made Yours
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
