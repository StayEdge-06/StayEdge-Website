"use client";

import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * The Lavender Diamond, in 3D (signature #1/#5 — the AI presence).
 * A faceted gem (octahedron) lit by purple + lavender light, slowly rotating,
 * gently floating, and parallaxing toward the cursor. Brand colours only; no
 * neon, no chrome, no HDR environment (kept cheap for the perf budget).
 */
function Gem(props: ThreeElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  // Track the window pointer so parallax works even though the canvas is a
  // pointer-transparent background layer (the hero form sits on top of it).
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.28;
    if (group.current) {
      const { x: px, y: py } = pointer.current;
      group.current.rotation.x += (py * 0.28 - group.current.rotation.x) * 0.05;
      group.current.rotation.y += (px * 0.28 - group.current.rotation.y) * 0.05;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
    }
  });

  return (
    <group ref={group} {...props}>
      <mesh ref={mesh}>
        <octahedronGeometry args={[1.15, 0]} />
        <meshStandardMaterial
          color="#A663CC"
          emissive="#6F2DBD"
          emissiveIntensity={0.4}
          metalness={0.35}
          roughness={0.18}
          flatShading
        />
      </mesh>
    </group>
  );
}

export default function DiamondScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
      frameloop={active ? "always" : "never"}
    >
      <ambientLight intensity={0.6} color="#A663CC" />
      <directionalLight position={[3, 3, 4]} intensity={2.6} color="#A663CC" />
      <directionalLight position={[-3, -2, 1]} intensity={1.6} color="#6F2DBD" />
      <Gem />
    </Canvas>
  );
}
