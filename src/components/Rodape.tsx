import Image from "next/image";
import Link from "next/link";
import { BotaoInstagram } from "@/components/BotaoInstagram";
import { Container } from "@/components/Titulo";
import { lerConfiguracoes } from "@/lib/dados";
import { linkInstagram } from "@/lib/formato";
import { LINKS } from "@/lib/navegacao";

export async function Rodape() {
  const cfg = await lerConfiguracoes();
  const usuario = cfg.instagram_usuario?.replace(/^@/, "") ?? null;
  return (
    <footer className="mt-28 bg-azul text-branco">
      <div aria-hidden="true" className="h-1.5 bg-vermelho" />
      <Container className="grid gap-12 pt-14 pb-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-titulo text-[clamp(2.6rem,10vw,4.5rem)] leading-[0.88] font-black uppercase">
            Dúvida? Chama no direct.
          </p>
          <p className="mt-4 max-w-[44ch] text-lg text-white/80">
            Todo contato com a organização é feito pelo Instagram oficial
            {usuario ? (
              <>
                ,{" "}
                <a href={linkInstagram(usuario)} target="_blank" rel="noopener noreferrer" className="font-bold text-branco underline underline-offset-4 hover:text-sol">
                  @{usuario}
                </a>
              </>
            ) : null}
            .
          </p>
          <BotaoInstagram usuario={usuario} className="mt-6" />
        </div>
        <div className="flex flex-col gap-8 lg:items-end">
          <nav aria-label="Rodapé">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-1.5 text-lg font-semibold">
              {[...LINKS, { href: "/inscricao", rotulo: "Inscreva seu time" }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/85 hover:text-sol">
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
      <div className="bg-preto">
        <Container className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
          <Image src="/logo-escudo.png" alt="" width={44} height={48} className="h-12 w-auto self-start" />
          <p className="text-sm text-cinza">
            {cfg.nome_campeonato}, futebol 7{cfg.edicao ? `, ${cfg.edicao}` : ""}. Os dados dos capitães são usados só
            pela organização e nunca aparecem no site.
          </p>
        </Container>
      </div>
    </footer>
  );
}
