"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { NAV_ITEMS } from "@/lib/constants";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const isAnimating = useRef(false);

  const openMenu = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setIsOpen(true);

    const overlay = overlayRef.current;
    if (!overlay) return;

    overlay.style.visibility = "visible";
    overlay.style.pointerEvents = "auto";
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => { isAnimating.current = false; },
    });

    tl.fromTo(overlay, { xPercent: 100 }, { xPercent: 0, duration: 0.6, ease: "power3.inOut" })
      .fromTo(
        itemsRef.current.filter(Boolean),
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" },
        "-=0.2"
      );
  }, []);

  const closeMenu = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setIsOpen(false);
        overlay.style.visibility = "hidden";
        overlay.style.pointerEvents = "none";
        document.body.style.overflow = "";
      },
    });

    tl.to(itemsRef.current.filter(Boolean), {
      x: 60, opacity: 0, duration: 0.3, stagger: 0.04, ease: "power2.in",
    }).to(overlay, { xPercent: 100, duration: 0.5, ease: "power3.inOut" }, "-=0.1");
  }, []);

  const handleNavClick = useCallback(
    (href: string) => {
      closeMenu();
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 700);
    },
    [closeMenu]
  );

  useEffect(() => {
    if (overlayRef.current) {
      overlayRef.current.style.visibility = "hidden";
      overlayRef.current.style.pointerEvents = "none";
      gsap.set(overlayRef.current, { xPercent: 100 });
    }
  }, []);

  return (
    <>
      <button
        onClick={isOpen ? closeMenu : openMenu}
        className="fixed top-8 right-8 z-[300] w-8 h-8 flex flex-col items-end justify-center"
        data-cursor="pointer"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <span
          className="block h-[1px] bg-montaire-gold transition-all duration-300 origin-center"
          style={{
            width: "100%",
            transform: isOpen ? "translateY(3.5px) rotate(45deg)" : "translateY(0) rotate(0)",
          }}
        />
        <span
          className="block h-[1px] bg-montaire-gold transition-all duration-300 mt-[6px]"
          style={{ width: isOpen ? 0 : "75%", opacity: isOpen ? 0 : 1 }}
        />
        <span
          className="block h-[1px] bg-montaire-gold transition-all duration-300 origin-center mt-[6px]"
          style={{
            width: isOpen ? "100%" : "50%",
            transform: isOpen ? "translateY(-9.5px) rotate(-45deg)" : "translateY(0) rotate(0)",
          }}
        />
      </button>

      <div ref={overlayRef} data-lenis-prevent className="fixed inset-0 z-[200]" style={{ backgroundColor: "#000000" }}>
        <nav className="flex flex-col items-center justify-center h-full gap-8 md:gap-10">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.label}
              ref={(el) => { itemsRef.current[i] = el; }}
              href={item.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
              className="group relative font-bodoni text-3xl md:text-[56px] hover:text-montaire-gold transition-colors duration-300 min-h-[44px] flex items-center"
              data-cursor="pointer"
              style={{ color: "#F5F5F0", opacity: 0 }}
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
