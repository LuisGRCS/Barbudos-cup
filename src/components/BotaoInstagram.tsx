import { Icone } from "@/components/Icone";
import { SeloADefinir } from "@/components/Selo";
import { linkDirect } from "@/lib/formato";

/** Abre o direct do Instagram oficial. Toda dúvida e contato passam por aqui. */
export function BotaoInstagram({
  usuario,
  className = "",
  texto = "Falar com a organização no Instagram",
}: {
  usuario: string | null;
  className?: string;
  texto?: string;
}) {
  if (!usuario) {
    return (
      <span className={`inline-flex flex-wrap items-center gap-3 ${className}`}>
        <span className="botao botao-fantasma" aria-disabled="true">
          <Icone nome="instagram" className="text-xl" />
          {texto}
        </span>
        <span className="text-base text-cinza">
          Instagram oficial <SeloADefinir />
        </span>
      </span>
    );
  }
  return (
    <a
      href={linkDirect(usuario)}
      target="_blank"
      rel="noopener noreferrer"
      className={`botao botao-branco ${className}`}
    >
      <Icone nome="instagram" className="text-xl" />
      {texto}
      <span className="sr-only">(abre o direct do @{usuario.replace(/^@/, "")} em nova aba)</span>
    </a>
  );
}
