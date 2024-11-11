import { HttpClient } from "@angular/common/http";
import { take } from "rxjs";
import { environment } from "../../../../../environments/environments";
import { ContaModel, FiltroParametrosConta } from "../modelo/conta.model";
import { filtroService } from "../../../../shared/filter/filter-params.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ContaApiService{
  protected readonly pathApi = `${environment.url.service}`
  protected readonly pathApiConta = this.pathApi + '/conta'

  constructor(private http: HttpClient){}

  buscarContas(
    param?: FiltroParametrosConta,
    page?: number,
    size?: number
  ){
    return this.http.get(`${this.pathApiConta}/filtros`,
      {params: filtroService.criarParametro(param,page, size)}
    ).pipe(take(1))
  }

  buscarContaPorId(id: string){
    return this.http.get(`${this.pathApiConta}/${id}`).pipe(take(1))
  }

  salvarConta(param: ContaModel){
    return this.http.post(`${this.pathApiConta}`, param).pipe(take(1))
  }

  editarConta(id: string, param: ContaModel){
    return this.http.put(`${this.pathApiConta}/${id}`, param).pipe(take(1))
  }

  deletarConta(id: string){
    return this.http.delete(`${this.pathApiConta}/${id}`).pipe(take(1))
  }
}
