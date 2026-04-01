"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COLLECTION_ITEMS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

const PANEL_IMAGES = [
  "/images/gallery/ring1.jpg",
  "/images/gallery/necklace1.jpg",
  "/images/gallery/rings3.jpg",
  "/images/gallery/bracelet1.jpg",
  "/images/gallery/ring2.jpg",
  "/images/gallery/earrings1.jpg",
];

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

  useEffect(() => {
    if (!titleRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: titleRef.current, start: "top 85%", toggleActions: "play none none none" },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isMobile || !pinRef.current || !trackRef.current) return;

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
          if (progressBarRef.current) progressBarRef.current.style.width = `${prog * 100}%`;
          setCurrentPanel(Math.min(panels, Math.floor(prog * panels) + 1));
        },
      });

      COLLECTION_ITEMS.forEach((_, i) => {
        const panelEl = document.querySelector(`[data-panel="${i}"]`);
        if (!panelEl) return;
        const info = panelEl.querySelector(".panel-info");
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

  const btnClass =
    "mt-3 w-fit px-8 py-3.5 font-outfit text-[12px] uppercase border transition-all duration-300 active:scale-[0.98]";
  const btnStyle = {
    letterSpacing: "0.15em",
    borderColor: "rgba(255,255,255,0.2)",
    borderWidth: "0.5px",
    color: "rgba(255,255,255,0.6)",
    backgroundColor: "transparent",
  };

  return (
    <section ref={sectionRef} id="collection" className="relative">
      {/* Title */}
      <div ref={titleRef} className="py-24 md:py-32 text-center" style={{ opacity: 0 }}>
        <p className="font-outfit text-[11px] uppercase mb-4" style={{ letterSpacing: "0.25em", color: "#C9A84C" }}>
          Curated Pieces
        </p>
        <h2 className="font-bodoni text-[36px] md:text-[56px] font-normal" style={{ color: "#F5F5F0" }}>
          The Collection
        </h2>
      </div>

      {isMobile ? (
        <div
          className="overflow-x-auto"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex" style={{ width: `${COLLECTION_ITEMS.length * 100}vw` }}>
            {COLLECTION_ITEMS.map((item, i) => (
              <div key={i} className="flex-shrink-0 w-screen px-6 py-12 flex flex-col gap-8" style={{ scrollSnapAlign: "start" }}>
                <div
                  className="w-full overflow-hidden transition-transform duration-600 hover:scale-[1.02]"
                  style={{ aspectRatio: "3/4", maxHeight: "50vh", backgroundColor: "#1A1A1A", border: "0.5px solid rgba(255,255,255,0.06)" }}
                >
                  <img src={PANEL_IMAGES[i]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="font-outfit text-[11px] uppercase" style={{ letterSpacing: "0.2em", color: "#C9A84C" }}>{item.category}</p>
                  <h3 className="font-bodoni text-[28px] font-normal" style={{ color: "#F5F5F0" }}>{item.name}</h3>
                  <p className="font-outfit text-[14px] font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{item.description}</p>
                  <p className="font-outfit text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>{item.specs}</p>
                  <p className="font-outfit text-[16px] mt-1" style={{ color: "#C9A84C" }}>{item.price}</p>
                  <button className={btnClass} style={btnStyle} data-cursor="pointer">
                    Inquire
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div ref={pinRef} className="relative overflow-hidden">
          <div ref={trackRef} className="flex h-screen" style={{ width: `${COLLECTION_ITEMS.length * 100}vw` }}>
            {COLLECTION_ITEMS.map((item, i) => (
              <div
                key={i}
                data-panel={i}
                className="flex-shrink-0 w-screen h-full flex items-center relative"
                style={{
                  paddingLeft: "5vw",
                  paddingRight: "5vw",
                  background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)",
                }}
              >
                {/* Large dim panel number */}
                <span
                  className="absolute bottom-12 right-[5vw] font-bodoni select-none pointer-events-none"
                  style={{ fontSize: 200, color: "rgba(255,255,255,0.02)", lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Left: Image */}
                <div className="w-[55%] flex justify-center pr-[3vw]">
                  <div
                    className="overflow-hidden transition-transform duration-[600ms] hover:scale-[1.02]"
                    style={{
                      width: "100%", maxWidth: 500, aspectRatio: "3/4", maxHeight: "70vh",
                      backgroundColor: "#1A1A1A", border: "0.5px solid rgba(255,255,255,0.06)",
                    }}
                    data-cursor="pointer"
                  >
                    <img src={PANEL_IMAGES[i]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Vertical gold divider */}
                <div
                  className="self-center"
                  style={{ width: 1, height: "40vh", backgroundColor: "rgba(201,168,76,0.2)" }}
                />

                {/* Right: Info */}
                <div className="panel-info w-[35%] flex flex-col gap-4 pl-[3vw]">
                  <p className="font-outfit text-[11px] uppercase" style={{ letterSpacing: "0.2em", color: "#C9A84C" }}>{item.category}</p>
                  <h3 className="font-bodoni text-[36px] font-normal leading-tight" style={{ color: "#F5F5F0" }}>{item.name}</h3>
                  <p className="font-outfit text-[15px] font-light leading-[1.7] max-w-[360px]" style={{ color: "rgba(255,255,255,0.4)" }}>{item.description}</p>
                  <p className="font-outfit text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>{item.specs}</p>
                  <p className="font-outfit text-[16px] mt-1" style={{ color: "#C9A84C" }}>{item.price}</p>
                  <button
                    className={btnClass}
                    style={btnStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                    data-cursor="pointer"
                  >
                    Inquire
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="absolute bottom-8 left-[5vw] right-[5vw] flex items-center gap-4" style={{ zIndex: 10 }}>
            <div className="flex-1 h-[1px] relative" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
              <div ref={progressBarRef} className="absolute top-0 left-0 h-full" style={{ backgroundColor: "#C9A84C", width: "0%", transition: "width 0.1s" }} />
            </div>
            <p className="font-bodoni text-[13px] tabular-nums" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
              {String(currentPanel).padStart(2, "0")} / {String(COLLECTION_ITEMS.length).padStart(2, "0")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
