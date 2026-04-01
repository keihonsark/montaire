"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCENE_IDS } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    SCENE_IDS.forEach((id, index) => {
      const el = document.getElementById(id);
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[90] hidden md:flex flex-col gap-3">
      {SCENE_IDS.map((id, index) => (
        <button
          key={id}
          onClick={() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          className="w-[6px] h-[6px] rounded-full transition-all duration-300"
          style={{
            backgroundColor:
              index === activeIndex
                ? "var(--montaire-gold)"
                : "rgba(255, 255, 255, 0.2)",
            transform: index === activeIndex ? "scale(1.5)" : "scale(1)",
          }}
          aria-label={`Scroll to ${id}`}
          data-cursor="pointer"
        />
      ))}
    </div>
  );
}
