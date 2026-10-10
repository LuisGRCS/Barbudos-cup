"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { LINKS } from "@/lib/navegacao";

function ativo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Cabeçalho fixo: logo e inscrição em cima, as abas do campeonato logo abaixo */
export function Cabecalho() {
  const pathname = usePathname();
  const abas = useRef<HTMLUListElement>(null);

  // No celular as abas rolam para o lado: mantém a aba atual à vista
  useEffect(() => {
    const atual = abas.current?.querySelector<HTMLElement>('[aria-current="page"]');
    atual?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-preto">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Barbudos Cup, início">
          <Image src="/logo-escudo.png" alt="" width={34} height={37} className="h-9 w-auto" priority />
          <span className="font-titulo text-[1.45rem] leading-none font-black whitespace-nowrap uppercase">
            Barbudos Cup
          </span>
        </Link>
        <Link href="/inscricao" className="botao botao-sol ml-auto !min-h-9 !px-3.5 !py-1.5 !text-[0.95rem] whitespace-nowrap">
          Inscreva seu time
        </Link>
      </div>
      <nav aria-label="Abas do campeonato" className="border-b border-linha">
        <ul
          ref={abas}
          className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-2 [scrollbar-width:none] sm:px-4 [&::-webkit-scrollbar]:hidden"
        >
          {LINKS.map((l) => {
            const atual = ativo(pathname, l.href);
            return (
              <li key={l.href} className="shrink-0">
                <Link
                  href={l.href}
                  aria-current={atual ? "page" : undefined}
                  className={`relative block px-3 py-3 text-[1.05rem] font-semibold whitespace-nowrap transition-colors ${
                    atual ? "text-branco" : "text-cinza hover:text-branco"
                  }`}
                >
                  {l.rotulo}
                  {atual && <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-[3px] bg-sol" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
