import { profile } from "@/data/resume";
import Logo from "./ui/Logo";

export default function Footer() {
  return (
    <footer className="relative mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/40 sm:flex-row">
        <p className="flex items-center gap-2.5">
          <Logo className="h-6 w-6" />
          © {new Date().getFullYear()} {profile.name}. Crafted with Next.js, Three.js & lots of ☕.
        </p>
        <a href="#top" className="font-mono text-xs tracking-widest uppercase hover:text-white">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
