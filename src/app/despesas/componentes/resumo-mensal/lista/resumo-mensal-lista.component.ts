import {Component, OnInit} from "@angular/core";
import {ItemListaDespesa} from "../../despesa/modelo/despesa.model";
import {FiltroResumoMensal, AcertoResponsavelModel, ObrigacaoFinanceiraModel} from "../modelo/acerto-responsavel.model";
import {navegacaoDespesa, navegacaoResumoMensal} from "../../../servico/navegacao-despesa.service";
import {FaturaModel, FiltroParametrosFatura} from "../../fatura/modelo/fatura.model";
import {ResumoMensalApiService} from "../servico/resumo-mensal-api.service";
import {getMesAnoAtual} from "../../../../shared/servico/function/valida-formulario.service";
import {FaturaApiService} from "../../fatura/servico/fatura.service";
import {ResponsavelApiService} from "../../../../cadastros/componentes/responsavel/servico/responsavel-api.service";
import {ResponsavelModel} from "../../../../cadastros/componentes/responsavel/modelo/responsavel.model";

type DetalheContexto = 'ACERTO_RESPONSAVEL' | 'OBRIGACAO_FINANCEIRA';

@Component({
  selector: 'app-resumo-mensal-lista',
  templateUrl: 'resumo-mensal-lista.component.html',
  styleUrls: ['resumo-mensal-lista.component.scss']
})
export class ResumoMensalListaComponent implements OnInit {
  nomePagina = navegacaoResumoMensal.label
  idResponsavelTitular: string | undefined;
  filtroBuscaAvancada: FiltroResumoMensal = {};
  totalEntradas: number = 0;
  totalSaidas: number = 0;
  subtotalObrigacoes = 0;
  subtotalAcertosPagar = 0;

  saidaExpandida: boolean = false;

  impactoFinal: number = 0;

  itensAcertoResponsaveis: AcertoResponsavelModel[] = [];
  itensObrigacoesFinanceiras: ObrigacaoFinanceiraModel[] = [];
  uiState: Record<string, {
    expandido: boolean;
    carregando: boolean;
    parcelas?: FaturaModel[];
  }> = {};

  constructor(
    private resumoMensalApiService: ResumoMensalApiService,
    private faturaApiService: FaturaApiService,
    private responsavelApiService: ResponsavelApiService,
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
        this.responsavelApiService.buscarResponsaveis({titular: true}).subscribe({
          next: (dados: ResponsavelModel[]) => {
            if (dados) {
              this.idResponsavelTitular = dados[0]?.id
            }

            this.atualizarTotalSaidas();
          },
          complete: () => {

          }
        })

      }
    })
  }

  atualizarTotalEntradas(){
    this.resumoMensalApiService.buscarAcertoResponsaveis(this.filtroBuscaAvancada).subscribe({
      next: (response: any) => {
        this.itensAcertoResponsaveis = response
        this.totalEntradas = this.itensAcertoResponsaveis
          .filter(i => i.credorId === this.idResponsavelTitular)
          .reduce((acc, i) => acc + Number(i.valor), 0);
      },
      complete: () => {
        this.atualizarImpactoTotal(this.totalEntradas, this.totalSaidas);
      }
    })
  }

  atualizarTotalSaidas(){
    this.resumoMensalApiService.buscarObrigacoesFinanceiras(this.filtroBuscaAvancada).subscribe({
      next: (response: any) => {
        this.itensObrigacoesFinanceiras = response

        this.subtotalAcertosPagar = this.itensAcertoResponsaveis
          .filter(i => i.devedorId === this.idResponsavelTitular)
          .reduce((acc, i) => acc + Number(i.valor), 0);

        this.subtotalObrigacoes = this.itensObrigacoesFinanceiras
          .reduce((acc, i) => acc + Number(i.valorTotal), 0);

        this.totalSaidas = this.subtotalAcertosPagar + this.subtotalObrigacoes;
      },
      complete: () => {
        this.atualizarTotalEntradas();
      }
    })
  }

  atualizarImpactoTotal(totalEntradas: number, totalSaidas: number) {
    this.impactoFinal = totalEntradas - totalSaidas;
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
