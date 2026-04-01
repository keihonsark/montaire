"use client";

import { useEffect, useRef } from "react";

interface LightCausticsProps {
  opacity?: number;
}

interface CausticBlob {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  angle: number;
  speed: number;
  orbitRadius: number;
  orbitCenterX: number;
  orbitCenterY: number;
  wobbleFreqX: number;
  wobbleFreqY: number;
  opacity: number;
  baseOpacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  isCool: boolean;
}

export default function LightCaustics({ opacity = 1 }: LightCausticsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const visibleRef = useRef(false);
  const blobsRef = useRef<CausticBlob[]>([]);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    resize();

    // Create blobs
    const w = canvas.parentElement!.clientWidth;
    const h = canvas.parentElement!.clientHeight;

    blobsRef.current = Array.from({ length: 4 }, (_, i) => ({
      x: 0,
      y: 0,
      radius: 0,
      baseRadius: 150 + Math.random() * 200,
      angle: Math.random() * Math.PI * 2,
      speed: 0.0002 + Math.random() * 0.0003,
      orbitRadius: 100 + Math.random() * 200,
      orbitCenterX: w * (0.2 + Math.random() * 0.6),
      orbitCenterY: h * (0.2 + Math.random() * 0.6),
      wobbleFreqX: 0.3 + Math.random() * 0.4,
      wobbleFreqY: 0.2 + Math.random() * 0.3,
      opacity: 0,
      baseOpacity: 0.03 + Math.random() * 0.02,
      pulseSpeed: 0.001 + Math.random() * 0.001,
      pulsePhase: Math.random() * Math.PI * 2,
      isCool: i === 0,
    }));

    // IntersectionObserver to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const animate = (time: number) => {
      animRef.current = requestAnimationFrame(animate);

      // Throttle to ~30fps
      if (time - lastFrameRef.current < 33) return;
      lastFrameRef.current = time;

      if (!visibleRef.current) return;

      const cw = canvas.parentElement!.clientWidth;
      const ch = canvas.parentElement!.clientHeight;

      ctx.clearRect(0, 0, cw, ch);

      blobsRef.current.forEach((blob) => {
        blob.angle += blob.speed * 33;
        const pulse = Math.sin(time * blob.pulseSpeed + blob.pulsePhase);

        blob.x =
          blob.orbitCenterX +
          Math.cos(blob.angle) * blob.orbitRadius +
          Math.sin(blob.angle * blob.wobbleFreqX) * 50;
        blob.y =
          blob.orbitCenterY +
          Math.sin(blob.angle) * blob.orbitRadius +
          Math.cos(blob.angle * blob.wobbleFreqY) * 40;
        blob.radius = blob.baseRadius + pulse * 30;
        blob.opacity = (blob.baseOpacity + pulse * 0.015) * opacity;

        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.radius
        );

        if (blob.isCool) {
          gradient.addColorStop(0, `rgba(200, 220, 255, ${blob.opacity})`);
          gradient.addColorStop(0.5, `rgba(200, 220, 255, ${blob.opacity * 0.4})`);
        } else {
          gradient.addColorStop(0, `rgba(255, 255, 255, ${blob.opacity})`);
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${blob.opacity * 0.4})`);
        }
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    animRef.current = requestAnimationFrame(animate);

    const resizeHandler = () => resize();
    window.addEventListener("resize", resizeHandler);

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
      window.removeEventListener("resize", resizeHandler);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
