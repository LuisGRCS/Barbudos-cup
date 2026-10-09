import type { SVGProps } from "react";

/* Pictogramas em traço, desenhados para combinar com os cortes angulares da logo */
const PATHS: Record<string, React.ReactNode> = {
  apito: (
    <>
      <path d="M3 10.5a5.5 5.5 0 1 0 11 0V8h7V5H8.5A5.5 5.5 0 0 0 3 10.5Z" />
      <circle cx="8.5" cy="10.5" r="1.6" />
      <path d="M10 5V3" />
    </>
  ),
  bola: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 7.5 4 2.9-1.5 4.7h-5L8 10.4Z" />
      <path d="M12 7.5V3.2M16 10.4l4.1-1.3M14.5 15.1l2.6 3.6M9.5 15.1l-2.6 3.6M8 10.4 3.9 9.1" />
    </>
  ),
  chave: (
    <>
      <path d="M3 4h5v6H3M3 14h5v6H3M8 7h4v10H8M12 12h5" />
      <path d="M17 9h4v6h-4Z" />
    </>
  ),
  trofeu: (
    <>
      <path d="M7 3h10v6a5 5 0 0 1-10 0Z" />
      <path d="M7 5H3.5v1.5A3.5 3.5 0 0 0 7 10M17 5h3.5v1.5A3.5 3.5 0 0 1 17 10M12 14v4M8 21h8l-1-3H9Z" />
    </>
  ),
  camisa: (
    <>
      <path d="M8.5 3 3 6l2 4.5 2-1V21h10V9.5l2 1L21 6l-5.5-3a3.5 3.5 0 0 1-7 0Z" />
      <path d="M11 13h2v4" />
    </>
  ),
  calendario: (
    <>
      <path d="M4 5h16v16H4ZM4 10h16M8 3v4M16 3v4" />
      <path d="M8 14h3v3H8Z" />
    </>
  ),
  documento: (
    <>
      <path d="M6 2.5h8.5L19 7v14.5H6Z" />
      <path d="M14 2.5V7.5h5M9 12h7M9 15.5h7M9 19h4" />
    </>
  ),
  escudo: <path d="M4 4.5 12 2l8 2.5V12c0 4.5-3.4 8-8 10-4.6-2-8-5.5-8-10Z" />,
  elenco: (
    <>
      <circle cx="8" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M2.5 20c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6M14 14.3c.9-.5 1.9-.8 3-.8 2.6 0 4.5 2.1 4.5 5.5" />
    </>
  ),
  relogio: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4.5l3 2M9.5 2.5h5" />
    </>
  ),
  wo: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m5.6 5.6 12.8 12.8" />
    </>
  ),
  amarelo: <path d="M7 3h10l-1 18H6Z" fill="currentColor" stroke="none" />,
  vermelho: <path d="M7 3h10l-1 18H6Z" fill="currentColor" stroke="none" />,
  troca: (
    <>
      <path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5" />
    </>
  ),
  mapa: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  dinheiro: (
    <>
      <path d="M2.5 6.5h19v11h-19Z" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6 9.5v5M18 9.5v5" />
    </>
  ),
  check: <path d="m4.5 12.5 4.5 4.5 10.5-11" />,
  seta: <path d="m6 9 6 6 6-6" />,
  menu: <path d="M3 6h18M3 12h18M9 18h12" />,
  fechar: <path d="M5 5l14 14M19 5 5 19" />,
  baixar: <path d="M12 3v12m0 0-5-5m5 5 5-5M4 20h16" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  externo: <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
};

export type NomeIcone = keyof typeof PATHS;

export function Icone({ nome, ...props }: { nome: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {PATHS[nome] ?? PATHS.apito}
    </svg>
  );
}
