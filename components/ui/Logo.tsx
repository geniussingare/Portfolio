import { useId } from "react";

/** Orbit "G" mark: a gradient ring curling into a G, with a service node riding its tip. */
export default function Logo({ className = "h-9 w-9" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Ganesh Singare logo">
      <defs>
        <linearGradient id={`${id}-g`} x1="8" y1="56" x2="56" y2="8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
        <radialGradient id={`${id}-n`}>
          <stop offset="0" stopColor="#22d3ee" stopOpacity="0.9" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M46.14 17.86 A20 20 0 1 0 52 32 H35"
        fill="none"
        stroke={`url(#${id}-g)`}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="46.14" cy="17.86" r="9" fill={`url(#${id}-n)`} />
      <circle cx="46.14" cy="17.86" r="4.2" fill="#fff" />
    </svg>
  );
}
