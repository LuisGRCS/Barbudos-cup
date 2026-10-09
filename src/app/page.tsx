import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BarraVagas } from "@/components/BarraVagas";
import { Contagem } from "@/components/Contagem";
import { Horizonte } from "@/components/Horizonte";
import { ProximoJogo, type JogoResumo } from "@/components/ProximoJogo";
import { Campo, SeloADefinir } from "@/components/Selo";
import { Container } from "@/components/Titulo";
import { lerConfiguracoes, lerInscricoes, lerRegulamento, lerTorneio } from "@/lib/dados";
import { diaSemana, hora } from "@/lib/formato";
import { ROTULO_STATUS } from "@/lib/inscricao";
import { artilharia, classificacao, ladosDoJogo, NOME_FASE } from "@/lib/torneio";

const FUSO = "America/Sao_Paulo";
const dia = (iso: string) => new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, day: "numeric" }).format(new Date(iso));
const mes = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, month: "short" }).format(new Date(iso)).replace(".", "");

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
  const inicio = cfg.inicio_campeonato;

  return (
    <>
      {/* Abertura em forma de cartaz */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="linhas-de-campo absolute inset-0 -z-10 opacity-[0.05] [background-position:center_30%]" />
        <Container className="grid gap-8 pt-8 pb-28 sm:pb-32 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-12 lg:pt-14 lg:pb-36">
          <div className="order-2 lg:order-1">
            <p className="anim-subir text-xl font-semibold text-cinza" style={{ "--atraso": "0.1s" } as React.CSSProperties}>
              {cfg.edicao ? `${cfg.edicao}, ` : ""}futebol 7
            </p>
            {inicio ? (
              <h1 className="anim-subir mt-2" style={{ "--atraso": "0.2s" } as React.CSSProperties}>
                <span className="sr-only">Barbudos Cup começa em </span>
                <span className="flex items-end gap-3">
                  <span className="numeros text-[clamp(7rem,38vw,13rem)] leading-[0.78] text-sol">{dia(inicio)}</span>
                  <span className="pb-[0.12em] text-[clamp(3rem,15vw,5.5rem)] leading-[0.82]">
                    {mes(inicio)}
                    <span className="block text-cinza">{new Date(inicio).getUTCFullYear()}</span>
                  </span>
                </span>
              </h1>
            ) : (
              <h1 className="anim-subir mt-3 text-[clamp(3.4rem,15vw,6rem)]" style={{ "--atraso": "0.2s" } as React.CSSProperties}>
                <span className="sr-only">Barbudos Cup. </span>
                Data de início <SeloADefinir grande />
              </h1>
            )}
            {inicio && (
              <p className="anim-subir mt-4 text-2xl font-semibold" style={{ "--atraso": "0.3s" } as React.CSSProperties}>
                {diaSemana(inicio)}, a partir das {hora(inicio)}
                <span className="block text-lg font-medium text-cinza">
                  {cfg.local_nome ?? "Local a definir"}
                </span>
              </p>
            )}
            <div
              className="anim-subir mt-8 flex flex-col gap-3 sm:flex-row"
              style={{ "--atraso": "0.4s" } as React.CSSProperties}
            >
              <Link href="/inscricao" className="botao botao-sol !min-h-14 !px-7 !text-xl">
                Inscreva seu time
              </Link>
              <Link href="/informacoes" className="botao botao-contorno !min-h-14 !px-7 !text-xl">
                Ver informações
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:justify-self-end">
            <Image
              src="/logo-escudo.png"
              alt="Logo do Barbudos Cup"
              width={1011}
              height={1091}
              priority
              sizes="(min-width: 1024px) 420px, 200px"
              className="h-auto w-[200px] lg:w-[420px]"
            />
          </div>
        </Container>
        <Horizonte />
      </section>

      {/* Contagem regressiva */}
      <section aria-labelledby="titulo-contagem" className="py-12 sm:py-16">
        <Container>
          {inicio ? (
            <Contagem
              alvo={inicio}
              rotulo="Tempo até o início do campeonato"
              titulo={
                <h2 id="titulo-contagem" className="mb-5 text-[clamp(2.2rem,8vw,3.5rem)]">
                  A bola rola em
                </h2>
              }
              aoTerminar={
                <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-end sm:gap-10">
                  <h2 id="titulo-contagem" className="text-[clamp(2.2rem,8vw,3.5rem)]">
                    Bola rolando
                  </h2>
                  <div className="text-xl">
                    <p className="text-cinza">Próximo jogo</p>
                    <ProximoJogo jogos={agenda} vazio="A agenda dos próximos jogos sai em breve." />
                  </div>
                </div>
              }
            />
          ) : (
            <h2 id="titulo-contagem" className="text-[clamp(2.2rem,8vw,3.5rem)]">
              A contagem começa quando a data sair
            </h2>
          )}
        </Container>
      </section>

      {/* Inscrições: faixa de sol */}
      <section aria-labelledby="titulo-inscricoes" className="bg-sol text-preto">
        <Container className="grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <h2 id="titulo-inscricoes" className="text-[clamp(3.2rem,14vw,7rem)]">
              {ROTULO_STATUS[inscricoes.status]}
            </h2>
            <p className="mt-4 max-w-[40ch] text-xl font-semibold">
              Valores, datas, requisitos e o passo a passo para garantir a vaga do seu time, tudo numa página só.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <BarraVagas preenchidas={inscricoes.vagasPreenchidas} total={cfg.vagas_total} />
            <Link href="/inscricao" className="botao botao-preto self-start !min-h-14 !px-7 !text-xl">
              Inscreva seu time
            </Link>
          </div>
        </Container>
      </section>

      {/* Índice das seções */}
      <section aria-label="Seções do site" className="pt-14">
        <Container>
          <ul className="border-t-2 border-branco">
            <ItemIndice href="/informacoes" titulo="Informações">
              Datas, taxa e premiação. Local: <Campo valor={cfg.local_nome} />
            </ItemIndice>
            <ItemIndice href="/times" titulo="Times">
              {torneio.times.length > 0
                ? `${torneio.times.length} ${torneio.times.length === 1 ? "time confirmado" : "times confirmados"}`
                : "Nenhum time confirmado ainda"}
            </ItemIndice>
            <ItemIndice href="/tabela" titulo="Tabela">
              {lideres.length > 0
                ? lideres.map((l) => `${l.lider.time.nome} lidera o Grupo ${l.grupo}`).join(". ")
                : "Classificação e chaveamento do mata-mata"}
            </ItemIndice>
            <ItemIndice href="/jogos" titulo="Jogos">
              <ProximoJogo jogos={agenda} vazio="A agenda sai depois do sorteio dos grupos." prefixo="Próximo: " />
            </ItemIndice>
            <ItemIndice href="/estatisticas" titulo="Estatísticas">
              {artilheiro
                ? `Artilheiro: ${artilheiro.nome}, ${artilheiro.total} ${artilheiro.total === 1 ? "gol" : "gols"}`
                : "Artilharia, cartões e melhor defesa"}
            </ItemIndice>
            <ItemIndice href="/regulamento" titulo="Regulamento">
              {regulamento.length} tópicos, com versão em PDF
            </ItemIndice>
          </ul>
        </Container>
      </section>
    </>
  );
}

function ItemIndice({ href, titulo, children }: { href: string; titulo: string; children: ReactNode }) {
  return (
    <li className="border-b-2 border-linha">
      <Link
        href={href}
        className="group grid gap-1 py-5 transition-colors hover:bg-azul sm:grid-cols-[22rem_1fr] sm:items-center sm:gap-8 sm:px-3"
      >
        <span className="font-titulo text-[clamp(2.8rem,12vw,4.25rem)] leading-[0.9] font-black uppercase transition-colors group-hover:text-sol">
          {titulo}
        </span>
        <span className="text-lg text-cinza group-hover:text-branco">{children}</span>
      </Link>
    </li>
  );
}
