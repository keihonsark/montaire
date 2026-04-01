"use client";

import { Canvas } from "@react-three/fiber";
import DiamondMesh from "./DiamondMesh";

export default function DiamondsDiamond() {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      frameloop="always"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}
    >
      <DiamondMesh rotationSpeed={0.15} floatAmplitude={0.1} floatSpeed={0.8} scale={1.2} opacity={0.5} />
    </Canvas>
  );
}
