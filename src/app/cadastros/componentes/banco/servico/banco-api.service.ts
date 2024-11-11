import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { take } from "rxjs";
import { environment } from "../../../../../environments/environments";
import { BancoModel } from "../modelo/banco.model";

@Injectable({
  providedIn: 'root'
})
export class BancoApiService{
  protected readonly pathApi = `${environment.url.service}`
  protected readonly pathApiBanco = this.pathApi + '/banco'

  constructor(private http: HttpClient){}

  buscarBancos(){
    return this.http.get(`${this.pathApiBanco}`
    ).pipe(take(1))
  }

  buscarBancoPorId(id: string){
    return this.http.get(`${this.pathApiBanco}/${id}`).pipe(take(1))
  }

  salvarBanco(param: BancoModel){
    return this.http.post(`${this.pathApiBanco}`, param).pipe(take(1))
  }

  editarBanco(id: string, param: BancoModel){
    return this.http.put(`${this.pathApiBanco}/${id}`, param).pipe(take(1))
  }

  deletarBanco(id: string){
    return this.http.delete(`${this.pathApiBanco}/${id}`).pipe(take(1))
  }
}
