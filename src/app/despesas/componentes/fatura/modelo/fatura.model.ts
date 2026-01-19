export interface FaturaModel{
  indTabela?: number;
  dataVencimento?: Date;
  fornecedorId?: string;
  responsavelId: string;
  responsavelNome?: string;
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
  responsavelConta?: string
}

export interface ResumoParcelaPorResponsavel{
  responsavelId: string;
  responsavelNome: string;
  valorTotal: number;
}

export interface ResumoParcelaPorConta{
  contaId: string;
  contaNome: string;
  valorTotal: number;
}
