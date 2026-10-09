"use client";

import { useAgora } from "@/hooks/useAgora";

export type JogoResumo = { id: number; dataHora: string; casa: string; fora: string; fase: string };

const FUSO = "America/Sao_Paulo";

function quando(iso: string) {
  const d = new Date(iso);
  const dia = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, weekday: "short", day: "2-digit", month: "2-digit" })
    .format(d)
    .replace(".", "");
  const h = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, hour: "2-digit", minute: "2-digit" }).format(d);
  return `${dia}, ${h.replace(":", "h")}`;
}

/** Escolhe o próximo jogo pela hora do aparelho (a página fica em cache) */
export function ProximoJogo({ jogos, vazio }: { jogos: JogoResumo[]; vazio: string }) {
  const agora = useAgora();
  if (agora === null) return <span className="text-cinza">Carregando agenda</span>;
  const proximo = jogos
    .filter((j) => new Date(j.dataHora).getTime() > agora - 60 * 60 * 1000)
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))[0];
  if (!proximo) return <span>{vazio}</span>;
  return (
    <span>
      <span className="font-semibold text-branco">
        {proximo.casa} x {proximo.fora}
      </span>
      <span className="block text-cinza">
        {proximo.fase}, {quando(proximo.dataHora)}
      </span>
    </span>
  );
}
