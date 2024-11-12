import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';

import { environment } from '../../../../../environments/environments';
import { filtroService } from '../../../../shared/filter/filter-params.service';
import { DespesaModel, FiltroParametrosDespesa } from '../modelo/despesa.model';

@Injectable({
  providedIn: 'root'
})
export class DespesaApiService{
  protected readonly pathApi = `${environment.url.service}`
  protected readonly pathApiDespesa = this.pathApi + '/despesa'

  constructor(private http: HttpClient){}

  buscarDespesas(
    param?: FiltroParametrosDespesa,
    page?: number,
    size?: number
  ){
    return this.http.get(`${this.pathApiDespesa}/filtros`,
      {params: filtroService.criarParametro(param,page, size)}
    ).pipe(take(1))
  }

  buscarDespesaPorId(id: string){
    return this.http.get(`${this.pathApiDespesa}/${id}`).pipe(take(1))
  }

  salvarDespesa(param: DespesaModel){
    return this.http.post(`${this.pathApiDespesa}`, param).pipe(take(1))
  }

  editarDespesa(id: string, param: DespesaModel){
    return this.http.put(`${this.pathApiDespesa}/${id}`, param).pipe(take(1))
  }

  deletarDespesa(id: string){
    return this.http.delete(`${this.pathApiDespesa}/${id}`).pipe(take(1))
  }
}
