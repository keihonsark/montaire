"use client";

import { Canvas } from "@react-three/fiber";
import DiamondMesh from "./DiamondMesh";
import * as THREE from "three";

export default function IntroDiamond() {
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
      style={{ position: "absolute", inset: 0 }}
    >
      <DiamondMesh scale={2} rotationSpeed={0.3} floatAmplitude={0} floatSpeed={0} />
    </Canvas>
  );
}
