import { Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environments";
import { FiltroParametrosFornecedor, FornecedorModel } from "../modelo/fornecedor.model";
import { filtroService } from "../../../../shared/filter/filter-params.service";
import { HttpClient } from "@angular/common/http";
import { take } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FornecedorApiService{
  protected readonly pathApi = `${environment.url.service}`
  protected readonly pathApiFornecedor = this.pathApi + '/fornecedor'

  constructor(private http: HttpClient){}

  buscarFornecedores(
    param?: FiltroParametrosFornecedor,
    page?: number,
    size?: number
  ){
    return this.http.get(`${this.pathApiFornecedor}/filtros`,
      {params: filtroService.criarParametro(param,page, size)}
    ).pipe(take(1))
  }

  buscarFornecedorPorId(id: string){
    return this.http.get(`${this.pathApiFornecedor}/${id}`).pipe(take(1))
  }

  salvarFornecedor(param: FornecedorModel){
    return this.http.post(`${this.pathApiFornecedor}`, param).pipe(take(1))
  }

  editarFornecedor(id: string, param: FornecedorModel){
    return this.http.put(`${this.pathApiFornecedor}/${id}`, param).pipe(take(1))
  }

  deletarFornecedor(id: string){
    return this.http.delete(`${this.pathApiFornecedor}/${id}`).pipe(take(1))
  }
}
