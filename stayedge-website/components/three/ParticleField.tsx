"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "@/components/theme/ThemeProvider";

/**
 * The Living Edge particle field (flagship hero): a drifting constellation of
 * purple/lavender particles that leans away from the cursor — the "AI presence"
 * as weather, not wallpaper. Count is tiered by the parent; transform-only work
 * happens on the GPU via buffer attributes.
 */
export function ParticleField({ count = 1200 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const pointer = useRef({ x: 0, y: 0 });
  // Additive blending adds light to what is behind it, which is why the field
  // glows on charcoal — and why it would disappear entirely on the light
  // canvas, where the ground is already near its maximum. On light the
  // particles paint normally instead, reading as purple dust rather than glow.
  const onLight = useTheme().theme === "light";

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Intentional randomness: the field is generated once per mount; particles
  // are decorative (aria-hidden canvas), so render purity is not a concern.
  /* eslint-disable react-hooks/purity */
  const { positions, colors, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const purple = new THREE.Color("#6F2DBD");
    const lavender = new THREE.Color("#A663CC");
    for (let i = 0; i < count; i++) {
      // a wide, shallow slab behind the content
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
      const c = Math.random() > 0.65 ? lavender : purple;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, colors, seeds };
  }, [count]);
  /* eslint-enable react-hooks/purity */

  useFrame((state) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    const px = pointer.current.x * 7;
    const py = pointer.current.y * 4;
    for (let i = 0; i < count; i++) {
      const seed = seeds[i];
      const baseX = positions[i * 3];
      const baseY = positions[i * 3 + 1];
      // slow organic drift
      let x = baseX + Math.sin(t * 0.25 + seed) * 0.4;
      let y = baseY + Math.cos(t * 0.2 + seed * 1.7) * 0.3;
      // cursor repulsion — the field leans away from attention
      const dx = x - px;
      const dy = y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < 4) {
        const f = (4 - d2) * 0.12;
        x += dx * f;
        y += dy * f;
      }
      pos.setXY(i, x, y);
    }
    pos.needsUpdate = true;
    if (points.current) points.current.rotation.z = Math.sin(t * 0.05) * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={onLight ? 0.048 : 0.055}
        vertexColors
        transparent
        opacity={onLight ? 0.5 : 0.75}
        sizeAttenuation
        depthWrite={false}
        blending={onLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  );
}
