import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FiltroParametrosResponsavel, ItemListaResponsavel } from "../modelo/responsavel.model";
import { ResponsavelApiService } from "../servico/responsavel-api.service";
import { navegacaoResponsavel, navegacaoResponsavelEditarCadastro, navegacaoResponsavelNovoCadastro } from "../../../servico/navegacao-cadastro.service";
import { MensagemNotificacao } from "../../../../shared/mensagem/notificacao-msg.service";
import { Message } from "primeng/api";

@Component({
  selector: 'app-responsavel-lista',
  templateUrl: './responsavel-lista.component.html',
  styleUrls: ['./responsavel-lista.component.scss']
})
export class ResponsavelListaComponent implements OnInit{
  itensResponsaveis: ItemListaResponsavel[]  = [];
  nomePagina = navegacaoResponsavel.label
  notificacao: Message[] =[]
  pesquisar = '';
  filtroBuscaAvancada: FiltroParametrosResponsavel = {};
  mostrarBuscaAvancada = false;
  opcoesBanco: any[] = [];
  opcoesResponsavel: any[] = [];

  paginacao = {
    page: 0,
    size: 20
  }

  constructor(
    private router: Router,
    private responsavelApiService: ResponsavelApiService
  ){}

  ngOnInit(): void {
    this.buscarDadosResponsaveis()
  }

  navegarNovoFormulario() {
    this.router.navigate([navegacaoResponsavelNovoCadastro.link]);
  }

  buscarDadosResponsaveis(){
    let params = this.criarParamentrosBusca(this.pesquisar)
    this.responsavelApiService.buscarResponsaveis(params, this.paginacao.page, this.paginacao.size).subscribe({
      next: (response: any) => {
          this.itensResponsaveis = response
      },
      error: ({ error }) => {
        this.notificacao = new Array(MensagemNotificacao(error).erroAoListar);
      },
    })
  }

  criarParamentrosBusca(filtroSimples: string, filtroBuscaAvancada?: FiltroParametrosResponsavel){
    if(!filtroSimples && !filtroBuscaAvancada){
      return
    }

    return {
      nome: filtroSimples
    }
  }

  editItem(item: ItemListaResponsavel) {
    this.router.navigate([navegacaoResponsavelEditarCadastro(item.id).link])
  }

  removeItem(item: ItemListaResponsavel) {
    this.responsavelApiService.deletarResponsavel(item.id).subscribe({
      next: (responsavel: any) => {
        this.buscarDadosResponsaveis();
      },
      error: ({error}) => {
        this.notificacao = [MensagemNotificacao(error).erroAoListar];
      }
    })
  }
}
