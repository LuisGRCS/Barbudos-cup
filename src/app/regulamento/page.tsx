import type { Metadata } from "next";
import { BotaoInstagram } from "@/components/BotaoInstagram";
import { Icone } from "@/components/Icone";
import { Sanfona } from "@/components/Sanfona";
import { Container, TituloPagina } from "@/components/Titulo";
import { lerConfiguracoes, lerRegulamento } from "@/lib/dados";
import { blocosDeTexto } from "@/lib/formato";

export const metadata: Metadata = {
  title: "Regulamento",
  description: "Regulamento completo do Barbudos Cup: inscrição, elenco, partidas, desempate, cartões, W.O., uniformes e conduta.",
};

export default async function Regulamento() {
  const [cfg, secoes] = await Promise.all([lerConfiguracoes(), lerRegulamento()]);

  return (
    <Container>
      <TituloPagina titulo="Regulamento">
        As regras valem para todos os times inscritos. Ao inscrever o time, o capitão aceita este regulamento em nome
        de todo o elenco.
      </TituloPagina>

      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a href="/regulamento/pdf" className="botao botao-sol self-start" download>
          <Icone nome="baixar" className="text-xl" />
          Baixar regulamento em PDF
        </a>
        <p className="text-base text-cinza">A versão do site é sempre a mais atual.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
        <nav aria-label="Tópicos do regulamento" className="hidden lg:block">
          <ol className="sticky top-28 space-y-1 border-l-2 border-linha">
            {secoes.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#topico-${s.id}`}
                  className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-cinza transition-colors hover:border-vermelho hover:text-branco"
                >
                  <span className="numeros mr-2 text-cinza-escuro">{i + 1}.</span>
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="border-t border-linha">
          {secoes.map((s, i) => (
            <Sanfona
              key={s.id}
              id={`topico-${s.id}`}
              aberto={i === 0}
              titulo={
                <span className="flex items-baseline gap-3">
                  <span className="numeros font-titulo text-2xl text-vermelho">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-titulo text-[1.7rem] leading-tight uppercase">{s.titulo}</span>
                </span>
              }
            >
              <div className="texto-corrido text-lg">
                {blocosDeTexto(s.conteudo).map((b, j) =>
                  b.tipo === "p" ? (
                    <p key={j}>{b.texto}</p>
                  ) : (
                    <ul key={j}>
                      {b.itens.map((item, k) => (
                        <li key={k}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </Sanfona>
          ))}
        </div>
      </div>

      <div className="mt-16 border-t-2 border-branco pt-8">
        <h2 className="text-[clamp(2.4rem,9vw,4rem)]">Ficou dúvida sobre alguma regra?</h2>
        <p className="mt-3 mb-6 max-w-[56ch] text-cinza">
          Chama a organização no direct do Instagram. Recursos sobre jogos são enviados pelo capitão em até 24 horas.
        </p>
        <BotaoInstagram usuario={cfg.instagram_usuario} />
      </div>
    </Container>
  );
}
