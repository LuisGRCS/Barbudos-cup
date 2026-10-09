"use client";

import { useSyncExternalStore } from "react";

/* Relógio compartilhado: um único intervalo para todos os componentes que precisam da hora atual.
 * No servidor (e na hidratação) devolve null, porque as páginas ficam em cache. */

let atual = 0;
let timer: ReturnType<typeof setInterval> | undefined;
const ouvintes = new Set<() => void>();

function assinar(aviso: () => void) {
  ouvintes.add(aviso);
  if (!timer) {
    atual = Date.now();
    timer = setInterval(() => {
      atual = Date.now();
      ouvintes.forEach((f) => f());
    }, 1000);
  }
  return () => {
    ouvintes.delete(aviso);
    if (ouvintes.size === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const lerCliente = () => atual || (atual = Date.now());
const lerServidor = () => null;

export function useAgora(): number | null {
  return useSyncExternalStore(assinar, lerCliente, lerServidor);
}
