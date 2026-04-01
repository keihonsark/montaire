"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import DiamondMesh from "./DiamondMesh";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

function ScrollFadeDiamond() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const progress = Math.min(scrollY / vh, 1);
    const s = 1 + progress * 0.3;
    groupRef.current.scale.set(s, s, s);
    // Fade the group visibility via material opacity
    groupRef.current.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        if ('opacity' in mat) {
          mat.opacity = (1 - progress) * 0.9;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      <DiamondMesh scale={2.5} rotationSpeed={0.2} floatAmplitude={0.15} floatSpeed={1.0} />
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
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
      frameloop="always"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
    >
      <ScrollFadeDiamond />
    </Canvas>
  );
}
