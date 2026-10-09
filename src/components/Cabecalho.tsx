"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Icone } from "@/components/Icone";
import { LINKS } from "@/lib/navegacao";

function ativo(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Cabecalho() {
  const pathname = usePathname();
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const [rotaAnterior, setRotaAnterior] = useState(pathname);

  // Fecha o menu ao trocar de página
  if (rotaAnterior !== pathname) {
    setRotaAnterior(pathname);
    setAberto(false);
  }

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAberto(false);
        botaoMenu.current?.focus();
      }
    };
    window.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b ${aberto ? "border-sol bg-sol text-preto" : "border-linha bg-preto"}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Barbudos Cup, página inicial">
          <Image src="/logo-escudo.png" alt="" width={40} height={43} className="h-10 w-auto" priority />
          <span className="hidden font-titulo text-[1.65rem] leading-none font-black whitespace-nowrap uppercase sm:inline">Barbudos Cup</span>
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden lg:block">
          <ul className="flex items-center">
            {LINKS.slice(1).map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={ativo(pathname, l.href) ? "page" : undefined}
                  className="block px-3 py-2 text-[1.05rem] font-semibold text-cinza transition-colors hover:text-branco aria-[current=page]:text-sol"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/inscricao"
          className={`botao ml-auto !min-h-10 !px-4 !text-base whitespace-nowrap lg:ml-4 ${aberto ? "botao-preto" : "botao-sol"} ${
            aberto ? "invisible" : ""
          }`}
        >
          Inscreva seu time
        </Link>

        <button
          ref={botaoMenu}
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-celular"
          className="-mr-2 grid size-11 place-items-center text-3xl lg:hidden"
        >
          <Icone nome={aberto ? "fechar" : "menu"} strokeWidth={2.2} />
          <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
        </button>
      </div>

      <AnimatePresence>
        {aberto && (
          <motion.nav
            id="menu-celular"
            aria-label="Principal"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-sol text-preto lg:hidden"
          >
            <ul className="flex flex-col px-4 pt-2 pb-8">
              {LINKS.map((l) => (
                <li key={l.href} className="border-b-2 border-preto/15">
                  <Link
                    href={l.href}
                    aria-current={ativo(pathname, l.href) ? "page" : undefined}
                    className="flex items-baseline justify-between py-2.5 font-titulo text-[3.1rem] leading-none font-black uppercase aria-[current=page]:underline aria-[current=page]:decoration-[5px] aria-[current=page]:underline-offset-[6px]"
                  >
                    {l.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="px-4 pb-10">
              <Link href="/inscricao" className="botao botao-preto w-full !min-h-14 !text-xl">
                Inscreva seu time
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
