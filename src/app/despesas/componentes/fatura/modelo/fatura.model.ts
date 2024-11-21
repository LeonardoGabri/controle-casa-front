export interface FaturaModel{
  id?: string
  dataVencimento?: Date;
  despesaFornecedor?: string;
  responsavelId?: string;
  responsavelNome?: string;
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
