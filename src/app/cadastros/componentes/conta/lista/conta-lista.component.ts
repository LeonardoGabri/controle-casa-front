import { ContaApiService } from './../servico/conta-api.service';
import { Component, OnInit } from "@angular/core";
import { Route, Router } from "@angular/router";
import { FiltroParametrosConta, ItemListaConta } from "../modelo/conta.model";
import { BancoApiService } from '../../banco/servico/banco-api.service';
import { navegacaoConta, navegacaoContaEditarCadastro, navegacaoContaNovoCadastro } from '../../../servico/navegacao-cadastro.service';
import { ResponsavelApiService } from '../../responsavel/servico/responsavel-api.service';
import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import { Message } from 'primeng/api';
import { NotificationService } from '../../../../shared/servico/notification.service';

@Component({
  selector: 'app-conta-lista',
  templateUrl: './conta-lista-component.html',
  styleUrls: ['./conta-lista.component.scss']
})
export class ContaListaComponent implements OnInit{
  itensConta: ItemListaConta[]  = [];
  nomePagina = navegacaoConta.label
  notificacao: Message[] =[]
  pesquisar = '';
  filtroBuscaAvancada: FiltroParametrosConta = {};
  mostrarBuscaAvancada = false;
  opcoesBanco: any[] = [];
  opcoesResponsavel: any[] = [];

  paginacao = {
    page: 0,
    size: 20
  }

  constructor(
    private router: Router,
    private contaApiService: ContaApiService,
    private bancoApiService: BancoApiService,
    private responsavelApiService: ResponsavelApiService,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.notificacao = this.notificationService.getMessages();
    this.notificationService.clearMessages();

    this.carregarOpcoesBanco();
    this.carregarOpcoesResponsavel();

    this.buscarDadosConta()
  }

  navegarNovoFormulario() {
    this.router.navigate([navegacaoContaNovoCadastro.link]);
  }

  buscarDadosConta(){
    let params = this.criarParamentrosBusca(this.pesquisar, this.filtroBuscaAvancada)
    this.contaApiService.buscarContas(params, this.paginacao.page, this.paginacao.size).subscribe({
      next: (response: any) => {
          this.itensConta = response
      },
      error: ({ error }) => {
        this.notificacao = new Array(MensagemNotificacao(error).erroAoListar);
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
    this.buscarDadosConta()
    this.fecharBuscaAvancada();
  }


  editItem(item: ItemListaConta) {
    this.router.navigate([navegacaoContaEditarCadastro(item.id).link])
  }

  removeItem(item: ItemListaConta) {
    this.contaApiService.deletarConta(item.id).subscribe({
      next: (dados: any) => {
        this.buscarDadosConta()
        this.notificacao = new Array(MensagemNotificacao().deletarRegistro);

      },
      error: (err) => {
        this.notificacao = new Array(MensagemNotificacao(err).erroAoDeletar);
      }
    });
  }

  carregarOpcoesBanco() {
    this.bancoApiService.buscarBancos().subscribe({
      next: (dados: any) => {
        this.opcoesBanco = dados.map((item: any) => ({
          label: item.nome,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de bancos', err)
    });
  }

  carregarOpcoesResponsavel() {
    this.responsavelApiService.buscarResponsaveis().subscribe({
      next: (dados: any) => {
        this.opcoesResponsavel = dados.map((item: any) => ({
          label: item.nome,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de responsáveis', err)
    });
  }

  criarParamentrosBusca(filtroSimples: string, filtroBuscaAvancada?: FiltroParametrosConta){
    if(!filtroSimples && !filtroBuscaAvancada){
      return
    }

    return {
      responsavel: filtroBuscaAvancada?.responsavel,
      banco: filtroBuscaAvancada?.banco
    }
  }
}
