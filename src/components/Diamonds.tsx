"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SHAPES = [
  { name: "Round", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" },
  { name: "Oval", path: "M12 2C8 2 4 6 4 12s4 10 8 10 8-4 8-10S16 2 12 2z" },
  { name: "Emerald", path: "M6 4h12l2 3v10l-2 3H6l-2-3V7l2-3z" },
  { name: "Cushion", path: "M6 3Q2 3 2 7v10q0 4 4 4h12q4 0 4-4V7q0-4-4-4H6z" },
];

export default function Diamonds() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none none" },
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    try {
      const res = await fetch("https://formspree.io/f/xpqodbdv", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _source: "montaire-diamond-notify", email }),
      });
      if (res.ok) setSubmitted(true);
      else setError("Something went wrong. Please try again.");
    } catch { setError("Network error. Please try again."); }
  };

  return (
    <section ref={sectionRef} id="diamonds" className="relative flex items-center justify-center px-6" style={{ minHeight: "100dvh" }}>
      <div ref={contentRef} className="text-center max-w-lg relative" style={{ opacity: 0 }}>
        <h2 className="gradient-text font-bodoni text-[36px] md:text-[48px] font-normal">
          Your Perfect Stone
        </h2>
        <p className="font-outfit text-[15px] md:text-[16px] font-light leading-relaxed mt-6" style={{ color: "rgba(255,255,255,0.4)" }}>
          Sourced from the world&apos;s finest diamond houses. Our certified diamond search is coming soon.
        </p>

        {submitted ? (
          <p className="font-outfit text-[15px] mt-8" style={{ color: "#C9A84C" }}>We&apos;ll notify you when it launches.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 mt-10 max-w-sm mx-auto">
            <input type="email" name="email" required placeholder="Your email" className="flex-1 bg-transparent border-b border-white/10 py-2.5 font-outfit text-[14px] text-montaire-white placeholder:text-white/25 focus:outline-none focus:border-montaire-gold transition-colors" />
            <button
              type="submit"
              className="px-5 py-2.5 font-outfit text-[12px] uppercase border transition-all duration-300 hover:bg-[rgba(201,168,76,0.1)] hover:border-montaire-gold-light active:scale-[0.98]"
              style={{ letterSpacing: "0.15em", borderColor: "#C9A84C", color: "#C9A84C" }}
              data-cursor="pointer"
            >
              Notify Me
            </button>
          </form>
        )}

        {error && <p className="font-outfit text-[13px] mt-3" style={{ color: "#E57373" }}>{error}</p>}

        {/* Diamond shape outlines */}
        <div className="flex justify-center gap-8 mt-10">
          {SHAPES.map((shape) => (
            <div key={shape.name} className="group flex flex-col items-center gap-2" data-cursor="pointer">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="transition-colors duration-300">
                <path d={shape.path} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" fill="none" className="group-hover:stroke-[#C9A84C] transition-colors duration-300" />
              </svg>
              <span className="font-outfit text-[10px] uppercase transition-colors duration-300" style={{ letterSpacing: "0.1em", color: "rgba(255,255,255,0.15)" }}>
                {shape.name}
              </span>
            </div>
          ))}
        </div>

        <p className="font-outfit text-[12px] uppercase mt-8" style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)" }}>
          GIA Certified · Ethically Sourced · Global Inventory
        </p>
      </div>
    </section>
  );
}
