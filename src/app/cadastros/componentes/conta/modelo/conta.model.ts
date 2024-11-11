export interface ContaModel{
  id?:string;
 nome: string;
 responsavelId?: string
}

export interface ItemListaConta {
  id: string;
  nome: string;
  responsavel: string
}

export interface FiltroParametrosConta{
  bancoId?: string;
  responsavelId?: string
}

export interface ContaModel{

}
