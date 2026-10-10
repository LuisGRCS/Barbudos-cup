import Image from "next/image";
import Link from "next/link";
import { BotaoInstagram } from "@/components/BotaoInstagram";
import { Contagem } from "@/components/Contagem";
import { ProximoJogo, type JogoResumo } from "@/components/ProximoJogo";
import { SeloADefinir } from "@/components/Selo";
import { Container } from "@/components/Titulo";
import { lerConfiguracoes, lerInscricoes, lerTorneio } from "@/lib/dados";
import { dataLonga, diaSemana, hora } from "@/lib/formato";
import { ROTULO_STATUS } from "@/lib/inscricao";
import { ladosDoJogo, NOME_FASE } from "@/lib/torneio";

/* Início: só o essencial. O resto do campeonato fica nas abas. */
export default async function Inicio() {
  const [cfg, inscricoes, torneio] = await Promise.all([lerConfiguracoes(), lerInscricoes(), lerTorneio()]);

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
  const inicio = cfg.inicio_campeonato;
  const vagas = cfg.vagas_total ? `${inscricoes.vagasPreenchidas} de ${cfg.vagas_total} vagas preenchidas` : null;

  return (
    <Container className="flex flex-col items-center pt-10 pb-6 text-center sm:pt-14">
      <h1 className="anim-subir" style={{ "--atraso": "0s" } as React.CSSProperties}>
        <Image
          src="/logo-escudo.png"
          alt="Barbudos Cup, futebol 7"
          width={1011}
          height={1091}
          priority
          sizes="(min-width: 640px) 260px, 210px"
          className="h-auto w-[210px] sm:w-[260px]"
        />
      </h1>

      <p className="mt-8 text-lg text-cinza">{cfg.edicao ? `${cfg.edicao}, futebol 7` : "Futebol 7"}</p>
      <p className="mt-1 font-titulo text-[clamp(2.2rem,9vw,3.25rem)] leading-none font-black uppercase">
        {inicio ? (
          <>
            {diaSemana(inicio)}, {dataLonga(inicio).replace(/ de \d{4}$/, "")}
          </>
        ) : (
          <>
            Data <SeloADefinir grande />
          </>
        )}
      </p>
      {inicio && (
        <p className="mt-2 text-lg text-cinza">
          A partir das {hora(inicio)}
          {cfg.local_nome ? `, ${cfg.local_nome}` : ""}
        </p>
      )}

      <div className="mt-10 w-full max-w-md">
        {inicio ? (
          <Contagem
            alvo={inicio}
            rotulo="Tempo até o início do campeonato"
            titulo={<h2 className="mb-3 text-base font-semibold tracking-normal text-cinza normal-case [font-family:var(--font-texto)]">Falta para a bola rolar</h2>}
            aoTerminar={
              <div className="border-y border-linha py-5">
                <h2 className="text-base font-semibold text-cinza normal-case [font-family:var(--font-texto)]">Próximo jogo</h2>
                <div className="mt-2">
                  <ProximoJogo jogos={agenda} vazio="A agenda sai em breve." />
                </div>
              </div>
            }
          />
        ) : null}
      </div>

      <div className="mt-10 flex w-full max-w-md flex-col gap-3">
        <Link href="/inscricao" className="botao botao-sol !min-h-14 !text-xl">
          Inscreva seu time
        </Link>
        <p className="text-base text-cinza">
          {ROTULO_STATUS[inscricoes.status]}
          {vagas ? `. ${vagas}` : ""}
        </p>
      </div>

      <div className="mt-10">
        <BotaoInstagram usuario={cfg.instagram_usuario} variante="contorno" />
      </div>
    </Container>
  );
}
