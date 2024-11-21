import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlanejamentoParcelas } from '../../../modelo/despesa.model';
import { ResponsavelApiService } from '../../../../../../cadastros/componentes/responsavel/servico/responsavel-api.service';
import { MenuItem, Message } from 'primeng/api';
import { MensagemNotificacao } from '../../../../../../shared/mensagem/notificacao-msg.service';
import { validaCamposInvalidosFormulario } from '../../../../../../shared/servico/function/valida-formulario.service';

@Component({
  selector: 'app-planejamento-parcelas-component',
  templateUrl: './planejamento-parcelas.component.html',
  styleUrls: ['./planejamento-parcelas.component.scss'],
})
export class PlanejamentoParcelasComponent implements OnInit {
  formulario!: FormGroup;
  opcoesResponsavel: any[] = [];
  notificacao: Message[] = [];
  @Input() parcelas: PlanejamentoParcelas[] = [];
  @Output() parcelasChange = new EventEmitter<PlanejamentoParcelas[]>();
  menuAcoes: MenuItem[] = [];
  modalVisivel = false;
  @Input() planejamentoAberto = true;

  constructor(
    private formBuilder: FormBuilder,
    private responsavelApiService: ResponsavelApiService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.carregarOpcoesResponsavel();

    this.atualizarIndTabela();
  }

  criarFormulario(novoFormulario?: PlanejamentoParcelas) {
    this.formulario = this.formBuilder.group({
      indTabela: [novoFormulario?.indTabela],
      porcentagemDivisao: [
        novoFormulario?.porcentagemDivisao,
        Validators.required,
      ],
      responsavelId: [novoFormulario?.responsavelId, Validators.required],
      responsavelNome: [novoFormulario?.responsavelNome, Validators.required],
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

  abrirModal() {
    this.formulario.reset();
    this.modalVisivel = true;
  }

  fecharModal() {
    this.modalVisivel = false;
  }

  adicionarParcela() {
    if (this.formulario.valid) {
      const index = this.formulario.get('indTabela')?.value;

      if (index === null || index === undefined) {
        this.parcelas.push({ ...this.formulario.getRawValue() });
      } else {
        this.parcelas[index] = { ...this.formulario.getRawValue() };
      }

      this.atualizarIndTabela();
      this.parcelasChange.emit(this.parcelas);
      this.fecharModal();
    } else {
      let camposErros = validaCamposInvalidosFormulario(this.formulario).join(
        ' - '
      );
      this.notificacao = new Array(
        MensagemNotificacao(camposErros).formularioInvalido
      );
    }
  }

  editarParcela(item: PlanejamentoParcelas) {
    this.modalVisivel = true;
    this.formulario.patchValue(item);
  }

  removerParcela(item: any) {
    if (item) {
      const index = this.parcelas.indexOf(item);
      if (index > -1) {
        this.parcelas.splice(index, 1);
      }
      item = null;
    }
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
    this.parcelas.forEach((item: PlanejamentoParcelas, index: number) => {
      item.indTabela = index;
    });
  }

  atualizaNomeResponsavel(item: any) {
    this.formulario
      .get('responsavelNome')
      ?.setValue(item.originalEvent.currentTarget.ariaLabel);
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
      this.notificacao.push(MensagemNotificacao().erroSomaPorcentagem);
    }
  }

  togglePlanejamento() {
    this.planejamentoAberto = !this.planejamentoAberto;
  }
}
