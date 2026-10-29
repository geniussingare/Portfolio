"use client";

import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Float, Line, OrbitControls } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { MousePointerClick, X, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";

type Node = {
  label: string;
  pos: [number, number, number];
  color: string;
  size: number;
  info: string;
  href: string;
};

// A Spring Boot core wired to the services Ganesh works with day to day.
const NODES: Node[] = [
  {
    label: "Spring Boot",
    pos: [0, 0, 0],
    color: "#8b5cf6",
    size: 0.62,
    info: "The core of his Java work — REST APIs, Spring Security and JPA/Hibernate in the Easy Mentor learning-platform API and the E-Commerce platform.",
    href: "#projects",
  },
  {
    label: "REST APIs",
    pos: [-2.3, 1.1, 0.4],
    color: "#22d3ee",
    size: 0.26,
    info: "Designs and ships REST APIs end to end — plus Jira & Azure DevOps integrations with comment sync and automated alerts at Novatech.",
    href: "#experience",
  },
  {
    label: "Auth · JWT",
    pos: [2.1, 1.35, -0.5],
    color: "#ec4899",
    size: 0.24,
    info: "Stateless JWT authentication and role-based access with Spring Security, including password-reset flows in Easy Mentor.",
    href: "#projects",
  },
  {
    label: "RAG · LLM",
    pos: [2.4, -0.9, 0.7],
    color: "#a78bfa",
    size: 0.3,
    info: "Built an AI Vector Context Framework on the OpenAI API that retrieves relevant artifacts as context for generation and semantic search.",
    href: "#experience",
  },
  {
    label: "Redis",
    pos: [-1.7, -1.45, 0.9],
    color: "#f59e0b",
    size: 0.2,
    info: "Caching is part of his databases & caching toolkit alongside MySQL and PostgreSQL.",
    href: "#skills",
  },
  {
    label: "SQL Server",
    pos: [0.35, -2.05, -0.8],
    color: "#22d3ee",
    size: 0.24,
    info: "Dynamic SQL, temp tables and Full-Text Search: 15-level traces that used to crash now finish in ~3.5 min, and search dropped from 60 s to 12 s.",
    href: "#experience",
  },
  {
    label: "AWS S3",
    pos: [-0.5, 2.15, -0.9],
    color: "#f472b6",
    size: 0.22,
    info: "Object storage on AWS — part of his cloud & DevOps toolkit with Docker, Git and Maven.",
    href: "#skills",
  },
];

const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 2], [3, 5], [4, 5], [1, 6],
];

type Shared = {
  boost: RefObject<number>;
  hovered: number | null;
  selected: number | null;
  setHovered: (i: number | null) => void;
  setSelected: (i: number | null) => void;
};

function Packets({ reduced, boost }: { reduced: boolean; boost: RefObject<number> }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const time = useRef(0);
  const vectors = useMemo(
    () =>
      EDGES.map(([a, b]) => [
        new THREE.Vector3(...NODES[a].pos),
        new THREE.Vector3(...NODES[b].pos),
      ]),
    []
  );
  const offsets = useMemo(() => EDGES.map((_, i) => (i * 0.37) % 1), []);

  useFrame((_, delta) => {
    // A request burst speeds packets up, then decays back to idle traffic.
    time.current += reduced ? 0 : delta * 0.35 * (1 + boost.current * 6);
    vectors.forEach(([a, b], i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      // Ping-pong between the two services: request out, response back.
      const p = ((time.current + offsets[i]) % 2 + 2) % 2;
      const k = p < 1 ? p : 2 - p;
      mesh.position.lerpVectors(a, b, k);
      mesh.scale.setScalar(1 + boost.current * 1.5);
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

function Core({ boost, hovered, selected, setHovered, setSelected }: Shared) {
  const wire = useRef<THREE.Mesh>(null);
  const body = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (wire.current) {
      wire.current.rotation.x += d * (0.25 + boost.current * 2);
      wire.current.rotation.y -= d * (0.35 + boost.current * 2);
    }
    if (body.current) {
      const target = 1 + boost.current * 0.25 + (hovered === 0 || selected === 0 ? 0.12 : 0);
      body.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
    }
  });
  return (
    <group
      ref={body}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(0); }}
      onPointerOut={() => setHovered(null)}
      onClick={(e) => { e.stopPropagation(); setSelected(selected === 0 ? null : 0); }}
    >
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

function Satellite({
  n,
  i,
  shared,
  nodeRef,
  reduced,
}: {
  n: Node;
  i: number;
  shared: Shared;
  nodeRef: (el: THREE.Group | null) => void;
  reduced: boolean;
}) {
  const scaler = useRef<THREE.Group>(null);
  const active = shared.hovered === i || shared.selected === i;
  useFrame(() => {
    const s = active ? 1.45 : 1;
    scaler.current?.scale.lerp(new THREE.Vector3(s, s, s), 0.15);
  });
  const handlers = {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); shared.setHovered(i); },
    onPointerOut: () => shared.setHovered(null),
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      shared.setSelected(shared.selected === i ? null : i);
    },
  };
  return (
    <Float speed={reduced ? 0 : 2} floatIntensity={0.6} rotationIntensity={0.4}>
      <group position={n.pos} ref={nodeRef}>
        <group ref={scaler} {...handlers}>
          <mesh>
            <sphereGeometry args={[n.size, 32, 32]} />
            <meshPhysicalMaterial
              color={n.color}
              emissive={n.color}
              emissiveIntensity={active ? 1.1 : 0.45}
              roughness={0.1}
              transmission={0.5}
              thickness={0.6}
              clearcoat={1}
            />
          </mesh>
          <mesh scale={active ? 2.1 : 1.6}>
            <sphereGeometry args={[n.size, 16, 16]} />
            <meshBasicMaterial
              color={n.color}
              transparent
              opacity={active ? 0.3 : 0.18}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      </group>
    </Float>
  );
}

function Constellation({
  reduced,
  labels,
  shared,
}: {
  reduced: boolean;
  labels: RefObject<(HTMLDivElement | null)[]>;
  shared: Shared;
}) {
  const group = useRef<THREE.Group>(null);
  const nodeRefs = useRef<(THREE.Group | null)[]>([]);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const focus = shared.selected ?? shared.hovered;

  useFrame(({ camera, size }, delta) => {
    // Pause the idle spin while someone is inspecting a node.
    if (!reduced && focus === null && group.current) group.current.rotation.y += delta * 0.12;
    shared.boost.current = Math.max(0, shared.boost.current - delta * 0.6);

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
      label.style.opacity = String(
        focus === i + 1 ? 1 : THREE.MathUtils.clamp(0.7 + depth * 0.25, 0.5, 1)
      );
      label.style.zIndex = String(Math.max(1, Math.round(10 + depth * 4)));
    });
  });

  return (
    <group ref={group}>
      {EDGES.map(([a, b], i) => {
        const lit = focus !== null && (a === focus || b === focus);
        return (
          <Line
            key={i}
            points={[NODES[a].pos, NODES[b].pos]}
            color={lit ? NODES[focus].color : a === 0 ? "#8b5cf6" : "#22d3ee"}
            lineWidth={lit ? 2.5 : 1}
            transparent
            opacity={lit ? 0.95 : a === 0 ? 0.55 : 0.25}
            dashed={a !== 0 && !lit}
            dashSize={0.12}
            gapSize={0.08}
          />
        );
      })}
      <Packets reduced={reduced} boost={shared.boost} />
      <Core {...shared} />
      {NODES.slice(1).map((n, i) => (
        <Satellite
          key={n.label}
          n={n}
          i={i + 1}
          shared={shared}
          reduced={reduced}
          nodeRef={(el) => { nodeRefs.current[i] = el; }}
        />
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
  const boost = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [requests, setRequests] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.cursor = hovered !== null ? "pointer" : "";
    return () => { document.body.style.cursor = ""; };
  }, [hovered]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 1600);
    return () => clearTimeout(id);
  }, [toast]);

  const fire = () => {
    boost.current = 1;
    setRequests((r) => r + 1);
    setToast(`200 OK · ${18 + Math.floor(Math.random() * 30)} ms`);
  };

  const shared: Shared = { boost, hovered, selected, setHovered, setSelected };
  const node = selected !== null ? NODES[selected] : null;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8.2], fov: 45 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => setSelected(null)}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={60} color="#22d3ee" />
        <pointLight position={[-5, -3, 3]} intensity={50} color="#ec4899" />
        <pointLight position={[0, 0, 4]} intensity={20} color="#8b5cf6" />
        <Starfield />
        <Constellation reduced={reduced} labels={labels} shared={shared} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          rotateSpeed={0.6}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
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

      {/* Controls: only on desktop, where the scene is interactive */}
      <div className="absolute right-4 bottom-4 left-4 hidden items-center justify-between gap-3 lg:flex">
        <span className="flex items-center gap-2 font-mono text-[11px] text-white/40">
          <MousePointerClick size={14} /> drag to rotate · click a node
        </span>
        <button
          onClick={fire}
          className="glass group flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 font-mono text-xs text-white/80 transition hover:text-white hover:shadow-[0_0_24px_rgb(34_211_238/0.45)]"
        >
          <Zap size={14} className="text-amber transition group-active:scale-125" />
          POST /request
          {requests > 0 && <span className="rounded-full bg-white/10 px-1.5 text-[10px]">{requests}</span>}
        </button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-6 left-6 hidden rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 font-mono text-xs text-emerald-300 backdrop-blur-md lg:block"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {node && (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, x: 20, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass absolute top-6 right-4 hidden w-72 rounded-2xl bg-[#0a0b18]/90 p-5 lg:block"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                <span className="h-3 w-3 rounded-full" style={{ background: node.color, boxShadow: `0 0 14px ${node.color}` }} />
                {node.label}
              </span>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="grid h-7 w-7 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">{node.info}</p>
            <a href={node.href} className="mt-4 inline-block font-mono text-xs text-cyan hover:underline">
              see it on the page →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
