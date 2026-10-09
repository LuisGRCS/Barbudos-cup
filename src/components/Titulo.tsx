import type { ReactNode } from "react";

export function TituloPagina({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <header className="grid gap-5 pt-10 pb-10 sm:pt-16 sm:pb-14 lg:grid-cols-[1fr_24rem] lg:items-end">
      <h1 className="text-[clamp(3.6rem,17vw,9.5rem)]">{titulo}</h1>
      {children && <div className="max-w-[46ch] text-xl leading-snug text-cinza lg:pb-3">{children}</div>}
    </header>
  );
}

export function TituloSecao({ id, titulo, children }: { id?: string; titulo: string; children?: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 id={id} className="text-[clamp(2.4rem,9vw,4rem)]">
        {titulo}
      </h2>
      {children && <p className="mt-3 max-w-[60ch] text-cinza">{children}</p>}
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
