import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {take} from 'rxjs';

import {FaturaModel} from "../../../../../fatura/modelo/fatura.model";
import {PlanejamentoParcelas} from "../../../../modelo/despesa.model";
import {environment} from "../../../../../../../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class PlanejamentoParcelasApiService{
  protected readonly pathApi = `${environment.url.service}`
  protected readonly pathApiPlanejamento = this.pathApi + '/planejamento-parcela'

  constructor(private http: HttpClient){}

  calcularPlanejamentoParcelas(param: FaturaModel[]){
    return this.http.post<PlanejamentoParcelas[]>(`${this.pathApiPlanejamento}/calcular`, param).pipe(take(1))
  }
}
