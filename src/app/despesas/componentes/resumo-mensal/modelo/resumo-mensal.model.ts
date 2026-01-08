import {ResponsavelModel} from "../../../../cadastros/componentes/responsavel/modelo/responsavel.model";

export interface ResumoMensalModel{
  devedorId: string;
  devedorNome: string;
  credorId: string;
  credorNome: string;
  valor: number
}

export interface FiltroResumoMensal{
  referenciaCobranca?: string;
}
