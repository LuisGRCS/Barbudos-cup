import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, rgb, StandardFonts, type PDFFont, type PDFPage } from "pdf-lib";
import { lerConfiguracoes, lerRegulamento } from "@/lib/dados";
import { blocosDeTexto, dataLonga } from "@/lib/formato";

/* Gera o PDF do regulamento a partir do texto editado no painel */

const A4: [number, number] = [595.28, 841.89];
const MARGEM = 56;
const VERMELHO = rgb(224 / 255, 17 / 255, 43 / 255);
const PRETO = rgb(0, 0, 0);
const CINZA = rgb(0.35, 0.35, 0.35);

// Fontes padrão do PDF usam a codificação WinAnsi: troca caracteres fora dela
const limpar = (t: string) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x00-\xFF–—•]/g, "");

function quebrarLinhas(texto: string, fonte: PDFFont, tamanho: number, largura: number) {
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of limpar(texto).split(/\s+/)) {
    const teste = atual ? `${atual} ${palavra}` : palavra;
    if (fonte.widthOfTextAtSize(teste, tamanho) > largura && atual) {
      linhas.push(atual);
      atual = palavra;
    } else atual = teste;
  }
  if (atual) linhas.push(atual);
  return linhas;
}

export async function GET() {
  const [cfg, secoes] = await Promise.all([lerConfiguracoes(), lerRegulamento()]);
  const pdf = await PDFDocument.create();
  pdf.setTitle(`Regulamento - ${cfg.nome_campeonato}`);
  pdf.setLanguage("pt-BR");
  const normal = await pdf.embedFont(StandardFonts.Helvetica);
  const negrito = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logo = await pdf.embedPng(await readFile(path.join(process.cwd(), "public", "logo.png")));

  let pagina: PDFPage = pdf.addPage(A4);
  let y = A4[1] - MARGEM;
  const largura = A4[0] - MARGEM * 2;

  const novaPagina = () => {
    pagina = pdf.addPage(A4);
    y = A4[1] - MARGEM;
  };
  const garantir = (altura: number) => {
    if (y - altura < MARGEM) novaPagina();
  };

  // Capa resumida
  const escala = 90 / logo.height;
  pagina.drawImage(logo, { x: MARGEM, y: y - 90, width: logo.width * escala, height: 90 });
  pagina.drawText(limpar(cfg.nome_campeonato.toUpperCase()), { x: MARGEM + 100, y: y - 40, size: 26, font: negrito });
  pagina.drawText("Regulamento oficial - futebol 7", { x: MARGEM + 100, y: y - 62, size: 13, font: normal, color: CINZA });
  y -= 110;
  pagina.drawRectangle({ x: MARGEM, y, width: largura, height: 3, color: VERMELHO });
  y -= 28;

  secoes.forEach((secao, i) => {
    garantir(60);
    pagina.drawText(limpar(`${i + 1}. ${secao.titulo}`.toUpperCase()), { x: MARGEM, y, size: 15, font: negrito });
    y -= 22;
    for (const bloco of blocosDeTexto(secao.conteudo)) {
      const itens = bloco.tipo === "p" ? [{ texto: bloco.texto, marcador: false }] : bloco.itens.map((t) => ({ texto: t, marcador: true }));
      for (const item of itens) {
        const recuo = item.marcador ? 14 : 0;
        const linhas = quebrarLinhas(item.texto, normal, 11, largura - recuo);
        garantir(linhas.length * 15);
        if (item.marcador) pagina.drawRectangle({ x: MARGEM + 2, y: y + 3, width: 6, height: 2, color: VERMELHO });
        for (const linha of linhas) {
          pagina.drawText(linha, { x: MARGEM + recuo, y, size: 11, font: normal, color: PRETO });
          y -= 15;
        }
        y -= 4;
      }
      y -= 4;
    }
    y -= 12;
  });

  const paginas = pdf.getPages();
  const hoje = dataLonga(new Date(cfg.atualizado_em).toISOString());
  paginas.forEach((p, i) => {
    p.drawText(limpar(`${cfg.nome_campeonato} - versão de ${hoje} - página ${i + 1} de ${paginas.length}`), {
      x: MARGEM,
      y: 28,
      size: 9,
      font: normal,
      color: CINZA,
    });
  });

  const bytes = await pdf.save();
  return new Response(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="regulamento-barbudos-cup.pdf"',
    },
  });
}
