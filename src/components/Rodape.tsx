import { BotaoInstagram } from "@/components/BotaoInstagram";
import { Container } from "@/components/Titulo";
import { lerConfiguracoes } from "@/lib/dados";

export async function Rodape() {
  const cfg = await lerConfiguracoes();
  const usuario = cfg.instagram_usuario?.replace(/^@/, "") ?? null;
  return (
    <footer className="mt-20 border-t border-linha">
      <Container className="flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold">Dúvidas? Fale com a organização pelo direct.</p>
          <p className="mt-1 text-sm text-cinza">
            {cfg.nome_campeonato}, futebol 7. Os dados dos capitães nunca aparecem no site.
          </p>
        </div>
        <BotaoInstagram usuario={usuario} variante="contorno" className="self-start sm:self-auto" />
      </Container>
    </footer>
  );
}
