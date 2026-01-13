import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environments";
import {HttpClient} from "@angular/common/http";
import {BinanceResponseModel} from "../modelo/binance.model";

@Injectable({
  providedIn: 'root'
})
export class BinanceApiService {
  protected readonly pathApi = `${environment.url.binance}`
  protected readonly pathApiPatrimonio = this.pathApi + '/ticker/price'

  constructor(private http: HttpClient){}

  buscarValorMoeda(moeda: string){
    let param = moeda.toUpperCase()+'BRL'
    return this.http.get<BinanceResponseModel>(`${this.pathApiPatrimonio}?symbol=${param}`)
  }
}
