export function BarraVagas({ preenchidas, total }: { preenchidas: number; total: number | null }) {
  if (!total) return null;
  const pct = Math.min(100, Math.round((preenchidas / total) * 100));
  return (
    <div>
      <p className="numeros text-lg font-semibold">
        {preenchidas} de {total} vagas preenchidas
      </p>
      <div
        className="mt-2 h-3 bg-preto/40"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={preenchidas}
        aria-label="Vagas preenchidas"
        style={{ clipPath: "polygon(0.4rem 0,100% 0,calc(100% - 0.4rem) 100%,0 100%)" }}
      >
        <div className="h-full bg-current" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
