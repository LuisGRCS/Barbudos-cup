import type { ReactNode } from "react";
import { Icone } from "@/components/Icone";

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
    <details id={id} open={aberto} className="sanfona group border-b border-linha">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-xl font-semibold transition-colors hover:text-sol [&::-webkit-details-marker]:hidden">
        <span>{titulo}</span>
        <Icone
          nome="seta"
          className="shrink-0 text-2xl text-vermelho transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="pb-6 text-cinza">{children}</div>
    </details>
  );
}
