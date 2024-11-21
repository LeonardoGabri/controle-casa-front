import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import { navegacaoGrupo, navegacaoGrupoEditarCadastro, navegacaoGrupoNovoCadastro } from '../../../servico/navegacao-cadastro.service';
import { FiltroParametrosGrupo, ItemListaGrupo } from '../modelo/grupo.model';
import { GrupoApiService } from './../servico/grupo-api.service';
import { NotificationService } from '../../../../shared/servico/notification.service';

@Component({
  selector: 'app-grupo-lista',
  templateUrl: './grupo-lista.component.html',
  styleUrls: ['./grupo-lista.component.scss']
})
export class GrupoListaComponent implements OnInit{
  itensGrupo: ItemListaGrupo[]  = [];
  notificacao: Message[] =[]
  pesquisar = '';
  filtroBuscaAvancada: FiltroParametrosGrupo = {};
  mostrarBuscaAvancada = false;
  opcoesBanco: any[] = [];
  opcoesResponsavel: any[] = [];
  nomePagina = navegacaoGrupo.label
  paginacao = {
    page: 0,
    size: 20
  }

  constructor(
    private router: Router,
    private grupoApiService: GrupoApiService,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.notificacao = this.notificationService.getMessages();
    this.notificationService.clearMessages();

    this.buscarDadosGrupo()
  }

  navegarNovoFormulario() {
    this.router.navigate([navegacaoGrupoNovoCadastro.link]);
  }

  buscarDadosGrupo(){
    let params = this.criarParamentrosBusca(this.pesquisar, this.filtroBuscaAvancada)
    this.grupoApiService.buscarGrupos(params, this.paginacao.page, this.paginacao.size).subscribe({
      next: (response: any) => {
          this.itensGrupo = response
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
    this.buscarDadosGrupo()
    this.fecharBuscaAvancada();
  }


  editItem(item: ItemListaGrupo) {
    this.router.navigate([navegacaoGrupoEditarCadastro(item.id).link])
  }

  removeItem(item: ItemListaGrupo) {
    this.grupoApiService.deletarGrupo(item.id).subscribe({
      next: (response: any) => {
          this.buscarDadosGrupo()
          this.notificacao = new Array(MensagemNotificacao().deletarRegistro);
      },
      error: ({ error }) => {
        this.notificacao = new Array(MensagemNotificacao(error).erroAoDeletar);
      },
    })
  }

  criarParamentrosBusca(filtroSimples: string, filtroBuscaAvancada?: FiltroParametrosGrupo){
    if(!filtroSimples && !filtroBuscaAvancada){
      return
    }

    return {
      nome: filtroSimples
    }
  }
}
