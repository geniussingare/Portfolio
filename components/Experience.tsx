"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import { useRef } from "react";
import { experience, type Metric, type Role } from "@/data/resume";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";

const ACCENTS = {
  violet: { dot: "bg-violet shadow-[0_0_20px_#8b5cf6]", text: "text-violet", glow: "139 92 246", ring: "border-violet/40 bg-violet/10 text-violet-200" },
  cyan: { dot: "bg-cyan shadow-[0_0_20px_#22d3ee]", text: "text-cyan", glow: "34 211 238", ring: "border-cyan/40 bg-cyan/10 text-cyan" },
} as const;

function MetricBadge({ m }: { m: Metric }) {
  const bar = (width: number, cls: string, delay: number) => (
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div
        className={`h-full rounded-full ${cls}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${width * 100}%` }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="flex flex-wrap items-center gap-3 font-display">
        <span className="text-lg text-white/40 line-through decoration-pink/70">{m.before}</span>
        <ArrowRight size={18} className="text-white/40" />
        <span className="text-gradient text-3xl font-bold tracking-tight">{m.after}</span>
      </div>
      <div className="mt-3 space-y-1.5 font-mono text-[10px] text-white/40">
        <div className="flex items-center gap-2">
          <span className="w-12">before</span>
          {m.ratio ? bar(1, "bg-pink/60", 0) : bar(1, "bg-[repeating-linear-gradient(45deg,#ec4899_0_6px,transparent_6px_12px)] opacity-70", 0)}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-12">after</span>
          {bar(m.ratio ?? 1, "bg-gradient-to-r from-violet to-cyan", 0.35)}
        </div>
      </div>
      <p className="mt-2 font-mono text-[11px] tracking-wide text-white/45">{m.label}</p>
    </div>
  );
}

function RoleBlock({ r, index }: { r: Role; index: number }) {
  const accent = ACCENTS[r.accent];
  return (
    <div className="relative grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-12">
      <span className={`absolute top-2 left-[5px] z-10 h-3.5 w-3.5 rounded-full ring-4 ring-ink lg:left-[-44px] ${accent.dot}`} />
      <div className="pl-10 lg:pl-0">
        <div className="lg:sticky lg:top-28">
          <span className={`font-mono text-xs ${accent.text}`}>role_{String(experience.roles.length - index).padStart(2, "0")}</span>
          <h3 className="mt-2 font-display text-2xl font-semibold text-white md:text-3xl">{r.role}</h3>
          <span className={`mt-3 inline-block rounded-full border px-3 py-1 font-mono text-xs ${accent.ring}`}>{r.period}</span>
          <p className="mt-4 text-sm text-white/45">{r.items.length} highlights</p>
        </div>
      </div>
      <div className="grid gap-5 pl-10 md:grid-cols-2 lg:pl-0">
        {r.items.map((it, i) => (
          <Reveal key={it.title} delay={(i % 2) * 0.06} className={it.metric ? "md:row-span-1" : ""}>
            <TiltCard className="p-6" max={5} glow={accent.glow}>
              <div className="flex h-full flex-col">
                <h4 className="font-display text-xl font-semibold text-white">{it.title}</h4>
                {it.metric && <MetricBadge m={it.metric} />}
                <p className="mt-4 text-[14.5px] leading-relaxed text-white/65">{it.text}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {it.tags.map((t) => (
                    <span key={t} className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-white/55">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <SectionHeading
        index="03"
        kicker="Experience"
        title={
          <>
            Making enterprise systems <span className="text-gradient">faster</span>.
          </>
        }
        sub="Three years at Novatech re-architecting performance-critical backend services, search and integrations."
      />

      <Reveal>
        <div className="glass glow-border mb-14 flex flex-col gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet to-cyan">
              <Briefcase className="text-white" />
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold text-white">{experience.company}</h3>
              <p className="text-white/55">{experience.product}</p>
            </div>
          </div>
          <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 font-mono text-sm text-emerald-300">
            {experience.period}
          </span>
        </div>
      </Reveal>

      <div ref={ref} className="relative lg:pl-12">
        <div className="absolute top-0 bottom-0 left-[11px] w-px bg-white/10" />
        <motion.div
          style={{ scaleY }}
          className="absolute top-0 bottom-0 left-[11px] w-px origin-top bg-gradient-to-b from-violet via-cyan to-pink"
        />
        <div className="space-y-20">
          {experience.roles.map((r, i) => (
            <RoleBlock key={r.role} r={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
