"use client";

import { Canvas } from "@react-three/fiber";
import DiamondMesh from "./DiamondMesh";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import * as THREE from "three";

interface IntroDiamondProps {
  onReady?: () => void;
}

function AnimatedDiamond({ onReady }: IntroDiamondProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    // Start invisible
    groupRef.current.scale.set(0, 0, 0);
    groupRef.current.traverse((child) => {
      if ((child as THREE.Mesh).material) {
        ((child as THREE.Mesh).material as THREE.MeshPhysicalMaterial).opacity = 0;
      }
    });

    // Fade in and scale up at 1.0s
    const tl = gsap.timeline({ delay: 1.0, onStart: onReady });
    tl.to(groupRef.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.5,
      ease: "power2.out",
    });

    return () => { tl.kill(); };
  }, [onReady]);

  return (
    <group ref={groupRef}>
      <DiamondMesh rotationSpeed={0.3} floatAmplitude={0} floatSpeed={0} scale={1.8} />
    </group>
  );
}

export default function IntroDiamond() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: "absolute", inset: 0 }}
    >
      <AnimatedDiamond />
    </Canvas>
  );
}
