import {ResponsavelModel} from "../../../../cadastros/componentes/responsavel/modelo/responsavel.model";

export interface AcertoResponsavelModel {
  devedorId: string;
  devedorNome: string;
  credorId: string;
  credorNome: string;
  valor: number
}

export interface ObrigacaoFinanceiraModel {
  bancoId: string;
  bancoNome: string;
  responsavelId: string;
  responsavelNome: string;
  contaId: string;
  valorTotal: number
}

export interface FiltroResumoMensal{
  referenciaCobranca?: string;
}
