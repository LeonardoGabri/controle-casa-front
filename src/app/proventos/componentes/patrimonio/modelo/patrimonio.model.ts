import {ContaModel} from "../../../../cadastros/componentes/conta/modelo/conta.model";

export interface PatrimonioModel {
  id?:string;
  conta?: ContaModel;
  tipo?: string;
  moeda?: string;
  descricao?: string;
  valor?: number;
  dataInicio?: string;
  dataFim?: string;
}

export interface ItemListaPatrimonio{
  id:string;
  conta: ContaModel;
  tipo: string;
  moeda: string;
  valor: number;
  dataInicio?: string;
  dataFim?: string;
}

export interface FiltroParametrosPatrimonio{
  tipo?: string
  conta?: string
}
