'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BlueprintBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll('.blueprint-line');
    const circles = svgRef.current.querySelectorAll('.blueprint-circle');

    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength?.() || 300;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      });
    });

    circles.forEach((circle) => {
      gsap.set(circle, { scale: 0, transformOrigin: 'center center', opacity: 0 });
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: svgRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });

      paths.forEach((path, i) => {
        tl.to(path, {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 2,
          ease: 'power2.inOut',
        }, i * 0.3);
      });

      circles.forEach((circle, i) => {
        tl.to(circle, {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
        }, 0.5 + i * 0.4);
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 600"
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[60%] h-auto opacity-[0.06] pointer-events-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ring band - main circle */}
      <ellipse className="blueprint-circle" cx="400" cy="300" rx="180" ry="200" stroke="#C9A84C" strokeWidth="0.8" />

      {/* Ring band - inner circle */}
      <ellipse className="blueprint-circle" cx="400" cy="300" rx="155" ry="175" stroke="#C9A84C" strokeWidth="0.5" />

      {/* Center stone outline - octagon shape */}
      <path className="blueprint-line" d="M370 180 L430 180 L460 200 L460 240 L430 260 L370 260 L340 240 L340 200 Z" stroke="#C9A84C" strokeWidth="0.8" />

      {/* Stone facet lines */}
      <path className="blueprint-line" d="M400 180 L400 260" stroke="#C9A84C" strokeWidth="0.3" />
      <path className="blueprint-line" d="M340 220 L460 220" stroke="#C9A84C" strokeWidth="0.3" />
      <path className="blueprint-line" d="M370 180 L430 260" stroke="#C9A84C" strokeWidth="0.3" />
      <path className="blueprint-line" d="M430 180 L370 260" stroke="#C9A84C" strokeWidth="0.3" />

      {/* Prong lines */}
      <path className="blueprint-line" d="M370 180 L360 160 L355 170" stroke="#C9A84C" strokeWidth="0.5" />
      <path className="blueprint-line" d="M430 180 L440 160 L445 170" stroke="#C9A84C" strokeWidth="0.5" />
      <path className="blueprint-line" d="M370 260 L360 280 L355 270" stroke="#C9A84C" strokeWidth="0.5" />
      <path className="blueprint-line" d="M430 260 L440 280 L445 270" stroke="#C9A84C" strokeWidth="0.5" />

      {/* Dimension lines - horizontal */}
      <path className="blueprint-line" d="M280 140 L520 140" stroke="#C9A84C" strokeWidth="0.3" strokeDasharray="4 4" />
      <path className="blueprint-line" d="M280 460 L520 460" stroke="#C9A84C" strokeWidth="0.3" strokeDasharray="4 4" />

      {/* Dimension lines - vertical */}
      <path className="blueprint-line" d="M560 100 L560 500" stroke="#C9A84C" strokeWidth="0.3" strokeDasharray="4 4" />
      <path className="blueprint-line" d="M240 100 L240 500" stroke="#C9A84C" strokeWidth="0.3" strokeDasharray="4 4" />

      {/* Dimension arrows */}
      <path className="blueprint-line" d="M280 140 L280 460" stroke="#C9A84C" strokeWidth="0.3" />
      <path className="blueprint-line" d="M520 140 L520 460" stroke="#C9A84C" strokeWidth="0.3" />

      {/* Cross center marks */}
      <path className="blueprint-line" d="M390 300 L410 300" stroke="#C9A84C" strokeWidth="0.5" />
      <path className="blueprint-line" d="M400 290 L400 310" stroke="#C9A84C" strokeWidth="0.5" />

      {/* Side view - small ring profile */}
      <path className="blueprint-line" d="M650 250 L650 350 C650 370 680 370 680 350 L680 250 C680 230 650 230 650 250" stroke="#C9A84C" strokeWidth="0.5" />
      <path className="blueprint-line" d="M645 240 L685 240" stroke="#C9A84C" strokeWidth="0.3" />
      <path className="blueprint-line" d="M655 235 L660 220 L670 220 L675 235" stroke="#C9A84C" strokeWidth="0.5" />

      {/* Measurement text placeholders - small lines representing text */}
      <path className="blueprint-line" d="M255 295 L265 295" stroke="#C9A84C" strokeWidth="0.3" />
      <path className="blueprint-line" d="M255 305 L270 305" stroke="#C9A84C" strokeWidth="0.3" />

      {/* Corner detail circles */}
      <circle className="blueprint-circle" cx="280" cy="140" r="3" stroke="#C9A84C" strokeWidth="0.5" />
      <circle className="blueprint-circle" cx="520" cy="140" r="3" stroke="#C9A84C" strokeWidth="0.5" />
      <circle className="blueprint-circle" cx="280" cy="460" r="3" stroke="#C9A84C" strokeWidth="0.5" />
      <circle className="blueprint-circle" cx="520" cy="460" r="3" stroke="#C9A84C" strokeWidth="0.5" />
    </svg>
  );
}
