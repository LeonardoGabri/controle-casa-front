export interface FaturaModel{
  id?: string
  dataVencimento?: Date;
  fornecedorId?: string;
  responsavelId: string;
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
  fornecedorId: string
  fornecedorNome: string
  despesaId: string
}

export interface FiltroParametrosFatura{
  responsavel?: string
  referenciaCobranca?: string;
  dataIni?: string
  dataFim?: string
  contaId?: string;
}

export interface ResumoParcelaPorResponsavel{
  responsavelNome: string;
  valorTotal: number;
}
