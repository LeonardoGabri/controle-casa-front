import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import {
  navegacaoFornecedor,
  navegacaoFornecedorEditarCadastro,
  navegacaoFornecedorNovoCadastro,
} from '../../../servico/navegacao-cadastro.service';
import { FiltroParametrosFornecedor, ItemListaFornecedor } from '../modelo/fornecedor.model';
import { FornecedorApiService } from '../servico/fornecedor-api.service';
import { SubgrupoApiService } from '../../subgrupo/servico/subgrupo-api.service';
import { NotificationService } from '../../../../shared/mensagem/notification.service';

@Component({
  selector: 'app-fornecedor-lista',
  templateUrl: './fornecedor-lista.component.html',
  styleUrls: ['./fornecedor-lista.component.scss']
})
export class FornecedorListaComponent implements OnInit{
  itensConta: ItemListaFornecedor[]  = [];
  nomePagina = navegacaoFornecedor.label
  pesquisar = '';
  filtroBuscaAvancada: FiltroParametrosFornecedor = {};
  mostrarBuscaAvancada = false;
  opcoesSubgrupo: any[] = [];

  paginacao = {
    page: 0,
    size: 20
  }

  constructor(
    private router: Router,
    private subgrupoApiService: SubgrupoApiService,
    private fornecedorApiService: FornecedorApiService,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.carregarOpcoesGrupo();

    this.buscarDadosFornecedor()
  }

  navegarNovoFormulario() {
    this.router.navigate([navegacaoFornecedorNovoCadastro.link]);
  }

  buscarDadosFornecedor(){
    let params = this.criarParamentrosBusca(this.pesquisar, this.filtroBuscaAvancada)
    this.fornecedorApiService.buscarFornecedores(params, this.paginacao.page, this.paginacao.size).subscribe({
      next: (response: any) => {
          this.itensConta = response
      },
      error: ({ error }) => {
        this.notificationService.error(MensagemNotificacao(error).erroAoBuscarRegistro.detail)
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
    this.buscarDadosFornecedor()
    this.fecharBuscaAvancada();
  }


  editItem(item: ItemListaFornecedor) {
    this.router.navigate([navegacaoFornecedorEditarCadastro(item.id).link])
  }

  removeItem(item: ItemListaFornecedor) {
    this.fornecedorApiService.deletarFornecedor(item.id).subscribe({
      next: (dados: any) => {
        this.buscarDadosFornecedor()
        this.notificationService.success(MensagemNotificacao().deletarRegistro.summary)

      },
      error: (err) => {
        this.notificationService.error(MensagemNotificacao(err).erroAoDeletar.detail)
      }
    });
  }

  carregarOpcoesGrupo() {
    this.subgrupoApiService.buscarSubgrupos().subscribe({
      next: (dados: any) => {
        this.opcoesSubgrupo = dados.map((item: any) => ({
          label: item.nome,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de bancos', err)
    });
  }

  criarParamentrosBusca(filtroSimples: string, filtroBuscaAvancada?: FiltroParametrosFornecedor){
    if(!filtroSimples && !filtroBuscaAvancada){
      return
    }

    return {
      nome: filtroBuscaAvancada?.nome,
      grupoId: filtroBuscaAvancada?.subgrupo
    }
  }
}
