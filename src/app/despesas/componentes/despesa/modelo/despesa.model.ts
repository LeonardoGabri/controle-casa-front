import { ContaModel } from "../../../../cadastros/componentes/conta/modelo/conta.model";

export interface DespesaModel{
  contaId?: string;
  fornecedorId?: string;
  grupoId?: string;
  dataLancamento?: string;
  mesInicioCobranca?: string;
  anoInicioCobranca?: string;
  numeroParcelas?: string;
  valorTotal?: string;
  planejamentoParcelas?: any;
}

export interface ItemListaDespesa {
  id: string;
  conta: ContaModel;
  fornecedorNome: string
  grupoNome: string
  nParcelas: string
  valorTotal: string
  valorTotalAtivo: string
  mesInicioCobranca: string
  anoInicioCobranca: string
  situacao: string
  parcelas: any

}

export interface FiltroParametrosDespesa{
  fornecedor?: string
  banco?:string;
  grupo?: string;
  situacao?: string
}
