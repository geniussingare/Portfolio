"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type Node = {
  label: string;
  pos: [number, number, number];
  color: string;
  size: number;
};

// A Spring Boot core wired to the services Ganesh works with day to day.
const NODES: Node[] = [
  { label: "Spring Boot", pos: [0, 0, 0], color: "#8b5cf6", size: 0.62 },
  { label: "API Gateway", pos: [-2.3, 1.1, 0.4], color: "#22d3ee", size: 0.26 },
  { label: "Auth · JWT", pos: [2.1, 1.35, -0.5], color: "#ec4899", size: 0.24 },
  { label: "RAG · LLM", pos: [2.4, -0.9, 0.7], color: "#a78bfa", size: 0.3 },
  { label: "Redis", pos: [-1.7, -1.45, 0.9], color: "#f59e0b", size: 0.2 },
  { label: "MySQL", pos: [0.35, -2.05, -0.8], color: "#22d3ee", size: 0.24 },
  { label: "AWS S3", pos: [-0.5, 2.15, -0.9], color: "#f472b6", size: 0.22 },
];

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 2], [3, 5], [4, 5], [1, 6],
];

function Packets({ reduced }: { reduced: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const vectors = useMemo(
    () =>
      EDGES.map(([a, b]) => [
        new THREE.Vector3(...NODES[a].pos),
        new THREE.Vector3(...NODES[b].pos),
      ]),
    []
  );
  const offsets = useMemo(() => EDGES.map((_, i) => (i * 0.37) % 1), []);

  useFrame(({ clock }) => {
    const t = reduced ? 0.5 : clock.getElapsedTime();
    vectors.forEach(([a, b], i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      // Ping-pong between the two services: request out, response back.
      const p = ((t * 0.35 + offsets[i]) % 2 + 2) % 2;
      const k = p < 1 ? p : 2 - p;
      mesh.position.lerpVectors(a, b, k);
    });
  });

  return (
    <>
      {EDGES.map(([, b], i) => (
        <mesh key={i} ref={(m) => { refs.current[i] = m; }}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color={NODES[b].color} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function Core() {
  const wire = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (wire.current) {
      wire.current.rotation.x += d * 0.25;
      wire.current.rotation.y -= d * 0.35;
    }
  });
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshPhysicalMaterial
          color="#8b5cf6"
          emissive="#5b21b6"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.1}
          transmission={0.6}
          thickness={1}
          clearcoat={1}
          flatShading
        />
      </mesh>
      <mesh ref={wire}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Constellation({
  reduced,
  labels,
}: {
  reduced: boolean;
  labels: RefObject<(HTMLDivElement | null)[]>;
}) {
  const group = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ pointer, camera, size }, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reduced) g.rotation.y += delta * 0.12;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.y * 0.35, 0.05);
    g.position.x = THREE.MathUtils.lerp(g.position.x, pointer.x * 0.3, 0.05);

    // Pin each DOM label just below its node in screen space.
    nodeRefs.current.forEach((node, i) => {
      const label = labels.current[i];
      if (!node || !label) return;
      node.getWorldPosition(tmp);
      const depth = tmp.z;
      tmp.project(camera);
      const x = (tmp.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.y * 0.5 + 0.5) * size.height + 26 + NODES[i + 1].size * 40;
      label.style.transform = `translate(-50%, 0) translate(${x}px, ${y}px)`;
      label.style.opacity = String(THREE.MathUtils.clamp(0.7 + depth * 0.25, 0.5, 1));
      label.style.zIndex = String(Math.max(1, Math.round(10 + depth * 4)));
    });
  });

  return (
    <group ref={group}>
      {EDGES.map(([a, b], i) => (
        <Line
          key={i}
          points={[NODES[a].pos, NODES[b].pos]}
          color={a === 0 ? "#8b5cf6" : "#22d3ee"}
          lineWidth={1}
          transparent
          opacity={a === 0 ? 0.55 : 0.25}
          dashed={a !== 0}
          dashSize={0.12}
          gapSize={0.08}
        />
      ))}
      <Packets reduced={reduced} />
      <Core />
      {NODES.slice(1).map((n, i) => (
        <Float key={n.label} speed={reduced ? 0 : 2} floatIntensity={0.6} rotationIntensity={0.4}>
          <group position={n.pos} ref={(el) => { nodeRefs.current[i] = el; }}>
            <mesh>
              <sphereGeometry args={[n.size, 32, 32]} />
              <meshPhysicalMaterial
                color={n.color}
                emissive={n.color}
                emissiveIntensity={0.45}
                roughness={0.1}
                transmission={0.5}
                thickness={0.6}
                clearcoat={1}
              />
            </mesh>
            <mesh scale={1.6}>
              <sphereGeometry args={[n.size, 16, 16]} />
              <meshBasicMaterial color={n.color} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}

function Starfield() {
  const positions = useMemo(() => {
    const arr = new Float32Array(600 * 3);
    for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() - 0.5) * 18;
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y -= d * 0.01;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#c4b5fd" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function HeroScene() {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const labels = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8.2], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={60} color="#22d3ee" />
        <pointLight position={[-5, -3, 3]} intensity={50} color="#ec4899" />
        <pointLight position={[0, 0, 4]} intensity={20} color="#8b5cf6" />
        <Starfield />
        <Constellation reduced={reduced} labels={labels} />
      </Canvas>
      {NODES.slice(1).map((n, i) => (
        <div
          key={n.label}
          ref={(el) => { labels.current[i] = el; }}
          className="pointer-events-none absolute top-0 left-0 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 font-mono text-[11px] whitespace-nowrap text-white/80 opacity-0 backdrop-blur-md will-change-transform"
        >
          {n.label}
        </div>
      ))}
    </div>
  );
}
