"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Folder,
  Globe,
  Mail,
  Music,
  Settings,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";

const ITEMS: { label: string; icon: LucideIcon }[] = [
  { label: "Terminal", icon: Terminal },
  { label: "Browser", icon: Globe },
  { label: "Mail", icon: Mail },
  { label: "Music", icon: Music },
  { label: "Settings", icon: Settings },
  { label: "Files", icon: Folder },
  { label: "Notes", icon: StickyNote },
  { label: "Screenshot", icon: Camera },
];

const RADIUS = 92;
const DEAD_ZONE = 28;

/* A playable miniature of TheOrbit: hold to open the ring, aim, release to launch. */
export default function OrbitDemo() {
  const area = useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [launched, setLaunched] = useState<{ label: string; key: number } | null>(null);

  const local = (e: PointerEvent) => {
    const r = area.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = local(e);
    // Keep the ring fully inside the preview.
    const r = area.current!.getBoundingClientRect();
    const pad = RADIUS + 28;
    setOrigin({
      x: Math.min(Math.max(p.x, pad), r.width - pad),
      y: Math.min(Math.max(p.y, pad), r.height - pad),
    });
    setActive(null);
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!origin) return;
    const p = local(e);
    const dx = p.x - origin.x;
    const dy = p.y - origin.y;
    if (Math.hypot(dx, dy) < DEAD_ZONE) return setActive(null);
    // Item 0 sits at the top; angles run clockwise.
    const angle = (Math.atan2(dy, dx) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
    setActive(Math.round(angle / ((Math.PI * 2) / ITEMS.length)) % ITEMS.length);
  };

  const onUp = () => {
    if (active !== null) setLaunched({ label: ITEMS[active].label, key: Date.now() });
    setOrigin(null);
    setActive(null);
  };

  return (
    <div
      ref={area}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onContextMenu={(e) => e.preventDefault()}
      className="relative h-full min-h-[300px] cursor-crosshair touch-none overflow-hidden rounded-xl select-none"
    >
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="h-56 w-56 rounded-full bg-violet/15 blur-3xl" />
      </div>

      <AnimatePresence>
        {!origin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 grid place-items-center text-center"
          >
            <div>
              <div className="mx-auto mb-4 grid h-14 w-14 animate-float place-items-center rounded-2xl glass">
                <svg viewBox="0 0 24 24" className="h-7 w-7 drop-shadow-[0_0_12px_#22d3ee]" aria-hidden>
                  <path d="M4 2l16 10-7 1.5L10 21z" fill="white" stroke="#22d3ee" strokeWidth="1" />
                </svg>
              </div>
              <p className="font-display text-lg text-white">Try it</p>
              <p className="mt-1 font-mono text-[11px] tracking-wide text-white/45">
                press &amp; hold anywhere · aim · release
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {origin && (
          <motion.div
            key={`${origin.x}-${origin.y}`}
            className="pointer-events-none absolute"
            style={{ left: origin.x, top: origin.y }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.25, opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          >
            <div
              className="absolute rounded-full border border-dashed border-white/15"
              style={{ width: RADIUS * 2, height: RADIUS * 2, left: -RADIUS, top: -RADIUS }}
            />
            <div className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_14px_#22d3ee]" />
            {ITEMS.map((it, i) => {
              const a = (i / ITEMS.length) * Math.PI * 2 - Math.PI / 2;
              const on = active === i;
              const Icon = it.icon;
              return (
                <motion.div
                  key={it.label}
                  className={`absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border backdrop-blur-md transition-colors ${
                    on
                      ? "border-cyan/80 bg-cyan/20 text-white shadow-[0_0_28px_rgb(34_211_238/0.6)]"
                      : "border-white/12 bg-white/[0.06] text-white/70"
                  }`}
                  style={{ left: Math.cos(a) * RADIUS, top: Math.sin(a) * RADIUS }}
                  animate={{ scale: on ? 1.22 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 24 }}
                >
                  <Icon size={20} />
                </motion.div>
              );
            })}
            <AnimatePresence>
              {active !== null && (
                <motion.span
                  key={active}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[11px] whitespace-nowrap text-white"
                  style={{ top: RADIUS + 34 }}
                >
                  {ITEMS[active].label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {launched && (
          <motion.div
            key={launched.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setTimeout(() => setLaunched(null), 1200)}
            className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 font-mono text-xs whitespace-nowrap text-emerald-300"
          >
            ✓ Launched {launched.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
