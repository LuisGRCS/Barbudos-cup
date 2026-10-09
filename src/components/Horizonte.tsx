/* O horizonte da logo: sol nascendo atrás do mar, com reflexos amarelos na água */

const RAIOS = [0.95, 0.6, 0.82, 0.55, 1, 0.58, 0.85, 0.62, 0.9];

export function Horizonte({ className = "" }: { className?: string }) {
  const cx = 150;
  const cy = 150;
  const n = RAIOS.length;
  const raios = RAIOS.map((comp, i) => {
    const a = Math.PI + (i + 0.5) * (Math.PI / n);
    const meia = Math.PI / n / 2.4;
    const r0 = 62;
    const r1 = 62 + comp * 86;
    const p = (r: number, ang: number) => `${(cx + Math.cos(ang) * r).toFixed(1)},${(cy + Math.sin(ang) * r).toFixed(1)}`;
    return `${p(r0, a - meia)} ${p(r1, a)} ${p(r0, a + meia)}`;
  });

  return (
    <div aria-hidden="true" className={`relative ${className}`}>
      <svg viewBox="0 0 300 150" className="anim-sol absolute right-[6%] bottom-full w-[min(68vw,22rem)] translate-y-[3px] text-sol lg:right-auto lg:left-[8%]">
        {raios.map((pts, i) => (
          <polygon key={i} points={pts} fill="currentColor" />
        ))}
        <path d="M88 150a62 62 0 0 1 124 0Z" fill="currentColor" />
      </svg>
      <div className="relative h-14 overflow-hidden bg-azul sm:h-16">
        {/* reflexos do sol na água */}
        <div className="absolute inset-y-0 right-[6%] w-[min(68vw,22rem)] lg:right-auto lg:left-[8%]">
          <span className="absolute top-[18%] left-[18%] h-[3px] w-[64%] bg-sol" />
          <span className="absolute top-[42%] left-[28%] h-[3px] w-[44%] bg-sol" />
          <span className="absolute top-[66%] left-[38%] h-[3px] w-[24%] bg-sol" />
        </div>
      </div>
      <div className="h-1.5 bg-vermelho" />
    </div>
  );
}
