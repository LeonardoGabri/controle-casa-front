import {Component, OnInit, ViewChild} from "@angular/core";
import {BancoPatrimonioView, FiltroParametrosPatrimonio, ItemListaPatrimonio} from "../modelo/patrimonio.model";
import {
  navegacaoPatrimonio,
  navegacaoPatrimonioEditarCadastro,
  navegacaoPatrimonioNovoCadastro
} from "../../../servico/navegacao-proventos.service";
import {Router} from "@angular/router";
import {ContaApiService} from "../../../../cadastros/componentes/conta/servico/conta-api.service";
import {MensagemNotificacao} from "../../../../shared/mensagem/notificacao-msg.service";
import {NotificationService} from "../../../../shared/mensagem/notification.service";
import {PatrimonioApiService} from "../servico/patrimonio-api.service";
import {BinanceApiService} from "../../../../shared/servico/binance-api/binance-api.service";
import {CriptomoedaApiService} from "../../../../shared/servico/criptomoeda-api/criptomoeda-api.service";
import {CriptomoedaModel} from "../../../../shared/servico/modelo/criptomoeda.model";
import {TransacaoListaComponent} from "../../transacao/lista/transacao-lista.component";

@Component({
  selector: 'app-patrimonio-lista',
  templateUrl: './patrimonio-lista.component.html',
  styleUrls: ['./patrimonio-lista.component.scss'],
})
export class PatrimonioListaComponent implements OnInit {
  pesquisar = '';
  mostrarBuscaAvancada = false;
  patrimonioSelecionado: any | null = null;
  podeAtualizarCriptos = false;
  tooltipAtualizarCriptos = '';
  nomePagina = navegacaoPatrimonio.label
  totalPatrimonio = 0;
  filtroBuscaAvancada: FiltroParametrosPatrimonio = {};
  criptos : CriptomoedaModel[] = []
  patrimoniosPorBanco: BancoPatrimonioView[] = []
  opcoesConta: any[] = [];
  itensPatrimonio: ItemListaPatrimonio[] = [];
  paginacao = {
    page: 0,
    size: 20
  }

  constructor(
    private router: Router,
    private contaApiService: ContaApiService,
    private notificationService: NotificationService,
    private patrimonioApiService: PatrimonioApiService,
    private binanceApiService: BinanceApiService,
    private criptomoedaApiService: CriptomoedaApiService
  ) {
  }

  ngOnInit() {
    this.carregarOpcoesConta();
    this.buscarDadosPatrimonios()
    this.buscarCriptosSistema();
  }

  navegarNovoFormulario() {
    this.router.navigate([navegacaoPatrimonioNovoCadastro.link]);
  }


  buscarDadosPatrimonios() {
    let params = this.criarParamentrosBusca(this.pesquisar, this.filtroBuscaAvancada)
    this.patrimonioApiService.buscarPatrimonios(params, this.paginacao.page, this.paginacao.size).subscribe({
      next: (response: any) => {
        if(response.length > 0){
          response.map((item: any) => {
            if(item.moeda){
              this.criptomoedaApiService.buscarCriptomoedaPorCodigo(item.moeda).subscribe({
                next: (criptomoeda: CriptomoedaModel) => {
                  item.valorMoeda = criptomoeda.valor
                  item.quantidadeMoeda = item.valor
                  item.valor = criptomoeda.valor * item.valor
                },
                error: (err) => console.error('Erro ao buscar criptomoeda', err),
                complete: () => {
                  this.calcularTotalPatrimonio();
                  this.agruparPorBanco()
                }
              })
            }
          })
        }
        this.itensPatrimonio = response
      },
      error: ({error}) => {
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
    this.buscarDadosPatrimonios()
    this.fecharBuscaAvancada();
  }

  criarParamentrosBusca(filtroSimples: string, filtroBuscaAvancada?: FiltroParametrosPatrimonio) {
    if (!filtroSimples && !filtroBuscaAvancada) {
      return
    }

    return {
      tipo: filtroBuscaAvancada?.tipo,
      conta: filtroBuscaAvancada?.conta,
    }
  }

  editItem(item: ItemListaPatrimonio) {
    this.router.navigate([navegacaoPatrimonioEditarCadastro(item.id).link])
  }


  removeItem(item: ItemListaPatrimonio) {
    this.patrimonioApiService.deletarPatrimonio(item.id).subscribe({
      next: (response: any) => {
        this.buscarDadosPatrimonios()
        this.notificationService.success(MensagemNotificacao().deletarRegistro.summary)
      },
      error: ({error}) => {
        this.notificationService.error(MensagemNotificacao(error).erroAoDeletar.detail)
      },
    })
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

  atualizarCriptos() {
    this.itensPatrimonio.map((item: ItemListaPatrimonio) => {
      if(item.moeda){
        let idCripto = this.criptos.find(cripto => cripto.simbolo === item.moeda)?.id

        this.binanceApiService.buscarValorMoeda(item.moeda).subscribe({
          next: (dados: any) => {
            if(idCripto){
              let request =
                {
                  nome: 'teste',
                  simbolo: item.moeda,
                  valor: dados.price
                }
              this.criptomoedaApiService.editarCriptomoeda(idCripto, request).subscribe({
                next: (response: any) => {
                  if(response){
                    this.notificationService.success(
                      MensagemNotificacao().salvarRegistro.summary
                    );
                  }
                },
                error: ({error}) => {
                  this.notificationService.error(
                    MensagemNotificacao(error).erroSalvarRegistro.detail
                  );
                }
              })
            }
          },
          error: (err) => console.error('Erro ao buscar valor da moeda', err),
          complete: () => {
           this.buscarDadosPatrimonios()
          }
        })
      }
    })
  }

  buscarCriptosSistema(){
    this.criptomoedaApiService.buscarCriptomoedas().subscribe({
      next: (dados: any) => {
        this.criptos = dados
        this.verificarPodeAtualizar(dados);
      }
    })
  }

  selecionarPatrimonio(item: any) {
    if (this.patrimonioSelecionado?.id === item.id) {
      this.patrimonioSelecionado = null;
    } else {
      this.patrimonioSelecionado = item;
    }
  }

  verificarPodeAtualizar(criptos: any[]) {
    const criptosComData = criptos.filter(c => c.dataAtualizacao);

    if (criptosComData.length === 0) {
      this.podeAtualizarCriptos = true;
      this.tooltipAtualizarCriptos =
        'Nenhuma atualização registrada ainda';
      return;
    }

    const ultimaAtualizacao = criptosComData
      .map(c => new Date(c.dataAtualizacao))
      .sort((a, b) => b.getTime() - a.getTime())[0];

    const agora = new Date();

    const proximaAtualizacao = new Date(ultimaAtualizacao);
    proximaAtualizacao.setHours(proximaAtualizacao.getHours() + 24);

    this.podeAtualizarCriptos = agora >= proximaAtualizacao;

    this.tooltipAtualizarCriptos = this.podeAtualizarCriptos
      ? 'Clique para atualizar os valores das criptomoedas'
      : `Atualização disponível em ${this.formatarDataTooltip(proximaAtualizacao)}`;
  }

  formatarDataTooltip(data: Date): string {
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calcularTotalPatrimonio() {
    this.totalPatrimonio = this.itensPatrimonio
      .map(item => item.valor || 0)
      .reduce((acc, valor) => acc + valor, 0);
  }

  private agruparPorBanco() {
    const mapa = new Map<string, BancoPatrimonioView>();

    this.itensPatrimonio.forEach(item => {
      const banco = item.conta.banco;

      if (!mapa.has(banco.id)) {
        mapa.set(banco.id, {
          bancoId: banco.id,
          bancoNome: banco.nome,
          total: 0,
          expandido: false,
          patrimonios: []
        });
      }

      const grupo = mapa.get(banco.id)!;
      grupo.total += item.valor;
      grupo.patrimonios.push(item);
    });

    this.patrimoniosPorBanco = Array.from(mapa.values());
  }
}




