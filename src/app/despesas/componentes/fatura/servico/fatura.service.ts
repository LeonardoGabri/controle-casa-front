import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { filtroService } from '../../../../shared/filter/filter-params.service';
import { FaturaModel, FiltroParametrosFatura } from '../modelo/fatura.model';
import {DespesaModel} from "../../despesa/modelo/despesa.model";

@Injectable({
  providedIn: 'root'
})
export class FaturaApiService{
  protected readonly pathApi = `${environment.url.service}`
  protected readonly pathApiDespesa = this.pathApi + '/parcela'

  constructor(private http: HttpClient){}

  buscarParcelas(
    param?: FiltroParametrosFatura,
    page?: number,
    size?: number
  ){
    return this.http.get<FaturaModel[]>(`${this.pathApiDespesa}/filtros`,
      {params: filtroService.criarParametro(param,page, size)}
    ).pipe(take(1))
  }

  buscarParcelaPorId(id: string){
    return this.http.get(`${this.pathApiDespesa}/${id}`).pipe(take(1))
  }

  salvarParcela(param: FaturaModel){
    return this.http.post(`${this.pathApiDespesa}`, param).pipe(take(1))
  }

  editarParcela(id: string, param: FaturaModel){
    return this.http.put(`${this.pathApiDespesa}/${id}`, param).pipe(take(1))
  }

  deletarParcela(id: string){
    return this.http.delete(`${this.pathApiDespesa}/${id}`).pipe(take(1))
  }

  calcularParcelas(despesa: DespesaModel){
    return this.http.post(`${this.pathApiDespesa}/calcular-parcelas`, despesa).pipe(take(1))
  }

  buscarResumoParcelaPorResponsavel(
    param?: FiltroParametrosFatura,
    page?: number,
    size?: number
  ){
    return this.http.get(`${this.pathApiDespesa}/resumo-responsavel`,
      {params: filtroService.criarParametro(param,page, size)}
    ).pipe(take(1))
  }

  buscarResumoParcelaPorConta(
    param?: FiltroParametrosFatura,
    page?: number,
    size?: number
  ){
    return this.http.get(`${this.pathApiDespesa}/resumo-conta`,
      {params: filtroService.criarParametro(param,page, size)}
    ).pipe(take(1))
  }
}
