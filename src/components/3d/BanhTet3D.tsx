"use client";

import { useRef, useMemo, Suspense } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Center } from "@react-three/drei";
import type { Group } from "three";

interface BanhTet3DProps {
  scale?: number;
  autoRotate?: boolean;
  modelPath?: string; // Path to GLTF/GLB model in /public/models/
}

// Detect if device is mobile/low-performance
function useIsMobile(): boolean {
  const { gl } = useThree();
  return useMemo(() => {
    const isMobileDevice =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 || window.devicePixelRatio > 2);
    const maxTextures = gl.capabilities.maxTextures;
    const isLowEnd = maxTextures < 16;
    return isMobileDevice || isLowEnd;
  }, [gl]);
}

// Component to load GLTF/GLB model
function GLTFModel({ path, scale }: { path: string; scale: number }) {
  const { scene } = useGLTF(path);

  return (
    <primitive
      object={scene.clone()}
      scale={scale}
      dispose={null}
    />
  );
}

// Simple fallback model when no GLTF is provided
function FallbackModel({ isMobile }: { isMobile: boolean }) {
  const segments = isMobile ? 24 : 48;

  return (
    <group>
      {/* Simple cylinder representation */}
      <mesh>
        <cylinderGeometry args={[0.45, 0.45, 2.2, segments]} />
        <meshStandardMaterial
          color="#6B7B4C"
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* String bindings */}
      {[-0.7, 0, 0.7].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.47, 0.015, 8, segments]} />
          <meshStandardMaterial color="#D4C4A8" roughness={0.9} />
        </mesh>
      ))}

      {/* Top end */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.12, 0.2, 8]} />
        <meshStandardMaterial color="#4A5A3A" roughness={0.8} />
      </mesh>

      {/* Bottom end */}
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.12, 0.2, 8]} />
        <meshStandardMaterial color="#4A5A3A" roughness={0.8} />
      </mesh>
    </group>
  );
}

export function BanhTet3D({
  scale = 1,
  autoRotate = true,
  modelPath = "/models/banh-tet.glb" // Default model path
}: BanhTet3DProps) {
  const groupRef = useRef<Group>(null);
  const isMobile = useIsMobile();

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      const speed = isMobile ? 0.15 : 0.25;
      groupRef.current.rotation.y += delta * speed;
    }
  });

  // Check if model file exists by trying to load it
  const hasModel = modelPath && modelPath.length > 0;

  return (
    <group ref={groupRef} scale={scale}>
      <Center>
        <Suspense fallback={<FallbackModel isMobile={isMobile} />}>
          {hasModel ? (
            <GLTFModel path={modelPath} scale={1} />
          ) : (
            <FallbackModel isMobile={isMobile} />
          )}
        </Suspense>
      </Center>

      {/* Lighting */}
      <pointLight position={[2, 2, 2]} intensity={0.3} color="#fff5e6" />
    </group>
  );
}

export default BanhTet3D;

// Preload the model if it exists
// useGLTF.preload("/models/banh-tet.glb");
