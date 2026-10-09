import type { ReactNode } from "react";

/**
 * Marcação para informação que a organização ainda não definiu:
 * um campo tracejado, como espaço em branco de ficha a preencher.
 */
export function SeloADefinir({ grande = false, sobreSol = false }: { grande?: boolean; sobreSol?: boolean }) {
  return (
    <span
      className={`inline-block border-[1.5px] border-dashed px-2 align-middle leading-snug font-semibold ${
        sobreSol ? "border-preto/60 text-preto" : "border-sol/70 text-sol"
      } ${grande ? "py-0.5 text-[0.62em] tracking-normal normal-case" : "py-px text-[0.9em]"}`}
      style={grande ? { fontFamily: "var(--font-texto)", fontWeight: 600 } : undefined}
    >
      a definir
    </span>
  );
}

/** Mostra o conteúdo quando o valor existe; caso contrário, a marcação "a definir" */
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
