"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile, stats } from "@/data/resume";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const target = parseFloat(value);
  const decimals = value.includes(".") ? 1 : 0;
  const suffix = value.replace(/[\d.]/g, "");
  const [shown, setShown] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, target, decimals]);

  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}

/* A tiny Spring controller describing Ganesh — the "about me" in his native language. */
function CodeCard() {
  const k = "text-pink";
  const a = "text-amber";
  const s = "text-emerald-300";
  const t = "text-cyan";
  const c = "text-white/35";
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-white/40">GaneshController.java</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-6 text-white/80 md:text-[13.5px]">
        <code>
          <span className={a}>@RestController</span>{"\n"}
          <span className={a}>@RequestMapping</span>(<span className={s}>&quot;/api/v1/ganesh&quot;</span>){"\n"}
          <span className={k}>public class</span> <span className={t}>GaneshController</span> {"{"}{"\n"}
          {"\n"}
          {"  "}<span className={c}>{"// 3+ years shipping backend systems"}</span>{"\n"}
          {"  "}<span className={a}>@GetMapping</span>(<span className={s}>&quot;/stack&quot;</span>){"\n"}
          {"  "}<span className={k}>public</span> <span className={t}>List</span>&lt;<span className={t}>String</span>&gt; stack() {"{"}{"\n"}
          {"    "}<span className={k}>return</span> <span className={t}>List</span>.of(<span className={s}>&quot;Java&quot;</span>, <span className={s}>&quot;Spring Boot&quot;</span>,{"\n"}
          {"        "}<span className={s}>&quot;Microservices&quot;</span>, <span className={s}>&quot;RAG&quot;</span>);{"\n"}
          {"  }"}{"\n"}
          {"\n"}
          {"  "}<span className={a}>@PostMapping</span>(<span className={s}>&quot;/ideas&quot;</span>){"\n"}
          {"  "}<span className={k}>public</span> <span className={t}>ResponseEntity</span>&lt;<span className={t}>System</span>&gt; build(){"{"}{"\n"}
          {"    "}<span className={k}>return</span> <span className={t}>ResponseEntity</span>.ok({"\n"}
          {"        "}scalable().secure().reliable());{"\n"}
          {"  }"}{"\n"}
          {"}"}
        </code>
      </pre>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <SectionHeading
        index="01"
        kicker="About"
        title={
          <>
            Owning features from <span className="text-gradient">schema</span>
            <br className="hidden md:block" /> to <span className="text-gradient">production</span>.
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <div className="glass h-full rounded-3xl p-7 md:p-10">
            <p className="text-lg leading-relaxed text-white/75 md:text-xl md:leading-relaxed">
              {profile.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Performance", "Reliability", "Clean Architecture", "End-to-end Ownership"].map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-white/70">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-2">
          <CodeCard />
        </Reveal>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <TiltCard className="p-6 md:p-8" glow={["139 92 246", "34 211 238", "236 72 153", "245 158 11"][i]}>
              <div className="font-display text-5xl font-bold tracking-tight text-white md:text-6xl">
                <CountUp value={s.value} />
              </div>
              <div className="mt-2 text-sm text-white/50">{s.label}</div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
