import type { Metadata } from "next";
import Link from "next/link";
import { EscudoTime } from "@/components/EscudoTime";
import { Container, TituloPagina } from "@/components/Titulo";
import { lerConfiguracoes, lerTorneio } from "@/lib/dados";
import { dataCurta, hora } from "@/lib/formato";
import { classificacao, ladosDoJogo, NOME_FASE, ORDEM_MATA_MATA, vencedorDoJogo } from "@/lib/torneio";
import type { DadosTorneio, Jogo } from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Tabela e chaveamento",
  description: "Classificação dos grupos e chaveamento do mata-mata do Barbudos Cup, atualizados a cada resultado.",
};

export default async function Tabela() {
  const [dados, cfg] = await Promise.all([lerTorneio(), lerConfiguracoes()]);
  const fasesMataMata = ORDEM_MATA_MATA.filter((f) => dados.jogos.some((j) => j.fase === f));
  const terceiro = dados.jogos.find((j) => j.fase === "terceiro");

  return (
    <Container>
      <TituloPagina titulo="Tabela">
        A classificação e o chaveamento se atualizam sozinhos a cada resultado lançado pela organização.
      </TituloPagina>

      <section aria-labelledby="titulo-grupos" className="mb-16">
        <h2 id="titulo-grupos" className="mb-2 text-[clamp(2rem,7vw,3.25rem)]">
          Fase de grupos
        </h2>
        <p className="mb-6 text-cinza">
          Avançam os {cfg.classificados_por_grupo} primeiros de cada grupo. Vitória vale 3 pontos, empate vale 1.
        </p>
        {dados.grupos.length === 0 ? (
          <p className="text-xl text-cinza">Os grupos aparecem aqui depois do sorteio.</p>
        ) : (
          <div className="grid gap-10 xl:grid-cols-2">
            {dados.grupos.map((g) => (
              <TabelaGrupo key={g.id} dados={dados} grupoId={g.id} nome={g.nome} classificados={cfg.classificados_por_grupo} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="titulo-mata">
        <h2 id="titulo-mata" className="mb-2 text-[clamp(2rem,7vw,3.25rem)]">
          Mata-mata
        </h2>
        <p className="mb-6 text-cinza">Empate no mata-mata é decidido nos pênaltis.</p>
        {fasesMataMata.length === 0 ? (
          <p className="text-xl text-cinza">O chaveamento aparece quando a organização montar o mata-mata.</p>
        ) : (
          <>
            <p className="mb-3 text-base text-cinza md:hidden">Arraste para o lado para ver todas as fases.</p>
            <div className="-mx-4 overflow-x-auto px-4 pb-4 [scroll-snap-type:x_mandatory] sm:-mx-6 sm:px-6">
              <ol className="flex min-w-max gap-0">
                {fasesMataMata.map((fase, i) => {
                  const jogos = dados.jogos
                    .filter((j) => j.fase === fase)
                    .sort((a, b) => (a.chave_ordem ?? 0) - (b.chave_ordem ?? 0));
                  const ultima = i === fasesMataMata.length - 1;
                  return (
                    <li key={fase} className={`flex shrink-0 flex-col [scroll-snap-align:start] ${i > 0 ? "w-[19rem] sm:w-[21rem]" : "w-[17rem] sm:w-[19rem]"}`}>
                      <h3 className={`mb-4 text-2xl ${ultima ? "text-sol" : ""} ${i > 0 ? "pl-8" : ""}`}>{NOME_FASE[fase]}</h3>
                      <ul className="flex flex-1 flex-col justify-around gap-6">
                        {jogos.map((j) => (
                          <li key={j.id} className={`relative ${ultima ? "" : "pr-8"} ${i > 0 ? "pl-8" : ""}`}>
                            {i > 0 && (
                              <span aria-hidden="true" className="absolute top-1/2 left-0 h-[3px] w-8 bg-vermelho" />
                            )}
                            <Confronto dados={dados} jogo={j} final={ultima} />
                            {!ultima && (
                              <span
                                aria-hidden="true"
                                className="absolute top-1/2 right-0 h-[3px] w-8 bg-vermelho"
                                style={{ clipPath: "polygon(0 0,100% 0,calc(100% - 3px) 100%,0 100%)" }}
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                })}
              </ol>
            </div>
            {terceiro && (
              <div className="mt-8 max-w-[19rem]">
                <h3 className="mb-4 text-2xl">{NOME_FASE.terceiro}</h3>
                <Confronto dados={dados} jogo={terceiro} />
              </div>
            )}
          </>
        )}
      </section>
    </Container>
  );
}

function TabelaGrupo({
  dados,
  grupoId,
  nome,
  classificados,
}: {
  dados: DadosTorneio;
  grupoId: number;
  nome: string;
  classificados: number;
}) {
  const linhas = classificacao(dados, grupoId);
  const colunas = [
    { chave: "pontos", curto: "P", longo: "Pontos" },
    { chave: "jogos", curto: "J", longo: "Jogos" },
    { chave: "vitorias", curto: "V", longo: "Vitórias" },
    { chave: "empates", curto: "E", longo: "Empates" },
    { chave: "derrotas", curto: "D", longo: "Derrotas" },
    { chave: "golsPro", curto: "GP", longo: "Gols pró" },
    { chave: "golsContra", curto: "GC", longo: "Gols contra" },
    { chave: "saldo", curto: "SG", longo: "Saldo de gols" },
  ] as const;

  return (
    <div className="min-w-0">
      <h3 className="mb-3 flex items-center gap-3 text-3xl">
        <span className="grid size-10 place-items-center bg-azul font-titulo text-2xl" style={{ clipPath: "polygon(0 0,100% 0,100% 72%,50% 100%,0 72%)" }}>
          {nome}
        </span>
        Grupo {nome}
      </h3>
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <table className="numeros w-full min-w-[30rem] border-collapse text-left text-base">
          <caption className="sr-only">Classificação do Grupo {nome}</caption>
          <thead>
            <tr className="border-b-2 border-vermelho text-cinza">
              <th scope="col" className="sticky left-0 bg-preto py-2 pr-2 font-semibold">
                Time
              </th>
              {colunas.map((c) => (
                <th key={c.chave} scope="col" className="w-9 px-0.5 py-2 text-center font-semibold">
                  <abbr title={c.longo} className="no-underline">
                    {c.curto}
                  </abbr>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((l, i) => {
              const classifica = i < classificados;
              return (
                <tr key={l.time.id} className="border-b border-linha">
                  <th scope="row" className="sticky left-0 bg-preto py-2.5 pr-2 font-semibold">
                    <Link href={`/times/${l.time.slug}`} className="flex items-center gap-2.5 hover:text-sol">
                      <span
                        className={`w-6 text-center font-titulo text-xl ${classifica ? "text-sol" : "text-cinza-escuro"}`}
                        title={classifica ? "Zona de classificação" : undefined}
                      >
                        {i + 1}
                      </span>
                      <EscudoTime id={l.time.id} nome={l.time.nome} escudoPath={l.time.escudo_path} tamanho={26} />
                      <span className="max-w-[9rem] truncate sm:max-w-none">{l.time.nome}</span>
                    </Link>
                  </th>
                  {colunas.map((c) => (
                    <td
                      key={c.chave}
                      className={`px-1 py-2.5 text-center ${c.chave === "pontos" ? "font-titulo text-xl text-branco" : "text-cinza"}`}
                    >
                      {c.chave === "saldo" && l.saldo > 0 ? `+${l.saldo}` : l[c.chave]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 flex items-center gap-2 text-sm text-cinza">
        <span className="font-titulo text-base text-sol">1</span> Posição em amarelo: zona de classificação
      </p>
    </div>
  );
}

function Confronto({ dados, jogo, final = false }: { dados: DadosTorneio; jogo: Jogo; final?: boolean }) {
  const { casa, fora } = ladosDoJogo(dados, jogo);
  const resultado = vencedorDoJogo(dados, jogo);
  const linhas = [
    { lado: casa, gols: jogo.gols_casa, pen: jogo.penaltis_casa },
    { lado: fora, gols: jogo.gols_fora, pen: jogo.penaltis_fora },
  ];
  return (
    <div className={`bg-carvao ring-1 ring-inset ${final ? "ring-sol" : "ring-linha"}`}>
      {linhas.map(({ lado, gols, pen }, i) => {
        const time = dados.times.find((t) => t.id === lado.timeId);
        const venceu = resultado?.vencedor === lado.timeId && lado.timeId !== null;
        return (
          <div
            key={i}
            className={`flex items-center gap-2.5 px-3 py-2.5 ${i === 0 ? "border-b border-linha" : ""} ${
              venceu ? "bg-sol/10" : ""
            }`}
          >
            {time ? (
              <EscudoTime id={time.id} nome={time.nome} escudoPath={time.escudo_path} tamanho={24} />
            ) : (
              <span aria-hidden="true" className="block h-[27px] w-6 bg-grafite" />
            )}
            <span className={`flex-1 truncate ${time ? "font-semibold" : "text-cinza"} ${venceu ? "text-sol" : ""}`}>
              {time?.nome ?? lado.rotulo}
            </span>
            {jogo.encerrado && gols !== null && (
              <span className={`numeros font-titulo text-xl ${venceu ? "text-sol" : ""}`}>
                {gols}
                {pen !== null && <span className="ml-1 text-sm text-cinza">({pen})</span>}
              </span>
            )}
          </div>
        );
      })}
      {!jogo.encerrado && jogo.data_hora && (
        <p className="border-t border-linha px-3 py-1.5 text-sm text-cinza">
          {dataCurta(jogo.data_hora)}, {hora(jogo.data_hora)}
          {jogo.campo ? `, ${jogo.campo}` : ""}
        </p>
      )}
    </div>
  );
}
