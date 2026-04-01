"use client";

import { Canvas } from "@react-three/fiber";
import DiamondMesh from "./DiamondMesh";
import * as THREE from "three";

export default function DiamondsDiamond() {
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
      <DiamondMesh scale={1.5} position={[0.5, 0, 0]} rotationSpeed={0.15} floatAmplitude={0.1} floatSpeed={0.8} />
    </Canvas>
  );
}
