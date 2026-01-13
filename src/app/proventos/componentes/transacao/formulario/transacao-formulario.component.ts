import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TransacaoModel} from "../modelo/transacao.model";
import {
  navegacaoPatrimonio,
  navegacaoPatrimonioNovoCadastro, navegacaoTransacao,
  navegacaoTransacaoNovoCadastro
} from "../../../servico/navegacao-proventos.service";
import {PatrimonioApiService} from "../../patrimonio/servico/patrimonio-api.service";
import {ContaApiService} from "../../../../cadastros/componentes/conta/servico/conta-api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {NotificationService} from "../../../../shared/mensagem/notification.service";
import {TransacaoApiService} from "../servico/transacao-api.service";
import {MensagemNotificacao} from "../../../../shared/mensagem/notificacao-msg.service";
import {PatrimonioModel} from "../../patrimonio/modelo/patrimonio.model";

@Component({
  selector: 'app-transacao-formulario',
  templateUrl: './transacao-formulario.component.html',
  styleUrls: ['./transacao-formulario.component.scss']
})
export class TransacaoFormularioComponent implements OnInit{
  formulario!: FormGroup
  id: string | null = null;
  minFractionDigits = 2;
  maxFractionDigits = 2;
  nomePagina = navegacaoTransacaoNovoCadastro.label;
  patrimonio: PatrimonioModel | null = null;
  opcoesTipoTransacao: any[] = [
    {label: 'Entrada', value: 'ENTRADA'},
    {label: 'Saída', value: 'SAIDA'},
    {label: 'Transferência', value: 'TRANSFERENCIA'},
  ];
  opcoesPatrimonio: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private patrimonioApiService: PatrimonioApiService,
    private transacaoApiService: TransacaoApiService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.criarFormulario();
    this.carregarOpcoesPatrimonio()

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.carregarTransacao(this.id);
    }

    this.formulario.get('patrimonio')?.valueChanges.subscribe(tipo => {
      this.alteraPatrimonio(tipo)
    });
  }

  carregarTransacao(id: string){
    this.transacaoApiService.buscarTransacaoPorId(id).subscribe({
      next: (transacao: any) => {
        this.formulario.patchValue(transacao);
        this.formulario.get('patrimonio')?.setValue(transacao.patrimonio.id)
        this.patrimonio = transacao.patrimonio
      },
      error: ({error}) => {
        this.notificationService.error(MensagemNotificacao(error).erroAoBuscarRegistro.detail)
      }
    })
  }

  salvar(){
    if(this.formulario.valid){
      let request = this.formulario.getRawValue();
      let id = request.id;
      delete request.id;

      let metodo = id ? this.transacaoApiService.editarTransacao(id, request) :
        this.transacaoApiService.salvarTransacao(request)

      metodo.subscribe({
        next: () => {
          this.notificationService.success(
            MensagemNotificacao().salvarRegistro.summary
          );
          this.router.navigate([navegacaoTransacao.link]);
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


  criarFormulario(novoFormulario?: TransacaoModel){
    this.formulario = this.formBuilder.group({
      dataTransacao: [novoFormulario?.dataTransacao],
      tipo: [novoFormulario?.tipo],
      patrimonio: [novoFormulario?.patrimonio],
      valor: [novoFormulario?.valor],
      descricao: [novoFormulario?.descricao],
      patrimonioOrigem: [novoFormulario?.patrimonioOrigem],
      patrimonioDestino: [novoFormulario?.patrimonioDestino],
    })
  }

  carregarOpcoesPatrimonio() {
    this.patrimonioApiService.buscarPatrimonios().subscribe({
      next: (dados: any) => {
        this.opcoesPatrimonio = dados.map((item: any) => ({
          label: `${item.conta.banco.nome} - ${item.tipo}${item.descricao ? ' - ' + item.descricao : ''}${item.moeda ? ' - ' + item.moeda : ''}`,
          value: item.id,
          tipo: item.tipo,
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de contas', err)
    });
  }

  alteraPatrimonio(id: any){
    let tipoPatrimonio = this.opcoesPatrimonio.find(item => {
      return item.value === id
    })?.tipo;

    if (tipoPatrimonio === 'CRIPTO') {
      this.minFractionDigits = 4;
      this.maxFractionDigits = 8;
    } else {
      this.minFractionDigits = 2;
      this.maxFractionDigits = 2;
    }

  }
}
