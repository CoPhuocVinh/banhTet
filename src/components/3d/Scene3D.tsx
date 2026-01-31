"use client";

import { Suspense, type ReactNode, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";

interface Scene3DProps {
  children: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  enableOrbitControls?: boolean;
  enableShadows?: boolean;
}

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-tet-cream/50 rounded-lg">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-tet-green border-t-transparent" />
    </div>
  );
}

// Hook to detect mobile device
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.devicePixelRatio > 2);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export function Scene3D({
  children,
  className = "",
  cameraPosition = [0, 0, 5],
  enableOrbitControls = true,
  enableShadows = true,
}: Scene3DProps) {
  const isMobile = useIsMobile();

  // Reduce quality on mobile
  const dpr = isMobile ? [1, 1.5] : [1, 2];
  const shadowMapSize = isMobile ? 512 : 2048;
  const shouldUseShadows = enableShadows && !isMobile;

  return (
    <div className={`h-full w-full ${className}`}>
      <Suspense fallback={<SceneFallback />}>
        <Canvas
          camera={{ position: cameraPosition, fov: 45 }}
          shadows={shouldUseShadows}
          dpr={dpr as [number, number]}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: isMobile ? "low-power" : "high-performance",
          }}
          style={{ background: "transparent" }}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={isMobile ? 0.6 : 0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={isMobile ? 0.8 : 1}
            castShadow={shouldUseShadows}
            shadow-mapSize={[shadowMapSize, shadowMapSize]}
          />
          {!isMobile && <Environment preset="studio" />}
          {shouldUseShadows && (
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={10}
              blur={2}
            />
          )}
          {children}
          {enableOrbitControls && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 2}
              enableDamping={!isMobile}
              dampingFactor={0.05}
            />
          )}
        </Canvas>
      </Suspense>
    </div>
  );
}

export default Scene3D;
