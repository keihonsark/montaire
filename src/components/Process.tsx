"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "Sketch",
    subtitle: "Where it begins",
    description: "Every Montaire piece starts as a hand-drawn concept. Our designers capture your vision in detailed wireframe illustrations — mapping every facet, prong, and curve before a single tool touches metal.",
    image: "/images/process/sketch.png",
  },
  {
    number: "02",
    title: "3D Model",
    subtitle: "Precision engineered",
    description: "Your sketch is translated into a precise 3D CAD model. Every dimension is calculated to the hundredth of a millimeter — ensuring structural integrity, perfect stone fit, and flawless symmetry before production begins.",
    image: "/images/process/cad.png",
  },
  {
    number: "03",
    title: "Finished Piece",
    subtitle: "Brought to life",
    description: "Cast, set, and polished entirely by hand in our California workshop. Certified diamonds are individually selected and placed. The result: a one-of-a-kind piece, exactly as you envisioned it.",
    image: "/images/process/final.png",
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    if (isMobile || !pinRef.current || !trackRef.current) return;

    const panels = STEPS.length;
    const totalWidth = panels * window.innerWidth;

    const ctx = gsap.context(() => {
      const scrollTween = gsap.to(trackRef.current, {
        x: -(totalWidth - window.innerWidth),
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: () => "+=" + (totalWidth - window.innerWidth * 1.15),
        pin: true,
        scrub: 1,
        animation: scrollTween,
        onUpdate: (self) => {
          const prog = self.progress;
          if (progressBarRef.current) progressBarRef.current.style.width = `${prog * 100}%`;
          setCurrentPanel(Math.min(panels, Math.floor(prog * panels) + 1));
        },
      });

      STEPS.forEach((_, i) => {
        const panelEl = document.querySelector(`[data-process-panel="${i}"]`);
        if (!panelEl) return;
        const info = panelEl.querySelector(".process-panel-info");
        if (!info) return;

        gsap.fromTo(
          info.children,
          { x: 30, opacity: 0 },
          {
            x: 0, opacity: 1, stagger: 0.08, ease: "power2.out", duration: 0.5,
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
    <section ref={sectionRef} id="process" style={{ backgroundColor: "#000000" }}>
      {isMobile ? (
        <>
          <div className="pt-20 pb-12 text-center">
            <p className="font-outfit text-[11px] uppercase mb-4" style={{ letterSpacing: "0.25em", color: "#C9A84C" }}>Our Process</p>
            <h2 className="font-bodoni text-[32px] font-normal" style={{ color: "#F5F5F0" }}>From vision to reality</h2>
          </div>
          <div className="overflow-x-auto pb-8" style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}>
            <div className="flex" style={{ width: `${STEPS.length * 100}vw` }}>
              {STEPS.map((step, i) => (
                <div key={i} className="flex-shrink-0 w-screen px-6 py-12 flex flex-col gap-8" style={{ scrollSnapAlign: "start" }}>
                  <div className="w-full overflow-hidden" style={{ aspectRatio: "4/3", backgroundColor: "#000000" }}>
                    <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <p className="font-outfit text-[11px] uppercase" style={{ letterSpacing: "0.2em", color: "#C9A84C" }}>{step.number} — {step.subtitle}</p>
                    <h3 className="font-bodoni text-[28px] font-normal" style={{ color: "#F5F5F0" }}>{step.title}</h3>
                    <p className="font-outfit text-[14px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div ref={pinRef} className="relative h-screen overflow-hidden" style={{ backgroundColor: "#000000" }}>
          {/* Pinned title — always visible at top */}
          <div className="absolute top-0 left-0 right-0 z-10 pt-12 pb-8 text-center" style={{ background: "linear-gradient(to bottom, #000000 0%, #000000 60%, transparent 100%)" }}>
            <p className="font-outfit text-[11px] uppercase mb-3" style={{ letterSpacing: "0.25em", color: "#C9A84C" }}>Our Process</p>
            <h2 className="font-bodoni text-[40px] md:text-[52px] font-normal" style={{ color: "#F5F5F0" }}>From vision to reality</h2>
          </div>

          {/* Horizontal scroll track — panels positioned below title */}
          <div ref={trackRef} className="flex h-full" style={{ width: `${STEPS.length * 100}vw`, paddingTop: "140px" }}>
            {STEPS.map((step, i) => (
              <div
                key={i}
                data-process-panel={i}
                className="flex-shrink-0 w-screen h-full flex items-center relative"
                style={{ paddingLeft: "5vw", paddingRight: "5vw", backgroundColor: "#000000" }}
              >
                {/* Large dim step number */}
                <span
                  className="absolute bottom-16 right-[5vw] font-bodoni select-none pointer-events-none"
                  style={{ fontSize: 180, color: "rgba(255,255,255,0.02)", lineHeight: 1 }}
                >
                  {step.number}
                </span>

                {/* Left: Image */}
                <div className="w-[50%] flex justify-center items-center pr-[2vw]">
                  <div
                    className="overflow-hidden"
                    style={{
                      width: "100%", maxWidth: 550, maxHeight: "55vh",
                      backgroundColor: "transparent",
                    }}
                  >
                    <img src={step.image} alt={step.title} className="w-full h-full object-contain" />
                  </div>
                </div>

                {/* Vertical gold divider */}
                <div
                  className="self-center"
                  style={{ width: 1, height: "35vh", backgroundColor: "rgba(201,168,76,0.2)" }}
                />

                {/* Right: Info */}
                <div className="process-panel-info w-[40%] flex flex-col gap-5 pl-[3vw]">
                  <p className="font-outfit text-[11px] uppercase" style={{ letterSpacing: "0.2em", color: "#C9A84C" }}>{step.number} — {step.subtitle}</p>
                  <h3 className="font-bodoni text-[32px] md:text-[40px] font-normal leading-tight" style={{ color: "#F5F5F0" }}>{step.title}</h3>
                  <p className="font-outfit text-[15px] font-light leading-[1.8] max-w-[380px]" style={{ color: "rgba(255,255,255,0.45)" }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-8 left-[5vw] right-[5vw] flex items-center gap-4" style={{ zIndex: 10 }}>
            <div className="flex-1 h-[1px] relative" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <div ref={progressBarRef} className="absolute top-0 left-0 h-full" style={{ backgroundColor: "#C9A84C", width: "0%", transition: "width 0.1s" }} />
            </div>
            <p className="font-bodoni text-[13px] tabular-nums" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
              {String(currentPanel).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
