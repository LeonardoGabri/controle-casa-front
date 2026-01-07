import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {take} from 'rxjs';

import {environment} from '../../../../../environments/environments';
import {filtroService} from '../../../../shared/filter/filter-params.service';
import {FiltroResumoMensal} from "../modelo/resumo-mensal.model";

@Injectable({
  providedIn: 'root'
})
export class ResumoMensalApiService{
  protected readonly pathApi = `${environment.url.service}`
  protected readonly pathApiDespesa = this.pathApi + '/resumo-mensal'

  constructor(private http: HttpClient){}

  buscarResumoMensal(
    param?: FiltroResumoMensal
  ){
    return this.http.get(`${this.pathApiDespesa}/buscar`,
      {params: filtroService.criarParametro(param)}
    ).pipe(take(1))
  }
}
