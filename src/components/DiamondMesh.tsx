"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

interface DiamondMeshProps {
  rotationSpeed?: number;
  floatAmplitude?: number;
  floatSpeed?: number;
  scale?: number;
  opacity?: number;
}

function createDiamondGeometry(): THREE.BufferGeometry {
  // Brilliant-cut diamond: octagonal crown + octagonal pavilion
  const crownHeight = 0.35;
  const pavilionDepth = 0.65;
  const tableRadius = 0.5;
  const girdleRadius = 1.0;
  const culetY = -pavilionDepth;
  const tableY = crownHeight;
  const girdleY = 0;
  const sides = 8;

  const vertices: number[] = [];
  const indices: number[] = [];

  // Table center vertex
  vertices.push(0, tableY, 0); // index 0

  // Table edge vertices (index 1-8)
  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    vertices.push(
      Math.cos(angle) * tableRadius,
      tableY,
      Math.sin(angle) * tableRadius
    );
  }

  // Girdle vertices (index 9-16)
  for (let i = 0; i < sides; i++) {
    const angle = ((i + 0.5) / sides) * Math.PI * 2;
    vertices.push(
      Math.cos(angle) * girdleRadius,
      girdleY,
      Math.sin(angle) * girdleRadius
    );
  }

  // Culet vertex (index 17)
  vertices.push(0, culetY, 0);

  // Table face (fan from center)
  for (let i = 0; i < sides; i++) {
    indices.push(0, 1 + i, 1 + ((i + 1) % sides));
  }

  // Crown faces (triangles between table edge and girdle)
  for (let i = 0; i < sides; i++) {
    const t1 = 1 + i;
    const t2 = 1 + ((i + 1) % sides);
    const g1 = 9 + i;
    const g2 = 9 + ((i + 1) % sides);

    // Upper crown triangle
    indices.push(t1, g1, t2);
    // Lower crown triangle
    indices.push(t2, g1, g2);
  }

  // Pavilion faces (fan from culet to girdle)
  for (let i = 0; i < sides; i++) {
    indices.push(17, 9 + ((i + 1) % sides), 9 + i);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

export default function DiamondMesh({
  rotationSpeed = 0.2,
  floatAmplitude = 0.15,
  floatSpeed = 1.0,
  scale = 1,
  opacity = 1,
}: DiamondMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => createDiamondGeometry(), []);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.95,
        roughness: 0.0,
        metalness: 0.0,
        ior: 2.42,
        thickness: 1.5,
        envMapIntensity: 2.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        transparent: true,
        opacity,
      }),
    [opacity]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += rotationSpeed * (1 / 60);
    meshRef.current.position.y =
      Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude;
  });

  return (
    <>
      <mesh ref={meshRef} geometry={geometry} material={material} scale={scale} />
      <Environment preset="studio" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <directionalLight position={[-3, 2, -2]} intensity={1} color="#fff5e6" />
    </>
  );
}
