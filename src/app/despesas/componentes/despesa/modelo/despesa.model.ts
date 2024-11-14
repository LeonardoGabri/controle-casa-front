import { ContaModel } from "../../../../cadastros/componentes/conta/modelo/conta.model";
import { FornecedorModel } from "../../../../cadastros/componentes/fornecedor/modelo/fornecedor.model";
import { SubgrupoModel } from "../../../../cadastros/componentes/subgrupo/modelo/subgrupo.model";

export interface DespesaModel{
  contaId?: string;
  fornecedorId?: string;
  subgrupoId?: string;
  dataLancamento?: string;
  mesInicioCobranca?: string;
  anoInicioCobranca?: string;
  numeroParcelas?: string;
  valorTotal?: string;
  planejamentoParcelas?: PlanejamentoParcelas[];
}

export interface PlanejamentoParcelas{
  indTabela?: number;
  porcentagemDivisao?: number;
  responsavelId?: string;
  responsavelNome?: string
}

export interface ItemListaDespesa {
  id: string;
  conta: ContaModel;
  fornecedor: FornecedorModel
  subgrupo: SubgrupoModel
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
