/** Uma casinha por vaga: preenchida = time confirmado */
export function BarraVagas({ preenchidas, total }: { preenchidas: number; total: number | null }) {
  if (!total) return null;
  return (
    <div>
      <ol className="flex flex-wrap gap-1.5" aria-label={`${preenchidas} de ${total} vagas preenchidas`}>
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            aria-hidden="true"
            className={`h-7 w-5 border-2 border-current ${i < preenchidas ? "bg-current" : ""}`}
          />
        ))}
      </ol>
      <p className="numeros mt-2 font-semibold">
        {preenchidas} de {total} vagas preenchidas
      </p>
    </div>
  );
}
