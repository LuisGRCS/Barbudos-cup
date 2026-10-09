import { iniciais, urlEscudo } from "@/lib/formato";

const CORES = ["#1565C0", "#E0112B", "#F7C81E", "#FFFFFF"];

/** Escudo enviado pelo capitão ou, sem imagem, um escudo provisório com as iniciais */
export function EscudoTime({
  nome,
  escudoPath,
  tamanho = 56,
  id = 0,
}: {
  nome: string;
  escudoPath: string | null;
  tamanho?: number;
  id?: number;
}) {
  const url = urlEscudo(escudoPath);
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={`Escudo do ${nome}`}
        width={tamanho}
        height={tamanho}
        loading="lazy"
        className="shrink-0 object-contain"
        style={{ width: tamanho, height: tamanho }}
      />
    );
  }
  const cor = CORES[id % CORES.length];
  const claro = cor === "#F7C81E" || cor === "#FFFFFF";
  return (
    <svg
      viewBox="0 0 48 54"
      width={tamanho}
      height={tamanho * 1.125}
      role="img"
      aria-label={`Escudo provisório do ${nome}`}
      className="shrink-0"
      style={{ width: tamanho, height: tamanho * 1.125 }}
    >
      <path d="M3 4 24 0l21 4v24c0 12-9 21-21 26C12 49 3 40 3 28Z" fill={cor} />
      <path d="M3 4 24 0l21 4v24c0 12-9 21-21 26C12 49 3 40 3 28Z" fill="none" stroke="#000" strokeOpacity=".35" strokeWidth="2" />
      <text
        x="24"
        y="31"
        textAnchor="middle"
        fontFamily="var(--font-titulo)"
        fontSize="19"
        fill={claro ? "#000" : "#fff"}
      >
        {iniciais(nome)}
      </text>
    </svg>
  );
}
