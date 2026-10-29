"use client";

import {
  Cloud,
  Code2,
  Cpu,
  Database,
  FlaskConical,
  LayoutTemplate,
  Server,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { skills } from "@/data/resume";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";

const ICONS: Record<string, LucideIcon> = {
  server: Server,
  code: Code2,
  database: Database,
  sparkles: Sparkles,
  shield: ShieldCheck,
  cloud: Cloud,
  layout: LayoutTemplate,
  flask: FlaskConical,
  cpu: Cpu,
};

const GLOWS = ["139 92 246", "34 211 238", "236 72 153", "245 158 11"];
const GRADIENTS = [
  "from-violet to-pink",
  "from-cyan to-violet",
  "from-pink to-amber",
  "from-amber to-cyan",
];

const MARQUEE = [
  "Java", "Spring Boot", "Microservices", "REST", "JPA", "Hibernate", "Redis",
  "PostgreSQL", "MySQL", "AWS S3", "Docker", "JWT", "OAuth2", "RAG", "LLMs",
  "JUnit", "Testcontainers", "React", "Next.js",
];

export default function Skills() {
  return (
    <section id="skills" className="relative scroll-mt-24 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          index="02"
          kicker="Tech Stack"
          title={
            <>
              The toolkit behind <span className="text-gradient">the APIs</span>.
            </>
          }
          sub="Backend-first, with enough frontend and cloud to ship features end-to-end."
        />

        <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-5">
          {skills.map((g, i) => {
            const Icon = ICONS[g.icon] ?? Code2;
            return (
              <Reveal
                key={g.title}
                delay={(i % 4) * 0.06}
                className={g.span === "wide" ? "sm:col-span-2" : ""}
              >
                <TiltCard className="p-6" max={6} glow={GLOWS[i % 4]}>
                  <div className="flex items-start justify-between">
                    <div
                      className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${GRADIENTS[i % 4]} shadow-lg`}
                    >
                      <Icon size={22} className="text-white" />
                    </div>
                    <span className="font-mono text-xs text-white/30">
                      {String(g.items.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-white">
                    {g.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {g.items.map((s) => (
                      <span
                        key={s}
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[13px] text-white/75 transition-colors group-hover:border-white/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Infinite tech marquee */}
      <div className="relative mt-20 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          className="flex w-max gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span
              key={i}
              className="glass rounded-full px-6 py-3 font-display text-lg whitespace-nowrap text-white/70"
            >
              <span className="mr-3 text-cyan">◆</span>
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
