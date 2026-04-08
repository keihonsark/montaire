"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headline = headlineRef.current;
    const body = bodyRef.current;
    const rule = ruleRef.current;
    if (!headline || !body || !rule) return;

    // SplitType needs DOM access — run after mount
    const split = new SplitType(headline, { types: "words" });

    const ctx = gsap.context(() => {
      const wordsTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      if (split.words) {
        wordsTl.fromTo(
          split.words,
          { y: 25, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
          }
        );
      }

      // Body text fades in after headline
      wordsTl.fromTo(
        body,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        ">-0.2"
      );

      // Gold rule scales in after body
      wordsTl.fromTo(
        rule,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.out" },
        ">-0.2"
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6"
      style={{ paddingTop: 100, paddingBottom: 100, background: 'linear-gradient(180deg, #0A0A0A 0%, #0E0E0E 30%, #0E0E0E 70%, #0A0A0A 100%)' }}
    >
      <div className="ambient-glow ambient-glow-white" style={{ top: '50%', right: '-10%', transform: 'translateY(-50%)' }} />
      <div className="max-w-[800px] w-full text-center">
        <h2
          ref={headlineRef}
          className="font-bodoni text-[28px] md:text-[44px] font-normal leading-[1.2]"
          style={{
            color: "var(--montaire-white)",
            willChange: "transform, opacity, filter",
          }}
        >
          Every piece begins with a conversation.
        </h2>

        <div className="h-6" />

        <p
          ref={bodyRef}
          className="font-outfit text-[15px] md:text-[18px] font-light leading-[1.7]"
          style={{
            color: "rgba(255, 255, 255, 0.5)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        >
          We don&apos;t sell jewelry. We craft meaning — designed around your
          story, your moment, your vision.
        </p>

        <div className="h-10" />

        <div
          ref={ruleRef}
          className="mx-auto"
          style={{
            width: 120,
            height: 1,
            backgroundColor: "var(--montaire-gold)",
            transformOrigin: "center",
            transform: "scaleX(0)",
          }}
        />
      </div>
    </section>
  );
}
