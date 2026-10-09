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
 * Contagem regressiva no estilo placar. Calculada no navegador (hora do aparelho),
 * então nunca fica desatualizada pelo cache das páginas.
 */
export function Contagem({
  alvo,
  aoTerminar,
  rotulo,
  titulo,
  tom = "claro",
}: {
  alvo: string;
  aoTerminar?: ReactNode;
  rotulo: string;
  titulo?: ReactNode;
  tom?: "claro" | "escuro";
}) {
  const agora = useAgora();
  const restante = agora === null ? null : new Date(alvo).getTime() - agora;
  if (restante !== null && restante <= 0) return <>{aoTerminar}</>;

  const p = restante === null ? null : partes(restante);
  const itens = [
    { valor: p?.dias, nome: p?.dias === 1 ? "dia" : "dias" },
    { valor: p?.horas, nome: p?.horas === 1 ? "hora" : "horas" },
    { valor: p?.minutos, nome: "minutos" },
    { valor: p?.segundos, nome: "segundos" },
  ];
  const escuro = tom === "escuro";

  return (
    <div>
      {titulo}
      <div role="timer" aria-label={rotulo} data-alvo={alvo}>
        <dl className={`grid grid-cols-4 divide-x-2 ${escuro ? "divide-preto/20" : "divide-giz"}`}>
          {itens.map((item, i) => (
            <div key={i} className="flex flex-col px-2 first:pl-0 sm:px-5">
              <dt className={`order-last text-sm font-semibold sm:text-base ${escuro ? "text-preto/70" : "text-cinza"}`}>
                {item.nome}
              </dt>
              <dd
                className={`numeros font-titulo text-[clamp(3rem,15vw,5.5rem)] leading-[0.9] font-black ${
                  escuro ? "text-preto" : i === 0 ? "text-sol" : "text-branco"
                }`}
              >
                {item.valor === undefined ? "--" : String(item.valor).padStart(2, "0")}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
