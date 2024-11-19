export interface ContaModel{
  id?: string;
  bancoId?: string;
  responsavelId?: string
}

export interface ItemListaConta {
  id: string;
  nome: string;
  responsavel: string
}

export interface FiltroParametrosConta{
  banco?: string;
  responsavel?: string
}
