"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LightCaustics from "./LightCaustics";

gsap.registerPlugin(ScrollTrigger);

const TRUST_SIGNALS = [
  "GIA Certified Stones",
  "Insured Shipping",
  "Lifetime Warranty",
  "Handcrafted in California",
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      const children = contentRef.current!.children;
      gsap.fromTo(
        children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen flex items-center justify-center px-6"
    >
      <LightCaustics opacity={0.4} />

      <div
        ref={contentRef}
        className="text-center max-w-2xl relative flex flex-col items-center"
        style={{ zIndex: 2 }}
      >
        <p
          className="font-outfit text-[13px] md:text-[14px] uppercase"
          style={{ letterSpacing: "0.2em", color: "#C9A84C" }}
        >
          Montaire was founded on a simple belief:
        </p>

        <h2
          className="font-cormorant text-[36px] md:text-[48px] font-normal mt-4"
          style={{ color: "#F5F5F0" }}
        >
          Fine jewelry should be personal.
        </h2>

        <p
          className="font-outfit text-[15px] md:text-[16px] font-light leading-[1.7] mt-6 max-w-xl"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Every piece we create begins with a conversation and ends with something
          extraordinary. Based in California, we work with clients worldwide to design
          and craft jewelry that tells their story.
        </p>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-16">
          {TRUST_SIGNALS.map((signal) => (
            <p
              key={signal}
              className="font-outfit text-[11px] md:text-[12px] uppercase"
              style={{ letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}
            >
              {signal}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
