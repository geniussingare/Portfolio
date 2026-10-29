import { Award, BadgeCheck, GraduationCap, Trophy } from "lucide-react";
import { achievements, certifications, education } from "@/data/resume";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import TiltCard from "./ui/TiltCard";

export default function Achievements() {
  const award = achievements[0];
  return (
    <section id="achievements" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <SectionHeading
        index="05"
        kicker="Recognition & Learning"
        title={
          <>
            Awards, education <span className="text-gradient">& certs</span>.
          </>
        }
      />

      <div className="grid gap-5 md:grid-cols-3">
        <Reveal className="md:row-span-2">
          <TiltCard className="p-8" glow="245 158 11">
            <div className="relative flex h-full flex-col">
              <div className="relative mx-auto my-6 grid h-40 w-40 place-items-center">
                <div className="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#f59e0b,#ec4899,#8b5cf6,#22d3ee,#f59e0b)] opacity-60 blur-xl" />
                <div className="glass relative grid h-32 w-32 animate-float place-items-center rounded-full">
                  <Trophy size={52} className="text-amber drop-shadow-[0_0_18px_#f59e0b]" />
                </div>
              </div>
              <span className="font-mono text-sm text-amber">{award.date}</span>
              <h3 className="mt-2 font-display text-3xl font-bold text-white">{award.title}</h3>
              <p className="mt-3 text-white/60">{award.detail}</p>
              <p className="mt-auto pt-6 font-mono text-xs text-white/30">Novatech Software Pvt. Ltd.</p>
            </div>
          </TiltCard>
        </Reveal>

        <Reveal delay={0.08} className="md:col-span-2">
          <TiltCard className="p-8" max={5} glow="139 92 246">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet to-pink">
                <GraduationCap size={30} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-2xl font-semibold text-white">{education.degree}</h3>
                <p className="mt-1 text-white/55">{education.school}</p>
                <div className="mt-4 flex flex-wrap gap-3 font-mono text-sm">
                  <span className="rounded-full bg-white/[0.06] px-3 py-1 text-white/60">{education.period}</span>
                  <span className="rounded-full border border-violet/40 bg-violet/15 px-3 py-1 text-violet-200">
                    {education.score}
                  </span>
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {certifications.map((c, i) => (
          <Reveal key={c.title} delay={0.12 + i * 0.06}>
            <TiltCard className="p-7" max={6} glow={i === 0 ? "34 211 238" : "236 72 153"}>
              <div className="flex items-start justify-between">
                {i === 0 ? (
                  <BadgeCheck size={30} className="text-cyan" />
                ) : (
                  <Award size={30} className="text-pink" />
                )}
                <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
                  Certification
                </span>
              </div>
              <h4 className="mt-6 font-display text-xl font-semibold text-white">{c.title}</h4>
              <p className="mt-1 text-sm text-white/50">{c.issuer}</p>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
