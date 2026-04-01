"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Tagline fade in
      gsap.fromTo(
        taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power2.out" }
      );

      // Parallax scroll-out for title
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

      // Tagline fade out on scroll
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
      {/* Background radial gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(26, 26, 26, 0.5) 0%, #0A0A0A 70%)",
        }}
      />

      {/* Subtle gold ambient particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 2,
              height: 2,
              backgroundColor: "rgba(201, 168, 76, 0.3)",
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
        <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0px) scale(1); opacity: 0.2; }
            100% { transform: translateY(-30px) scale(1.5); opacity: 0.5; }
          }
        `}</style>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1
          ref={titleRef}
          className="gradient-text font-cormorant text-[48px] md:text-[80px] lg:text-[100px] font-normal"
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
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
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
