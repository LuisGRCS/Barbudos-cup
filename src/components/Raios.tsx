/* Raios de sol da logo, com comprimentos irregulares como no desenho original */
const RAIOS = [1, 0.62, 0.86, 0.55, 0.95, 0.6, 0.8, 0.5, 0.9, 0.58, 0.84, 0.52, 0.97, 0.6, 0.82, 0.56];

export function Raios({ className = "" }: { className?: string }) {
  const n = RAIOS.length;
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      {RAIOS.map((comp, i) => {
        const angulo = (i / n) * Math.PI * 2 - Math.PI / 2;
        const meia = Math.PI / n / 2.2;
        const r0 = 30;
        const r1 = 30 + comp * 70;
        const p = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`;
        return (
          <polygon
            key={i}
            points={`${p(r0, angulo - meia)} ${p(r1, angulo)} ${p(r0, angulo + meia)}`}
            fill="currentColor"
          />
        );
      })}
    </svg>
  );
}
