export interface ResumoMensalModel{
  devedor: string;
  credor: string;
  valor: number
}

export interface FiltroResumoMensal{
  referenciaCobranca?: string;
}
