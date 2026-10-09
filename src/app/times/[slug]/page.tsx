import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CartaoJogo } from "@/components/CartaoJogo";
import { EscudoTime } from "@/components/EscudoTime";
import { Icone } from "@/components/Icone";
import { Container } from "@/components/Titulo";
import { lerTorneio } from "@/lib/dados";
import { linkInstagram } from "@/lib/formato";
import { artilharia, resumoDoTime } from "@/lib/torneio";

export async function generateStaticParams() {
  const { times } = await lerTorneio();
  // Sem times aprovados, gera só o modelo da página
  return times.length > 0 ? times.map((t) => ({ slug: t.slug })) : [{ slug: "__vazio" }];
}

export async function generateMetadata(props: PageProps<"/times/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const { times } = await lerTorneio();
  const time = times.find((t) => t.slug === slug);
  return time
    ? { title: time.nome, description: `Elenco, jogos e estatísticas do ${time.nome} no Barbudos Cup.` }
    : { title: "Time" };
}

export default function PaginaTime(props: PageProps<"/times/[slug]">) {
  return (
    <Container>
      <Suspense fallback={<div className="h-[60vh]" aria-busy="true" />}>
        <DetalheTime params={props.params} />
      </Suspense>
    </Container>
  );
}

async function DetalheTime({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dados = await lerTorneio();
  const time = dados.times.find((t) => t.slug === slug);
  if (!time) notFound();

  const elenco = dados.jogadores.filter((j) => j.time_id === time.id).sort((a, b) => a.numero - b.numero);
  const resumo = resumoDoTime(dados, time.id);
  const goleadores = artilharia(dados).filter((l) => l.time.id === time.id);
  const grupo = dados.grupos.find((g) => g.id === time.grupo_id);
  const disputados = resumo.vitorias + resumo.empates + resumo.derrotas;
  const numeros = [
    { rotulo: "Jogos", valor: disputados },
    { rotulo: "Vitórias", valor: resumo.vitorias },
    { rotulo: "Empates", valor: resumo.empates },
    { rotulo: "Derrotas", valor: resumo.derrotas },
    { rotulo: "Gols marcados", valor: resumo.golsPro },
    { rotulo: "Gols sofridos", valor: resumo.golsContra },
  ];

  return (
    <>
      <Link href="/times" className="mt-6 inline-flex items-center gap-1 text-cinza hover:text-branco">
        <Icone nome="seta" className="rotate-90" /> Todos os times
      </Link>
      <header className="flex flex-col items-start gap-5 pt-6 pb-10 sm:flex-row sm:items-center sm:gap-8">
        <EscudoTime id={time.id} nome={time.nome} escudoPath={time.escudo_path} tamanho={112} />
        <div>
          <h1 className="text-[clamp(3.2rem,14vw,7rem)]">{time.nome}</h1>
          <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-lg">
            {grupo && <span className="bg-sol px-2 font-bold text-preto">Grupo {grupo.nome}</span>}
            {time.instagram && (
              <a
                href={linkInstagram(time.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-cinza hover:text-branco"
              >
                <Icone nome="instagram" /> @{time.instagram}
              </a>
            )}
          </p>
        </div>
      </header>

      <section aria-label="Números do time" className="mb-14">
        <dl className="grid grid-cols-3 gap-y-6 border-y-2 border-branco py-5 sm:grid-cols-6">
          {numeros.map((n, i) => (
            <div key={n.rotulo} className={`flex flex-col px-3 ${i % 3 === 0 ? "" : "border-l-2 border-giz"} sm:border-l-2 sm:first:border-l-0`}>
              <dt className="order-last text-sm font-semibold text-cinza">{n.rotulo}</dt>
              <dd className="numeros font-titulo text-5xl leading-none font-black">{n.valor}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
        <section aria-labelledby="titulo-elenco">
          <h2 id="titulo-elenco" className="mb-3 text-5xl">
            Elenco
          </h2>
          {elenco.length === 0 ? (
            <p className="text-cinza">O capitão ainda não cadastrou o elenco.</p>
          ) : (
            <ol className="divide-y-2 divide-linha border-t-2 border-branco">
              {elenco.map((j) => {
                const gols = goleadores.find((g) => g.jogadorId === j.id)?.total ?? 0;
                return (
                  <li key={j.id} className="flex items-center gap-4 py-2.5">
                    <span className="numeros w-10 text-right font-titulo text-[2rem] leading-none font-black text-sol">{j.numero}</span>
                    <span className="flex-1 text-lg font-semibold">{j.nome}</span>
                    {gols > 0 && (
                      <span className="numeros inline-flex items-center gap-1 text-cinza">
                        <Icone nome="bola" /> {gols}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </section>

        <section aria-labelledby="titulo-jogos">
          <h2 id="titulo-jogos" className="mb-3 text-5xl">
            Jogos
          </h2>
          {resumo.jogos.length === 0 ? (
            <p className="text-cinza">Os jogos aparecem aqui depois do sorteio dos grupos.</p>
          ) : (
            <div className="border-t-2 border-branco">
              {resumo.jogos.map((j) => (
                <CartaoJogo key={j.id} dados={dados} jogo={j} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
