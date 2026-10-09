-- =====================================================================
-- Barbudos Cup — esquema inicial
-- Tabelas, regras de acesso (RLS), gatilhos e armazenamento de arquivos.
-- =====================================================================

create extension if not exists unaccent with schema extensions;

-- ---------------------------------------------------------------------
-- Administradores: e-mails autorizados a acessar o painel do organizador
-- ---------------------------------------------------------------------
create table public.admins (
  email text primary key check (email = lower(email)),
  criado_em timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------
-- Configurações do campeonato (registro único, id = 1)
-- Tudo que é exibido em "Inscreva seu time" e "Informações" vem daqui.
-- Campo vazio (null) = o site mostra o selo "A definir".
-- ---------------------------------------------------------------------
create table public.configuracoes (
  id smallint primary key default 1 check (id = 1),
  nome_campeonato text not null default 'Barbudos Cup',
  edicao text,
  instagram_usuario text,

  -- Inscrições
  inscricoes_status text not null default 'em_breve'
    check (inscricoes_status in ('abertas', 'em_breve', 'encerradas')),
  vagas_total int check (vagas_total is null or vagas_total > 0),
  inscricoes_abertura timestamptz,
  inscricoes_encerramento timestamptz,

  -- Datas
  prazo_elenco timestamptz,
  sorteio_data timestamptz,
  sorteio_descricao text,
  inicio_campeonato timestamptz,
  data_final timestamptz,
  dias_horarios text,

  -- Local
  local_nome text,
  local_endereco text,

  -- Valores e pagamento
  taxa_valor numeric(10, 2),
  taxa_inclui text,
  pix_chave text,
  pix_favorecido text,
  prazo_pagamento text,
  politica_reembolso text,

  -- Formato
  formato_disputa text,
  duracao_partidas text,
  classificados_por_grupo int not null default 2 check (classificados_por_grupo between 1 and 8),
  disputa_terceiro boolean not null default true,

  -- Requisitos
  elenco_min int not null default 7 check (elenco_min > 0),
  elenco_max int not null default 15 check (elenco_max >= elenco_min),
  idade_minima text,
  uniforme text,
  outras_exigencias text,

  -- Pré-inscrição para a próxima edição
  pre_inscricao_prioridade boolean not null default false,
  prioridade_dias int not null default 3 check (prioridade_dias between 0 and 60),

  atualizado_em timestamptz not null default now()
);

insert into public.configuracoes (id) values (1);

-- ---------------------------------------------------------------------
-- Conteúdo editável
-- ---------------------------------------------------------------------
create table public.faq (
  id bigint generated always as identity primary key,
  ordem int not null default 0,
  pergunta text not null,
  resposta text not null
);

create table public.regras_destaque (
  id bigint generated always as identity primary key,
  ordem int not null default 0,
  titulo text not null,
  texto text not null,
  icone text not null default 'apito'
);

create table public.regulamento_secoes (
  id bigint generated always as identity primary key,
  ordem int not null default 0,
  titulo text not null,
  conteudo text not null
);

create table public.premios (
  id bigint generated always as identity primary key,
  ordem int not null default 0,
  titulo text not null,
  descricao text
);

-- ---------------------------------------------------------------------
-- Perfis dos capitães (dados pessoais — nunca públicos)
-- ---------------------------------------------------------------------
create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  telefone text not null,
  email text not null,
  criado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Grupos, times e jogadores
-- ---------------------------------------------------------------------
create table public.grupos (
  id bigint generated always as identity primary key,
  nome text not null unique,
  ordem int not null default 0,
  exemplo boolean not null default false
);

create table public.times (
  id bigint generated always as identity primary key,
  capitao_id uuid unique references public.perfis (id) on delete set null,
  nome text not null,
  slug text not null unique,
  instagram text,
  faixa_jogadores text,
  responsavel_pagamento text,
  escudo_path text,
  status text not null default 'pendente'
    check (status in ('pendente', 'aprovado', 'recusado')),
  motivo_recusa text,
  pagamento_status text not null default 'pendente'
    check (pagamento_status in ('pendente', 'em_analise', 'pago')),
  comprovante_path text,
  comprovante_enviado_em timestamptz,
  aceite_regulamento_em timestamptz,
  grupo_id bigint references public.grupos (id) on delete set null,
  exemplo boolean not null default false,
  criado_em timestamptz not null default now()
);

create unique index times_nome_unico on public.times (lower(nome));

create table public.jogadores (
  id bigint generated always as identity primary key,
  time_id bigint not null references public.times (id) on delete cascade,
  nome text not null check (length(trim(nome)) between 2 and 80),
  numero int not null check (numero between 0 and 99),
  criado_em timestamptz not null default now(),
  unique (time_id, numero)
);

-- ---------------------------------------------------------------------
-- Jogos e súmulas
-- origem_casa / origem_fora descrevem de onde vem cada time no mata-mata:
--   'grupo:A:1'      → 1º colocado do grupo A
--   'vencedor:12'    → vencedor do jogo 12
--   'perdedor:12'    → perdedor do jogo 12 (disputa de 3º lugar)
-- ---------------------------------------------------------------------
create table public.jogos (
  id bigint generated always as identity primary key,
  fase text not null check (fase in ('grupos', 'oitavas', 'quartas', 'semifinal', 'terceiro', 'final')),
  rodada int,
  grupo_id bigint references public.grupos (id) on delete cascade,
  chave_ordem int,
  time_casa_id bigint references public.times (id) on delete set null,
  time_fora_id bigint references public.times (id) on delete set null,
  origem_casa text,
  origem_fora text,
  data_hora timestamptz,
  campo text,
  gols_casa int check (gols_casa >= 0),
  gols_fora int check (gols_fora >= 0),
  penaltis_casa int check (penaltis_casa >= 0),
  penaltis_fora int check (penaltis_fora >= 0),
  encerrado boolean not null default false,
  exemplo boolean not null default false,
  criado_em timestamptz not null default now()
);

create index jogos_data_idx on public.jogos (data_hora);

create table public.eventos_jogo (
  id bigint generated always as identity primary key,
  jogo_id bigint not null references public.jogos (id) on delete cascade,
  time_id bigint not null references public.times (id) on delete cascade,
  jogador_id bigint references public.jogadores (id) on delete set null,
  tipo text not null check (tipo in ('gol', 'gol_contra', 'amarelo', 'vermelho')),
  minuto int check (minuto between 0 and 200)
);

create index eventos_jogo_idx on public.eventos_jogo (jogo_id);

-- ---------------------------------------------------------------------
-- Comunicados e pré-inscrições
-- ---------------------------------------------------------------------
create table public.comunicados (
  id bigint generated always as identity primary key,
  titulo text not null,
  texto text not null,
  exemplo boolean not null default false,
  criado_em timestamptz not null default now()
);

create table public.pre_inscricoes (
  id bigint generated always as identity primary key,
  nome_time text not null check (length(trim(nome_time)) between 2 and 60),
  nome_capitao text not null check (length(trim(nome_capitao)) between 3 and 80),
  telefone text not null check (length(regexp_replace(telefone, '\D', '', 'g')) between 10 and 13),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  instagram text,
  notificado_em timestamptz,
  exemplo boolean not null default false,
  criado_em timestamptz not null default now()
);

create unique index pre_inscricoes_email_unico on public.pre_inscricoes (lower(email));

-- =====================================================================
-- Funções auxiliares
-- =====================================================================

-- Gera um endereço amigável (slug) a partir do nome do time
create or replace function public.gerar_slug(texto text)
returns text
language sql
immutable
set search_path = ''
as $$
  select trim(both '-' from regexp_replace(lower(extensions.unaccent(texto)), '[^a-z0-9]+', '-', 'g'));
$$;

create or replace function public.times_definir_slug()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  base text;
  candidato text;
  n int := 1;
begin
  if tg_op = 'UPDATE' and new.nome = old.nome then
    return new;
  end if;
  base := coalesce(nullif(public.gerar_slug(new.nome), ''), 'time');
  candidato := base;
  while exists (select 1 from public.times t where t.slug = candidato and t.id is distinct from new.id) loop
    n := n + 1;
    candidato := base || '-' || n;
  end loop;
  new.slug := candidato;
  return new;
end;
$$;

create trigger times_slug
  before insert or update of nome on public.times
  for each row execute function public.times_definir_slug();

-- Situação real das inscrições, considerando prazo e vagas.
-- Retorna 'abertas', 'em_breve' ou 'encerradas'.
create or replace function public.status_inscricoes()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when c.inscricoes_status <> 'abertas' then c.inscricoes_status
    when c.inscricoes_encerramento is not null and now() > c.inscricoes_encerramento then 'encerradas'
    when c.vagas_total is not null
      and (select count(*) from public.times t where t.status = 'aprovado') >= c.vagas_total then 'encerradas'
    else 'abertas'
  end
  from public.configuracoes c
  where c.id = 1;
$$;

-- Pré-inscritos com prioridade podem se inscrever alguns dias antes da abertura
create or replace function public.pode_inscrever(p_email text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.status_inscricoes() = 'abertas'
    or (
      c.inscricoes_status = 'em_breve'
      and c.pre_inscricao_prioridade
      and c.inscricoes_abertura is not null
      and now() >= c.inscricoes_abertura - make_interval(days => c.prioridade_dias)
      and exists (select 1 from public.pre_inscricoes p where lower(p.email) = lower(p_email))
    )
  from public.configuracoes c
  where c.id = 1;
$$;

-- Vagas preenchidas (times aprovados) — dado público e agregado
create or replace function public.vagas_preenchidas()
returns int
language sql
stable
security definer
set search_path = ''
as $$
  select count(*)::int from public.times where status = 'aprovado';
$$;

-- ---------------------------------------------------------------------
-- Cadastro do capitão: ao criar a conta, cria o perfil e o time.
-- Os dados chegam em raw_user_meta_data (enviados pelo formulário).
-- ---------------------------------------------------------------------
create or replace function public.criar_perfil_e_time()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  -- Contas criadas pela organização (ex.: administradores) não trazem time
  if coalesce(meta ->> 'tipo', '') <> 'capitao' then
    return new;
  end if;

  if not public.pode_inscrever(new.email) then
    raise exception 'As inscrições não estão abertas no momento.' using errcode = 'P0001';
  end if;

  if coalesce(meta ->> 'aceite_regulamento', '') <> 'true' then
    raise exception 'É preciso aceitar o regulamento para se inscrever.' using errcode = 'P0001';
  end if;

  if exists (select 1 from public.times t where lower(t.nome) = lower(trim(meta ->> 'nome_time'))) then
    raise exception 'Já existe um time inscrito com esse nome.' using errcode = 'P0001';
  end if;

  insert into public.perfis (id, nome, telefone, email)
  values (new.id, trim(meta ->> 'nome'), trim(meta ->> 'telefone'), lower(new.email));

  insert into public.times (capitao_id, nome, instagram, faixa_jogadores, responsavel_pagamento, aceite_regulamento_em)
  values (
    new.id,
    trim(meta ->> 'nome_time'),
    nullif(trim(meta ->> 'instagram'), ''),
    nullif(trim(meta ->> 'faixa_jogadores'), ''),
    nullif(trim(meta ->> 'responsavel_pagamento'), ''),
    now()
  );

  return new;
end;
$$;

create trigger ao_criar_usuario
  after insert on auth.users
  for each row execute function public.criar_perfil_e_time();

-- ---------------------------------------------------------------------
-- Proteções para o capitão: só a organização muda status, pagamento e grupo.
-- Ao enviar comprovante, o pagamento passa para "em análise" automaticamente.
-- ---------------------------------------------------------------------
create or replace function public.times_proteger_campos()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.is_admin() or auth.uid() is null then
    return new; -- organização ou processos internos
  end if;

  if new.status is distinct from old.status
    or new.motivo_recusa is distinct from old.motivo_recusa
    or new.grupo_id is distinct from old.grupo_id
    or new.capitao_id is distinct from old.capitao_id
    or new.aceite_regulamento_em is distinct from old.aceite_regulamento_em
    or new.exemplo is distinct from old.exemplo then
    raise exception 'Somente a organização pode alterar esse dado.' using errcode = '42501';
  end if;

  if new.comprovante_path is distinct from old.comprovante_path and new.comprovante_path is not null then
    new.comprovante_enviado_em := now();
    if old.pagamento_status <> 'pago' then
      new.pagamento_status := 'em_analise';
    end if;
  elsif new.pagamento_status is distinct from old.pagamento_status then
    raise exception 'Somente a organização pode confirmar pagamentos.' using errcode = '42501';
  end if;

  if new.nome is distinct from old.nome and old.status = 'aprovado' then
    raise exception 'Para mudar o nome de um time aprovado, fale com a organização.' using errcode = '42501';
  end if;

  return new;
end;
$$;

create trigger times_protecao
  before update on public.times
  for each row execute function public.times_proteger_campos();

-- ---------------------------------------------------------------------
-- Elenco: limite máximo e prazo de alteração (vale para o capitão)
-- ---------------------------------------------------------------------
create or replace function public.jogadores_validar()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  cfg public.configuracoes%rowtype;
  total int;
  alvo bigint := coalesce(new.time_id, old.time_id);
begin
  select * into cfg from public.configuracoes where id = 1;

  if not public.is_admin() and auth.uid() is not null then
    if cfg.prazo_elenco is not null and now() > cfg.prazo_elenco then
      raise exception 'O prazo para alterar o elenco terminou. Fale com a organização.' using errcode = 'P0001';
    end if;
  end if;

  if tg_op = 'INSERT' then
    select count(*) into total from public.jogadores where time_id = alvo;
    if total >= cfg.elenco_max then
      raise exception 'O elenco já tem o máximo de % jogadores.', cfg.elenco_max using errcode = 'P0001';
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  new.nome := trim(new.nome);
  return new;
end;
$$;

create trigger jogadores_validacao
  before insert or update or delete on public.jogadores
  for each row execute function public.jogadores_validar();

-- Atualiza o carimbo de data das configurações
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em := now();
  return new;
end;
$$;

create trigger configuracoes_atualizado
  before update on public.configuracoes
  for each row execute function public.tocar_atualizado_em();

-- Auxiliares usadas nas regras de acesso (evitam consultas recursivas)
create or replace function public.time_aprovado(p_time_id bigint)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.times t where t.id = p_time_id and t.status = 'aprovado');
$$;

create or replace function public.meu_time_id()
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  select t.id from public.times t where t.capitao_id = auth.uid();
$$;

create or replace function public.meu_time_ativo()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.times t where t.capitao_id = auth.uid() and t.status <> 'recusado');
$$;

-- =====================================================================
-- Visão pública dos times (sem dados pessoais — LGPD)
-- =====================================================================
create view public.times_publicos
with (security_barrier = true)
as
  select t.id, t.nome, t.slug, t.instagram, t.escudo_path, t.grupo_id
  from public.times t
  where t.status = 'aprovado';

-- =====================================================================
-- Regras de acesso (RLS)
-- =====================================================================
alter table public.admins enable row level security;
alter table public.configuracoes enable row level security;
alter table public.faq enable row level security;
alter table public.regras_destaque enable row level security;
alter table public.regulamento_secoes enable row level security;
alter table public.premios enable row level security;
alter table public.perfis enable row level security;
alter table public.grupos enable row level security;
alter table public.times enable row level security;
alter table public.jogadores enable row level security;
alter table public.jogos enable row level security;
alter table public.eventos_jogo enable row level security;
alter table public.comunicados enable row level security;
alter table public.pre_inscricoes enable row level security;

-- Administradores
create policy "admins: organização vê" on public.admins
  for select to authenticated using (public.is_admin());
create policy "admins: organização gerencia" on public.admins
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Conteúdo público: todos leem, só a organização edita
create policy "configuracoes: leitura pública" on public.configuracoes for select using (true);
create policy "configuracoes: organização edita" on public.configuracoes
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "faq: leitura pública" on public.faq for select using (true);
create policy "faq: organização edita" on public.faq
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "regras: leitura pública" on public.regras_destaque for select using (true);
create policy "regras: organização edita" on public.regras_destaque
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "regulamento: leitura pública" on public.regulamento_secoes for select using (true);
create policy "regulamento: organização edita" on public.regulamento_secoes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "premios: leitura pública" on public.premios for select using (true);
create policy "premios: organização edita" on public.premios
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "grupos: leitura pública" on public.grupos for select using (true);
create policy "grupos: organização edita" on public.grupos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "jogos: leitura pública" on public.jogos for select using (true);
create policy "jogos: organização edita" on public.jogos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "eventos: leitura pública" on public.eventos_jogo for select using (true);
create policy "eventos: organização edita" on public.eventos_jogo
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Perfis: o capitão vê e edita o próprio; a organização vê todos
create policy "perfis: dono ou organização leem" on public.perfis
  for select to authenticated using (id = auth.uid() or public.is_admin());
create policy "perfis: dono edita" on public.perfis
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "perfis: organização edita" on public.perfis
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Times: tabela completa só para o dono e a organização (o público usa times_publicos)
create policy "times: dono ou organização leem" on public.times
  for select to authenticated using (capitao_id = auth.uid() or public.is_admin());
create policy "times: dono edita" on public.times
  for update to authenticated using (capitao_id = auth.uid()) with check (capitao_id = auth.uid());
create policy "times: organização gerencia" on public.times
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Jogadores: elenco de times aprovados é público; o capitão gerencia o próprio
create policy "jogadores: leitura pública de times aprovados" on public.jogadores
  for select using (public.time_aprovado(time_id));
create policy "jogadores: capitão lê o próprio elenco" on public.jogadores
  for select to authenticated using (time_id = public.meu_time_id());
create policy "jogadores: capitão gerencia o próprio elenco" on public.jogadores
  for all to authenticated
  using (time_id = public.meu_time_id() and public.meu_time_ativo())
  with check (time_id = public.meu_time_id() and public.meu_time_ativo());
create policy "jogadores: organização gerencia" on public.jogadores
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Comunicados: capitães logados leem; organização publica
create policy "comunicados: capitães leem" on public.comunicados
  for select to authenticated using (true);
create policy "comunicados: organização publica" on public.comunicados
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Pré-inscrições: qualquer pessoa envia; só a organização vê
create policy "pre_inscricoes: qualquer pessoa envia" on public.pre_inscricoes
  for insert to anon, authenticated
  with check (notificado_em is null and exemplo = false);
create policy "pre_inscricoes: organização gerencia" on public.pre_inscricoes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Permissões de execução das funções auxiliares
revoke execute on function public.criar_perfil_e_time() from public, anon, authenticated;
revoke execute on function public.times_proteger_campos() from public, anon, authenticated;
revoke execute on function public.jogadores_validar() from public, anon, authenticated;
grant execute on function public.status_inscricoes() to anon, authenticated;
grant execute on function public.vagas_preenchidas() to anon, authenticated;
grant execute on function public.pode_inscrever(text) to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.time_aprovado(bigint) to anon, authenticated;
grant execute on function public.meu_time_id() to authenticated;
grant execute on function public.meu_time_ativo() to authenticated;
grant select on public.times_publicos to anon, authenticated;

-- =====================================================================
-- Armazenamento de arquivos
--   escudos      → público (imagens dos times)
--   comprovantes → privado (só o capitão dono e a organização)
-- Os arquivos ficam numa pasta com o id do usuário: <uid>/arquivo.ext
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('escudos', 'escudos', true, 2097152, array['image/png', 'image/jpeg', 'image/webp']),
  ('comprovantes', 'comprovantes', false, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;

create policy "escudos: leitura pública" on storage.objects
  for select using (bucket_id = 'escudos');
create policy "escudos: capitão envia na própria pasta" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'escudos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "escudos: capitão substitui na própria pasta" on storage.objects
  for update to authenticated
  using (bucket_id = 'escudos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "escudos: capitão apaga na própria pasta" on storage.objects
  for delete to authenticated
  using (bucket_id = 'escudos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "escudos: organização gerencia" on storage.objects
  for all to authenticated
  using (bucket_id = 'escudos' and public.is_admin())
  with check (bucket_id = 'escudos' and public.is_admin());

create policy "comprovantes: capitão vê os próprios" on storage.objects
  for select to authenticated
  using (bucket_id = 'comprovantes' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "comprovantes: capitão envia na própria pasta" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'comprovantes' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "comprovantes: organização vê todos" on storage.objects
  for select to authenticated
  using (bucket_id = 'comprovantes' and public.is_admin());
