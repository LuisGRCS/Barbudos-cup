import { Icone } from "@/components/Icone";
import { linkDirect } from "@/lib/formato";

/** Abre o direct do Instagram oficial. Toda dúvida e contato passam por aqui. */
export function BotaoInstagram({
  usuario,
  className = "",
  texto = "Falar com a organização no Instagram",
  variante = "branco",
}: {
  usuario: string | null;
  className?: string;
  texto?: string;
  variante?: "branco" | "preto" | "sol" | "contorno";
}) {
  if (!usuario) {
    return (
      <span className={`botao ${className}`} aria-disabled="true">
        <Icone nome="instagram" className="text-xl" />
        Instagram da organização em breve
      </span>
    );
  }
  return (
    <a
      href={linkDirect(usuario)}
      target="_blank"
      rel="noopener noreferrer"
      className={`botao botao-${variante} ${className}`}
    >
      <Icone nome="instagram" className="text-xl" />
      {texto}
      <span className="sr-only">(abre o direct do @{usuario.replace(/^@/, "")} em nova aba)</span>
    </a>
  );
}
