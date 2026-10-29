"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Sparkles, X } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { profile } from "@/data/resume";
import Logo from "./ui/Logo";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What's Ganesh's core tech stack?",
  "Tell me about his AI / RAG work",
  "What is TheOrbit?",
  "Is he a fit for a Java backend role?",
];

const GREETING: Msg = {
  role: "assistant",
  content: `Hi! I'm ${profile.firstName}'s AI assistant. Ask me anything about his experience, skills or projects — I answer from his resume and GitHub.`,
};

/* Turn URLs and emails in plain-text answers into links. */
function linkify(text: string): ReactNode[] {
  const parts = text.split(/(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.]+)/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noreferrer" className="text-cyan underline underline-offset-2 break-all">
          {part.replace(/^https?:\/\//, "")}
        </a>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="text-cyan underline underline-offset-2">
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    setInput("");
    const history: Msg[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    const setReply = (content: string) =>
      setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The greeting is UI-only, so it isn't sent to the model.
        body: JSON.stringify({ messages: history.slice(1) }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setReply(
          `${data.error ?? "I couldn't reach the assistant."} You can always email ${profile.firstName} directly at ${profile.email}.`
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setReply(reply);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setReply(`Connection lost. Please try again, or email ${profile.email}.`);
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  const showSuggestions = messages.length === 1;

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: 1.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.15 } }}
            onClick={() => setOpen(true)}
            aria-label="Open AI assistant"
            className="group fixed right-4 bottom-4 z-[60] flex items-center gap-3 rounded-full py-2 pr-5 pl-2 sm:right-6 sm:bottom-6 glass bg-black/50"
          >
            <span className="relative grid h-11 w-11 place-items-center">
              <span className="absolute inset-0 animate-spin-slow rounded-full bg-[conic-gradient(from_0deg,#8b5cf6,#22d3ee,#ec4899,#8b5cf6)] blur-[6px] opacity-90" />
              <span className="relative grid h-10 w-10 place-items-center rounded-full bg-ink">
                <Sparkles size={18} className="text-white" />
              </span>
            </span>
            <span className="text-left">
              <span className="block text-sm font-semibold text-white">Ask my AI</span>
              <span className="block text-[11px] text-white/50">about Ganesh</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label={`${profile.firstName}'s AI assistant`}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass fixed inset-x-2 bottom-2 z-[60] flex h-[min(620px,calc(100svh-1rem))] origin-bottom-right flex-col overflow-hidden rounded-3xl bg-[#0a0b18] sm:inset-x-auto sm:bg-[#0a0b18]/95 sm:right-6 sm:bottom-6 sm:w-[400px]"
          >
            <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-violet/30 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <span className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-ink">
                <Logo className="h-7 w-7" />
                <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#0a0b18]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-white">Ganesh&apos;s AI</p>
                <p className="truncate text-xs text-white/45">Answers from his resume &amp; GitHub</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close assistant"
                className="grid h-9 w-9 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="relative flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "rounded-br-md bg-gradient-to-br from-violet to-pink text-white"
                        : "rounded-bl-md border border-white/10 bg-white/[0.05] text-white/85"
                    }`}
                  >
                    {m.content ? (
                      linkify(m.content)
                    ) : (
                      <span className="flex gap-1 py-1.5" aria-label="Thinking">
                        {[0, 1, 2].map((d) => (
                          <span
                            key={d}
                            className="h-2 w-2 animate-bounce rounded-full bg-cyan"
                            style={{ animationDelay: `${d * 0.15}s` }}
                          />
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {showSuggestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-left text-[13px] text-white/75 transition hover:border-cyan/50 hover:bg-cyan/10 hover:text-white"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={onSubmit} className="relative border-t border-white/10 p-3">
              <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 focus-within:border-violet/60">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  rows={1}
                  maxLength={1000}
                  placeholder="Ask about experience, skills, projects…"
                  className="max-h-28 flex-1 resize-none bg-transparent px-2.5 py-2 text-[14.5px] text-white placeholder:text-white/35 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || busy}
                  aria-label="Send"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet to-cyan text-white transition disabled:opacity-30"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10.5px] text-white/30">
                AI can make mistakes — confirm details with {profile.firstName}.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
