import type { Metadata } from "next";
import Link from "next/link";
import { EscudoTime } from "@/components/EscudoTime";
import { Container, TituloPagina } from "@/components/Titulo";
import { lerTorneio } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Times",
  description: "Times confirmados no Barbudos Cup, com elenco, jogos e estatísticas.",
};

export default async function Times() {
  const { times, grupos } = await lerTorneio();
  const nomeGrupo = (id: number | null) => grupos.find((g) => g.id === id)?.nome;

  return (
    <Container>
      <TituloPagina titulo="Times">
        {times.length > 0
          ? `${times.length} ${times.length === 1 ? "time confirmado" : "times confirmados"} pela organização. Toque em um time para ver elenco, jogos e números.`
          : "Os times aparecem aqui assim que a organização aprovar as inscrições."}
      </TituloPagina>

      {times.length === 0 ? (
        <div className="border-t-2 border-branco pt-8">
          <p className="text-xl">Nenhum time confirmado ainda.</p>
          <Link href="/inscricao" className="botao botao-sol mt-6">
            Inscreva seu time
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {times.map((t) => (
            <li key={t.id}>
              {/* Cada time vira uma figurinha do álbum */}
              <Link
                href={`/times/${t.slug}`}
                className="group flex h-full flex-col border border-linha bg-carvao transition-colors hover:border-sol"
              >
                <div className="relative grid aspect-[5/4] place-items-center border-b border-linha">
                  <div className="relative">
                    <EscudoTime id={t.id} nome={t.nome} escudoPath={t.escudo_path} tamanho={68} />
                  </div>
                  {nomeGrupo(t.grupo_id) && (
                    <span className="absolute top-2 left-2 border border-linha px-1.5 text-sm font-semibold text-cinza">
                      Grupo {nomeGrupo(t.grupo_id)}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-3 pt-3 pb-3">
                  <h2 className="text-[1.5rem] leading-[0.95] sm:text-[1.7rem]">{t.nome}</h2>
                  {t.instagram && <p className="mt-1 truncate text-sm text-cinza">@{t.instagram}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
