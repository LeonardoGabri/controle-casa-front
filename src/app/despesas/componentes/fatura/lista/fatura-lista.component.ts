import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';

import { ResponsavelApiService } from '../../../../cadastros/componentes/responsavel/servico/responsavel-api.service';
import { opcoesSituacao } from '../../../../shared/enum/situacao.enum';
import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import {
  navegacaoParcela,
  navegacaoParcelaEditarCadastro,
  navegacaoParcelaNovoCadastro,
} from '../../../servico/navegacao-despesa.service';
import { FiltroParametrosFatura, ItemListaFatura } from '../modelo/fatura.model';
import { FaturaApiService } from '../servico/fatura.service';
import { NotificationService } from '../../../../shared/mensagem/notification.service';

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
  opcoesSituacao: any[] = opcoesSituacao;
  opcoesResponsavel: any[] = [];

  nomePagina = navegacaoParcela.label
  paginacao = {
    page: 0,
    size: 20
  }

  constructor(
    private router: Router,
    private faturaApiService: FaturaApiService,
    private responsavelApiService: ResponsavelApiService,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.carregarOpcoesResponsavel()

    this.buscarDadosDespesa()
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
    this.fecharBuscaAvancada();
  }


  editItem(item: ItemListaFatura) {
    this.router.navigate([navegacaoParcelaEditarCadastro(item.id).link])
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
}
