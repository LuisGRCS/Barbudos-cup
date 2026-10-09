import type { ReactNode } from "react";

/** Os dois traços vermelhos em ângulo, como a base do escudo */
export function Divisa({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 14" className={`h-3.5 w-[7.5rem] text-vermelho ${className}`} aria-hidden="true">
      <path d="M0 0h8l52 10L112 0h8L60 14Z" fill="currentColor" />
    </svg>
  );
}

export function TituloPagina({ titulo, children }: { titulo: string; children?: ReactNode }) {
  return (
    <header className="pt-8 pb-8 sm:pt-14 sm:pb-12">
      <h1 className="text-[clamp(3rem,13vw,7rem)]">{titulo}</h1>
      <Divisa className="mt-4" />
      {children && <div className="mt-5 max-w-[62ch] text-xl text-cinza">{children}</div>}
    </header>
  );
}

export function TituloSecao({ id, titulo, children }: { id?: string; titulo: string; children?: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 id={id} className="text-[clamp(2rem,7vw,3.25rem)]">
        {titulo}
      </h2>
      {children && <p className="mt-3 max-w-[62ch] text-cinza">{children}</p>}
    </div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
