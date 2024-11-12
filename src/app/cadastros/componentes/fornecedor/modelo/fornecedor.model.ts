export interface FornecedorModel{
  id?: string;
  nome?: string;
  grupoId?: string
}

export interface ItemListaFornecedor {
  id: string;
  nome: string;
  grupo: string
}

export interface FiltroParametrosFornecedor{
  nome?: string
  grupoId?: string
}
