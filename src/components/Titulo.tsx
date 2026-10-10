import type { ReactNode } from "react";

export function TituloPagina({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <header className="pt-8 pb-8 sm:pt-12 sm:pb-10">
      <h1 className="text-[clamp(2.6rem,10vw,4.25rem)]">{titulo}</h1>
      {children && <div className="mt-3 max-w-[56ch] text-lg leading-snug text-cinza">{children}</div>}
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
  return <div className={`mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
