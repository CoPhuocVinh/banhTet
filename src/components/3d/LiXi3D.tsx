"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import * as THREE from "three";

interface LiXi3DProps {
  scale?: number;
  autoRotate?: boolean;
}

// Colors
const colors = {
  red: "#DC2626",
  redDark: "#B91C1C",
  redLight: "#EF4444",
  gold: "#FFD700",
  goldDark: "#DAA520",
  green: "#84CC16",
  greenDark: "#65A30D",
  pink: "#EC4899",
  purple: "#A855F7",
};

// Detect mobile
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

// Envelope body with rounded corners
function EnvelopeBody() {
  return (
    <group>
      {/* Main body - rounded box */}
      <RoundedBox args={[1.2, 1.5, 0.1]} radius={0.08} smoothness={4}>
        <meshStandardMaterial color={colors.red} roughness={0.4} metalness={0.1} />
      </RoundedBox>

      {/* Inner border/frame */}
      <RoundedBox args={[1.1, 1.4, 0.02]} radius={0.06} smoothness={4} position={[0, 0, 0.05]}>
        <meshStandardMaterial color={colors.redDark} roughness={0.5} />
      </RoundedBox>
    </group>
  );
}

// Golden fan at top - simplified version
function GoldenFan() {
  return (
    <group position={[0, 0.45, 0.05]}>
      {/* Fan base - semi-circle */}
      <mesh rotation={[0, 0, 0]}>
        <circleGeometry args={[0.4, 32, 0, Math.PI]} />
        <meshStandardMaterial
          color={colors.gold}
          roughness={0.3}
          metalness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Fan rays */}
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = (i / 8) * Math.PI;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.2, Math.sin(angle) * 0.2, 0.01]}
            rotation={[0, 0, angle - Math.PI / 2]}
          >
            <boxGeometry args={[0.015, 0.35, 0.005]} />
            <meshStandardMaterial color={colors.goldDark} roughness={0.4} metalness={0.4} />
          </mesh>
        );
      })}

      {/* Center circle */}
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.06, 32]} />
        <meshStandardMaterial color={colors.goldDark} roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

// Central badge with LỘC text
function CentralBadge() {
  return (
    <group position={[0, 0.05, 0.06]}>
      {/* Outer ring */}
      <mesh>
        <ringGeometry args={[0.28, 0.32, 32]} />
        <meshStandardMaterial color={colors.gold} roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Inner circle - red */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial color={colors.redLight} roughness={0.4} />
      </mesh>

      {/* LỘC symbol - Chinese coin pattern */}
      <mesh position={[0, 0, 0.02]}>
        <ringGeometry args={[0.06, 0.12, 4]} />
        <meshStandardMaterial color={colors.gold} roughness={0.3} metalness={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Decorative lines forming 福 pattern */}
      <mesh position={[0, 0.08, 0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.005]} />
        <meshStandardMaterial color={colors.gold} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.08, 0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.02, 0.005]} />
        <meshStandardMaterial color={colors.gold} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[-0.08, 0, 0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.02, 0.18, 0.005]} />
        <meshStandardMaterial color={colors.gold} roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.08, 0, 0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.02, 0.18, 0.005]} />
        <meshStandardMaterial color={colors.gold} roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Decorative dots around */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.3, Math.sin(angle) * 0.3, 0.02]}
          >
            <circleGeometry args={[0.015, 8]} />
            <meshStandardMaterial color={colors.gold} roughness={0.3} metalness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

// Mai flower (Vietnamese apricot blossom)
function MaiFlower({ position, rotation = 0, scale = 1 }: { position: [number, number, number]; rotation?: number; scale?: number }) {
  const petalCount = 5;

  return (
    <group position={position} rotation={[0, 0, rotation]} scale={scale}>
      {/* Petals */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (i / petalCount) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.03, Math.sin(angle) * 0.03, 0]}
            rotation={[0, 0, angle]}
          >
            <circleGeometry args={[0.035, 16]} />
            <meshStandardMaterial color={colors.gold} roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
        );
      })}

      {/* Center */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.015, 16]} />
        <meshStandardMaterial color={colors.goldDark} roughness={0.3} />
      </mesh>
    </group>
  );
}

// Mai flower branch
function MaiBranch({ side }: { side: "left" | "right" }) {
  const mirror = side === "left" ? -1 : 1;

  return (
    <group position={[mirror * 0.35, 0.1, 0.05]} rotation={[0, 0, mirror * -0.3]}>
      {/* Main branch */}
      <mesh rotation={[0, 0, mirror * 0.2]}>
        <boxGeometry args={[0.02, 0.5, 0.02]} />
        <meshStandardMaterial color={colors.greenDark} roughness={0.7} />
      </mesh>

      {/* Sub branches */}
      <mesh position={[mirror * 0.05, 0.15, 0]} rotation={[0, 0, mirror * 0.8]}>
        <boxGeometry args={[0.015, 0.2, 0.015]} />
        <meshStandardMaterial color={colors.greenDark} roughness={0.7} />
      </mesh>

      <mesh position={[mirror * 0.03, -0.05, 0]} rotation={[0, 0, mirror * 0.5]}>
        <boxGeometry args={[0.015, 0.15, 0.015]} />
        <meshStandardMaterial color={colors.greenDark} roughness={0.7} />
      </mesh>

      {/* Flowers on branch */}
      <MaiFlower position={[mirror * 0.08, 0.2, 0.02]} scale={0.8} />
      <MaiFlower position={[mirror * 0.12, 0.08, 0.02]} scale={1} />
      <MaiFlower position={[mirror * 0.05, -0.08, 0.02]} scale={0.7} />
      <MaiFlower position={[0, 0.25, 0.02]} scale={0.6} />
      <MaiFlower position={[mirror * 0.15, -0.02, 0.02]} scale={0.9} />

      {/* Leaves */}
      {[0.12, 0, -0.1].map((y, i) => (
        <mesh
          key={i}
          position={[mirror * (0.06 + i * 0.02), y, 0.01]}
          rotation={[0, 0, mirror * (0.3 + i * 0.2)]}
        >
          <planeGeometry args={[0.08, 0.03]} />
          <meshStandardMaterial color={colors.green} roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// Decorative bow
function DecorativeBow() {
  return (
    <group position={[0, -0.35, 0.06]}>
      {/* Left loop */}
      <mesh position={[-0.1, 0.02, 0]} rotation={[0, 0, 0.3]}>
        <torusGeometry args={[0.06, 0.025, 8, 16, Math.PI]} />
        <meshStandardMaterial color={colors.redLight} roughness={0.4} />
      </mesh>

      {/* Right loop */}
      <mesh position={[0.1, 0.02, 0]} rotation={[0, 0, -0.3]} scale={[-1, 1, 1]}>
        <torusGeometry args={[0.06, 0.025, 8, 16, Math.PI]} />
        <meshStandardMaterial color={colors.redLight} roughness={0.4} />
      </mesh>

      {/* Center knot */}
      <mesh position={[0, 0, 0.02]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={colors.red} roughness={0.4} />
      </mesh>

      {/* Ribbon tails */}
      <mesh position={[-0.03, -0.08, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.04, 0.12, 0.015]} />
        <meshStandardMaterial color={colors.redLight} roughness={0.4} />
      </mesh>
      <mesh position={[0.03, -0.1, 0]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[0.04, 0.14, 0.015]} />
        <meshStandardMaterial color={colors.redLight} roughness={0.4} />
      </mesh>
    </group>
  );
}

// Gold coin with tassel
function GoldCoinTassel() {
  return (
    <group position={[0, -0.6, 0.05]}>
      {/* String */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
        <meshStandardMaterial color={colors.goldDark} roughness={0.5} />
      </mesh>

      {/* Coin */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 32]} />
        <meshStandardMaterial color={colors.gold} roughness={0.2} metalness={0.7} />
      </mesh>

      {/* Coin hole */}
      <mesh position={[0, 0, 0.011]}>
        <ringGeometry args={[0.02, 0.035, 4]} />
        <meshStandardMaterial color={colors.goldDark} roughness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Tassel top */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.05, 16]} />
        <meshStandardMaterial color={colors.purple} roughness={0.6} />
      </mesh>

      {/* Tassel threads */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const offsetX = Math.cos(angle) * 0.02;
        const offsetZ = Math.sin(angle) * 0.02;
        return (
          <mesh
            key={i}
            position={[offsetX, -0.22, offsetZ]}
            rotation={[Math.sin(angle) * 0.1, 0, Math.cos(angle) * 0.1]}
          >
            <cylinderGeometry args={[0.004, 0.002, 0.15, 4]} />
            <meshStandardMaterial color={colors.pink} roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}

export function LiXi3D({ scale = 1, autoRotate = true }: LiXi3DProps) {
  const groupRef = useRef<Group>(null);
  const isMobile = useIsMobile();

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      const speed = isMobile ? 0.15 : 0.25;
      groupRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main envelope body */}
      <EnvelopeBody />

      {/* Golden fan at top */}
      <GoldenFan />

      {/* Central badge with LỘC */}
      <CentralBadge />

      {/* Mai flower branches */}
      <MaiBranch side="left" />
      <MaiBranch side="right" />

      {/* Decorative bow */}
      <DecorativeBow />

      {/* Gold coin with tassel */}
      <GoldCoinTassel />

      {/* Lighting */}
      <pointLight position={[1, 1, 2]} intensity={0.4} color="#fff5e6" />
    </group>
  );
}

export default LiXi3D;
