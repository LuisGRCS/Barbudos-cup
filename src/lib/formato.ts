const FUSO = "America/Sao_Paulo";

export function dataCurta(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, day: "2-digit", month: "2-digit" }).format(new Date(iso));
}

export function dataLonga(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );
}

export function diaEMes(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, day: "numeric", month: "long" }).format(new Date(iso));
}

export function diaSemana(iso: string) {
  const s = new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, weekday: "long" }).format(new Date(iso));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function hora(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, hour: "2-digit", minute: "2-digit" })
    .format(new Date(iso))
    .replace(":", "h");
}

export function dataEHora(iso: string) {
  return `${diaEMes(iso)}, ${hora(iso)}`;
}

export function moeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

export function linkInstagram(usuario: string) {
  return `https://instagram.com/${usuario.replace(/^@/, "")}`;
}

export function linkDirect(usuario: string) {
  return `https://ig.me/m/${usuario.replace(/^@/, "")}`;
}

export function linkMapa(endereco: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
}

export function linkComoChegar(endereco: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(endereco)}`;
}

export function linkMapaIncorporado(endereco: string) {
  return `https://maps.google.com/maps?q=${encodeURIComponent(endereco)}&output=embed`;
}

/** Iniciais para o escudo provisório de times sem imagem */
export function iniciais(nome: string) {
  const palavras = nome
    .replace(/\b(FC|EC|SC|AC|de|do|da|dos|das|e)\b/gi, "")
    .split(/\s+/)
    .filter(Boolean);
  return (palavras.length > 1 ? palavras[0][0] + palavras[1][0] : (palavras[0] ?? nome).slice(0, 2)).toUpperCase();
}

/** Converte texto com linhas "- item" em parágrafos e listas */
export function blocosDeTexto(texto: string) {
  const blocos: ({ tipo: "p"; texto: string } | { tipo: "lista"; itens: string[] })[] = [];
  for (const parte of texto.split(/\n\s*\n/)) {
    const linhas = parte.split("\n").map((l) => l.trim()).filter(Boolean);
    if (linhas.length === 0) continue;
    if (linhas.every((l) => l.startsWith("- "))) {
      blocos.push({ tipo: "lista", itens: linhas.map((l) => l.slice(2)) });
    } else {
      for (const l of linhas) {
        if (l.startsWith("- ")) {
          const ultimo = blocos.at(-1);
          if (ultimo?.tipo === "lista") ultimo.itens.push(l.slice(2));
          else blocos.push({ tipo: "lista", itens: [l.slice(2)] });
        } else blocos.push({ tipo: "p", texto: l });
      }
    }
  }
  return blocos;
}

/** Endereço público de um arquivo do bucket de escudos */
export function urlEscudo(path: string | null): string | null {
  if (!path) return null;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/escudos/${path}`;
}
