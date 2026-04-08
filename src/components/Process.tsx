"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "Consultation",
    description: "Share your vision — a sketch, a photo, a feeling. We listen, refine, and plan every detail together.",
    image: "/images/process/sketch.jpg",
  },
  {
    number: "02",
    title: "Design",
    description: "Our master jewelers translate your vision into precise technical blueprints and CAD specifications.",
    image: "/images/process/specs.jpg",
  },
  {
    number: "03",
    title: "Craft",
    description: "Your piece comes to life — 3D modeled, cast, set, and polished by hand in our California workshop.",
    image: "/images/process/render.jpg",
  },
  {
    number: "04",
    title: "Deliver",
    description: "The finished piece, exactly as you imagined — presented, insured, and ready for its moment.",
    image: "/images/process/final.png",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: titleRef.current, start: "top 80%", toggleActions: "play none none none" },
          }
        );
      }

      // Cards stagger animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".process-card");
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: cardsRef.current, start: "top 75%", toggleActions: "play none none none" },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="px-6 md:px-10 py-20 md:py-32">
      {/* Section title */}
      <div ref={titleRef} className="text-center mb-16 md:mb-20">
        <p
          className="font-outfit text-[11px] uppercase mb-4"
          style={{ letterSpacing: "0.25em", color: "#C9A84C" }}
        >
          Our Process
        </p>
        <h2
          className="font-bodoni text-[32px] md:text-[48px] font-normal"
          style={{ color: "#F5F5F0" }}
        >
          From vision to reality
        </h2>
      </div>

      {/* Horizontal scrollable on mobile, 4-column grid on desktop */}
      <div
        ref={cardsRef}
        className="flex gap-6 overflow-x-auto md:overflow-visible md:grid md:grid-cols-4 pb-4 md:pb-0 max-w-[1200px] mx-auto"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {STEPS.map((step, i) => (
          <div
            key={step.number}
            className="process-card flex-shrink-0 w-[280px] md:w-auto flex flex-col"
            style={{ scrollSnapAlign: "start" }}
          >
            {/* Image container */}
            <div
              className="relative overflow-hidden mb-6 group"
              style={{
                aspectRatio: "3/4",
                backgroundColor: "#000000",
              }}
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{
                  filter: i < 3 ? "grayscale(0.3) brightness(0.85)" : "none",
                }}
              />
              {/* Dark overlay gradient for consistency */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)",
                }}
              />
              {/* Step number overlay */}
              <span
                className="absolute top-4 left-4 font-bodoni text-[14px]"
                style={{ color: "rgba(201, 168, 76, 0.6)" }}
              >
                {step.number}
              </span>
            </div>

            {/* Thin gold line */}
            <div
              className="mb-4"
              style={{ width: 30, height: 1, backgroundColor: "rgba(201, 168, 76, 0.4)" }}
            />

            {/* Text */}
            <h3
              className="font-bodoni text-[22px] md:text-[26px] font-normal mb-2"
              style={{ color: "#F5F5F0" }}
            >
              {step.title}
            </h3>
            <p
              className="font-outfit text-[13px] md:text-[14px] font-light leading-[1.7]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {step.description}
            </p>

            {/* Connecting line between cards (desktop only, not on last card) */}
            {i < STEPS.length - 1 && (
              <div className="hidden md:block absolute" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
