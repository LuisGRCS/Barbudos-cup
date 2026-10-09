import type { ReactNode } from "react";

/** Lista de informações "rótulo: valor", usada nas páginas de Informações e Inscrição */
export function ListaInfo({ children }: { children: ReactNode }) {
  return <dl className="divide-y divide-linha border-y border-linha">{children}</dl>;
}

export function LinhaInfo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
      <dt className="text-cinza">{rotulo}</dt>
      <dd className="text-lg font-semibold whitespace-pre-line">{children}</dd>
    </div>
  );
}
