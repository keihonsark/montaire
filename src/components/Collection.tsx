"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COLLECTION_ITEMS } from "@/lib/constants";
import LightCaustics from "./LightCaustics";

gsap.registerPlugin(ScrollTrigger);

export default function Collection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [currentPanel, setCurrentPanel] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Title animation
  useEffect(() => {
    if (!titleRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  // Horizontal scroll-jack (desktop only)
  useEffect(() => {
    if (isMobile) return;
    if (!pinRef.current || !trackRef.current) return;

    const panels = COLLECTION_ITEMS.length;
    const totalWidth = panels * window.innerWidth;

    const ctx = gsap.context(() => {
      const scrollTween = gsap.to(trackRef.current, {
        x: -(totalWidth - window.innerWidth),
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: () => "+=" + (totalWidth - window.innerWidth),
        pin: true,
        scrub: 1,
        animation: scrollTween,
        onUpdate: (self) => {
          const prog = self.progress;
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${prog * 100}%`;
          }
          setCurrentPanel(Math.min(panels, Math.floor(prog * panels) + 1));
        },
      });

      // Panel content stagger animations
      COLLECTION_ITEMS.forEach((_, i) => {
        const panelEl = document.querySelector(`[data-panel="${i}"]`);
        if (!panelEl) return;

        const info = panelEl.querySelector(".panel-info");
        if (!info) return;
        const children = info.children;

        gsap.fromTo(
          children,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.08,
            ease: "power2.out",
            duration: 0.5,
            scrollTrigger: {
              trigger: panelEl,
              start: "left 80%",
              toggleActions: "play none none reverse",
              containerAnimation: scrollTween,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section ref={sectionRef} id="collection" className="relative">
      <LightCaustics opacity={0.7} />

      {/* Title Area — scrolls normally */}
      <div
        ref={titleRef}
        className="py-24 md:py-32 text-center relative"
        style={{ zIndex: 2, opacity: 0 }}
      >
        <p
          className="font-outfit text-[11px] uppercase mb-4"
          style={{ letterSpacing: "0.25em", color: "#C9A84C" }}
        >
          Curated Pieces
        </p>
        <h2
          className="font-cormorant text-[36px] md:text-[56px] font-normal"
          style={{ color: "#F5F5F0" }}
        >
          The Collection
        </h2>
      </div>

      {/* Horizontal scroll area */}
      {isMobile ? (
        /* Mobile: native horizontal scroll with snap */
        <div
          className="overflow-x-auto relative"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            zIndex: 2,
          }}
        >
          <div className="flex" style={{ width: `${COLLECTION_ITEMS.length * 100}vw` }}>
            {COLLECTION_ITEMS.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-screen px-6 py-12 flex flex-col gap-8"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Image placeholder */}
                <div
                  className="w-full flex items-center justify-center"
                  style={{
                    aspectRatio: "3/4",
                    maxHeight: "50vh",
                    backgroundColor: "#1A1A1A",
                    border: "0.5px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p className="font-outfit text-[12px] uppercase" style={{ color: "rgba(255,255,255,0.15)", letterSpacing: "0.15em" }}>
                    Product Photo {i + 1}
                  </p>
                </div>
                {/* Info */}
                <div className="flex flex-col gap-3">
                  <p className="font-outfit text-[11px] uppercase" style={{ letterSpacing: "0.2em", color: "#C9A84C" }}>
                    {item.category}
                  </p>
                  <h3 className="font-cormorant text-[28px] font-normal" style={{ color: "#F5F5F0" }}>
                    {item.name}
                  </h3>
                  <p className="font-outfit text-[14px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {item.description}
                  </p>
                  <p className="font-outfit text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {item.specs}
                  </p>
                  <p className="font-outfit text-[16px] mt-1" style={{ color: "#C9A84C" }}>
                    {item.price}
                  </p>
                  <button
                    className="mt-2 w-fit px-6 py-2.5 font-outfit text-[12px] uppercase border transition-all duration-300 hover:bg-montaire-gold hover:text-black"
                    style={{ letterSpacing: "0.15em", borderColor: "#C9A84C", color: "#C9A84C" }}
                    data-cursor="pointer"
                  >
                    Inquire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Desktop: GSAP scroll-jack pinned gallery */
        <div ref={pinRef} className="relative overflow-hidden" style={{ zIndex: 2 }}>
          <div
            ref={trackRef}
            className="flex h-screen"
            style={{ width: `${COLLECTION_ITEMS.length * 100}vw` }}
          >
            {COLLECTION_ITEMS.map((item, i) => (
              <div
                key={i}
                data-panel={i}
                className="flex-shrink-0 w-screen h-full flex items-center"
                style={{ paddingLeft: "5vw", paddingRight: "5vw" }}
              >
                {/* Left: Product image (55%) */}
                <div className="w-[55%] flex justify-center pr-[3vw]">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: "100%",
                      maxWidth: 500,
                      aspectRatio: "3/4",
                      maxHeight: "70vh",
                      backgroundColor: "#1A1A1A",
                      border: "0.5px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <p
                      className="font-outfit text-[13px] uppercase"
                      style={{ color: "rgba(255,255,255,0.12)", letterSpacing: "0.15em" }}
                    >
                      Product Photo {i + 1}
                    </p>
                  </div>
                </div>

                {/* Right: Product info (35%) */}
                <div className="panel-info w-[35%] flex flex-col gap-4 pl-[2vw]">
                  <p
                    className="font-outfit text-[11px] uppercase"
                    style={{ letterSpacing: "0.2em", color: "#C9A84C" }}
                  >
                    {item.category}
                  </p>
                  <h3
                    className="font-cormorant text-[36px] font-normal leading-tight"
                    style={{ color: "#F5F5F0" }}
                  >
                    {item.name}
                  </h3>
                  <p
                    className="font-outfit text-[15px] font-light leading-[1.7] max-w-[360px]"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {item.description}
                  </p>
                  <p
                    className="font-outfit text-[12px]"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {item.specs}
                  </p>
                  <p className="font-outfit text-[16px] mt-1" style={{ color: "#C9A84C" }}>
                    {item.price}
                  </p>
                  <button
                    className="mt-3 w-fit px-8 py-3 font-outfit text-[12px] uppercase border transition-all duration-300 hover:bg-montaire-gold hover:text-black"
                    style={{ letterSpacing: "0.15em", borderColor: "#C9A84C", color: "#C9A84C" }}
                    data-cursor="pointer"
                  >
                    Inquire
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Progress indicator */}
          <div
            className="absolute bottom-8 left-[5vw] right-[5vw] flex items-center gap-4"
            style={{ zIndex: 10 }}
          >
            <div className="flex-1 h-[1px] relative" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <div
                ref={progressBarRef}
                className="absolute top-0 left-0 h-full transition-[width] duration-100"
                style={{ backgroundColor: "#C9A84C", width: "0%" }}
              />
            </div>
            <p className="font-outfit text-[12px] tabular-nums" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
              {String(currentPanel).padStart(2, "0")} / {String(COLLECTION_ITEMS.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
