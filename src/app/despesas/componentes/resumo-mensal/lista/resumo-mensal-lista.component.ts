import {Component, OnInit} from "@angular/core";
import {ItemListaDespesa} from "../../despesa/modelo/despesa.model";
import {FiltroResumoMensal, ResumoMensalModel} from "../modelo/resumo-mensal.model";
import {navegacaoDespesa, navegacaoResumoMensal} from "../../../servico/navegacao-despesa.service";
import {FaturaModel, FiltroParametrosFatura} from "../../fatura/modelo/fatura.model";
import {ResumoMensalApiService} from "../servico/resumo-mensal-api.service";
import {getMesAnoAtual} from "../../../../shared/servico/function/valida-formulario.service";
import {FaturaApiService} from "../../fatura/servico/fatura.service";

@Component({
  selector: 'app-resumo-mensal-lista',
  templateUrl: 'resumo-mensal-lista.component.html',
  styleUrls: ['resumo-mensal-lista.component.scss']
})
export class ResumoMensalListaComponent implements OnInit {
  nomePagina = navegacaoResumoMensal.label
  filtroBuscaAvancada: FiltroResumoMensal = {};

  itensResumoMensal: ResumoMensalModel[] = [];

  uiState: Record<string, {
    expandido: boolean;
    carregando: boolean;
    parcelas?: FaturaModel[];
  }> = {};

  constructor(
    private resumoMensalApiService: ResumoMensalApiService,
    private faturaApiService: FaturaApiService
  ) {
  }

  ngOnInit() {
    if (this.filtroBuscaAvancada.referenciaCobranca == null) {
      this.filtroBuscaAvancada.referenciaCobranca = getMesAnoAtual()
      this.filtrarResumo()
    }
  }

  filtrarResumo() {
    this.uiState = {};

    this.resumoMensalApiService.buscarResumoMensal(this.filtroBuscaAvancada).subscribe({
      next: (response: any) => {
        this.itensResumoMensal = response
      }
    })
  }

  // buscarDetalhesDoResumo(resumo: ResumoMensalModel[]) {
  //   resumo.map((item: ResumoMensalModel) => {
  //     let filtro = {
  //       referenciaCobranca: this.filtroBuscaAvancada.referenciaCobranca,
  //       responsavel: item.devedorId,
  //       responsavelConta: item.credorId
  //     } as FiltroParametrosFatura
  //     this.faturaApiService.buscarParcelas(filtro).subscribe({
  //       next: (response: FaturaModel[]) => {
  //         console.log('RESPONSE', response)
  //       }
  //     })
  //   })
  // }

  public getKey(item: ResumoMensalModel): string {
    return `${item.devedorId}-${item.credorId}`;
  }

  toggleDetalhe(item: ResumoMensalModel) {
    const key = this.getKey(item);

    if (!this.uiState[key]) {
      this.uiState[key] = {
        expandido: false,
        carregando: false
      };
    }

    const state = this.uiState[key];
    state.expandido = !state.expandido;

    if (state.expandido && !state.parcelas) {
      state.carregando = true;

      const filtro = {
        referenciaCobranca: this.filtroBuscaAvancada.referenciaCobranca,
        responsavel: item.devedorId,
        responsavelConta: item.credorId
      } as FiltroParametrosFatura;

      this.faturaApiService.buscarParcelas(filtro).subscribe({
        next: (response: any) => {
          state.parcelas = response.parcelas;
          state.carregando = false;
        },
        error: () => {
          state.carregando = false;
        }
      });
    }
  }
}
