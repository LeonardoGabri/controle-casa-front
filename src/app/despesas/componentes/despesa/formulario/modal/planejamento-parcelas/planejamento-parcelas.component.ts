import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {DespesaModel, PlanejamentoParcelas} from '../../../modelo/despesa.model';
import { ResponsavelApiService } from '../../../../../../cadastros/componentes/responsavel/servico/responsavel-api.service';
import { MenuItem, Message } from 'primeng/api';
import { MensagemNotificacao } from '../../../../../../shared/mensagem/notificacao-msg.service';
import { validaCamposInvalidosFormulario } from '../../../../../../shared/servico/function/valida-formulario.service';
import {FaturaApiService} from "../../../../fatura/servico/fatura.service";
import {FaturaModel} from "../../../../fatura/modelo/fatura.model";
import {NotificationService} from "../../../../../../shared/mensagem/notification.service";

@Component({
  selector: 'app-planejamento-parcelas-component',
  templateUrl: './planejamento-parcelas.component.html',
  styleUrls: ['./planejamento-parcelas.component.scss'],
})
export class PlanejamentoParcelasComponent implements OnInit {
  formulario!: FormGroup;
  opcoesResponsavel: any[] = [];
  notificacao: Message[] = [];
  @Input() planejamentoParcelas: PlanejamentoParcelas[] = [];
  @Output() emitirParcelasCalculadas = new EventEmitter<FaturaModel[]>();

  @Input() despesa!: DespesaModel

  @Output() parcelasChange = new EventEmitter<PlanejamentoParcelas[]>();
  menuAcoes: MenuItem[] = [];
  modalVisivel = false;
  @Input() planejamentoAberto = true;

  constructor(
    private formBuilder: FormBuilder,
    private responsavelApiService: ResponsavelApiService,
    private faturaApiService: FaturaApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.carregarOpcoesResponsavel();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['planejamentoParcelas']) {
      this.planejamentoParcelas = this.planejamentoParcelas ?? [];
      this.atualizarIndTabela();
    }
  }

  criarFormulario(novoFormulario?: PlanejamentoParcelas) {
    this.formulario = this.formBuilder.group({
      indTabela: [novoFormulario?.indTabela],
      porcentagemDivisao: [
        novoFormulario?.porcentagemDivisao,
        Validators.required,
      ],
      responsavelId: [novoFormulario?.responsavelId, Validators.required],
      responsavelNome: [novoFormulario?.responsavelNome],
    });
  }

  configurarMenuAcoes() {
    this.menuAcoes = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editarParcela.bind(this),
      },
      {
        label: 'Remover',
        icon: 'pi pi-trash',
        command: () => this.removerParcela.bind(this),
      },
    ];
  }

  getReducePorcentagemDivisao(): number{
    return this.planejamentoParcelas.reduce((acc, n) => {
      return acc - n.porcentagemDivisao;
    }, 100);
  }

  abrirModal() {
    this.formulario.reset();
    this.modalVisivel = true;
    if(this.planejamentoParcelas.length != 0){
      const resultado = this.getReducePorcentagemDivisao()
      this.formulario.get('porcentagemDivisao')?.setValue(resultado)
      return
    }
    this.formulario.get('porcentagemDivisao')?.setValue(100)

    console.log('Planejamentos', this.planejamentoParcelas)
  }

  fecharModal() {
    this.modalVisivel = false;
  }

  adicionarParcela() {
    if (!this.formulario.valid) {
      const camposErros = validaCamposInvalidosFormulario(this.formulario).join(' - ');
      this.notificacao = [MensagemNotificacao(camposErros).formularioInvalido];
      return;
    }

    const valorFormulario = this.formulario.getRawValue();
    const listaAtual = this.planejamentoParcelas ?? [];

    let novaLista: PlanejamentoParcelas[];

    if (valorFormulario.indTabela === null || valorFormulario.indTabela === undefined) {
      novaLista = [...listaAtual, valorFormulario];
    } else {
      novaLista = listaAtual.map((item, index) =>
        index === valorFormulario.indTabela ? valorFormulario : item
      );
    }

    this.parcelasChange.emit(novaLista);
    this.fecharModal();
  }


  editarParcela(item: PlanejamentoParcelas) {
    this.modalVisivel = true;
    this.formulario.patchValue(item);
  }

  removerParcela(item: PlanejamentoParcelas) {
    const novaLista = this.planejamentoParcelas.filter(p => p !== item);
    this.parcelasChange.emit(novaLista);
  }

  carregarOpcoesResponsavel() {
    this.responsavelApiService.buscarResponsaveis().subscribe({
      next: (dados: any) => {
        this.opcoesResponsavel = dados.map((item: any) => ({
          label: item.nome,
          value: item.id,
        }));
      },
      error: (err) =>
        console.error('Erro ao carregar opções de responsáveis', err),
    });
  }

  atualizarIndTabela() {
    if (!this.planejamentoParcelas?.length) {
      return;
    }

    const novaLista = this.planejamentoParcelas.map((item, index) => ({
      ...item,
      indTabela: index
    }));

    this.parcelasChange.emit(novaLista);
  }

  atualizaNomeResponsavel(item: any) {
    let idResponsavel = this.formulario.get('responsavelId')?.value
    let labelResponsavel = this.opcoesResponsavel.find(item => {
      if(item.value == idResponsavel){
        return item.label
      }
    })

    this.formulario
      .get('responsavelNome')
      ?.setValue(labelResponsavel.label);
  }

  calcularTotalPorcentagemDivisao(
    planejamentoParcelas: PlanejamentoParcelas[]
  ) {
    const somaPorcentagem = planejamentoParcelas.reduce(
      (soma, item) => soma + (item.porcentagemDivisao || 0),
      0
    );
    somaPorcentagem === 100;

    if (somaPorcentagem !== 100) {
      this.notificationService.error(MensagemNotificacao().erroSomaPorcentagem.detail)
    }
  }

  togglePlanejamento() {
    this.planejamentoAberto = !this.planejamentoAberto;
  }

  gerarParcelas(){
    if(this.despesa.planejamentoParcelas){
      this.calcularTotalPorcentagemDivisao(this.despesa.planejamentoParcelas);
      this.faturaApiService.calcularParcelas(this.despesa).subscribe({
        next: (parcelasCalculadas: any) => {
          this.emitirParcelasCalculadas.emit(parcelasCalculadas);
        },
      })
    }

  }
}
