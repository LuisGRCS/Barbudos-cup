import type { ReactNode } from "react";

/** Item recolhível (accordion) usando <details>, acessível por teclado sem JavaScript */
export function Sanfona({
  titulo,
  children,
  aberto = false,
  id,
}: {
  titulo: ReactNode;
  children: ReactNode;
  aberto?: boolean;
  id?: string;
}) {
  return (
    <details id={id} open={aberto} className="group scroll-mt-24 border-b-2 border-linha">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5 text-left text-xl font-semibold transition-colors hover:text-sol [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">{titulo}</span>
        <span
          aria-hidden="true"
          className="relative mt-1.5 size-5 shrink-0 before:absolute before:top-1/2 before:left-0 before:h-[3px] before:w-full before:-translate-y-1/2 before:bg-sol after:absolute after:top-0 after:left-1/2 after:h-full after:w-[3px] after:-translate-x-1/2 after:bg-sol after:transition-transform group-open:after:scale-y-0"
        />
      </summary>
      <div className="pb-7 text-cinza">{children}</div>
    </details>
  );
}
