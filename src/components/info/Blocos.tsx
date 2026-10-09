import { Campo } from "@/components/Selo";
import { LinhaInfo, ListaInfo } from "@/components/info/Linhas";
import { dataEHora, diaSemana, dataLonga, moeda } from "@/lib/formato";
import type { Configuracoes } from "@/lib/tipos";

/* Blocos compartilhados entre "Informações" e "Inscreva seu time":
 * os dois leem o mesmo registro do banco, então editar no painel atualiza as duas páginas. */

export function BlocoPagamento({ cfg }: { cfg: Configuracoes }) {
  return (
    <ListaInfo>
      <LinhaInfo rotulo="Taxa de inscrição por time">
        <Campo valor={cfg.taxa_valor}>{(v) => <span className="numeros text-2xl text-sol">{moeda(v)}</span>}</Campo>
      </LinhaInfo>
      <LinhaInfo rotulo="O que a taxa inclui">
        <Campo valor={cfg.taxa_inclui} />
      </LinhaInfo>
      <LinhaInfo rotulo="Chave Pix">
        <Campo valor={cfg.pix_chave}>{(v) => <span className="break-all">{v}</span>}</Campo>
      </LinhaInfo>
      <LinhaInfo rotulo="Favorecido">
        <Campo valor={cfg.pix_favorecido} />
      </LinhaInfo>
      <LinhaInfo rotulo="Prazo para pagamento">
        <Campo valor={cfg.prazo_pagamento} />
      </LinhaInfo>
      <LinhaInfo rotulo="Desistência e reembolso">
        <Campo valor={cfg.politica_reembolso} />
      </LinhaInfo>
    </ListaInfo>
  );
}

export function BlocoFormato({ cfg }: { cfg: Configuracoes }) {
  return (
    <ListaInfo>
      <LinhaInfo rotulo="Número de times">
        <Campo valor={cfg.vagas_total}>{(v) => <span className="numeros">{v} times</span>}</Campo>
      </LinhaInfo>
      <LinhaInfo rotulo="Formato de disputa">
        <Campo valor={cfg.formato_disputa} />
      </LinhaInfo>
      <LinhaInfo rotulo="Duração das partidas">
        <Campo valor={cfg.duracao_partidas} />
      </LinhaInfo>
    </ListaInfo>
  );
}

function dataCompleta(iso: string) {
  return `${diaSemana(iso)}, ${dataLonga(iso)}`;
}

export function BlocoDatasJogos({ cfg }: { cfg: Configuracoes }) {
  return (
    <ListaInfo>
      <LinhaInfo rotulo="Início do campeonato">
        <Campo valor={cfg.inicio_campeonato}>{dataCompleta}</Campo>
      </LinhaInfo>
      <LinhaInfo rotulo="Final">
        <Campo valor={cfg.data_final}>{dataCompleta}</Campo>
      </LinhaInfo>
      <LinhaInfo rotulo="Dias e horários dos jogos">
        <Campo valor={cfg.dias_horarios} />
      </LinhaInfo>
      <LinhaInfo rotulo="Sorteio dos grupos">
        <Campo valor={cfg.sorteio_data}>{(v) => dataEHora(v)}</Campo>
      </LinhaInfo>
    </ListaInfo>
  );
}
