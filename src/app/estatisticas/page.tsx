import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { EscudoTime } from "@/components/EscudoTime";
import { Container, TituloPagina } from "@/components/Titulo";
import { lerTorneio } from "@/lib/dados";
import { artilharia, cartoes, melhorDefesa } from "@/lib/torneio";

export const metadata: Metadata = {
  title: "Estatísticas",
  description: "Artilharia, cartões e melhor defesa do Barbudos Cup, calculados a partir das súmulas.",
};

export default async function Estatisticas() {
  const dados = await lerTorneio();
  const gols = artilharia(dados);
  const disciplina = cartoes(dados);
  const defesas = melhorDefesa(dados);
  const lideres = gols.filter((g) => g.total === gols[0]?.total);

  return (
    <Container>
      <TituloPagina titulo="Estatísticas">
        Calculadas automaticamente a partir das súmulas lançadas pela organização.
      </TituloPagina>

      <div className="grid gap-14 lg:grid-cols-2">
        <Bloco id="artilharia" titulo="Artilharia" vazio="Nenhum gol marcado ainda." className="lg:row-span-2">
          {gols.length > 0 && (
            <>
              <div className="mb-4 flex items-center gap-4 bg-sol px-5 py-5 text-preto">
                <span className="numeros font-titulo text-7xl leading-none font-black">{gols[0].total}</span>
                <div className="min-w-0">
                  <p className="text-base font-semibold">
                    {gols[0].total === 1 ? "gol" : "gols"}, {lideres.length > 1 ? "dividem a liderança" : "lidera a artilharia"}
                  </p>
                  <p className="font-titulo text-3xl leading-none uppercase">
                    {lideres.length > 2
                      ? `${lideres.slice(0, 2).map((l) => l.nome).join(", ")} e mais ${lideres.length - 2}`
                      : lideres.map((l) => l.nome).join(" e ")}
                  </p>
                  {lideres.length === 1 && <p className="font-semibold">{gols[0].time.nome}</p>}
                </div>
              </div>
              <Ranking
                limite={10}
                linhas={gols.map((g) => ({
                  chave: g.jogadorId,
                  ordem: g.total,
                  nome: g.nome,
                  time: g.time,
                  valor: <span className="font-titulo text-2xl text-sol">{g.total}</span>,
                }))}
              />
            </>
          )}
        </Bloco>

        <Bloco id="defesa" titulo="Melhor defesa" vazio="A melhor defesa aparece depois dos primeiros jogos.">
          {defesas.length > 0 && (
            <Ranking
              linhas={defesas.map((d) => ({
                chave: d.time.id,
                ordem: d.media,
                nome: d.time.nome,
                time: d.time,
                link: `/times/${d.time.slug}`,
                detalhe: `${d.golsSofridos} ${d.golsSofridos === 1 ? "gol sofrido" : "gols sofridos"} em ${d.jogos} ${d.jogos === 1 ? "jogo" : "jogos"}`,
                valor: (
                  <span className="text-right">
                    <span className="font-titulo text-2xl text-sol">{d.media.toFixed(2).replace(".", ",")}</span>
                    <span className="block text-sm text-cinza">por jogo</span>
                  </span>
                ),
              }))}
            />
          )}
        </Bloco>

        <Bloco id="cartoes" titulo="Cartões" vazio="Nenhum cartão aplicado até agora. Que continue assim.">
          {disciplina.length > 0 && (
            <Ranking
              linhas={disciplina.map((c) => ({
                chave: c.jogadorId,
                ordem: c.vermelhos * 100 + c.amarelos,
                nome: c.nome,
                time: c.time,
                valor: (
                  <span className="flex items-center gap-3">
                    {c.amarelos > 0 && (
                      <span className="flex items-center gap-1" title="Cartões amarelos">
                        <span aria-hidden="true" className="inline-block h-5 w-3.5 bg-sol" />
                        <span className="sr-only">Amarelos:</span>
                        <span className="font-titulo text-xl">{c.amarelos}</span>
                      </span>
                    )}
                    {c.vermelhos > 0 && (
                      <span className="flex items-center gap-1" title="Cartões vermelhos">
                        <span aria-hidden="true" className="inline-block h-5 w-3.5 bg-vermelho" />
                        <span className="sr-only">Vermelhos:</span>
                        <span className="font-titulo text-xl">{c.vermelhos}</span>
                      </span>
                    )}
                  </span>
                ),
              }))}
            />
          )}
        </Bloco>
      </div>
    </Container>
  );
}

function Bloco({
  id,
  titulo,
  vazio,
  children,
  className = "",
}: {
  id: string;
  titulo: string;
  vazio: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={className}>
      <h2 id={id} className="mb-4 text-[clamp(2.6rem,10vw,4rem)]">
        {titulo}
      </h2>
      {children || <p className="text-cinza">{vazio}</p>}
    </section>
  );
}

type Linha = {
  chave: number;
  /** Valor usado para dar a mesma posição a quem está empatado */
  ordem: number;
  nome: string;
  time: { id: number; nome: string; slug: string; escudo_path: string | null };
  valor: ReactNode;
  detalhe?: string;
  link?: string;
};

function Ranking({ linhas, limite }: { linhas: Linha[]; limite?: number }) {
  // Empatados dividem a posição (1, 1, 3...)
  const posicoes = linhas.map((l, i) => (i > 0 && linhas[i - 1].ordem === l.ordem ? -1 : i + 1));
  for (let i = 1; i < posicoes.length; i++) if (posicoes[i] === -1) posicoes[i] = posicoes[i - 1];

  const item = (l: Linha, i: number) => (
    <li key={l.chave}>
      <Link href={l.link ?? `/times/${l.time.slug}`} className="flex items-center gap-3 py-3 hover:text-sol">
        <span className="w-7 shrink-0 text-center font-titulo text-xl text-cinza-escuro">
          {i > 0 && posicoes[i] === posicoes[i - 1] ? "" : `${posicoes[i]}º`}
        </span>
        <EscudoTime id={l.time.id} nome={l.time.nome} escudoPath={l.time.escudo_path} tamanho={28} />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{l.nome}</span>
          <span className="block truncate text-base text-cinza">{l.detalhe ?? l.time.nome}</span>
        </span>
        {l.valor}
      </Link>
    </li>
  );

  const visiveis = limite ? linhas.slice(0, limite) : linhas;
  const resto = limite ? linhas.slice(limite) : [];
  return (
    <>
      <ol className="numeros divide-y-2 divide-linha border-t-2 border-branco">{visiveis.map((l, i) => item(l, i))}</ol>
      {resto.length > 0 && (
        <details className="group mt-2">
          <summary className="cursor-pointer list-none py-3 font-semibold text-sol hover:underline [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Ver todos ({linhas.length})</span>
            <span className="hidden group-open:inline">Mostrar menos</span>
          </summary>
          <ol className="numeros divide-y-2 divide-linha">
            {resto.map((l, j) => item(l, j + visiveis.length))}
          </ol>
        </details>
      )}
    </>
  );
}
