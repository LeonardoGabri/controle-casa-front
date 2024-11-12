import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import {
  navegacaoFornecedor,
  navegacaoFornecedorEditarCadastro,
  navegacaoFornecedorNovoCadastro,
} from '../../../servico/navegacao-cadastro.service';
import { GrupoApiService } from '../../grupo/servico/grupo-api.service';
import { FiltroParametrosFornecedor, ItemListaFornecedor } from '../modelo/fornecedor.model';
import { FornecedorApiService } from '../servico/fornecedor-api.service';

@Component({
  selector: 'app-fornecedor-lista',
  templateUrl: './fornecedor-lista.component.html',
  styleUrls: ['./fornecedor-lista.component.scss']
})
export class FornecedorListaComponent implements OnInit{
  itensConta: ItemListaFornecedor[]  = [];
  nomePagina = navegacaoFornecedor.label
  notificacao: Message[] =[]
  pesquisar = '';
  filtroBuscaAvancada: FiltroParametrosFornecedor = {};
  mostrarBuscaAvancada = false;
  opcoesGrupo: any[] = [];

  paginacao = {
    page: 0,
    size: 20
  }

  constructor(
    private router: Router,
    private grupoApiService: GrupoApiService,
    private fornecedorApiService: FornecedorApiService
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
        this.notificacao = new Array(MensagemNotificacao().deletarRegistro);

      },
      error: (err) => {
        this.notificacao = new Array(MensagemNotificacao(err).erroAoDeletar);
      }
    });
  }

  carregarOpcoesGrupo() {
    this.grupoApiService.buscarGrupos().subscribe({
      next: (dados: any) => {
        this.opcoesGrupo = dados.map((item: any) => ({
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
      grupoId: filtroBuscaAvancada?.grupoId
    }
  }
}
