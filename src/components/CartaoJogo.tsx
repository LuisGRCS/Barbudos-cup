import Link from "next/link";
import { EscudoTime } from "@/components/EscudoTime";
import { diaSemana, diaEMes, hora } from "@/lib/formato";
import { golsDoJogo, ladosDoJogo, NOME_FASE } from "@/lib/torneio";
import type { DadosTorneio, Jogo } from "@/lib/tipos";

function Lado({
  dados,
  timeId,
  rotulo,
  alinhamento,
  vencedor,
}: {
  dados: DadosTorneio;
  timeId: number | null;
  rotulo: string;
  alinhamento: "esq" | "dir";
  vencedor: boolean;
}) {
  const time = dados.times.find((t) => t.id === timeId);
  const conteudo = (
    <>
      {time ? (
        <EscudoTime id={time.id} nome={time.nome} escudoPath={time.escudo_path} tamanho={36} />
      ) : (
        <span aria-hidden="true" className="block h-[40px] w-[36px] bg-grafite recorte-escudo [--ponta:0.5rem]" />
      )}
      <span
        className={`min-w-0 leading-tight font-semibold ${time ? "" : "text-cinza"} ${vencedor ? "text-branco" : ""} ${
          alinhamento === "dir" ? "text-right" : ""
        }`}
      >
        {time?.nome ?? rotulo}
      </span>
    </>
  );
  const classe = `flex min-w-0 items-center gap-2.5 ${alinhamento === "dir" ? "flex-row-reverse" : ""}`;
  return time ? (
    <Link href={`/times/${time.slug}`} className={`${classe} hover:text-sol`}>
      {conteudo}
    </Link>
  ) : (
    <div className={classe}>{conteudo}</div>
  );
}

/** Um jogo: times, horário ou placar, e quem fez os gols */
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
      ? [grupo ? `Grupo ${grupo.nome}` : null, jogo.rodada ? `Rodada ${jogo.rodada}` : null].filter(Boolean).join(", ")
      : NOME_FASE[jogo.fase];

  return (
    <article className="relative bg-carvao p-4 ring-1 ring-linha ring-inset sm:p-5">
      {destaque && (
        <p className="absolute -top-3 left-4 bg-vermelho px-2.5 py-0.5 text-sm font-bold" style={{ clipPath: "polygon(0.3rem 0,100% 0,calc(100% - 0.3rem) 100%,0 100%)" }}>
          {destaque}
        </p>
      )}
      <p className="mb-3 flex flex-wrap justify-between gap-x-4 text-base text-cinza">
        <span>{mostrarFase ? fase : ""}</span>
        <span>
          {jogo.data_hora ? (
            <time dateTime={jogo.data_hora}>
              {diaSemana(jogo.data_hora).slice(0, 3)}, {diaEMes(jogo.data_hora)}, {hora(jogo.data_hora)}
            </time>
          ) : (
            "Data a definir"
          )}
          {jogo.campo ? `, ${jogo.campo}` : ""}
        </span>
      </p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Lado dados={dados} timeId={casa.timeId} rotulo={casa.rotulo} alinhamento="esq" vencedor={casaVence} />
        <div className="text-center">
          {placar ? (
            <p className="numeros font-titulo text-[2.1rem] leading-none whitespace-nowrap">
              <span className={casaVence ? "text-sol" : ""}>{jogo.gols_casa}</span>
              <span className="mx-1.5 text-cinza-escuro">x</span>
              <span className={foraVence ? "text-sol" : ""}>{jogo.gols_fora}</span>
            </p>
          ) : (
            <p className="font-titulo text-2xl text-cinza-escuro">x</p>
          )}
          {penaltis && (
            <p className="numeros text-sm text-cinza">
              pênaltis {jogo.penaltis_casa} x {jogo.penaltis_fora}
            </p>
          )}
        </div>
        <Lado dados={dados} timeId={fora.timeId} rotulo={fora.rotulo} alinhamento="dir" vencedor={foraVence} />
      </div>
      {gols.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-4 border-t border-linha pt-3 text-base text-cinza">
          {[casa.timeId, fora.timeId].map((lado, i) => (
            <ul key={i} className={i === 1 ? "text-right" : ""}>
              {gols
                .filter((g) => g.timeId === lado)
                .map((g) => (
                  <li key={g.id}>
                    {g.nome}
                    {g.contra ? " (contra)" : ""}
                    {g.minuto !== null ? <span className="numeros text-cinza-escuro"> {g.minuto}&apos;</span> : null}
                  </li>
                ))}
            </ul>
          ))}
        </div>
      )}
    </article>
  );
}
