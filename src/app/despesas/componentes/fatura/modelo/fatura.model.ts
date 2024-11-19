export interface FaturaModel{
  id?: string
  dataVencimento?: Date;
  despesaFornecedor?: string;
  responsavelId?: string;
  responsavelNome?: string;
  porcentagemDivisao?: number;
  valor?: number;
  situacao?:string;
  despesaId?: string
}


export interface ItemListaFatura{
  id: string;
  responsavelId: string
  responsavelNome: string
  dataVencimento: string
  valor: number
  despesaFornecedor: string
  situacao: string
}

export interface FiltroParametrosFatura{
  responsavel?: string
  referenciaCobranca?: string
  situacao?: string
}
