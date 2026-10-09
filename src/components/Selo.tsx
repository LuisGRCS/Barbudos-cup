import type { ReactNode } from "react";

/** Selo mostrado no lugar de qualquer informação que a organização ainda não definiu */
export function SeloADefinir({ grande = false, sobreSol = false }: { grande?: boolean; sobreSol?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 font-semibold ring-1 ring-inset ${
        sobreSol
          ? "bg-[repeating-linear-gradient(-45deg,rgba(0,0,0,0.14)_0_6px,transparent_6px_12px)] text-preto ring-preto/60"
          : "bg-[repeating-linear-gradient(-45deg,rgba(247,200,30,0.16)_0_6px,transparent_6px_12px)] text-sol ring-sol/50"
      } ${
        grande ? "py-1 text-lg" : "py-0.5 text-base"
      }`}
      style={{ clipPath: "polygon(0.35rem 0, 100% 0, calc(100% - 0.35rem) 100%, 0 100%)" }}
    >
      A definir
    </span>
  );
}

/** Mostra o conteúdo quando o valor existe; caso contrário, o selo "A definir" */
export function Campo<T>({
  valor,
  children,
  grande,
  sobreSol,
}: {
  valor: T | null | undefined;
  children?: (v: T) => ReactNode;
  grande?: boolean;
  sobreSol?: boolean;
}) {
  const vazio = valor === null || valor === undefined || (typeof valor === "string" && valor.trim() === "");
  if (vazio) return <SeloADefinir grande={grande} sobreSol={sobreSol} />;
  return <>{children ? children(valor as T) : String(valor)}</>;
}
