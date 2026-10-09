import type { ReactNode } from "react";

/** Lista de informações "rótulo: valor", usada nas páginas de Informações e Inscrição */
export function ListaInfo({ children }: { children: ReactNode }) {
  return <dl className="divide-y-2 divide-linha">{children}</dl>;
}

export function LinhaInfo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="grid gap-0.5 py-3.5 first:pt-0 sm:grid-cols-[13rem_1fr] sm:gap-6">
      <dt className="text-cinza">{rotulo}</dt>
      <dd className="text-xl font-semibold whitespace-pre-line">{children}</dd>
    </div>
  );
}
