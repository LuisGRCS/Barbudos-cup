-- =====================================================================
-- Conteúdo inicial (base para revisão da organização)
-- Tudo aqui pode ser editado ou apagado pelo painel do organizador.
-- =====================================================================

insert into public.regulamento_secoes (ordem, titulo, conteudo) values
(1, 'Inscrição',
'A inscrição é feita pelo capitão do time, no site oficial, criando a conta de capitão e preenchendo os dados da equipe.

- A vaga só é garantida depois que a organização aprova a inscrição e confirma o pagamento da taxa.
- O pagamento deve ser feito dentro do prazo informado na página de inscrição. Inscrições sem pagamento no prazo podem ser canceladas.
- Ao se inscrever, o capitão declara que leu e aceita este regulamento em nome de todo o time.
- O número de vagas é limitado. Quando as vagas acabam, as inscrições são encerradas automaticamente.'),

(2, 'Elenco',
'- Cada time deve inscrever no mínimo 7 e no máximo 15 jogadores.
- Cada jogador só pode estar inscrito em um time durante todo o campeonato.
- O elenco é cadastrado pelo capitão na área do capitão, com nome e número da camisa de cada jogador.
- Alterações no elenco são permitidas até o prazo final definido pela organização. Depois disso, só com autorização da organização.
- Só podem entrar em campo jogadores inscritos no elenco do time.
- Cada time joga com 7 atletas (6 na linha e 1 goleiro). O jogo só começa ou continua com no mínimo 5 atletas por time.'),

(3, 'Duração das partidas',
'- A duração de cada partida e do intervalo é a informada na página de Informações.
- O cronômetro é controlado pela arbitragem. Não há acréscimos, salvo decisão do árbitro por paralisação longa.
- As substituições são ilimitadas e podem ser feitas com o jogo em andamento, pela zona de substituição, sem precisar avisar o árbitro.
- Um jogador substituído pode voltar à partida.'),

(4, 'Pontuação e desempate',
'Na fase de grupos, a pontuação é:

- Vitória: 3 pontos.
- Empate: 1 ponto.
- Derrota: 0 ponto.

Se dois ou mais times terminarem empatados em pontos, o desempate segue esta ordem:

- Maior número de vitórias.
- Maior saldo de gols.
- Maior número de gols marcados.
- Confronto direto (apenas entre dois times).
- Menor número de cartões (vermelho vale 3, amarelo vale 1).
- Sorteio.

No mata-mata, se a partida terminar empatada, a decisão vai para os pênaltis: 3 cobranças para cada time e, persistindo o empate, cobranças alternadas até sair um vencedor.'),

(5, 'Cartões e suspensões',
'- Cartão amarelo: advertência. O jogador sai por 2 minutos e o time joga com um a menos nesse período.
- Dois cartões amarelos na mesma partida equivalem a um vermelho.
- Cartão vermelho: o jogador é expulso e não pode ser substituído por 5 minutos. Depois disso, o time pode completar com outro atleta.
- Quem recebe cartão vermelho cumpre suspensão automática na partida seguinte.
- A cada 3 cartões amarelos acumulados no campeonato, o jogador cumpre 1 partida de suspensão.
- Os cartões amarelos são zerados ao fim da fase de grupos. Suspensões por vermelho continuam valendo.
- Agressão física a qualquer pessoa resulta em eliminação do jogador do campeonato, podendo o time também ser punido.'),

(6, 'W.O. (ausência)',
'- Há tolerância de 10 minutos a partir do horário marcado para o time estar em campo com no mínimo 5 jogadores.
- O time que não comparecer perde por W.O. e o adversário vence por 3 a 0.
- O time que levar dois W.O. é eliminado do campeonato e seus jogos seguintes contam como W.O.
- A taxa de inscrição não é devolvida em caso de W.O. ou eliminação.'),

(7, 'Uniformes',
'- Todos os jogadores de linha devem usar camisas da mesma cor e com numeração nas costas, igual ao número cadastrado no elenco.
- O goleiro deve usar uniforme de cor diferente dos demais.
- Se os uniformes dos dois times forem parecidos, o time mandante (primeiro na tabela) usa coletes fornecidos pela organização.
- É proibido jogar com chuteira de travas de alumínio (trava de metal). Use society ou futsal, conforme o piso do campo.'),

(8, 'Conduta',
'- O campeonato é para se divertir com respeito. Ofensas, discriminação de qualquer tipo e agressões não são toleradas.
- A arbitragem é a autoridade em campo. Reclamações devem ser feitas apenas pelo capitão, com educação.
- O time é responsável pelo comportamento da sua torcida e dos seus jogadores, dentro e fora de campo.
- Casos de indisciplina podem gerar suspensão, perda de pontos ou eliminação, a critério da organização.'),

(9, 'Papel do capitão',
'- O capitão é o único representante do time junto à organização.
- É responsável por inscrever o time, efetuar o pagamento, manter o elenco atualizado e repassar os comunicados aos jogadores.
- Deve conferir a súmula ao fim de cada jogo.
- Qualquer dúvida ou recurso deve ser enviado pelo capitão no direct do Instagram oficial do campeonato em até 24 horas após o jogo.'),

(10, 'Disposições gerais',
'- Casos não previstos neste regulamento serão decididos pela organização.
- Em caso de chuva forte ou condições que ponham os atletas em risco, a organização pode adiar jogos. As novas datas serão avisadas pelos comunicados e no Instagram.
- A organização pode atualizar este regulamento antes do início do campeonato. A versão válida é sempre a publicada no site.');

insert into public.regras_destaque (ordem, titulo, texto, icone) values
(1, 'Elenco de 7 a 15', 'Mínimo de 7 e máximo de 15 jogadores inscritos. Cada jogador defende um único time.', 'elenco'),
(2, 'Tolerância de 10 minutos', 'Depois do horário marcado, o time tem 10 minutos para estar em campo com pelo menos 5 jogadores.', 'relogio'),
(3, 'W.O. vale 3 a 0', 'Quem não comparece perde por 3 a 0. Dois W.O. eliminam o time.', 'wo'),
(4, 'Amarelo: 2 minutos fora', 'O jogador advertido sai por 2 minutos. Três amarelos acumulados geram 1 jogo de suspensão.', 'amarelo'),
(5, 'Vermelho: suspensão automática', 'Expulsão deixa o time com um a menos por 5 minutos e o jogador fora da próxima partida.', 'vermelho'),
(6, 'Substituições ilimitadas', 'Pode trocar à vontade, com o jogo rolando, pela zona de substituição.', 'troca'),
(7, 'Camisa numerada', 'Uniforme igual para todos da linha, com o número cadastrado no elenco. Goleiro com cor diferente.', 'camisa'),
(8, 'Respeito acima de tudo', 'Ofensa, discriminação ou agressão leva a suspensão ou eliminação.', 'apito');

insert into public.faq (ordem, pergunta, resposta) values
(1, 'Posso trocar jogador depois de inscrever o time?',
 'Pode. O capitão adiciona, remove ou edita jogadores pela área do capitão até o prazo final de cadastro do elenco. Depois desse prazo, só com autorização da organização.'),
(2, 'E se chover?',
 'Com chuva fraca, os jogos acontecem normalmente. Se houver chuva forte ou risco para os atletas, a organização adia a rodada e avisa pelos comunicados da área do capitão e pelo Instagram.'),
(3, 'Como funciona o desempate na fase de grupos?',
 'Empatou em pontos, vale nesta ordem: mais vitórias, maior saldo de gols, mais gols marcados, confronto direto, menos cartões e, por último, sorteio. No mata-mata, empate vai para os pênaltis.'),
(4, 'Um jogador pode jogar em dois times?',
 'Não. Cada jogador só pode estar inscrito em um time durante todo o campeonato.'),
(5, 'Como envio o comprovante de pagamento?',
 'Depois de fazer o Pix, entre na área do capitão e envie a foto ou o PDF do comprovante. A organização confere e confirma o pagamento por lá.'),
(6, 'Quando meu time está confirmado?',
 'Quando a organização aprova a inscrição e confirma o pagamento. Você recebe um aviso por e-mail e o status muda na área do capitão.');

insert into public.premios (ordem, titulo, descricao) values
(1, 'Campeão', null),
(2, 'Vice-campeão', null),
(3, '3º lugar', null),
(4, 'Artilheiro', null),
(5, 'Melhor goleiro', null);

update public.configuracoes set
  instagram_usuario = 'barbudoscup',
  formato_disputa = 'Fase de grupos seguida de mata-mata',
  classificados_por_grupo = 2,
  disputa_terceiro = true
where id = 1;
