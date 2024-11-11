import { ContaApiService } from './../servico/conta-api.service';
import { Component, OnInit } from "@angular/core";
import { Route, Router } from "@angular/router";
import { FiltroParametrosConta, ItemListaConta } from "../modelo/conta.model";
import { BancoApiService } from '../../banco/servico/banco-api.service';

@Component({
  selector: 'app-conta-lista',
  templateUrl: './conta-lista-component.html',
  styleUrls: ['./conta-lista.component.scss']
})
export class ContaListaComponent implements OnInit{
  itensConta: ItemListaConta[]  = [];
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
    private bancoApiService: BancoApiService
  ){}

  ngOnInit(): void {
    this.carregarOpcoesBanco();
    this.carregarOpcoesResponsavel();
  }

  navegarNovoFormulario() {
    this.router.navigate(['/caminho-do-formulario-de-conta']);
  }

  buscarDadosConta(){

  }

  abrirBuscaAvancada() {
    this.mostrarBuscaAvancada = true;
  }

  fecharBuscaAvancada() {
    this.mostrarBuscaAvancada = false;
  }

  aplicarBuscaAvancada() {
    // Adicione aqui a lógica para aplicar os filtros avançados
    console.log("Filtros avançados aplicados:", this.filtroBuscaAvancada);
    this.fecharBuscaAvancada();
  }


  editItem(item: ItemListaConta) {
    console.log('Editando', item);
  }

  removeItem(item: ItemListaConta) {
    console.log('Removendo', item);
  }

  carregarOpcoesBanco() {
    this.bancoApiService.buscarBancos().subscribe({
      next: (dados: any) => {
        debugger
        this.opcoesBanco = dados.map((item: any) => ({
          label: item.nome, // Ajuste conforme a estrutura do dado
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de bancos', err)
    });
  }

  carregarOpcoesResponsavel() {
    this.contaApiService.buscarContas().subscribe({
      next: (dados: any) => {
        this.opcoesResponsavel = dados.map((item: any) => ({
          label: item.nome, // Ajuste conforme a estrutura do dado
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de responsáveis', err)
    });
  }
}
