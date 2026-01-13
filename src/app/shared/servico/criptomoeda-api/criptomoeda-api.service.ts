import {Injectable} from "@angular/core";
import {take} from "rxjs";
import {PatrimonioModel} from "../../../proventos/componentes/patrimonio/modelo/patrimonio.model";
import {environment} from "../../../../environments/environments";
import {HttpClient} from "@angular/common/http";
import {CriptomoedaModel} from "../modelo/criptomoeda.model";

@Injectable({
  providedIn: 'root'
})
export class CriptomoedaApiService {
  protected readonly pathApi = `${environment.url.service}`
  protected readonly pathApiCriptomoeda = this.pathApi + '/criptomoeda'

  constructor(private http: HttpClient){}

  buscarCriptomoedas(){
    return this.http.get<CriptomoedaModel[]>(`${this.pathApiCriptomoeda}/listar-todos`).pipe(take(1))
  }

  buscarCriptomoedaPorId(id: string){
    return this.http.get<CriptomoedaModel>(`${this.pathApiCriptomoeda}/${id}`).pipe(take(1))
  }

  salvarCriptomoeda(param: CriptomoedaModel){
    return this.http.post<CriptomoedaModel>(`${this.pathApiCriptomoeda}`, param).pipe(take(1))
  }

  editarCriptomoeda(id: string, param: CriptomoedaModel){
    return this.http.put<CriptomoedaModel>(`${this.pathApiCriptomoeda}/${id}`, param).pipe(take(1))
  }

  buscarCriptomoedaPorCodigo(codigo: string){
    return this.http.get<CriptomoedaModel>(`${this.pathApiCriptomoeda}/codigo/${codigo}`).pipe(take(1))
  }

  deletarCriptomoeda(id: string){
    return this.http.delete(`${this.pathApiCriptomoeda}/${id}`).pipe(take(1))
  }
}
