"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import DiamondMesh from "./DiamondMesh";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

function ScrollFadeDiamond() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    // Scale and fade based on scroll position
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const progress = Math.min(scrollY / vh, 1);
    const scale = 1 + progress * 0.3;
    const opacity = 1 - progress;

    groupRef.current.scale.set(scale, scale, scale);
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).material && "opacity" in (child as THREE.Mesh).material) {
        ((child as THREE.Mesh).material as THREE.MeshPhysicalMaterial).opacity = opacity * 0.85;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <DiamondMesh rotationSpeed={0.2} floatAmplitude={0.15} floatSpeed={1.0} scale={2.2} opacity={0.85} />
    </group>
  );
}

export default function HeroDiamond() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY < window.innerHeight * 1.2);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <Canvas
      camera={{ position: [0, 0.3, 4.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      frameloop="always"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
    >
      <ScrollFadeDiamond />
    </Canvas>
  );
}
