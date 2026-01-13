import {HttpClient} from "@angular/common/http";
import {take} from "rxjs";
import {environment} from "../../../../../environments/environments";
import {filtroService} from "../../../../shared/filter/filter-params.service";
import {Injectable} from "@angular/core";
import {FiltroParametrosTransacao, TransacaoModel} from "../modelo/transacao.model";

@Injectable({
  providedIn: 'root'
})
export class TransacaoApiService{
  protected readonly pathApi = `${environment.url.service}`
  protected readonly pathApiTransacao = this.pathApi + '/transacao'

  constructor(private http: HttpClient){}

  buscarTransacoes(
    param?: FiltroParametrosTransacao,
    page?: number,
    size?: number
  ){
    return this.http.get(`${this.pathApiTransacao}/filtros`,
      {params: filtroService.criarParametro(param,page, size)}
    ).pipe(take(1))
  }

  buscarTransacaoPorId(id: string){
    return this.http.get(`${this.pathApiTransacao}/${id}`).pipe(take(1))
  }

  salvarTransacao(param: TransacaoModel){
    return this.http.post(`${this.pathApiTransacao}`, param).pipe(take(1))
  }

  editarTransacao(id: string, param: TransacaoModel){
    return this.http.put(`${this.pathApiTransacao}/${id}`, param).pipe(take(1))
  }

  deletarTransacao(id: string){
    return this.http.delete(`${this.pathApiTransacao}/${id}`).pipe(take(1))
  }
}
