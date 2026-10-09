import Image from "next/image";
import Link from "next/link";
import { BotaoInstagram } from "@/components/BotaoInstagram";
import { LINKS } from "@/lib/navegacao";
import { Container } from "@/components/Titulo";
import { lerConfiguracoes } from "@/lib/dados";
import { linkInstagram } from "@/lib/formato";

export async function Rodape() {
  const cfg = await lerConfiguracoes();
  return (
    <footer className="relative mt-24 border-t-4 border-vermelho bg-carvao">
      <div aria-hidden="true" className="absolute inset-x-0 -top-[10px] h-[6px] bg-azul" style={{ clipPath: "polygon(0 0,100% 0,98% 100%,2% 100%)" }} />
      <Container className="grid gap-10 py-12 md:grid-cols-[1fr_auto] md:items-start">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Image src="/logo-escudo.png" alt="" width={72} height={78} className="h-[4.5rem] w-auto" />
            <div>
              <p className="font-titulo text-3xl leading-none uppercase">
                {cfg.nome_campeonato}
              </p>
              <p className="mt-1 text-cinza">Campeonato de futebol 7{cfg.edicao ? `, ${cfg.edicao}` : ""}</p>
            </div>
          </div>
          <div>
            <p className="mb-3 max-w-[46ch] text-cinza">
              Contato e dúvidas somente pelo direct do Instagram oficial.
            </p>
            <BotaoInstagram usuario={cfg.instagram_usuario} />
            {cfg.instagram_usuario && (
              <p className="mt-3 text-base text-cinza">
                Siga{" "}
                <a href={linkInstagram(cfg.instagram_usuario)} target="_blank" rel="noopener noreferrer" className="font-semibold text-branco underline decoration-vermelho decoration-2 underline-offset-4 hover:text-sol">
                  @{cfg.instagram_usuario.replace(/^@/, "")}
                </a>
              </p>
            )}
          </div>
        </div>
        <nav aria-label="Rodapé">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2 text-lg">
            {[...LINKS, { href: "/inscricao", rotulo: "Inscreva seu time" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cinza transition-colors hover:text-branco">
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <Container className="border-t border-linha py-5 text-sm text-cinza-escuro">
        © {cfg.nome_campeonato}. Os dados dos capitães são usados só para a organização do campeonato e nunca são exibidos publicamente.
      </Container>
    </footer>
  );
}
