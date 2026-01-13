import {ContaModel} from "../../../../cadastros/componentes/conta/modelo/conta.model";
import {PatrimonioModel} from "../../patrimonio/modelo/patrimonio.model";

export interface TransacaoModel {
  id?:string;
  dataTransacao?: string;
  patrimonio?: string;
  tipo?: string;
  valor?: number;
  descricao?: string;
  patrimonioOrigem?: string;
  patrimonioDestino?: string;
}

export interface ItemListaTransacao{
  id?:string;
  patrimonio?: PatrimonioModel;
  tipo?: string;
  valor?: number;
  descricao?: string;
  patrimonioOrigem?: PatrimonioModel;
  patrimonioDestino?: PatrimonioModel;
}

export interface FiltroParametrosTransacao{
  tipo?: string
  patrimonio?: string
  dataIni?: string
  dataFim?: string
}
