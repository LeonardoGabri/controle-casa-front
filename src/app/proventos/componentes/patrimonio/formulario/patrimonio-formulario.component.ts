import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {PatrimonioModel} from "../modelo/patrimonio.model";
import {ContaApiService} from "../../../../cadastros/componentes/conta/servico/conta-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {NotificationService} from "../../../../shared/mensagem/notification.service";
import {PatrimonioApiService} from "../servico/patrimonio-api.service";
import {MensagemNotificacao} from "../../../../shared/mensagem/notificacao-msg.service";
import {navegacaoPatrimonio, navegacaoPatrimonioNovoCadastro} from "../../../servico/navegacao-proventos.service";

@Component({
  selector: 'app-patrimonio-formulario',
  templateUrl: './patrimonio-formulario.component.html',
  styleUrls: ['./patrimonio-formulario.component.scss']
})
export class PatrimonioFormularioComponent implements OnInit  {
  formulario!: FormGroup;
  nomePagina = navegacaoPatrimonioNovoCadastro.label;
  minFractionDigits = 2;
  maxFractionDigits = 2;
  opcoesConta: any[] = [];
  opcoesTipoPatrimonio: any[] = [
    {label: 'CDB', value: 'CDB'},
    {label: 'RDB', value: 'RDB'},
    {label: 'Criptomoeda', value: 'CRIPTO'},
    {label: 'Poupança', value: 'POUPANCA'},
    {label: 'Previdência', value: 'PREVIDENCIA'},
    {label: 'Previdência Privada', value: 'PREVIDENCIA_PRIVADA'},
    {label: 'Tesouro Direto', value: 'TESOURO_DIRETO'},
    {label: 'Ação', value: 'ACAO'},
    {label: 'FII', value: 'FII'},
  ];
  opcoesCriptomoedas: any[] = [
    { label: 'Bitcoin (BTC)', value: 'BTC' },
    { label: 'Ethereum (ETH)', value: 'ETH' },
    { label: 'Tether (USDT)', value: 'USDT' },
    { label: 'USD Coin (USDC)', value: 'USDC' },
    { label: 'BNB (Binance Coin)', value: 'BNB' },
    { label: 'XRP (Ripple)', value: 'XRP' },
    { label: 'Cardano (ADA)', value: 'ADA' },
    { label: 'Solana (SOL)', value: 'SOL' },
    { label: 'Dogecoin (DOGE)', value: 'DOGE' },
    { label: 'Polygon (MATIC)', value: 'MATIC' }
  ];

  id: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private patrimonioApiService: PatrimonioApiService,
    private contaApiService: ContaApiService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.carregarOpcoesConta()

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.carregarPatrimonio(this.id);
    }

    this.formulario.get('tipo')?.valueChanges.subscribe(tipo => {
      if (tipo === 'CRIPTO') {
        this.minFractionDigits = 4;
        this.maxFractionDigits = 8;
      } else {
        this.minFractionDigits = 2;
        this.maxFractionDigits = 2;
      }
    });
  }

  carregarPatrimonio(id: string){
    this.patrimonioApiService.buscarPatrimonioPorId(id).subscribe({
      next: (patrimonio: any) => {
        this.formulario.patchValue(patrimonio);
        this.formulario.get('conta')?.setValue(patrimonio.conta.id)
      },
      error: ({error}) => {
        this.notificationService.error(MensagemNotificacao(error).erroAoBuscarRegistro.detail)
      }
    })
  }

  criarFormulario(novoFormulario?: PatrimonioModel){
    this.formulario = this.formBuilder.group({
      tipo: [novoFormulario?.tipo],
      conta: [novoFormulario?.conta],
      moeda: [novoFormulario?.moeda],
      descricao: [novoFormulario?.descricao],
      valor: [novoFormulario?.valor],
      dataInicio: [novoFormulario?.dataInicio],
      dataFim: [novoFormulario?.dataFim]
    })
  }

  salvar(){
    if(this.formulario.valid){
      let request = this.formulario.getRawValue();

      let metodo = this.id ? this.patrimonioApiService.editarPatrimonio(this.id, request) :
      this.patrimonioApiService.salvarPatrimonio(request)

      metodo.subscribe({
        next: () => {
          this.notificationService.success(
            MensagemNotificacao().salvarRegistro.summary
          );
          this.router.navigate([navegacaoPatrimonio.link]);
        },
        error: ({error}) => {
          this.notificationService.error(
            MensagemNotificacao(error).erroSalvarRegistro.detail
          );        }
      })
    }
  }

  cancelar() {
    this.router.navigate([navegacaoPatrimonio.link]);
  }

  carregarOpcoesConta() {
    this.contaApiService.buscarContas().subscribe({
      next: (dados: any) => {
        this.opcoesConta = dados.map((item: any) => ({
          label: `${item.responsavel} - ${item.nome}`,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de contas', err)
    });
  }

  alteraTipoPatrimonio(tipo:any){
    if(tipo !== 'CRIPTO'){
      this.formulario.get('moeda')?.reset()
    }
  }
}
