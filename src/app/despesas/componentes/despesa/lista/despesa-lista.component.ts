import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

import { ContaApiService } from '../../../../cadastros/componentes/conta/servico/conta-api.service';
import { SubgrupoApiService } from '../../../../cadastros/componentes/subgrupo/servico/subgrupo-api.service';
import { opcoesSituacao } from '../../../../shared/enum/situacao.enum';
import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import {
  navegacaoDespesa,
  navegacaoDespesaEditarCadastro,
  navegacaoDespesaNovoCadastro,
} from '../../../servico/navegacao-despesa.service';
import { FiltroParametrosDespesa, ItemListaDespesa } from '../modelo/despesa.model';
import { DespesaApiService } from '../servico/despesa-api.service';
import { FornecedorApiService } from './../../../../cadastros/componentes/fornecedor/servico/fornecedor-api.service';
import { NotificationService } from '../../../../shared/mensagem/notification.service';

@Component({
  selector: 'app-despesa-lista',
  templateUrl: './despesa-lista.component.html',
  styleUrls: ['./despesa-lista.component.scss']
})
export class DespesaListaComponent implements OnInit{
  itensDespesa: ItemListaDespesa[]  = [];
  pesquisar = '';
  filtroBuscaAvancada: FiltroParametrosDespesa = {};
  mostrarBuscaAvancada = false;
  opcoesConta: any[] = [];
  opcoesFornecedor: any[] = [];
  opcoesSubgrupo: any[] = [];
  opcoesSituacao: any[] = opcoesSituacao;

  nomePagina = navegacaoDespesa.label
  paginacao = {
    page: 0,
    size: 20
  }

  constructor(
    private router: Router,
    private despesaApiService: DespesaApiService,
    private fornecedorApiService: FornecedorApiService,
    private contaApiService: ContaApiService,
    private subgrupoApiService: SubgrupoApiService,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.carregarOpcoesConta()
    this.carregarOpcoesFornecedor()
    this.carregarOpcoesSubgrupo()

    this.buscarDadosDespesa()
  }

  navegarNovoFormulario() {
    this.router.navigate([navegacaoDespesaNovoCadastro.link]);
  }

  buscarDadosDespesa(){
    let params = this.criarParamentrosBusca(this.pesquisar, this.filtroBuscaAvancada)
    this.despesaApiService.buscarDespesas(params, this.paginacao.page, this.paginacao.size).subscribe({
      next: (response: any) => {
          this.itensDespesa = response
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
    this.fecharBuscaAvancada();
  }


  editItem(item: ItemListaDespesa) {
    this.router.navigate([navegacaoDespesaEditarCadastro(item.id, undefined).link])
  }

  removeItem(item: ItemListaDespesa) {
    this.despesaApiService.deletarDespesa(item.id).subscribe({
      next: (response: any) => {
          this.buscarDadosDespesa()
          this.notificationService.success(MensagemNotificacao().deletarRegistro.summary)
        },
      error: ({ error }) => {
        this.notificationService.error(MensagemNotificacao(error).erroAoDeletar.detail)
      },
    })
  }

  criarParamentrosBusca(filtroSimples: string, filtroBuscaAvancada?: FiltroParametrosDespesa){
    if(!filtroSimples && !filtroBuscaAvancada){
      return
    }

    return {
      fornecedor: filtroBuscaAvancada?.fornecedor,
      conta: filtroBuscaAvancada?.conta,
      subgrupo: filtroBuscaAvancada?.subgrupo,
    }
  }

  carregarOpcoesSubgrupo() {
    this.subgrupoApiService.buscarSubgrupos().subscribe({
      next: (dados: any) => {
        this.opcoesSubgrupo = dados.map((item: any) => ({
          label: item.nome,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de grupos', err)
    });
  }

  carregarOpcoesFornecedor() {
    this.fornecedorApiService.buscarFornecedores().subscribe({
      next: (dados: any) => {
        this.opcoesFornecedor = dados.map((item: any) => ({
          label: item.nome,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de fornecedores', err)
    });
  }

  carregarOpcoesConta() {
    this.contaApiService.buscarContas().subscribe({
      next: (dados: any) => {
        this.opcoesConta = dados.map((item: any) => ({
          label: `${item.nome} - ${item.responsavel}`,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de contas', err)
    });
  }
}
