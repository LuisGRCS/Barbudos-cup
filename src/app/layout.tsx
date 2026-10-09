import type { Metadata, Viewport } from "next";
import { Anton, Barlow_Condensed } from "next/font/google";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import "./globals.css";

const anton = Anton({ variable: "--fonte-anton", weight: "400", subsets: ["latin"], display: "swap" });
const barlow = Barlow_Condensed({
  variable: "--fonte-barlow",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const DESCRICAO =
  "Site oficial do Barbudos Cup, campeonato de futebol 7. Inscrições, regulamento, times, tabela, jogos e estatísticas.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Barbudos Cup | Futebol 7", template: "%s | Barbudos Cup" },
  description: DESCRICAO,
  applicationName: "Barbudos Cup",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Barbudos Cup",
    title: "Barbudos Cup | Futebol 7",
    description: DESCRICAO,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${barlow.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#conteudo"
          className="sr-only z-[60] bg-sol px-4 py-2 font-bold text-preto focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Pular para o conteúdo
        </a>
        <Cabecalho />
        <main id="conteudo" className="flex-1 pt-16 lg:pt-20">
          {children}
        </main>
        <Rodape />
      </body>
    </html>
  );
}
