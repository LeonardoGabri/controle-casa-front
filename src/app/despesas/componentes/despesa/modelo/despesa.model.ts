import { ContaModel } from "../../../../cadastros/componentes/conta/modelo/conta.model";
import { FornecedorModel } from "../../../../cadastros/componentes/fornecedor/modelo/fornecedor.model";
import { SubgrupoModel } from "../../../../cadastros/componentes/subgrupo/modelo/subgrupo.model";
import {FaturaModel} from "../../fatura/modelo/fatura.model";

export interface DespesaModel{
  contaId?: string;
  fornecedorId?: string;
  subgrupoId?: string;
  descricao?: string;
  dataLancamento?: string;
  referenciaCobranca?: string;
  numeroParcelas?: string;
  valorTotal?: string;
  planejamentoParcelas?: PlanejamentoParcelas[];
  parcelas: FaturaModel[]
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
  referenciaCobranca: string
  parcelas: any
}

export interface FiltroParametrosDespesa{
  fornecedor?: string
  conta?: string
  subgrupo?:string;
}
