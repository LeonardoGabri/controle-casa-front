import {Component, OnInit} from "@angular/core";
import {ItemListaDespesa} from "../../despesa/modelo/despesa.model";
import {FiltroResumoMensal, AcertoResponsavelModel, ObrigacaoFinanceiraModel} from "../modelo/acerto-responsavel.model";
import {navegacaoDespesa, navegacaoResumoMensal} from "../../../servico/navegacao-despesa.service";
import {FaturaModel, FiltroParametrosFatura} from "../../fatura/modelo/fatura.model";
import {ResumoMensalApiService} from "../servico/resumo-mensal-api.service";
import {getMesAnoAtual} from "../../../../shared/servico/function/valida-formulario.service";
import {FaturaApiService} from "../../fatura/servico/fatura.service";

type DetalheContexto = 'ACERTO_RESPONSAVEL' | 'OBRIGACAO_FINANCEIRA';

@Component({
  selector: 'app-resumo-mensal-lista',
  templateUrl: 'resumo-mensal-lista.component.html',
  styleUrls: ['resumo-mensal-lista.component.scss']
})
export class ResumoMensalListaComponent implements OnInit {
  nomePagina = navegacaoResumoMensal.label
  filtroBuscaAvancada: FiltroResumoMensal = {};

  itensAcertoResponsaveis: AcertoResponsavelModel[] = [];
  itensObrigacoesFinanceiras: ObrigacaoFinanceiraModel[] = [];
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

    this.resumoMensalApiService.buscarAcertoResponsaveis(this.filtroBuscaAvancada).subscribe({
      next: (response: any) => {
        this.itensAcertoResponsaveis = response
      }
    })

    this.resumoMensalApiService.buscarObrigacoesFinanceiras(this.filtroBuscaAvancada).subscribe({
      next: (response: any) => {
        this.itensObrigacoesFinanceiras = response
      }
    })
  }

  getKey(item: any, contexto: DetalheContexto): string {
    if (contexto === 'ACERTO_RESPONSAVEL') {
      return `ACERTO-${item.devedorId}-${item.credorId}`;
    }

    return `OBRIGACAO-${item.contaId}`;
  }

  toggleDetalhe(
    item: any,
    contexto: DetalheContexto
  ) {
    const key = this.getKey(item, contexto);

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

      const filtro = this.montarFiltroParcelas(item, contexto);

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

  private montarFiltroParcelas(
    item: any,
    contexto: DetalheContexto
  ): FiltroParametrosFatura {

    const base = {
      referenciaCobranca: this.filtroBuscaAvancada.referenciaCobranca
    } as FiltroParametrosFatura;

    if (contexto === 'ACERTO_RESPONSAVEL') {
      return {
        ...base,
        responsavel: item.devedorId,
        responsavelConta: item.credorId
      };
    }

    if (contexto === 'OBRIGACAO_FINANCEIRA') {
      return {
        ...base,
        contaId: item.contaId
      };
    }

    return base;
  }
}
