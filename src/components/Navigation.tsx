"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { NAV_ITEMS } from "@/lib/constants";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLAnchorElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    const tl = gsap.timeline({ paused: true });

    tl.fromTo(
      overlayRef.current,
      { xPercent: 100 },
      { xPercent: 0, duration: 0.6, ease: "power3.inOut" }
    ).fromTo(
      itemsRef.current,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
      "-=0.2"
    );

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 600);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-8 right-8 z-[100] flex flex-col gap-[6px] items-end"
        data-cursor="pointer"
        aria-label="Open menu"
        style={{ display: isOpen ? "none" : "flex" }}
      >
        <span className="block w-8 h-[1px] bg-montaire-gold" />
        <span className="block w-6 h-[1px] bg-montaire-gold" />
        <span className="block w-4 h-[1px] bg-montaire-gold" />
      </button>

      {/* Fullscreen Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[200] bg-montaire-black flex items-center justify-center"
        style={{ transform: "translateX(100%)" }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-8 right-8 w-8 h-8 flex items-center justify-center"
          data-cursor="pointer"
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <line x1="4" y1="4" x2="20" y2="20" stroke="#C9A84C" strokeWidth="1" />
            <line x1="20" y1="4" x2="4" y2="20" stroke="#C9A84C" strokeWidth="1" />
          </svg>
        </button>

        {/* Nav Items */}
        <nav className="flex flex-col items-center gap-8 md:gap-10">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.label}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className="group relative font-cormorant text-4xl md:text-[56px] text-montaire-white hover:text-montaire-gold transition-colors duration-300"
              data-cursor="pointer"
              style={{ opacity: 0 }}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-montaire-gold transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
