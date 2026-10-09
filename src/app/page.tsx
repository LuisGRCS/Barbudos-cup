import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BarraVagas } from "@/components/BarraVagas";
import { Contagem } from "@/components/Contagem";
import { EscudoTime } from "@/components/EscudoTime";
import { Icone } from "@/components/Icone";
import { ProximoJogo, type JogoResumo } from "@/components/ProximoJogo";
import { Raios } from "@/components/Raios";
import { Campo, SeloADefinir } from "@/components/Selo";
import { Container } from "@/components/Titulo";
import { lerConfiguracoes, lerInscricoes, lerRegulamento, lerTorneio } from "@/lib/dados";
import { dataLonga, diaSemana } from "@/lib/formato";
import { ROTULO_STATUS } from "@/lib/inscricao";
import { artilharia, classificacao, ladosDoJogo, NOME_FASE } from "@/lib/torneio";

export default async function Inicio() {
  const [cfg, inscricoes, regulamento, torneio] = await Promise.all([
    lerConfiguracoes(),
    lerInscricoes(),
    lerRegulamento(),
    lerTorneio(),
  ]);

  const nomeTime = (id: number | null) => torneio.times.find((t) => t.id === id)?.nome;
  const agenda: JogoResumo[] = torneio.jogos
    .filter((j) => j.data_hora && !j.encerrado)
    .map((j) => {
      const { casa, fora } = ladosDoJogo(torneio, j);
      return {
        id: j.id,
        dataHora: j.data_hora!,
        casa: nomeTime(casa.timeId) ?? casa.rotulo,
        fora: nomeTime(fora.timeId) ?? fora.rotulo,
        fase: j.fase === "grupos" && j.rodada ? `Rodada ${j.rodada}` : NOME_FASE[j.fase],
      };
    });
  const lideres = torneio.grupos
    .map((g) => ({ grupo: g.nome, lider: classificacao(torneio, g.id)[0] }))
    .filter((l) => l.lider && l.lider.jogos > 0);
  const artilheiro = artilharia(torneio)[0];

  return (
    <>
      {/* Abertura */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Raios className="anim-raios absolute top-[19rem] left-1/2 w-[190vw] max-w-[1400px] -translate-x-1/2 -translate-y-1/2 text-sol/[0.13] sm:top-[21rem]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-preto to-transparent" />
        </div>
        <Container className="flex flex-col items-center pt-6 pb-16 text-center sm:pt-10">
          <h1 className="anim-escudo">
            <Image
              src="/logo-escudo.png"
              alt="Barbudos Cup, futebol 7"
              width={1011}
              height={1091}
              priority
              sizes="(min-width: 640px) 360px, 280px"
              className="h-auto w-[280px] drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)] sm:w-[360px]"
            />
          </h1>
          <p className="anim-subir mt-6 text-2xl font-semibold text-cinza sm:text-3xl" style={{ "--atraso": "0.55s" } as React.CSSProperties}>
            {cfg.edicao ? `${cfg.edicao} do campeonato` : "Campeonato"} de futebol 7
          </p>
          <p className="anim-subir mt-2 text-2xl font-semibold sm:text-3xl" style={{ "--atraso": "0.65s" } as React.CSSProperties}>
            {cfg.inicio_campeonato ? (
              <>
                {diaSemana(cfg.inicio_campeonato)}, <span className="text-sol">{dataLonga(cfg.inicio_campeonato)}</span>
              </>
            ) : (
              <span className="inline-flex items-center gap-2">
                Data de início <SeloADefinir grande />
              </span>
            )}
          </p>
          <div
            className="anim-subir mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row"
            style={{ "--atraso": "0.75s" } as React.CSSProperties}
          >
            <Link href="/inscricao" className="botao botao-sol !min-h-14 !px-8 !text-xl">
              Inscreva seu time
            </Link>
            <Link href="/informacoes" className="botao botao-fantasma !min-h-14 !px-8 !text-xl">
              Ver informações
            </Link>
          </div>
        </Container>
      </section>

      {/* Contagem regressiva */}
      <section aria-labelledby="titulo-contagem" className="relative">
        <Container>
          <div className="mx-auto max-w-3xl">
            {cfg.inicio_campeonato ? (
              <Contagem
                alvo={cfg.inicio_campeonato}
                rotulo="Tempo até o início do campeonato"
                titulo={
                  <h2 id="titulo-contagem" className="mb-5 text-center text-[clamp(1.8rem,6vw,2.6rem)]">
                    Falta pouco para a bola rolar
                  </h2>
                }
                aoTerminar={
                  <div className="recorte-escudo bg-grafite px-6 pt-6 pb-10 text-center text-xl">
                    <h2 id="titulo-contagem" className="mb-3 text-[clamp(1.8rem,6vw,2.6rem)] text-sol">
                      Campeonato em andamento
                    </h2>
                    <p className="mb-1 text-cinza">Próximo jogo</p>
                    <ProximoJogo jogos={agenda} vazio="A agenda dos próximos jogos sai em breve." />
                  </div>
                }
              />
            ) : (
              <div className="recorte-escudo bg-grafite px-6 pt-6 pb-10 text-center">
                <h2 id="titulo-contagem" className="text-3xl">
                  Contagem para a bola rolar
                </h2>
                <p className="mt-3 text-cinza">
                  A contagem começa assim que a data de início for definida. <SeloADefinir />
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Seções */}
      <section aria-label="Seções do site" className="mt-16 sm:mt-24">
        <Container>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            <li className="sm:col-span-2">
              <CardSecao
                href="/inscricao"
                titulo="Inscreva seu time"
                icone="escudo"
                destaque
                descricao="Valores, datas, requisitos e o passo a passo para garantir a vaga."
              >
                <p className="mb-3 font-titulo text-2xl uppercase">{ROTULO_STATUS[inscricoes.status]}</p>
                <BarraVagas preenchidas={inscricoes.vagasPreenchidas} total={cfg.vagas_total} />
              </CardSecao>
            </li>
            <li>
              <CardSecao
                href="/informacoes"
                titulo="Informações"
                icone="mapa"
                descricao="Datas, local, taxa, premiação e formato."
              >
                <p>
                  <span className="text-cinza">Local: </span>
                  <Campo valor={cfg.local_nome} />
                </p>
              </CardSecao>
            </li>
            <li>
              <CardSecao href="/times" titulo="Times" icone="camisa" descricao="Os times confirmados e seus elencos.">
                {torneio.times.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {torneio.times.slice(0, 5).map((t) => (
                        <EscudoTime key={t.id} id={t.id} nome={t.nome} escudoPath={t.escudo_path} tamanho={30} />
                      ))}
                    </div>
                    <span className="font-semibold">
                      {torneio.times.length} {torneio.times.length === 1 ? "time confirmado" : "times confirmados"}
                    </span>
                  </div>
                ) : (
                  <p className="text-cinza">Nenhum time confirmado ainda.</p>
                )}
              </CardSecao>
            </li>
            <li>
              <CardSecao href="/tabela" titulo="Tabela" icone="chave" descricao="Classificação dos grupos e o chaveamento do mata-mata.">
                {lideres.length > 0 ? (
                  <ul className="space-y-0.5">
                    {lideres.map((l) => (
                      <li key={l.grupo}>
                        <span className="text-cinza">Grupo {l.grupo}: </span>
                        <span className="font-semibold">{l.lider.time.nome}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-cinza">A classificação aparece após a primeira rodada.</p>
                )}
              </CardSecao>
            </li>
            <li>
              <CardSecao href="/jogos" titulo="Jogos" icone="calendario" descricao="Agenda por rodada e resultados.">
                <ProximoJogo jogos={agenda} vazio="A agenda sai depois do sorteio dos grupos." />
              </CardSecao>
            </li>
            <li>
              <CardSecao href="/regulamento" titulo="Regulamento" icone="documento" descricao="Todas as regras, com versão em PDF.">
                <p className="text-cinza">
                  {regulamento.length} tópicos, do elenco à disciplina
                </p>
              </CardSecao>
            </li>
            <li className="sm:col-span-2 lg:col-span-2">
              <CardSecao href="/estatisticas" titulo="Estatísticas" icone="trofeu" descricao="Artilharia, cartões e melhor defesa.">
                {artilheiro ? (
                  <p>
                    <span className="text-cinza">Artilheiro: </span>
                    <span className="font-semibold">{artilheiro.nome}</span>
                    <span className="text-cinza">, {artilheiro.time.nome}, </span>
                    <span className="numeros font-semibold text-sol">
                      {artilheiro.total} {artilheiro.total === 1 ? "gol" : "gols"}
                    </span>
                  </p>
                ) : (
                  <p className="text-cinza">Os números aparecem depois dos primeiros jogos.</p>
                )}
              </CardSecao>
            </li>
          </ul>
        </Container>
      </section>
    </>
  );
}

function CardSecao({
  href,
  titulo,
  descricao,
  icone,
  destaque = false,
  children,
}: {
  href: string;
  titulo: string;
  descricao: string;
  icone: string;
  destaque?: boolean;
  children?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group canto-cortado relative flex h-full min-h-48 flex-col p-5 [--corte:2.25rem] sm:p-6 ${
        destaque ? "bg-sol text-preto" : "bg-carvao text-branco ring-1 ring-linha ring-inset"
      }`}
    >
      {/* O canto cortado ganha uma faixa vermelha ao passar o mouse ou focar */}
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 size-[2.25rem] origin-top-right scale-0 bg-vermelho transition-transform duration-200 ease-[var(--ease-chute)] group-hover:scale-100 group-focus-visible:scale-100"
        style={{ clipPath: "polygon(0 0,100% 100%,100% 0)" }}
      />
      <div className="flex items-start gap-3">
        <Icone nome={icone} className={`mt-0.5 text-3xl ${destaque ? "text-preto" : "text-sol"}`} />
        <div>
          <h2 className="text-[2.1rem] transition-colors sm:text-[2.4rem]">{titulo}</h2>
          <p className={`mt-1 ${destaque ? "text-preto/80" : "text-cinza"}`}>{descricao}</p>
        </div>
      </div>
      <div className={`mt-auto pt-5 ${destaque ? "text-preto" : ""}`}>{children}</div>
    </Link>
  );
}
