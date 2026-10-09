"use client";

import type { ReactNode } from "react";
import { useAgora } from "@/hooks/useAgora";

function partes(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    dias: Math.floor(s / 86400),
    horas: Math.floor((s % 86400) / 3600),
    minutos: Math.floor((s % 3600) / 60),
    segundos: s % 60,
  };
}

/**
 * Contagem regressiva. Calculada no navegador (hora do aparelho), então
 * nunca fica desatualizada pelo cache das páginas.
 */
export function Contagem({
  alvo,
  aoTerminar,
  tamanho = "grande",
  rotulo,
  titulo,
}: {
  alvo: string;
  aoTerminar?: ReactNode;
  tamanho?: "grande" | "medio";
  rotulo: string;
  titulo?: ReactNode;
}) {
  const agora = useAgora();

  const restante = agora === null ? null : new Date(alvo).getTime() - agora;
  if (restante !== null && restante <= 0) return <>{aoTerminar}</>;

  const p = restante === null ? null : partes(restante);
  const itens = [
    { valor: p?.dias, nome: p?.dias === 1 ? "dia" : "dias" },
    { valor: p?.horas, nome: p?.horas === 1 ? "hora" : "horas" },
    { valor: p?.minutos, nome: "min" },
    { valor: p?.segundos, nome: "seg" },
  ];
  const grande = tamanho === "grande";

  return (
    <div>
      {titulo}
      <div role="timer" aria-label={rotulo}>
      <dl className={`grid grid-cols-4 ${grande ? "gap-2 sm:gap-3" : "gap-1.5"}`}>
        {itens.map((item, i) => (
          <div
            key={i}
            className={`recorte-escudo flex flex-col items-center bg-grafite ${
              grande ? "px-2 pt-3 pb-6 [--ponta:0.9rem] sm:pt-4 sm:pb-7" : "px-1 pt-2 pb-4 [--ponta:0.6rem]"
            }`}
          >
            <dt className={`order-last font-semibold text-cinza ${grande ? "mt-1.5 text-base" : "mt-1 text-sm"}`}>
              {item.nome}
            </dt>
            <dd
              className={`numeros font-titulo leading-none text-sol ${
                grande ? "text-[clamp(2.4rem,11vw,4.5rem)]" : "text-[2rem]"
              }`}
              aria-live="off"
            >
              {item.valor === undefined ? "––" : String(item.valor).padStart(2, "0")}
            </dd>
          </div>
        ))}
      </dl>
      </div>
    </div>
  );
}
