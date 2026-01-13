import {HttpClient} from "@angular/common/http";
import {take} from "rxjs";
import {environment} from "../../../../../environments/environments";
import {filtroService} from "../../../../shared/filter/filter-params.service";
import {Injectable} from "@angular/core";
import {FiltroParametrosPatrimonio, PatrimonioModel} from "../modelo/patrimonio.model";

@Injectable({
  providedIn: 'root'
})
export class PatrimonioApiService{
  protected readonly pathApi = `${environment.url.service}`
  protected readonly pathApiPatrimonio = this.pathApi + '/patrimonio'

  constructor(private http: HttpClient){}

  buscarPatrimonios(
    param?: FiltroParametrosPatrimonio,
    page?: number,
    size?: number
  ){
    return this.http.get(`${this.pathApiPatrimonio}/filtros`,
      {params: filtroService.criarParametro(param,page, size)}
    ).pipe(take(1))
  }

  buscarPatrimonioPorId(id: string){
    return this.http.get(`${this.pathApiPatrimonio}/${id}`).pipe(take(1))
  }

  salvarPatrimonio(param: PatrimonioModel){
    return this.http.post(`${this.pathApiPatrimonio}`, param).pipe(take(1))
  }

  editarPatrimonio(id: string, param: PatrimonioModel){
    return this.http.put(`${this.pathApiPatrimonio}/${id}`, param).pipe(take(1))
  }

  deletarPatrimonio(id: string){
    return this.http.delete(`${this.pathApiPatrimonio}/${id}`).pipe(take(1))
  }
}
