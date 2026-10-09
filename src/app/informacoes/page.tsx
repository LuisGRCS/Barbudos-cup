import type { Metadata } from "next";
import Link from "next/link";
import { BotaoInstagram } from "@/components/BotaoInstagram";
import { Icone } from "@/components/Icone";
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

      <Secao id="datas" titulo="Datas e horários" icone={<Icone nome="calendario" />}>
        <BlocoDatasJogos cfg={cfg} />
      </Secao>

      <Secao id="local" titulo="Local" icone={<Icone nome="mapa" />}>
        <Local nome={cfg.local_nome} endereco={cfg.local_endereco} />
      </Secao>

      <Secao id="valores" titulo="Taxa e pagamento" icone={<Icone nome="dinheiro" />}>
        <BlocoPagamento cfg={cfg} />
      </Secao>

      <Secao id="premiacao" titulo="Premiação" icone={<Icone nome="trofeu" />}>
        {premios.length > 0 ? (
          <ol className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {premios.map((p, i) => (
              <li
                key={p.id}
                className={`recorte-escudo flex flex-col gap-2 px-4 pt-5 pb-9 sm:px-5 ${
                  i === 0 ? "col-span-2 bg-sol text-preto lg:col-span-1" : "bg-carvao ring-1 ring-linha ring-inset"
                }`}
              >
                <Icone nome="trofeu" className={`text-3xl ${i === 0 ? "" : "text-sol"}`} />
                <h3 className="text-2xl sm:text-3xl">{p.titulo}</h3>
                <p className={i === 0 ? "font-semibold" : "text-cinza"}>
                  <Campo valor={p.descricao} sobreSol={i === 0} />
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-cinza">
            Premiação <Campo valor={null} />
          </p>
        )}
      </Secao>

      <Secao id="formato" titulo="Times e formato" icone={<Icone nome="chave" />}>
        <BlocoFormato cfg={cfg} />
      </Secao>

      <Secao
        id="contato"
        titulo="Contato e dúvidas"
        icone={<Icone nome="instagram" />}
        intro="Todo contato com a organização é feito pelo direct do Instagram oficial. Mande sua dúvida por lá que a gente responde."
      >
        <BotaoInstagram usuario={cfg.instagram_usuario} />
      </Secao>
    </Container>
  );
}
