import {ResponsavelModel} from "../../../../cadastros/componentes/responsavel/modelo/responsavel.model";

export interface FaturaModel{
  id?: string
  dataVencimento?: Date;
  fornecedor?: string;
  responsavel?: ResponsavelModel;
  porcentagemDivisao?: number;
  parcelaAtual: string
  valor?: number;
  despesaId?: string
}


export interface ItemListaFatura{
  id: string;
  responsavelId: string
  responsavelNome: string
  dataVencimento: string
  valor: number
  parcelaAtual: string
  despesaFornecedor: string
}

export interface FiltroParametrosFatura{
  responsavel?: string
  referenciaCobranca?: string
}
