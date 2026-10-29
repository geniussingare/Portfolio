"use client";

import { ArrowUpRight, ExternalLink, Folder, Star } from "lucide-react";
import { featuredProjects, moreProjects, profile, type Project } from "@/data/resume";
import { GithubIcon } from "./ui/BrandIcons";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";

/* Animated architecture sketch of the e-commerce system. */
function ArchitectureDiagram() {
  const box =
    "fill-white/[0.05] stroke-white/15";
  return (
    <svg viewBox="0 0 360 300" className="h-full w-full" role="img" aria-label="E-commerce architecture: React client calls a Spring Boot API secured by JWT, which routes to user, product and order services backed by MySQL">
      <defs>
        <linearGradient id="flow" x1="0" x2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <style>{`
          .wire { stroke: url(#flow); stroke-width: 1.5; fill: none; stroke-dasharray: 4 6; animation: dash 1.4s linear infinite; }
          @keyframes dash { to { stroke-dashoffset: -20; } }
          .lbl { font: 500 11px var(--font-jetbrains), monospace; fill: rgba(255,255,255,.8); }
          .sub { font: 9px var(--font-jetbrains), monospace; fill: rgba(255,255,255,.4); }
        `}</style>
      </defs>

      {/* wires */}
      <path className="wire" d="M180 52 V86" />
      <path className="wire" d="M180 130 C180 150 70 150 70 172" />
      <path className="wire" d="M180 130 V172" />
      <path className="wire" d="M180 130 C180 150 290 150 290 172" />
      <path className="wire" d="M70 210 C70 232 180 232 180 250" />
      <path className="wire" d="M180 210 V250" />
      <path className="wire" d="M290 210 C290 232 180 232 180 250" />

      {/* client */}
      <rect x="100" y="14" width="160" height="38" rx="12" className={box} />
      <text x="180" y="31" textAnchor="middle" className="lbl">React Client</text>
      <text x="180" y="44" textAnchor="middle" className="sub">catalog · cart · checkout</text>

      {/* api */}
      <rect x="100" y="86" width="160" height="44" rx="12" fill="url(#flow)" opacity="0.18" />
      <rect x="100" y="86" width="160" height="44" rx="12" fill="none" stroke="url(#flow)" />
      <text x="180" y="105" textAnchor="middle" className="lbl">Spring Boot REST API</text>
      <text x="180" y="120" textAnchor="middle" className="sub">🔒 JWT · stateless auth</text>

      {/* services */}
      {[
        { x: 20, t: "Users" },
        { x: 130, t: "Products" },
        { x: 240, t: "Orders" },
      ].map((s) => (
        <g key={s.t}>
          <rect x={s.x} y="172" width="100" height="38" rx="12" className={box} />
          <text x={s.x + 50} y="195" textAnchor="middle" className="lbl">{s.t}</text>
        </g>
      ))}

      {/* db */}
      <ellipse cx="180" cy="256" rx="48" ry="8" fill="#22d3ee" opacity="0.25" />
      <rect x="132" y="256" width="96" height="30" fill="#22d3ee" opacity="0.12" />
      <ellipse cx="180" cy="286" rx="48" ry="8" fill="#22d3ee" opacity="0.18" />
      <text x="180" y="276" textAnchor="middle" className="lbl">MySQL</text>
    </svg>
  );
}

/* TheOrbit's radial ring: items orbit the cursor, one highlighted at a time. */
function OrbitVisual() {
  const items = ["⌘", "◐", "✉", "♫", "⚙", "⌂", "▶", "✎"];
  return (
    <div className="relative grid h-full min-h-[300px] place-items-center">
      <div className="absolute h-64 w-64 rounded-full bg-violet/20 blur-3xl" />
      <div className="relative h-60 w-60 animate-[spin_24s_linear_infinite]">
        <div className="absolute inset-6 rounded-full border border-dashed border-white/15" />
        {items.map((icon, i) => {
          const angle = (i / items.length) * Math.PI * 2;
          const x = 50 + Math.cos(angle) * 42;
          const y = 50 + Math.sin(angle) * 42;
          return (
            <span
              key={i}
              style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.5}s` }}
              className="glass absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-[orbit-pulse_4s_ease-in-out_infinite] place-items-center rounded-2xl text-lg text-white/80"
            >
              <span className="animate-[spin_24s_linear_infinite_reverse]">{icon}</span>
            </span>
          );
        })}
      </div>
      {/* cursor at the centre */}
      <svg viewBox="0 0 24 24" className="absolute h-8 w-8 drop-shadow-[0_0_12px_#22d3ee]" aria-hidden>
        <path d="M4 2l16 10-7 1.5L10 21z" fill="white" stroke="#22d3ee" strokeWidth="1" />
      </svg>
      <span className="absolute bottom-3 font-mono text-[10px] tracking-widest text-white/30 uppercase">
        hold right-click · pick · release
      </span>
    </div>
  );
}

function LinkButtons({ p, primary = false }: { p: Project; primary?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      {p.repo && (
        <a
          href={p.repo}
          target="_blank"
          rel="noreferrer"
          className={
            primary
              ? "group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:shadow-[0_0_30px_rgb(255_255_255/0.35)]"
              : "inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
          }
        >
          <GithubIcon className="h-4 w-4" /> {primary ? "View code" : "Code"}
        </a>
      )}
      {p.live && (
        <a
          href={p.live}
          target="_blank"
          rel="noreferrer"
          className={
            primary
              ? "glass group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              : "inline-flex items-center gap-1.5 text-sm text-white/60 transition hover:text-white"
          }
        >
          {primary ? "Live site" : "Live"}
          <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      )}
    </div>
  );
}

const CARD_GLOWS = ["139 92 246", "236 72 153", "245 158 11"];

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <SectionHeading
        index="04"
        kicker="Projects"
        title={
          <>
            Built <span className="text-gradient">end-to-end</span>.
          </>
        }
        sub="From native desktop tooling in Rust to Spring Boot APIs — a selection from work and GitHub."
      />

      <div className="space-y-8">
        {featuredProjects.map((p, idx) => (
          <Reveal key={p.title}>
            <TiltCard className="glow-border" max={4} glow={idx === 0 ? "139 92 246" : "34 211 238"}>
              <div className="grid gap-8 p-6 md:p-10 lg:grid-cols-2 lg:gap-12">
                <div className={`flex flex-col ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                  <span className="w-fit rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1 font-mono text-xs text-cyan">
                    {p.badge}
                  </span>
                  <h3 className="mt-5 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-lg text-white/50">{p.subtitle}</p>
                  <ul className="mt-7 space-y-3">
                    {p.points.map((pt, i) => (
                      <li key={pt} className="flex gap-4 text-white/70">
                        <span className="font-mono text-sm text-white/30">0{i + 1}</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span key={s} className="rounded-full bg-white/[0.06] px-3 py-1 font-mono text-xs text-white/60">
                        {s}
                      </span>
                    ))}
                  </div>
                  {(p.repo || p.live) && (
                    <div className="mt-8">
                      <LinkButtons p={p} primary />
                    </div>
                  )}
                </div>
                <div className="relative min-h-[300px] rounded-2xl border border-white/10 bg-black/30 p-4">
                  <span className="absolute top-3 left-4 font-mono text-[10px] tracking-widest text-white/30 uppercase">
                    {p.visual === "orbit" ? "theorbit.preview" : "architecture.svg"}
                  </span>
                  {p.visual === "orbit" ? <OrbitVisual /> : <ArchitectureDiagram />}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {moreProjects.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <TiltCard className="p-7" max={6} glow={CARD_GLOWS[i % CARD_GLOWS.length]}>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <Folder size={28} className="text-cyan" />
                  <span className="flex items-center gap-1.5 font-mono text-xs text-white/40">
                    <span className={`h-2 w-2 rounded-full ${p.badge === "Java" ? "bg-amber" : "bg-yellow-300"}`} />
                    {p.badge}
                  </span>
                </div>
                <h4 className="mt-6 font-display text-2xl font-semibold text-white">{p.title}</h4>
                <p className="mt-1 text-sm text-white/45">{p.subtitle}</p>
                <ul className="mt-4 space-y-2">
                  {p.points.map((pt) => (
                    <li key={pt} className="text-[14.5px] leading-relaxed text-white/65">{pt}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span key={s} className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-white/55">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-6">
                  <LinkButtons p={p} />
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 flex justify-center">
        <a
          href={`${profile.github}?tab=repositories`}
          target="_blank"
          rel="noreferrer"
          className="glass group inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <Star size={17} className="text-amber" />
          Explore all repositories on GitHub
          <ExternalLink size={15} className="transition-transform group-hover:translate-x-0.5" />
        </a>
      </Reveal>
    </section>
  );
}
