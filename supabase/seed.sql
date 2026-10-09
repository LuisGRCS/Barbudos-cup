-- =====================================================================
-- DADOS DE EXEMPLO (fictícios) — para visualizar o site funcionando.
-- Tudo aqui é marcado com exemplo = true e pode ser apagado pelo painel
-- do organizador no botão "Apagar dados de exemplo".
-- As datas são relativas ao dia em que o script roda.
-- =====================================================================

select setseed(0.42);

-- Meia-noite de hoje no horário de Brasília
create temporary table _base as
  select (date_trunc('day', now() at time zone 'America/Sao_Paulo') at time zone 'America/Sao_Paulo') as hoje;

update public.configuracoes set
  edicao = '1ª edição',
  inscricoes_status = 'abertas',
  vagas_total = 12,
  inscricoes_abertura = (select hoje from _base) - interval '20 days',
  inscricoes_encerramento = (select hoje from _base) + interval '12 days' + interval '23 hours 59 minutes',
  prazo_elenco = (select hoje from _base) + interval '15 days',
  sorteio_data = (select hoje from _base) - interval '18 days' + interval '20 hours',
  sorteio_descricao = 'Reunião com os capitães e sorteio dos grupos, ao vivo no Instagram',
  inicio_campeonato = (select hoje from _base) - interval '11 days' + interval '8 hours',
  data_final = (select hoje from _base) + interval '17 days' + interval '11 hours',
  dias_horarios = 'Domingos, das 8h às 13h',
  duracao_partidas = '2 tempos de 20 minutos, com 5 minutos de intervalo'
where id = 1;

insert into public.grupos (nome, ordem, exemplo) values ('A', 1, true), ('B', 2, true);

insert into public.times (nome, instagram, status, pagamento_status, aceite_regulamento_em, grupo_id, exemplo)
select t.nome, t.insta, 'aprovado', 'pago', now(), g.id, true
from (values
  ('Barba Negra FC', 'barbanegrafc', 'A'),
  ('Real Matismo', 'realmatismo', 'A'),
  ('Inter de Limão', null, 'A'),
  ('Sol Nascente FC', 'solnascentefc', 'A'),
  ('Bigodes United', 'bigodesunited', 'B'),
  ('Resenha FC', 'resenhafc', 'B'),
  ('Os Cabeludos', null, 'B'),
  ('Fúria do Litoral', 'furiadolitoral', 'B')
) as t(nome, insta, grupo)
join public.grupos g on g.nome = t.grupo;

-- Elencos: 10 jogadores por time, nomes fictícios
insert into public.jogadores (time_id, nome, numero)
select t.id,
  (array['Rafael','Thiago','Bruno','Diego','Lucas','Felipe','Gustavo','Rodrigo','Marcelo','André','Caio','Vinícius','Leandro','Paulo','Renato','Igor','Mateus','Fábio','Danilo','Henrique'])[1 + ((t.id * 7 + n * 3) % 20)]
  || ' ' ||
  (array['Silva','Souza','Oliveira','Costa','Pereira','Almeida','Ribeiro','Carvalho','Gomes','Martins','Rocha','Barbosa','Lima','Teixeira','Moura','Cardoso'])[1 + ((t.id * 5 + n * 11) % 16)],
  case when n = 1 then 1 else n * 2 + (t.id % 3) end
from public.times t
cross join generate_series(1, 10) as n
where t.exemplo;

-- Fase de grupos: todos contra todos dentro de cada grupo (3 rodadas)
with ordenados as (
  select t.id, t.grupo_id, row_number() over (partition by t.grupo_id order by t.id) as pos
  from public.times t where t.exemplo
),
confrontos(rodada, a, b) as (
  values (1, 1, 2), (1, 3, 4), (2, 1, 3), (2, 2, 4), (3, 1, 4), (3, 2, 3)
)
insert into public.jogos (fase, rodada, grupo_id, time_casa_id, time_fora_id, data_hora, campo, exemplo)
select 'grupos', c.rodada, x.grupo_id, x.id, y.id,
  (select hoje from _base) + make_interval(days => (c.rodada - 1) * 7 - 11)
    + make_interval(hours => 8 + (row_number() over (partition by c.rodada order by g.ordem, c.a) - 1)::int),
  'Campo 1',
  true
from confrontos c
join ordenados x on x.pos = c.a
join ordenados y on y.pos = c.b and y.grupo_id = x.grupo_id
join public.grupos g on g.id = x.grupo_id;

-- Placar das duas primeiras rodadas (já disputadas)
update public.jogos set
  gols_casa = floor(random() * 5)::int,
  gols_fora = floor(random() * 4)::int,
  encerrado = true
where exemplo and fase = 'grupos' and rodada <= 2;

-- Autores dos gols e cartões
do $$
declare
  j record;
  i int;
begin
  for j in select * from public.jogos where exemplo and encerrado loop
    for i in 1..j.gols_casa loop
      insert into public.eventos_jogo (jogo_id, time_id, jogador_id, tipo, minuto)
      select j.id, j.time_casa_id, p.id, 'gol', 1 + floor(random() * 40)::int
      from public.jogadores p where p.time_id = j.time_casa_id and p.numero <> 1
      order by random() limit 1;
    end loop;
    for i in 1..j.gols_fora loop
      insert into public.eventos_jogo (jogo_id, time_id, jogador_id, tipo, minuto)
      select j.id, j.time_fora_id, p.id, 'gol', 1 + floor(random() * 40)::int
      from public.jogadores p where p.time_id = j.time_fora_id and p.numero <> 1
      order by random() limit 1;
    end loop;
    if random() < 0.7 then
      insert into public.eventos_jogo (jogo_id, time_id, jogador_id, tipo, minuto)
      select j.id, p.time_id, p.id, 'amarelo', 1 + floor(random() * 40)::int
      from public.jogadores p where p.time_id in (j.time_casa_id, j.time_fora_id)
      order by random() limit 1;
    end if;
    if random() < 0.2 then
      insert into public.eventos_jogo (jogo_id, time_id, jogador_id, tipo, minuto)
      select j.id, p.time_id, p.id, 'vermelho', 1 + floor(random() * 40)::int
      from public.jogadores p where p.time_id in (j.time_casa_id, j.time_fora_id)
      order by random() limit 1;
    end if;
  end loop;
end $$;

-- Mata-mata: semifinais cruzadas, disputa de 3º lugar e final
insert into public.jogos (fase, chave_ordem, origem_casa, origem_fora, data_hora, campo, exemplo) values
  ('semifinal', 1, 'grupo:A:1', 'grupo:B:2', (select hoje from _base) + interval '10 days 8 hours', 'Campo 1', true),
  ('semifinal', 2, 'grupo:B:1', 'grupo:A:2', (select hoje from _base) + interval '10 days 9 hours', 'Campo 1', true);

insert into public.jogos (fase, chave_ordem, origem_casa, origem_fora, data_hora, campo, exemplo)
select 'terceiro', 1, 'perdedor:' || s1.id, 'perdedor:' || s2.id, (select hoje from _base) + interval '17 days 9 hours 30 minutes', 'Campo 1', true
from public.jogos s1, public.jogos s2
where s1.fase = 'semifinal' and s1.chave_ordem = 1 and s2.fase = 'semifinal' and s2.chave_ordem = 2;

insert into public.jogos (fase, chave_ordem, origem_casa, origem_fora, data_hora, campo, exemplo)
select 'final', 1, 'vencedor:' || s1.id, 'vencedor:' || s2.id, (select hoje from _base) + interval '17 days 11 hours', 'Campo 1', true
from public.jogos s1, public.jogos s2
where s1.fase = 'semifinal' and s1.chave_ordem = 1 and s2.fase = 'semifinal' and s2.chave_ordem = 2;

insert into public.comunicados (titulo, texto, exemplo, criado_em) values
  ('Rodada 3 confirmada', 'A terceira rodada da fase de grupos está confirmada para domingo. Cheguem com 20 minutos de antecedência para o aquecimento.', true, now() - interval '2 days'),
  ('Coletes disponíveis', 'Times com uniformes parecidos vão receber coletes da organização antes do jogo. Não precisa trazer.', true, now() - interval '9 days');

insert into public.pre_inscricoes (nome_time, nome_capitao, telefone, email, instagram, exemplo) values
  ('Pé de Pato FC', 'Carlos Exemplo', '(11) 98888-0001', 'carlos.exemplo@example.com', 'pedepatofc', true),
  ('Atlético Churrasco', 'João Exemplo', '(11) 97777-0002', 'joao.exemplo@example.com', null, true);

-- Organização de teste (somente no ambiente local)
insert into public.admins (email) values ('admin@barbudoscup.local');
