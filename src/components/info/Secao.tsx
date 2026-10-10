import type { ReactNode } from "react";

/** Bloco de conteúdo: título à esquerda no computador, empilhado no celular */
export function Secao({
  id,
  titulo,
  children,
  intro,
}: {
  id: string;
  titulo: string;
  children: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="grid scroll-mt-32 gap-5 border-t-2 border-branco pt-6 pb-16 lg:grid-cols-[19rem_1fr] lg:gap-10"
    >
      <h2 id={id} className="text-[clamp(2.6rem,10vw,3.75rem)]">
        {titulo}
      </h2>
      <div className="min-w-0">
        {intro && <div className="mb-6 max-w-[56ch] text-lg text-cinza">{intro}</div>}
        {children}
      </div>
    </section>
  );
}
