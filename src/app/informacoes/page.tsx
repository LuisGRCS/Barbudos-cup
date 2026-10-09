import type { Metadata } from "next";
import Link from "next/link";
import { BotaoInstagram } from "@/components/BotaoInstagram";
import { BlocoDatasJogos, BlocoFormato, BlocoPagamento } from "@/components/info/Blocos";
import { Local } from "@/components/info/Local";
import { Secao } from "@/components/info/Secao";
import { Campo } from "@/components/Selo";
import { Container, TituloPagina } from "@/components/Titulo";
import { lerConfiguracoes, lerPremios } from "@/lib/dados";

export const metadata: Metadata = {
  title: "Informações",
  description: "Datas, local, taxa de inscrição, premiação e formato do Barbudos Cup.",
};

export default async function Informacoes() {
  const [cfg, premios] = await Promise.all([lerConfiguracoes(), lerPremios()]);

  return (
    <Container>
      <TituloPagina titulo="Informações">
        Tudo sobre datas, local, valores e premiação. Quer inscrever seu time? Os detalhes completos estão em{" "}
        <Link href="/inscricao" className="font-semibold text-branco underline decoration-sol decoration-2 underline-offset-4 hover:text-sol">
          Inscreva seu time
        </Link>
        .
      </TituloPagina>

      <Secao id="datas" titulo="Datas e horários">
        <BlocoDatasJogos cfg={cfg} />
      </Secao>

      <Secao id="local" titulo="Local">
        <Local nome={cfg.local_nome} endereco={cfg.local_endereco} />
      </Secao>

      <Secao id="valores" titulo="Taxa e pagamento">
        <BlocoPagamento cfg={cfg} />
      </Secao>

      <Secao id="premiacao" titulo="Premiação">
        {premios.length > 0 ? (
          <ol className="divide-y-2 divide-linha">
            {premios.map((p, i) => (
              <li key={p.id} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-3 py-3 first:pt-0 sm:grid-cols-[4.5rem_1fr]">
                <span className={`numeros font-titulo text-5xl leading-none font-black ${i === 0 ? "text-sol" : "text-cinza-escuro"}`}>
                  {p.titulo.match(/artilheiro|goleiro|craque|fair/i) ? "★" : `${i + 1}º`}
                </span>
                <div>
                  <h3 className="text-[2rem] leading-none">{p.titulo}</h3>
                  <p className="mt-1 text-lg text-cinza">
                    <Campo valor={p.descricao} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-cinza">
            Premiação <Campo valor={null} />
          </p>
        )}
      </Secao>

      <Secao id="formato" titulo="Times e formato">
        <BlocoFormato cfg={cfg} />
      </Secao>

      <Secao
        id="contato"
        titulo="Contato e dúvidas"
       
        intro="Todo contato com a organização é feito pelo direct do Instagram oficial. Mande sua dúvida por lá que a gente responde."
      >
        <BotaoInstagram usuario={cfg.instagram_usuario} />
      </Secao>
    </Container>
  );
}
