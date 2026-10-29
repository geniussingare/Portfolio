"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, Download, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { profile } from "@/data/resume";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center">
      <div className="h-40 w-40 animate-pulse rounded-full bg-violet/30 blur-2xl" />
    </div>
  ),
});

const ease = [0.22, 1, 0.36, 1] as const;

function RoleRotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={profile.roles[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className="text-gradient font-semibold whitespace-nowrap"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pt-28 pb-16 sm:px-6 lg:flex-row lg:items-center lg:gap-6"
    >
      {/* 3D constellation: right column on desktop, faded backdrop on mobile */}
      <div className="pointer-events-none absolute inset-0 opacity-30 lg:pointer-events-auto lg:relative lg:order-2 lg:h-[640px] lg:flex-1 lg:opacity-100">
        <HeroScene />
      </div>

      <div className="relative z-10 lg:order-1 lg:max-w-xl lg:flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          className="glass mb-7 inline-flex items-center gap-2 rounded-full py-1.5 pr-4 pl-1.5 text-xs text-white/70"
        >
          <span className="relative flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-1 font-mono text-[11px] text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            200 OK
          </span>
          Open to backend engineering roles
        </motion.div>

        <h1 className="font-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.92] font-bold tracking-[-0.04em] text-white">
          {[profile.firstName, profile.lastName].map((word, wi) => (
            <span key={word} className="block overflow-hidden pb-2">
              <motion.span
                className={`block ${wi === 1 ? "text-gradient" : ""}`}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.15 + wi * 0.12, ease }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
        >
          <p className="mt-6 text-xl text-white/80 md:text-2xl">
            <RoleRotator />
          </p>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/55 md:text-lg">
            {profile.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-violet via-pink to-cyan px-6 py-3.5 font-semibold text-white shadow-[0_10px_40px_-10px_rgb(139_92_246/0.8)] transition-transform hover:scale-[1.03]"
            >
              Let&apos;s build something
              <ArrowDownRight size={18} className="transition-transform group-hover:rotate-[-45deg]" />
            </a>
            <a
              href={profile.resume}
              download
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-medium text-white transition hover:bg-white/10"
            >
              <Download size={17} /> Resume
            </a>
            <div className="flex items-center gap-2 pl-1">
              <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"
                className="glass grid h-12 w-12 place-items-center rounded-full text-white/80 transition hover:text-white hover:shadow-[0_0_24px_rgb(34_211_238/0.4)]">
                <GithubIcon className="h-5 w-5" />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"
                className="glass grid h-12 w-12 place-items-center rounded-full text-white/80 transition hover:text-white hover:shadow-[0_0_24px_rgb(34_211_238/0.4)]">
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="mt-10 flex items-center gap-2 font-mono text-xs text-white/40">
            <MapPin size={14} /> {profile.location} · Java · Spring Boot · Microservices
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase md:flex"
      >
        scroll
        <span className="relative h-10 w-6 rounded-full border border-white/20">
          <span className="absolute top-2 left-1/2 h-2 w-1 -translate-x-1/2 animate-bounce rounded-full bg-cyan" />
        </span>
      </motion.a>
    </section>
  );
}
