"use client";

import { useAgora } from "@/hooks/useAgora";

export type JogoResumo = { id: number; dataHora: string; casa: string; fora: string; fase: string };

const FUSO = "America/Sao_Paulo";

function quando(iso: string) {
  const d = new Date(iso);
  const dia = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, weekday: "short", day: "2-digit", month: "2-digit" })
    .format(d)
    .replace(".", "");
  const [h, m] = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .format(d)
    .split(":");
  return `${dia}, ${Number(h)}h${m === "00" ? "" : m}`;
}

/** Escolhe o próximo jogo pela hora do aparelho (a página fica em cache) */
export function ProximoJogo({ jogos, vazio, prefixo }: { jogos: JogoResumo[]; vazio: string; prefixo?: string }) {
  const agora = useAgora();
  if (agora === null) return <span>{prefixo ? `${prefixo}carregando` : "Carregando agenda"}</span>;
  const proximo = jogos
    .filter((j) => new Date(j.dataHora).getTime() > agora - 60 * 60 * 1000)
    .sort((a, b) => a.dataHora.localeCompare(b.dataHora))[0];
  if (!proximo) return <span>{vazio}</span>;
  if (prefixo) {
    return (
      <span>
        {prefixo}
        {proximo.casa} x {proximo.fora}, {quando(proximo.dataHora)}
      </span>
    );
  }
  return (
    <span>
      <span className="block font-titulo text-[clamp(1.8rem,6vw,2.6rem)] leading-none font-black uppercase">
        {proximo.casa} x {proximo.fora}
      </span>
      <span className="mt-1 block text-cinza">
        {proximo.fase}, {quando(proximo.dataHora)}
      </span>
    </span>
  );
}
