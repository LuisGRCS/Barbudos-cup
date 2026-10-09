import Link from "next/link";
import { EscudoTime } from "@/components/EscudoTime";
import { hora } from "@/lib/formato";
import { golsDoJogo, ladosDoJogo, NOME_FASE } from "@/lib/torneio";
import type { DadosTorneio, Jogo } from "@/lib/tipos";

const FUSO = "America/Sao_Paulo";
const semana = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, weekday: "short" }).format(new Date(iso)).replace(".", "");
const diaMes = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, day: "2-digit", month: "2-digit" }).format(new Date(iso));

/** Um jogo em formato de placar: data à esquerda, um time por linha com o placar ao lado */
export function CartaoJogo({
  dados,
  jogo,
  mostrarFase = true,
  destaque,
}: {
  dados: DadosTorneio;
  jogo: Jogo;
  mostrarFase?: boolean;
  destaque?: string;
}) {
  const { casa, fora } = ladosDoJogo(dados, jogo);
  const placar = jogo.encerrado && jogo.gols_casa !== null && jogo.gols_fora !== null;
  const penaltis = placar && jogo.penaltis_casa !== null && jogo.penaltis_fora !== null;
  const casaVence =
    placar && (jogo.gols_casa! > jogo.gols_fora! || (penaltis && jogo.penaltis_casa! > jogo.penaltis_fora!));
  const foraVence =
    placar && (jogo.gols_fora! > jogo.gols_casa! || (penaltis && jogo.penaltis_fora! > jogo.penaltis_casa!));
  const gols = placar ? golsDoJogo(dados, jogo) : [];
  const grupo = dados.grupos.find((g) => g.id === jogo.grupo_id);
  const fase =
    jogo.fase === "grupos"
      ? [grupo ? `Grupo ${grupo.nome}` : null, jogo.rodada ? `rodada ${jogo.rodada}` : null].filter(Boolean).join(", ")
      : NOME_FASE[jogo.fase];
  const detalhes = [mostrarFase ? fase : null, jogo.campo].filter(Boolean).join(", ");

  const linhas = [
    { lado: casa, gols: jogo.gols_casa, pen: jogo.penaltis_casa, venceu: casaVence },
    { lado: fora, gols: jogo.gols_fora, pen: jogo.penaltis_fora, venceu: foraVence },
  ];

  return (
    <article className="grid grid-cols-[4.25rem_1fr] gap-4 border-b-2 border-linha py-4 sm:grid-cols-[5rem_1fr]">
      <div className="pt-0.5">
        {jogo.data_hora ? (
          <time dateTime={jogo.data_hora} className="block leading-none">
            <span className="block text-sm font-semibold text-cinza capitalize">{semana(jogo.data_hora)}</span>
            <span className="numeros block font-titulo text-[1.7rem] font-black">{diaMes(jogo.data_hora)}</span>
            <span className="numeros mt-0.5 block font-semibold">{hora(jogo.data_hora)}</span>
          </time>
        ) : (
          <span className="text-sm text-cinza">Data a definir</span>
        )}
      </div>
      <div className="min-w-0">
        {destaque && <p className="mb-1.5 text-base font-bold text-sol">{destaque}</p>}
        <ul className="grid gap-1.5">
          {linhas.map(({ lado, gols: g, pen, venceu }, i) => {
            const time = dados.times.find((t) => t.id === lado.timeId);
            return (
              <li key={i} className="flex items-center gap-2.5">
                {time ? (
                  <EscudoTime id={time.id} nome={time.nome} escudoPath={time.escudo_path} tamanho={26} />
                ) : (
                  <span aria-hidden="true" className="block h-[29px] w-[26px] border-2 border-dashed border-linha" />
                )}
                {time ? (
                  <Link
                    href={`/times/${time.slug}`}
                    className={`min-w-0 flex-1 truncate text-lg font-semibold hover:text-sol ${placar && !venceu ? "text-cinza" : ""}`}
                  >
                    {time.nome}
                  </Link>
                ) : (
                  <span className="min-w-0 flex-1 truncate text-lg text-cinza">{lado.rotulo}</span>
                )}
                {placar && (
                  <span className={`numeros font-titulo text-[1.9rem] leading-none font-black ${venceu ? "text-sol" : ""}`}>
                    {g}
                    {pen !== null && <span className="ml-1 text-base font-semibold text-cinza">({pen})</span>}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        {(detalhes || gols.length > 0) && (
          <div className="mt-2 text-base text-cinza">
            {detalhes && <p>{detalhes}</p>}
            {gols.length > 0 && (
              <p className="mt-1">
                <span className="sr-only">Gols: </span>
                {gols
                  .map(
                    (g) =>
                      `${g.nome}${g.contra ? " (contra)" : ""}${g.minuto !== null ? ` ${g.minuto}'` : ""}`,
                  )
                  .join(", ")}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
