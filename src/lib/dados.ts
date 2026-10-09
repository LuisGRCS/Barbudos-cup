import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { clientePublico } from "@/lib/supabase/publico";
import type {
  Configuracoes,
  DadosTorneio,
  Faq,
  InfoInscricoes,
  Premio,
  RegraDestaque,
  SecaoRegulamento,
} from "@/lib/tipos";

/** Etiqueta de cache: o painel do organizador a invalida depois de cada alteração. */
export const TAG_SITE = "site";

function falhou(tabela: string, erro: { message: string }): never {
  throw new Error(`Não foi possível ler ${tabela}: ${erro.message}`);
}

export async function lerConfiguracoes(): Promise<Configuracoes> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_SITE);
  const { data, error } = await clientePublico().from("configuracoes").select("*").eq("id", 1).single();
  if (error) falhou("configurações", error);
  return { ...data, taxa_valor: data.taxa_valor === null ? null : Number(data.taxa_valor) } as Configuracoes;
}

export async function lerInscricoes(): Promise<InfoInscricoes> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_SITE);
  const db = clientePublico();
  const [status, vagas] = await Promise.all([db.rpc("status_inscricoes"), db.rpc("vagas_preenchidas")]);
  if (status.error) falhou("status das inscrições", status.error);
  if (vagas.error) falhou("vagas", vagas.error);
  return { status: status.data, vagasPreenchidas: vagas.data };
}

export async function lerFaq(): Promise<Faq[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_SITE);
  const { data, error } = await clientePublico().from("faq").select("*").order("ordem").order("id");
  if (error) falhou("perguntas frequentes", error);
  return data;
}

export async function lerRegrasDestaque(): Promise<RegraDestaque[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_SITE);
  const { data, error } = await clientePublico().from("regras_destaque").select("*").order("ordem").order("id");
  if (error) falhou("regras em destaque", error);
  return data;
}

export async function lerRegulamento(): Promise<SecaoRegulamento[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_SITE);
  const { data, error } = await clientePublico().from("regulamento_secoes").select("*").order("ordem").order("id");
  if (error) falhou("regulamento", error);
  return data;
}

export async function lerPremios(): Promise<Premio[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_SITE);
  const { data, error } = await clientePublico().from("premios").select("*").order("ordem").order("id");
  if (error) falhou("premiação", error);
  return data;
}

export async function lerTorneio(): Promise<DadosTorneio> {
  "use cache";
  cacheLife("minutes");
  cacheTag(TAG_SITE);
  const db = clientePublico();
  const [grupos, times, jogadores, jogos, eventos] = await Promise.all([
    db.from("grupos").select("id, nome, ordem").order("ordem").order("nome"),
    db.from("times_publicos").select("*").order("nome"),
    db.from("jogadores").select("id, time_id, nome, numero").order("numero"),
    db
      .from("jogos")
      .select(
        "id, fase, rodada, grupo_id, chave_ordem, time_casa_id, time_fora_id, origem_casa, origem_fora, data_hora, campo, gols_casa, gols_fora, penaltis_casa, penaltis_fora, encerrado",
      )
      .order("data_hora", { nullsFirst: false })
      .order("id"),
    db.from("eventos_jogo").select("id, jogo_id, time_id, jogador_id, tipo, minuto").order("minuto"),
  ]);
  if (grupos.error) falhou("grupos", grupos.error);
  if (times.error) falhou("times", times.error);
  if (jogadores.error) falhou("jogadores", jogadores.error);
  if (jogos.error) falhou("jogos", jogos.error);
  if (eventos.error) falhou("súmulas", eventos.error);
  return {
    grupos: grupos.data,
    times: times.data,
    jogadores: jogadores.data,
    jogos: jogos.data,
    eventos: eventos.data,
  };
}
