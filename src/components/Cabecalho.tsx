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
  const [rolou, setRolou] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const [rotaAnterior, setRotaAnterior] = useState(pathname);

  // Fecha o menu ao trocar de página
  if (rotaAnterior !== pathname) {
    setRotaAnterior(pathname);
    setAberto(false);
  }

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 8);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        rolou || aberto ? "bg-preto/95 backdrop-blur-md" : "bg-gradient-to-b from-preto to-preto/0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Barbudos Cup — página inicial">
          <Image src="/logo-escudo.png" alt="" width={40} height={43} className="h-10 w-auto lg:h-12" priority />
          <span className="font-titulo text-xl leading-none uppercase sm:text-2xl">
            Barbudos <span className="text-sol">Cup</span>
          </span>
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.slice(1).map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={ativo(pathname, l.href) ? "page" : undefined}
                  className="relative px-3 py-2 text-lg font-semibold text-cinza transition-colors hover:text-branco aria-[current=page]:text-branco"
                >
                  {l.rotulo}
                  {ativo(pathname, l.href) && (
                    <motion.span
                      layoutId="sublinhado"
                      className="absolute inset-x-3 -bottom-0.5 h-[3px] bg-vermelho"
                      style={{ clipPath: "polygon(3px 0,100% 0,calc(100% - 3px) 100%,0 100%)" }}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link href="/inscricao" className="botao botao-sol ml-auto !min-h-10 !px-4 !text-base lg:ml-3">
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
          <Icone nome={aberto ? "fechar" : "menu"} />
          <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
        </button>
      </div>

      <AnimatePresence>
        {aberto && (
          <motion.nav
            id="menu-celular"
            aria-label="Principal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-preto lg:hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-vermelho/90"
              style={{ clipPath: "polygon(70% 0,100% 0,100% 100%,0 100%)" }}
            />
            <ul className="relative flex flex-col px-4 pt-4 pb-10">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <Link
                    href={l.href}
                    aria-current={ativo(pathname, l.href) ? "page" : undefined}
                    className="flex items-center gap-3 border-b border-linha py-3.5 font-titulo text-[2.6rem] leading-none uppercase aria-[current=page]:text-sol"
                  >
                    {l.rotulo}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-8"
              >
                <Link href="/inscricao" className="botao botao-sol w-full !text-xl">
                  Inscreva seu time
                </Link>
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
