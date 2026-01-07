import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {ResponsavelApiService} from '../../../../cadastros/componentes/responsavel/servico/responsavel-api.service';
import {MensagemNotificacao} from '../../../../shared/mensagem/notificacao-msg.service';
import {
  navegacaoDespesaEditarCadastro,
  navegacaoParcela,
  navegacaoParcelaNovoCadastro,
} from '../../../servico/navegacao-despesa.service';
import {FiltroParametrosFatura, ItemListaFatura, ResumoParcelaPorResponsavel} from '../modelo/fatura.model';
import {FaturaApiService} from '../servico/fatura.service';
import {NotificationService} from '../../../../shared/mensagem/notification.service';
import {ContaApiService} from "../../../../cadastros/componentes/conta/servico/conta-api.service";

@Component({
  selector: 'app-fatura-lista',
  templateUrl: './fatura-lista.component.html',
  styleUrls: ['./fatura-lista.component.scss']
})
export class FaturaListaComponent implements OnInit{
  iteansParcelas: ItemListaFatura[]  = [];
  valorTotal: number = 0.00
  pesquisar = '';
  filtroBuscaAvancada: FiltroParametrosFatura = {};
  mostrarBuscaAvancada = false;
  opcoesResponsavel: any[] = [];
  opcoesConta: any[] = [];
  resumoPorResponsavel: ResumoParcelaPorResponsavel[] = [];

  nomePagina = navegacaoParcela.label
  paginacao = {
    page: 0,
    size: 20
  }

  constructor(
    private router: Router,
    private faturaApiService: FaturaApiService,
    private responsavelApiService: ResponsavelApiService,
    private notificationService: NotificationService,
    private contaApiService: ContaApiService,
  ){}

  ngOnInit(): void {
    this.carregarOpcoesResponsavel()
    this.carregarOpcoesConta();

    this.buscarDadosDespesa()
    this.buscarResumoParcelaPorResponsavel()
  }

  navegarNovoFormulario() {
    this.router.navigate([navegacaoParcelaNovoCadastro.link]);
  }

  buscarDadosDespesa(){
    let params = this.criarParamentrosBusca(this.pesquisar, this.filtroBuscaAvancada)
    this.faturaApiService.buscarParcelas(params, this.paginacao.page, this.paginacao.size).subscribe({
      next: (response: any) => {
          this.iteansParcelas = response.parcelas
          this.valorTotal = response.valorTotal
      },
      error: ({ error }) => {
        this.notificationService.error(MensagemNotificacao(error).erroAoListar.detail)
      },
    })
  }

  abrirBuscaAvancada() {
    this.mostrarBuscaAvancada = true;
  }

  fecharBuscaAvancada() {
    this.mostrarBuscaAvancada = false;
  }

  aplicarBuscaAvancada() {
    console.log("Filtros avançados aplicados:", this.filtroBuscaAvancada);
    this.buscarDadosDespesa()
    this.buscarResumoParcelaPorResponsavel();
    this.fecharBuscaAvancada();
  }


  editItem(item: ItemListaFatura) {
    this.router.navigate([navegacaoDespesaEditarCadastro(item.despesaId, item.id).link])
  }

  removeItem(item: ItemListaFatura) {
    this.faturaApiService.deletarParcela(item.id).subscribe({
      next: (response: any) => {
          this.buscarDadosDespesa()
          this.notificationService.success(MensagemNotificacao().deletarRegistro.summary)
        },
      error: ({ error }) => {
        this.notificationService.error(MensagemNotificacao(error).erroAoDeletar.detail)
      },
    })
  }

  criarParamentrosBusca(filtroSimples: string, filtroBuscaAvancada?: FiltroParametrosFatura){
    if(!filtroSimples && !filtroBuscaAvancada){
      return
    }

    return {
      responsavel: filtroBuscaAvancada?.responsavel,
      referenciaCobranca: filtroBuscaAvancada?.referenciaCobranca,
      contaId: filtroBuscaAvancada?.contaId
    }
  }

  carregarOpcoesResponsavel() {
    this.responsavelApiService.buscarResponsaveis().subscribe({
      next: (dados: any) => {
        this.opcoesResponsavel = dados.map((item: any) => ({
          label: `${item.nome}`,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de responsavel', err)
    });
  }

  carregarOpcoesConta() {
    this.contaApiService.buscarContas().subscribe({
      next: (dados: any) => {
        this.opcoesConta = dados.map((item: any) => ({
          label: `${item.responsavel} - ${item.nome}`,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de contas', err)
    });
  }

  buscarResumoParcelaPorResponsavel(){
    let params = this.criarParamentrosBusca(this.pesquisar, this.filtroBuscaAvancada)
    this.faturaApiService.buscarResumoParcelaPorResponsavel(params).subscribe({
      next: (response: any) => {
        this.resumoPorResponsavel = response
      }
    })
  }
}
