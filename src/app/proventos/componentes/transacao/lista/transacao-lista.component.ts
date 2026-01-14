import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {FiltroParametrosPatrimonio, ItemListaPatrimonio} from "../../patrimonio/modelo/patrimonio.model";
import {
  navegacaoTransacao,
  navegacaoTransacaoEditarCadastro,
  navegacaoTransacaoNovoCadastro
} from "../../../servico/navegacao-proventos.service";
import {Router} from "@angular/router";
import {ContaApiService} from "../../../../cadastros/componentes/conta/servico/conta-api.service";
import {NotificationService} from "../../../../shared/mensagem/notification.service";
import {PatrimonioApiService} from "../../patrimonio/servico/patrimonio-api.service";
import {TransacaoApiService} from "../servico/transacao-api.service";
import {MensagemNotificacao} from "../../../../shared/mensagem/notificacao-msg.service";
import {FiltroParametrosTransacao, ItemListaTransacao} from "../modelo/transacao.model";

@Component({
  selector: 'app-transacao-lista',
  templateUrl: './transacao-lista.component.html',
  styleUrls: ['./transacao-lista.component.scss']
  })
export class TransacaoListaComponent implements OnInit, OnChanges{
  @Input() patrimonioId?: string;
  itensTransacoes: ItemListaTransacao[] = [];
  pesquisar = '';
  filtroBuscaAvancada: FiltroParametrosTransacao = {};
  mostrarBuscaAvancada = false;
  opcoesPatrimonio: any[] = [];
  opcoesTipoTransacao: any[] = [
    {label: 'Entrada', value: 'ENTRADA'},
    {label: 'Saída', value: 'SAIDA'},
    {label: 'Transferência', value: 'TRANSFERENCIA'},
  ];
  nomePagina = navegacaoTransacao.label
  labelButtonNovo = navegacaoTransacaoNovoCadastro.label

  paginacao = {
    page: 0,
    size: 20
  }

  constructor(
    private router: Router,
    private contaApiService: ContaApiService,
    private notificationService: NotificationService,
    private transacaoApiService: TransacaoApiService,
    private patrimonioApiService: PatrimonioApiService,
  ) {}


  ngOnInit() {
    this.carregarOpcoesPatrimonio()
    this.buscarDadosTransacoes()
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['patrimonioId'] && changes['patrimonioId'].currentValue !== changes['patrimonioId'].previousValue){
      this.filtroBuscaAvancada.patrimonio = changes['patrimonioId'].currentValue;
      this.aplicarBuscaAvancada()
    }
  }

  navegarNovoFormulario() {
    this.router.navigate([navegacaoTransacaoNovoCadastro.link]);
  }

  buscarDadosTransacoes(){
    let params = this.criarParamentrosBusca(this.pesquisar, this.filtroBuscaAvancada)
    this.transacaoApiService.buscarTransacoes(params, this.paginacao.page, this.paginacao.size).subscribe({
      next: (response: any) => {
        this.itensTransacoes = response
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
    this.buscarDadosTransacoes()
    this.fecharBuscaAvancada();
  }

  criarParamentrosBusca(filtroSimples: string, filtroBuscaAvancada?: FiltroParametrosTransacao){
    if(!filtroSimples && !filtroBuscaAvancada){
      return
    }

    return {
      patrimonio: filtroBuscaAvancada?.patrimonio,
      tipo: filtroBuscaAvancada?.tipo,
    }
  }

  editItem(item: ItemListaPatrimonio) {
    this.router.navigate([navegacaoTransacaoEditarCadastro(item.id).link])
  }


  removeItem(item: ItemListaPatrimonio) {
    this.transacaoApiService.deletarTransacao(item.id).subscribe({
      next: (response: any) => {
        this.buscarDadosTransacoes()
        this.notificationService.success(MensagemNotificacao().deletarRegistro.summary)
      },
      error: ({ error }) => {
        this.notificationService.error(MensagemNotificacao(error).erroAoDeletar.detail)
      },
    })
  }

  carregarOpcoesPatrimonio() {
    this.patrimonioApiService.buscarPatrimonios().subscribe({
      next: (dados: any) => {
        this.opcoesPatrimonio = dados.map((item: any) => ({
          label: `${item.conta.banco.nome} - ${item.tipo}${item.descricao ? ' - ' + item.descricao : ''}${item.moeda ? ' - ' + item.moeda : ''}`,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de contas', err)
    });
  }
}
