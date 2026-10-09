import { Icone } from "@/components/Icone";
import { Campo } from "@/components/Selo";
import { linkComoChegar, linkMapaIncorporado } from "@/lib/formato";

export function Local({ nome, endereco }: { nome: string | null; endereco: string | null }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr] lg:items-stretch">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-cinza">Campo</p>
          <p className="mt-1 font-titulo text-4xl font-black uppercase">
            <Campo valor={nome} grande />
          </p>
        </div>
        <div>
          <p className="text-cinza">Endereço</p>
          <p className="mt-1 text-lg font-semibold">
            <Campo valor={endereco} />
          </p>
        </div>
        {endereco && (
          <a
            href={linkComoChegar(endereco)}
            target="_blank"
            rel="noopener noreferrer"
            className="botao botao-sol self-start"
          >
            <Icone nome="mapa" className="text-xl" />
            Como chegar
            <span className="sr-only">(abre o Google Maps em nova aba)</span>
          </a>
        )}
      </div>
      {endereco ? (
        <iframe
          title={`Mapa: ${nome ?? endereco}`}
          src={linkMapaIncorporado(endereco)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[4/3] w-full border-0 bg-grafite grayscale-[0.3] lg:aspect-auto lg:min-h-72"
        />
      ) : (
        <div className="linhas-de-campo relative grid aspect-[16/9] place-items-center border-2 border-dashed border-linha text-center text-cinza [background-size:90%] [background-position:center] lg:aspect-auto lg:min-h-72">
          <p className="relative max-w-[30ch] bg-preto px-4 py-2">O mapa aparece aqui assim que o local for definido.</p>
        </div>
      )}
    </div>
  );
}
