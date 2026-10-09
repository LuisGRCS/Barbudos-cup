# Barbudos Cup — site oficial

Site do campeonato de futebol 7 Barbudos Cup: informações, inscrições, regulamento, times, tabela, jogos e estatísticas.

Feito com Next.js, Tailwind CSS e Supabase (banco de dados, login e arquivos). Hospedagem prevista na Vercel.

## Rodar no computador (para desenvolvimento)

Requisitos: Node.js 20+ e Docker.

```bash
npm install
npx supabase start      # sobe o banco local com os dados de exemplo
cp .env.example .env.local   # e preencha com as chaves mostradas pelo comando acima
npm run dev             # abre em http://localhost:3000
```

## Estrutura

- `src/app` — páginas do site
- `src/components` — peças visuais reaproveitadas
- `src/lib/torneio.ts` — cálculos automáticos (classificação, chaveamento, artilharia)
- `supabase/migrations` — estrutura do banco e regras de acesso
- `supabase/seed.sql` — dados de exemplo (fictícios), marcados para apagar antes do lançamento

O guia passo a passo para publicar o site e usar o painel do organizador será adicionado ao fim do projeto.
