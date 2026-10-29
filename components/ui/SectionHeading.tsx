import Reveal from "./Reveal";

export default function SectionHeading({
  index,
  kicker,
  title,
  sub,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <Reveal className="mb-14 md:mb-20">
      <div className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-cyan uppercase">
        <span className="text-white/40">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-cyan to-transparent" />
        {kicker}
      </div>
      <h2 className="font-display text-4xl leading-[1.05] font-bold tracking-tight text-white md:text-6xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-5 max-w-2xl text-base text-white/60 md:text-lg">{sub}</p>
      )}
    </Reveal>
  );
}
