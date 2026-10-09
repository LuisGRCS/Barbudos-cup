import { Icone } from "@/components/Icone";
import { Campo, SeloADefinir } from "@/components/Selo";
import { linkComoChegar, linkMapaIncorporado } from "@/lib/formato";

export function Local({ nome, endereco }: { nome: string | null; endereco: string | null }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr] lg:items-stretch">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-cinza">Campo</p>
          <p className="mt-1 font-titulo text-3xl uppercase">
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
            className="botao botao-azul self-start"
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
        <div className="grid aspect-[16/9] place-items-center bg-[repeating-linear-gradient(-45deg,#111_0_14px,#0b0b0b_14px_28px)] text-center text-cinza ring-1 ring-linha ring-inset lg:aspect-auto lg:min-h-72">
          <p className="flex flex-col items-center gap-2 px-6">
            <Icone nome="mapa" className="text-4xl text-vermelho" />
            O mapa aparece aqui assim que o local for definido.
            <SeloADefinir />
          </p>
        </div>
      )}
    </div>
  );
}
