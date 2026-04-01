'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';

interface DiamondMeshProps {
  scale?: number;
  position?: [number, number, number];
  rotationSpeed?: number;
  floatAmplitude?: number;
  floatSpeed?: number;
}

export default function DiamondMesh({
  scale = 1,
  position = [0, 0, 0],
  rotationSpeed = 0.3,
  floatAmplitude = 0.1,
  floatSpeed = 0.5,
}: DiamondMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    const tableRadius = 0.6;
    const girdleRadius = 1.0;
    const crownHeight = 0.35;
    const pavilionDepth = 0.85;
    const sides = 8;

    const vertices: number[] = [];
    const indices: number[] = [];

    // Vertex 0: Bottom point (culet)
    vertices.push(0, -pavilionDepth, 0);

    // Vertices 1-8: Girdle points (widest ring)
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      vertices.push(
        Math.cos(angle) * girdleRadius,
        0,
        Math.sin(angle) * girdleRadius
      );
    }

    // Vertices 9-16: Table edge points (top ring, smaller, offset half step)
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 + Math.PI / sides;
      vertices.push(
        Math.cos(angle) * tableRadius,
        crownHeight,
        Math.sin(angle) * tableRadius
      );
    }

    // Vertex 17: Table center
    vertices.push(0, crownHeight, 0);

    // Pavilion faces: culet (0) to girdle (1-8)
    for (let i = 0; i < sides; i++) {
      const curr = i + 1;
      const next = ((i + 1) % sides) + 1;
      indices.push(0, next, curr);
    }

    // Crown faces: girdle (1-8) to table edge (9-16)
    for (let i = 0; i < sides; i++) {
      const gCurr = i + 1;
      const gNext = ((i + 1) % sides) + 1;
      const tCurr = i + 9;
      const tNext = ((i + 1) % sides) + 9;

      indices.push(gCurr, gNext, tCurr);
      indices.push(gNext, tNext, tCurr);
    }

    // Table face: table edge (9-16) to center (17)
    for (let i = 0; i < sides; i++) {
      const curr = i + 9;
      const next = ((i + 1) % sides) + 9;
      indices.push(17, curr, next);
    }

    geo.setIndex(indices);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geo.computeVertexNormals();

    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * floatSpeed) * floatAmplitude;
  });

  return (
    <>
      <mesh ref={meshRef} geometry={geometry} position={position} scale={scale}>
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.0}
          roughness={0.0}
          transmission={0.97}
          thickness={1.5}
          ior={2.42}
          envMapIntensity={3}
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          transparent={true}
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Environment preset="studio" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-3, 3, -3]} intensity={0.8} color="#f0f0ff" />
      <pointLight position={[0, -2, 3]} intensity={0.5} color="#C9A84C" />
    </>
  );
}
