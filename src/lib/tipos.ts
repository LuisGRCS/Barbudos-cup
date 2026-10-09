export type StatusInscricoes = "abertas" | "em_breve" | "encerradas";

export type Configuracoes = {
  nome_campeonato: string;
  edicao: string | null;
  instagram_usuario: string | null;
  inscricoes_status: StatusInscricoes;
  vagas_total: number | null;
  inscricoes_abertura: string | null;
  inscricoes_encerramento: string | null;
  prazo_elenco: string | null;
  sorteio_data: string | null;
  sorteio_descricao: string | null;
  inicio_campeonato: string | null;
  data_final: string | null;
  dias_horarios: string | null;
  local_nome: string | null;
  local_endereco: string | null;
  taxa_valor: number | null;
  taxa_inclui: string | null;
  pix_chave: string | null;
  pix_favorecido: string | null;
  prazo_pagamento: string | null;
  politica_reembolso: string | null;
  formato_disputa: string | null;
  duracao_partidas: string | null;
  classificados_por_grupo: number;
  disputa_terceiro: boolean;
  elenco_min: number;
  elenco_max: number;
  idade_minima: string | null;
  uniforme: string | null;
  outras_exigencias: string | null;
  pre_inscricao_prioridade: boolean;
  prioridade_dias: number;
  atualizado_em: string;
};

export type ItemOrdenado = { id: number; ordem: number };
export type Faq = ItemOrdenado & { pergunta: string; resposta: string };
export type RegraDestaque = ItemOrdenado & { titulo: string; texto: string; icone: string };
export type SecaoRegulamento = ItemOrdenado & { titulo: string; conteudo: string };
export type Premio = ItemOrdenado & { titulo: string; descricao: string | null };

export type Grupo = { id: number; nome: string; ordem: number };

export type TimePublico = {
  id: number;
  nome: string;
  slug: string;
  instagram: string | null;
  escudo_path: string | null;
  grupo_id: number | null;
};

export type Jogador = { id: number; time_id: number; nome: string; numero: number };

export type Fase = "grupos" | "oitavas" | "quartas" | "semifinal" | "terceiro" | "final";

export type Jogo = {
  id: number;
  fase: Fase;
  rodada: number | null;
  grupo_id: number | null;
  chave_ordem: number | null;
  time_casa_id: number | null;
  time_fora_id: number | null;
  origem_casa: string | null;
  origem_fora: string | null;
  data_hora: string | null;
  campo: string | null;
  gols_casa: number | null;
  gols_fora: number | null;
  penaltis_casa: number | null;
  penaltis_fora: number | null;
  encerrado: boolean;
};

export type TipoEvento = "gol" | "gol_contra" | "amarelo" | "vermelho";

export type EventoJogo = {
  id: number;
  jogo_id: number;
  time_id: number;
  jogador_id: number | null;
  tipo: TipoEvento;
  minuto: number | null;
};

/** Tudo o que as páginas públicas do campeonato precisam, numa única leitura */
export type DadosTorneio = {
  grupos: Grupo[];
  times: TimePublico[];
  jogadores: Jogador[];
  jogos: Jogo[];
  eventos: EventoJogo[];
};

export type InfoInscricoes = {
  status: StatusInscricoes;
  vagasPreenchidas: number;
};
