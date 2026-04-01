"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LightCaustics from "./LightCaustics";

gsap.registerPlugin(ScrollTrigger);

export default function Diamonds() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contentRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
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
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="diamonds"
      className="relative min-h-screen flex items-center justify-center px-6"
    >
      <LightCaustics opacity={0.5} />

      <div
        ref={contentRef}
        className="text-center max-w-lg relative"
        style={{ zIndex: 2, opacity: 0 }}
      >
        <h2
          className="gradient-text font-cormorant text-[36px] md:text-[48px] font-normal"
        >
          Your Perfect Stone
        </h2>
        <p
          className="font-outfit text-[15px] md:text-[16px] font-light leading-relaxed mt-6"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Sourced from the world&apos;s finest diamond houses. Our certified
          diamond search is coming soon.
        </p>

        {submitted ? (
          <p className="font-outfit text-[15px] mt-8" style={{ color: "#C9A84C" }}>
            We&apos;ll notify you when it launches.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 mt-10 max-w-sm mx-auto">
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="flex-1 bg-transparent border-b border-white/10 py-2.5 font-outfit text-[14px] text-montaire-white placeholder:text-white/25 focus:outline-none focus:border-montaire-gold transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 font-outfit text-[12px] uppercase border transition-all duration-300 hover:bg-montaire-gold hover:text-black"
              style={{ letterSpacing: "0.15em", borderColor: "#C9A84C", color: "#C9A84C" }}
              data-cursor="pointer"
            >
              Notify Me
            </button>
          </form>
        )}

        {error && (
          <p className="font-outfit text-[13px] mt-3" style={{ color: "#E57373" }}>{error}</p>
        )}

        <p
          className="font-outfit text-[12px] uppercase mt-8"
          style={{ letterSpacing: "0.15em", color: "rgba(255,255,255,0.25)" }}
        >
          GIA Certified · Ethically Sourced · Global Inventory
        </p>
      </div>
    </section>
  );
}
