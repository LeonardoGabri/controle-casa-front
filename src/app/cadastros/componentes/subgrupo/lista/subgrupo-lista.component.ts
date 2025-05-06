import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import { NotificationService } from '../../../../shared/servico/notification.service';
import { navegacaoSubgrupo, navegacaoSubgrupoEditarCadastro, navegacaoSubgrupoNovoCadastro } from '../../../servico/navegacao-cadastro.service';
import { FiltroParametrosGrupo } from '../../grupo/modelo/grupo.model';
import { FiltroParametrosSubgrupo, ItemListaSubgrupo } from '../modelo/subgrupo.model';
import { SubgrupoApiService } from '../servico/subgrupo-api.service';

@Component({
  selector: 'app-subgrupo-lista',
  templateUrl: './subgrupo-lista.component.html',
  styleUrls: ['./subgrupo-lista.component.scss']
})
export class SubgrupoListaComponent implements OnInit{
  itensSubgrupo: ItemListaSubgrupo[]  = [];
  notificacao: Message[] =[]
  pesquisar = '';
  filtroBuscaAvancada: FiltroParametrosSubgrupo = {};
  mostrarBuscaAvancada = false;
  opcoesBanco: any[] = [];
  opcoesResponsavel: any[] = [];
  nomePagina = navegacaoSubgrupo.label
  paginacao = {
    page: 0,
    size: 20
  }

  constructor(
    private router: Router,
    private subgrupoApiService: SubgrupoApiService,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.notificacao = this.notificationService.getMessages();
    this.notificationService.clearMessages();

    this.buscarDadosGrupo()
  }

  navegarNovoFormulario() {
    this.router.navigate([navegacaoSubgrupoNovoCadastro.link]);
  }

  buscarDadosGrupo(){
    let params = this.criarParamentrosBusca(this.pesquisar, this.filtroBuscaAvancada)
    this.subgrupoApiService.buscarSubgrupos(params, this.paginacao.page, this.paginacao.size).subscribe({
      next: (response: any) => {
          this.itensSubgrupo = response
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


  editItem(item: ItemListaSubgrupo) {
    this.router.navigate([navegacaoSubgrupoEditarCadastro(item.id).link])
  }

  removeItem(item: ItemListaSubgrupo) {
    this.subgrupoApiService.deletarSubgrupo(item.id).subscribe({
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
