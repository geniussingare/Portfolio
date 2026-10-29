"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import type { ReactNode, PointerEvent } from "react";

/** Glass card that tilts in 3D toward the pointer and shows a moving spotlight. */
export default function TiltCard({
  children,
  className = "",
  max = 10,
  glow = "139 92 246",
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glow?: string;
}) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const px = useTransform(x, (v) => `${v * 100}%`);
  const py = useTransform(y, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${px} ${py}, rgb(${glow} / 0.18), transparent 55%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`glass group relative h-full overflow-hidden rounded-3xl transition-shadow duration-300 hover:shadow-[0_30px_80px_-30px_rgb(139_92_246/0.5)] ${className}`}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
        <div style={{ transform: "translateZ(30px)" }} className="relative h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
