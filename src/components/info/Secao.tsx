import type { ReactNode } from "react";

/** Bloco de conteúdo com título, separado por um traço angular vermelho */
export function Secao({
  id,
  titulo,
  icone,
  children,
  intro,
}: {
  id: string;
  titulo: string;
  icone?: ReactNode;
  children: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24 border-t-2 border-linha pt-8 pb-14 first:border-t-0 first:pt-0">
      <div className="mb-6 flex items-center gap-3">
        {icone && <span className="text-3xl text-sol">{icone}</span>}
        <h2 id={id} className="text-[clamp(2rem,7vw,3.25rem)]">
          {titulo}
        </h2>
      </div>
      {intro && <div className="mb-6 max-w-[62ch] text-cinza">{intro}</div>}
      {children}
    </section>
  );
}
