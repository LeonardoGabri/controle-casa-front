import { SubgrupoModel } from "../../subgrupo/modelo/subgrupo.model";

export interface FornecedorModel{
  id?: string;
  nome?: string;
  subgrupoId?: string
}

export interface ItemListaFornecedor {
  id: string;
  nome: string;
  subgrupo: SubgrupoModel
}

export interface FiltroParametrosFornecedor{
  nome?: string
  subgrupoId?: string
}
