import type { DadosTorneio, EventoJogo, Fase, Jogo, TimePublico } from "@/lib/tipos";

/* =====================================================================
 * Cálculos automáticos do campeonato.
 * Tudo sai dos jogos e das súmulas lançadas pela organização:
 * ninguém digita a tabela, o chaveamento ou a artilharia.
 * ===================================================================== */

export const NOME_FASE: Record<Fase, string> = {
  grupos: "Fase de grupos",
  oitavas: "Oitavas de final",
  quartas: "Quartas de final",
  semifinal: "Semifinal",
  terceiro: "Disputa de 3º lugar",
  final: "Final",
};

export const ORDEM_MATA_MATA: Fase[] = ["oitavas", "quartas", "semifinal", "final"];

export type LinhaClassificacao = {
  time: TimePublico;
  pontos: number;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golsPro: number;
  golsContra: number;
  saldo: number;
  pontosDisciplina: number;
};

const temPlacar = (j: Jogo) => j.encerrado && j.gols_casa !== null && j.gols_fora !== null;

function pontosDisciplina(eventos: EventoJogo[], timeId: number, jogosIds: Set<number>) {
  return eventos
    .filter((e) => e.time_id === timeId && jogosIds.has(e.jogo_id))
    .reduce((soma, e) => soma + (e.tipo === "vermelho" ? 3 : e.tipo === "amarelo" ? 1 : 0), 0);
}

/**
 * Classificação de um grupo. Desempate (regulamento): pontos, vitórias, saldo,
 * gols marcados, confronto direto (só entre dois times), menos cartões e, por fim,
 * ordem alfabética (no lugar do sorteio, que a organização faz manualmente).
 */
export function classificacao(dados: DadosTorneio, grupoId: number): LinhaClassificacao[] {
  const times = dados.times.filter((t) => t.grupo_id === grupoId);
  const jogosGrupo = dados.jogos.filter((j) => j.fase === "grupos" && j.grupo_id === grupoId);
  const idsJogos = new Set(jogosGrupo.map((j) => j.id));

  const linhas = new Map<number, LinhaClassificacao>(
    times.map((time) => [
      time.id,
      {
        time,
        pontos: 0,
        jogos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        golsPro: 0,
        golsContra: 0,
        saldo: 0,
        pontosDisciplina: pontosDisciplina(dados.eventos, time.id, idsJogos),
      },
    ]),
  );

  for (const j of jogosGrupo) {
    if (!temPlacar(j) || j.time_casa_id === null || j.time_fora_id === null) continue;
    const casa = linhas.get(j.time_casa_id);
    const fora = linhas.get(j.time_fora_id);
    if (!casa || !fora) continue;
    const gc = j.gols_casa!;
    const gf = j.gols_fora!;
    casa.jogos++;
    fora.jogos++;
    casa.golsPro += gc;
    casa.golsContra += gf;
    fora.golsPro += gf;
    fora.golsContra += gc;
    if (gc > gf) {
      casa.vitorias++;
      fora.derrotas++;
      casa.pontos += 3;
    } else if (gc < gf) {
      fora.vitorias++;
      casa.derrotas++;
      fora.pontos += 3;
    } else {
      casa.empates++;
      fora.empates++;
      casa.pontos++;
      fora.pontos++;
    }
  }

  const lista = [...linhas.values()];
  for (const l of lista) l.saldo = l.golsPro - l.golsContra;

  const chave = (l: LinhaClassificacao) => [l.pontos, l.vitorias, l.saldo, l.golsPro];
  const empatados = (a: LinhaClassificacao, b: LinhaClassificacao) =>
    chave(a).every((v, i) => v === chave(b)[i]);

  const confrontoDireto = (a: LinhaClassificacao, b: LinhaClassificacao) => {
    let saldoA = 0;
    for (const j of jogosGrupo) {
      if (!temPlacar(j)) continue;
      if (j.time_casa_id === a.time.id && j.time_fora_id === b.time.id) saldoA += j.gols_casa! - j.gols_fora!;
      if (j.time_casa_id === b.time.id && j.time_fora_id === a.time.id) saldoA += j.gols_fora! - j.gols_casa!;
    }
    return saldoA;
  };

  lista.sort((a, b) => {
    const ka = chave(a);
    const kb = chave(b);
    for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return kb[i] - ka[i];
    // Confronto direto só vale quando exatamente dois times estão empatados
    const grupoEmpatado = lista.filter((l) => empatados(l, a));
    if (grupoEmpatado.length === 2) {
      const cd = confrontoDireto(a, b);
      if (cd !== 0) return -cd;
    }
    if (a.pontosDisciplina !== b.pontosDisciplina) return a.pontosDisciplina - b.pontosDisciplina;
    return a.time.nome.localeCompare(b.time.nome, "pt-BR");
  });

  return lista;
}

export function grupoEncerrado(dados: DadosTorneio, grupoId: number) {
  const jogos = dados.jogos.filter((j) => j.fase === "grupos" && j.grupo_id === grupoId);
  return jogos.length > 0 && jogos.every((j) => j.encerrado);
}

/* ---------------------------------------------------------------------
 * Mata-mata: cada vaga diz de onde vem o time (ver origem_casa/origem_fora)
 * --------------------------------------------------------------------- */

export type LadoJogo = { timeId: number | null; rotulo: string };

function rotuloJogo(dados: DadosTorneio, jogoId: number) {
  const jogo = dados.jogos.find((j) => j.id === jogoId);
  if (!jogo) return "jogo removido";
  const mesmaFase = dados.jogos.filter((j) => j.fase === jogo.fase);
  const nome = NOME_FASE[jogo.fase];
  return mesmaFase.length > 1 ? `${nome} ${jogo.chave_ordem ?? ""}`.trim() : nome;
}

export function resolverOrigem(dados: DadosTorneio, origem: string | null, visitados = new Set<number>()): LadoJogo {
  if (!origem) return { timeId: null, rotulo: "A definir" };
  const [tipo, a, b] = origem.split(":");

  if (tipo === "grupo") {
    const grupo = dados.grupos.find((g) => g.nome === a);
    const posicao = Number(b);
    const rotulo = `${posicao}º do Grupo ${a}`;
    if (!grupo || !grupoEncerrado(dados, grupo.id)) return { timeId: null, rotulo };
    const linha = classificacao(dados, grupo.id)[posicao - 1];
    return { timeId: linha?.time.id ?? null, rotulo };
  }

  if (tipo === "vencedor" || tipo === "perdedor") {
    const jogoId = Number(a);
    const rotulo = `${tipo === "vencedor" ? "Vencedor" : "Perdedor"} da ${rotuloJogo(dados, jogoId)}`;
    const jogo = dados.jogos.find((j) => j.id === jogoId);
    if (!jogo || visitados.has(jogoId)) return { timeId: null, rotulo };
    visitados.add(jogoId);
    const resultado = vencedorDoJogo(dados, jogo, visitados);
    if (!resultado) return { timeId: null, rotulo };
    return { timeId: tipo === "vencedor" ? resultado.vencedor : resultado.perdedor, rotulo };
  }

  return { timeId: null, rotulo: "A definir" };
}

/** Times de um jogo: os gravados no jogo ou, no mata-mata, os que avançaram */
export function ladosDoJogo(dados: DadosTorneio, jogo: Jogo, visitados = new Set<number>()) {
  const casa = jogo.time_casa_id
    ? { timeId: jogo.time_casa_id, rotulo: "" }
    : resolverOrigem(dados, jogo.origem_casa, new Set(visitados));
  const fora = jogo.time_fora_id
    ? { timeId: jogo.time_fora_id, rotulo: "" }
    : resolverOrigem(dados, jogo.origem_fora, new Set(visitados));
  return { casa, fora };
}

export function vencedorDoJogo(dados: DadosTorneio, jogo: Jogo, visitados = new Set<number>()) {
  if (!temPlacar(jogo)) return null;
  const { casa, fora } = ladosDoJogo(dados, jogo, visitados);
  if (casa.timeId === null || fora.timeId === null) return null;
  let casaVence: boolean;
  if (jogo.gols_casa! !== jogo.gols_fora!) casaVence = jogo.gols_casa! > jogo.gols_fora!;
  else if (jogo.penaltis_casa !== null && jogo.penaltis_fora !== null && jogo.penaltis_casa !== jogo.penaltis_fora)
    casaVence = jogo.penaltis_casa > jogo.penaltis_fora;
  else return null;
  return casaVence
    ? { vencedor: casa.timeId, perdedor: fora.timeId }
    : { vencedor: fora.timeId, perdedor: casa.timeId };
}

/* ---------------------------------------------------------------------
 * Estatísticas
 * --------------------------------------------------------------------- */

export type LinhaJogador = {
  jogadorId: number;
  nome: string;
  numero: number;
  time: TimePublico;
  total: number;
  amarelos: number;
  vermelhos: number;
};

export function artilharia(dados: DadosTorneio): LinhaJogador[] {
  return contarPorJogador(dados, (e) => e.tipo === "gol")
    .filter((l) => l.total > 0)
    .sort((a, b) => b.total - a.total || a.nome.localeCompare(b.nome, "pt-BR"));
}

export function cartoes(dados: DadosTorneio): LinhaJogador[] {
  return contarPorJogador(dados, (e) => e.tipo === "amarelo" || e.tipo === "vermelho")
    .filter((l) => l.total > 0)
    .sort(
      (a, b) =>
        b.vermelhos - a.vermelhos || b.amarelos - a.amarelos || a.nome.localeCompare(b.nome, "pt-BR"),
    );
}

function contarPorJogador(dados: DadosTorneio, filtro: (e: EventoJogo) => boolean): LinhaJogador[] {
  const jogosValidos = new Set(dados.jogos.filter((j) => j.encerrado).map((j) => j.id));
  const mapa = new Map<number, LinhaJogador>();
  for (const e of dados.eventos) {
    if (!e.jogador_id || !filtro(e) || !jogosValidos.has(e.jogo_id)) continue;
    const jogador = dados.jogadores.find((p) => p.id === e.jogador_id);
    const time = dados.times.find((t) => t.id === e.time_id);
    if (!jogador || !time) continue;
    const linha =
      mapa.get(jogador.id) ??
      ({ jogadorId: jogador.id, nome: jogador.nome, numero: jogador.numero, time, total: 0, amarelos: 0, vermelhos: 0 } as LinhaJogador);
    linha.total++;
    if (e.tipo === "amarelo") linha.amarelos++;
    if (e.tipo === "vermelho") linha.vermelhos++;
    mapa.set(jogador.id, linha);
  }
  return [...mapa.values()];
}

export type LinhaDefesa = { time: TimePublico; jogos: number; golsSofridos: number; media: number };

export function melhorDefesa(dados: DadosTorneio): LinhaDefesa[] {
  const linhas = new Map<number, LinhaDefesa>();
  for (const j of dados.jogos) {
    if (!temPlacar(j)) continue;
    const { casa, fora } = ladosDoJogo(dados, j);
    for (const [lado, sofridos] of [
      [casa.timeId, j.gols_fora!],
      [fora.timeId, j.gols_casa!],
    ] as const) {
      if (lado === null) continue;
      const time = dados.times.find((t) => t.id === lado);
      if (!time) continue;
      const l = linhas.get(lado) ?? { time, jogos: 0, golsSofridos: 0, media: 0 };
      l.jogos++;
      l.golsSofridos += sofridos;
      linhas.set(lado, l);
    }
  }
  return [...linhas.values()]
    .map((l) => ({ ...l, media: l.golsSofridos / l.jogos }))
    .sort((a, b) => a.media - b.media || b.jogos - a.jogos || a.time.nome.localeCompare(b.time.nome, "pt-BR"));
}

/** Resumo de um time: jogos, retrospecto e números */
export function resumoDoTime(dados: DadosTorneio, timeId: number) {
  const jogos = dados.jogos.filter((j) => {
    const { casa, fora } = ladosDoJogo(dados, j);
    return casa.timeId === timeId || fora.timeId === timeId;
  });
  let vitorias = 0,
    empates = 0,
    derrotas = 0,
    golsPro = 0,
    golsContra = 0;
  for (const j of jogos) {
    if (!temPlacar(j)) continue;
    const { casa } = ladosDoJogo(dados, j);
    const emCasa = casa.timeId === timeId;
    const pro = emCasa ? j.gols_casa! : j.gols_fora!;
    const contra = emCasa ? j.gols_fora! : j.gols_casa!;
    golsPro += pro;
    golsContra += contra;
    if (pro > contra) vitorias++;
    else if (pro < contra) derrotas++;
    else {
      const venc = vencedorDoJogo(dados, j);
      if (venc && j.fase !== "grupos") {
        if (venc.vencedor === timeId) vitorias++;
        else derrotas++;
      } else empates++;
    }
  }
  return { jogos, vitorias, empates, derrotas, golsPro, golsContra };
}

/** Autores dos gols de um jogo, já com nome do jogador */
export function golsDoJogo(dados: DadosTorneio, jogo: Jogo) {
  return dados.eventos
    .filter((e) => e.jogo_id === jogo.id && (e.tipo === "gol" || e.tipo === "gol_contra"))
    .map((e) => {
      const jogador = dados.jogadores.find((p) => p.id === e.jogador_id);
      // Gol contra conta para o adversário de quem marcou
      const { casa, fora } = ladosDoJogo(dados, jogo);
      const timeBeneficiado = e.tipo === "gol_contra" ? (e.time_id === casa.timeId ? fora.timeId : casa.timeId) : e.time_id;
      return {
        id: e.id,
        nome: jogador?.nome ?? "Jogador não informado",
        minuto: e.minuto,
        contra: e.tipo === "gol_contra",
        timeId: timeBeneficiado,
      };
    });
}
