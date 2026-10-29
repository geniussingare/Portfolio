export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[20%] -left-[10%] h-[60vmax] w-[60vmax] rounded-full bg-violet/25 blur-[120px] animate-blob" />
      <div
        className="absolute top-[30%] -right-[15%] h-[50vmax] w-[50vmax] rounded-full bg-cyan/15 blur-[120px] animate-blob"
        style={{ animationDelay: "-7s" }}
      />
      <div
        className="absolute -bottom-[25%] left-[20%] h-[55vmax] w-[55vmax] rounded-full bg-pink/15 blur-[140px] animate-blob"
        style={{ animationDelay: "-14s" }}
      />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 noise opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
