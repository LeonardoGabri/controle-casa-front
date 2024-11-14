export interface FaturaModel{
  id?: string
  dataVencimento?: Date;
  despesaFornecedor?: string;
  responsavelNome?: string;
  valor?: number;
  situacao?:string
}
