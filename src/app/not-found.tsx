import Link from "next/link";
import { Container } from "@/components/Titulo";

export default function NaoEncontrada() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-16">
      <p className="font-titulo text-[clamp(5rem,25vw,10rem)] leading-none text-vermelho">404</p>
      <h1 className="mt-2 text-[clamp(2rem,8vw,3.5rem)]">Essa página saiu pela linha de fundo</h1>
      <p className="mt-4 max-w-[48ch] text-xl text-cinza">
        O endereço não existe ou foi alterado. Volte para o início e siga pelas seções do campeonato.
      </p>
      <Link href="/" className="botao botao-sol mt-8">
        Voltar para o início
      </Link>
    </Container>
  );
}
