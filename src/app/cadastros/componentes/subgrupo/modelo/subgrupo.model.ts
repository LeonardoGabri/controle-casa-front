import { GrupoModel } from "../../grupo/modelo/grupo.model";

export interface SubgrupoModel{
  id?: string;
  nome?: string;
  grupoId?: string
}

export interface ItemListaSubgrupo {
  id: string;
  responsavel: string
  grupo: GrupoModel;
}

export interface FiltroParametrosSubgrupo{
  nome?: string
  grupoId?: string
}
