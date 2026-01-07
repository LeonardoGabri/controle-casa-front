import {Component} from "@angular/core";
import {ItemListaDespesa} from "../../despesa/modelo/despesa.model";
import {FiltroResumoMensal, ResumoMensalModel} from "../modelo/resumo-mensal.model";
import {navegacaoDespesa, navegacaoResumoMensal} from "../../../servico/navegacao-despesa.service";
import {FiltroParametrosFatura} from "../../fatura/modelo/fatura.model";
import {ResumoMensalApiService} from "../servico/resumo-mensal-api.service";

@Component({
  selector: 'app-resumo-mensal-lista',
  templateUrl: 'resumo-mensal-lista.component.html',
  styleUrls: ['resumo-mensal-lista.component.scss']
})
export class ResumoMensalListaComponent{
  nomePagina = navegacaoResumoMensal.label
  filtroBuscaAvancada: FiltroResumoMensal = {};

  itensResumoMensal: ResumoMensalModel[]  = [];

  constructor(
    private resumoMensalApiService:ResumoMensalApiService
  ) {
  }

  filtrarResumo(){
    this.resumoMensalApiService.buscarResumoMensal(this.filtroBuscaAvancada).subscribe({
      next: (response: any) =>{
        this.itensResumoMensal = response
      }
    })
  }
}
