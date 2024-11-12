import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environments";
import { HttpClient } from "@angular/common/http";
import { FiltroParametrosResponsavel, ResponsavelModel } from "../modelo/responsavel.model";
import { filtroService } from "../../../../shared/filter/filter-params.service";
import { take } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ResponsavelApiService{
  protected readonly pathApi = `${environment.url.service}`
  protected readonly pathApiResponsavel = this.pathApi + '/responsavel'

  constructor(private http: HttpClient){}

  buscarResponsaveis(
    param?: FiltroParametrosResponsavel,
    page?: number,
    size?: number
  ){
    return this.http.get(`${this.pathApiResponsavel}/filtros`,
      {params: filtroService.criarParametro(param,page, size)}
    ).pipe(take(1))
  }

  buscarResponsavelPorId(id: string){
    return this.http.get(`${this.pathApiResponsavel}/${id}`).pipe(take(1))
  }

  salvarResponsavel(param: ResponsavelModel){
    return this.http.post(`${this.pathApiResponsavel}`, param).pipe(take(1))
  }

  editarResponsavel(id: string, param: ResponsavelModel){
    return this.http.put(`${this.pathApiResponsavel}/${id}`, param).pipe(take(1))
  }

  deletarResponsavel(id: string){
    return this.http.delete(`${this.pathApiResponsavel}/${id}`).pipe(take(1))
  }
}
