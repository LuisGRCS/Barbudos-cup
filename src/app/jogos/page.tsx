import type { Metadata } from "next";
import { CartaoJogo } from "@/components/CartaoJogo";
import { Container, TituloPagina } from "@/components/Titulo";
import { lerTorneio } from "@/lib/dados";
import { NOME_FASE, ORDEM_MATA_MATA } from "@/lib/torneio";
import type { Jogo } from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Jogos",
  description: "Agenda por rodada, resultados e autores dos gols do Barbudos Cup.",
};

const porData = (a: Jogo, b: Jogo) => (a.data_hora ?? "9").localeCompare(b.data_hora ?? "9") || a.id - b.id;

export default async function Jogos() {
  const dados = await lerTorneio();
  const jogos = [...dados.jogos].sort(porData);

  const proximo = jogos.find((j) => !j.encerrado && j.data_hora);
  const ultimo = [...jogos].reverse().find((j) => j.encerrado);

  // Agrupa por rodada (fase de grupos) e por fase (mata-mata)
  const blocos: { chave: string; titulo: string; jogos: Jogo[] }[] = [];
  const rodadas = [...new Set(jogos.filter((j) => j.fase === "grupos").map((j) => j.rodada ?? 0))].sort((a, b) => a - b);
  for (const r of rodadas) {
    blocos.push({
      chave: `r${r}`,
      titulo: r ? `Rodada ${r}` : "Fase de grupos",
      jogos: jogos.filter((j) => j.fase === "grupos" && (j.rodada ?? 0) === r),
    });
  }
  for (const fase of [...ORDEM_MATA_MATA.slice(0, -1), "terceiro", "final"] as const) {
    const lista = jogos.filter((j) => j.fase === fase);
    if (lista.length) blocos.push({ chave: fase, titulo: NOME_FASE[fase], jogos: lista });
  }

  return (
    <Container>
      <TituloPagina titulo="Jogos">
        Agenda completa por rodada, com placar e autores dos gols assim que a súmula é lançada.
      </TituloPagina>

      {jogos.length === 0 ? (
        <p className="text-xl text-cinza">A tabela de jogos sai depois do sorteio dos grupos.</p>
      ) : (
        <>
          {(proximo || ultimo) && (
            <div className="mb-16 grid gap-x-10 border-t-2 border-branco md:grid-cols-2">
              {proximo && <CartaoJogo dados={dados} jogo={proximo} destaque="Próximo jogo" />}
              {ultimo && <CartaoJogo dados={dados} jogo={ultimo} destaque="Último resultado" />}
            </div>
          )}

          <nav aria-label="Rodadas" className="-mx-4 mb-10 overflow-x-auto px-4">
            <ul className="flex gap-6">
              {blocos.map((b) => (
                <li key={b.chave}>
                  <a
                    href={`#${b.chave}`}
                    className="block font-titulo text-2xl font-black whitespace-nowrap text-cinza uppercase underline decoration-transparent decoration-[3px] underline-offset-[6px] transition-colors hover:text-branco hover:decoration-sol"
                  >
                    {b.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-14">
            {blocos.map((b) => (
              <section key={b.chave} id={b.chave} aria-labelledby={`t-${b.chave}`} className="scroll-mt-32">
                <h2 id={`t-${b.chave}`} className="mb-1 text-[clamp(2.6rem,10vw,4rem)]">
                  {b.titulo}
                </h2>
                <div className="grid gap-x-10 border-t-2 border-branco md:grid-cols-2">
                  {b.jogos.map((j) => (
                    <CartaoJogo key={j.id} dados={dados} jogo={j} mostrarFase={j.fase === "grupos"} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
