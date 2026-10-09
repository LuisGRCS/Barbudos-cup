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
        <div className="recorte-escudo bg-carvao px-6 pt-8 pb-14 text-center ring-1 ring-linha ring-inset">
          <p className="text-xl">Nenhum time confirmado ainda.</p>
          <Link href="/inscricao" className="botao botao-sol mt-6">
            Inscreva seu time
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {times.map((t) => (
            <li key={t.id}>
              <Link
                href={`/times/${t.slug}`}
                className="group recorte-escudo flex h-full flex-col items-center bg-carvao px-3 pt-6 pb-10 text-center ring-1 ring-linha transition-colors ring-inset hover:bg-grafite [--ponta:1.5rem]"
              >
                <EscudoTime id={t.id} nome={t.nome} escudoPath={t.escudo_path} tamanho={72} />
                <h2 className="mt-4 text-[1.6rem] leading-tight transition-colors group-hover:text-sol sm:text-3xl">
                  {t.nome}
                </h2>
                {t.instagram && <p className="mt-1 text-base break-all text-cinza">@{t.instagram}</p>}
                {nomeGrupo(t.grupo_id) && (
                  <p className="mt-2 text-sm font-bold text-azul-claro">Grupo {nomeGrupo(t.grupo_id)}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
