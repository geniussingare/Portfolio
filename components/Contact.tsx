"use client";

import { Check, Copy, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { profile } from "@/data/resume";
import Reveal from "./ui/Reveal";
import { GithubIcon, LinkedinIcon } from "./ui/BrandIcons";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const channels = [
    { icon: <LinkedinIcon className="h-5 w-5" />, label: "LinkedIn", value: "in/geniussingare", href: profile.linkedin },
    { icon: <GithubIcon className="h-5 w-5" />, label: "GitHub", value: "@geniussingare", href: profile.github },
    { icon: <Phone size={20} />, label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/-/g, "")}` },
  ];

  return (
    <section id="contact" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 md:py-32">
      <Reveal>
        <div className="glass glow-border relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center md:px-16 md:py-24">
          <div aria-hidden className="absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-violet/30 blur-[100px]" />
          <div className="relative">
            <div className="mb-6 font-mono text-xs tracking-[0.25em] text-cyan uppercase">
              06 — POST /contact
            </div>
            <h2 className="mx-auto max-w-4xl font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.03em] text-white">
              Have a system to <span className="text-gradient">scale</span>?
              <br /> Let&apos;s talk.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/55">
              I&apos;m open to backend and full-stack roles where reliability, performance and clean
              architecture matter. My inbox is always open.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet via-pink to-cyan px-7 py-4 font-semibold text-white shadow-[0_10px_40px_-10px_rgb(139_92_246/0.8)] transition-transform hover:scale-[1.03]"
              >
                <Mail size={18} /> {profile.email}
              </a>
              <button
                onClick={copy}
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-4 font-medium text-white transition hover:bg-white/10"
              >
                {copied ? <Check size={18} className="text-emerald-300" /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy email"}
              </button>
            </div>

            <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.07] text-white/80 group-hover:text-cyan">
                    {c.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-white/40">{c.label}</span>
                    <span className="block truncate text-sm text-white/85">{c.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
