"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // On-load animations
      gsap.fromTo(
        titleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1.2, delay: 0.5, ease: "power2.out" }
      );

      gsap.fromTo(
        taglineRef.current,
        { opacity: 0 },
        { opacity: 0.7, duration: 0.6, delay: 1.0, ease: "power2.out" }
      );

      // Scroll parallax — entire content moves up and fades
      gsap.to(contentRef.current, {
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
        {/* Wordmark */}
        <h1
          ref={titleRef}
          className="gradient-text font-bodoni text-[40px] md:text-[64px] lg:text-[80px] font-normal uppercase"
          style={{
            letterSpacing: "0.12em",
            opacity: 0,
          }}
        >
          MONTAIRE
        </h1>

        {/* Hero image */}
        <div
          ref={imageRef}
          className="relative mt-4"
          style={{ opacity: 0 }}
        >
          <img
            src="/images/gallery/ring2.png"
            alt="Montaire fine jewelry"
            className="block mx-auto"
            style={{
              maxHeight: "45vh",
              width: "auto",
              objectFit: "contain",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 75%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 75%, transparent 100%)",
            }}
          />
          {/* Reflection */}
          <img
            src="/images/gallery/ring2.png"
            alt=""
            aria-hidden="true"
            className="block mx-auto"
            style={{
              maxHeight: "15vh",
              width: "auto",
              transform: "scaleY(-1)",
              opacity: 0.12,
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 60%)",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 60%)",
              marginTop: -2,
            }}
          />
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-outfit text-[12px] uppercase mt-4"
          style={{
            letterSpacing: "0.25em",
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
