import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from "@angular/core";
import { FaturaModel } from "../../../../fatura/modelo/fatura.model";
import { Router } from "@angular/router";
import { navegacaoParcelaEditarCadastro } from "../../../../../servico/navegacao-despesa.service";
import {ResponsavelApiService} from "../../../../../../cadastros/componentes/responsavel/servico/responsavel-api.service";
import {FornecedorApiService} from "../../../../../../cadastros/componentes/fornecedor/servico/fornecedor-api.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {NotificationService} from "../../../../../../shared/mensagem/notification.service";
import {Message} from "primeng/api";
import {validaCamposInvalidosFormulario} from "../../../../../../shared/servico/function/valida-formulario.service";
import {MensagemNotificacao} from "../../../../../../shared/mensagem/notificacao-msg.service";
import {DespesaModel, PlanejamentoParcelas} from "../../../modelo/despesa.model";
import {ResponsavelModel} from "../../../../../../cadastros/componentes/responsavel/modelo/responsavel.model";
import {DespesaFormularioComponent} from "../../despesa-formulario.component";

@Component({
  selector: 'app-parcela-component',
  templateUrl: './parcela.component.html',
  styleUrls: ['./parcela.component.scss']
})
export class ParcelaComponent implements OnInit{
  formulario!: FormGroup;
  opcoesResponsavel: any[] = [];
  modalVisivel = false;
  notificacao: Message[] = [];
  @Input() despesa: DespesaModel = {};
  @Output() parcelasChange = new EventEmitter<FaturaModel[]>();
  opcoesFornecedor: any[] = [];

  constructor(
    private router: Router,
    private formBuiler: FormBuilder,
    private responsavelApiService: ResponsavelApiService,
    private fornecedorApiService: FornecedorApiService,
    private notificationService: NotificationService,

  ){}

  ngOnInit() {
    this.criarFormulario()
    this.formulario.get('fornecedorId')?.disable()
    this.carregarOpcoesResponsaveis()
    this.carregarOpcoesFornecedores()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['despesa']) {
      this.despesa.parcelas = this.despesa.parcelas ?? [];
      this.atualizarIndTabela();
    }
  }

  criarFormulario(novoFormulario?: FaturaModel){
    this.formulario = this.formBuiler.group({
      indTabela: [novoFormulario?.indTabela],
      dataVencimento: [novoFormulario?.dataVencimento],
      fornecedorId: [novoFormulario?.fornecedorId],
      responsavelId: [novoFormulario?.responsavelId],
      responsavelNome: [novoFormulario?.responsavelNome],
      parcelaAtual: [novoFormulario?.parcelaAtual],
      valor: [novoFormulario?.valor],
      despesaId: [novoFormulario?.despesaId]
    })
  }

  editarParcela(parcela: FaturaModel) {
    this.modalVisivel = true;
    this.formulario.patchValue(parcela);
  }

  removerParcela(parcela: FaturaModel) {
    const novaLista = this.despesa?.parcelas?.filter(p => p !== parcela);
    this.parcelasChange.emit(novaLista);
  }

  carregarOpcoesResponsaveis() {
    this.responsavelApiService.buscarResponsaveis().subscribe({
      next: (dados: any) => {
        this.opcoesResponsavel = dados.map((item: any) => ({
          label: item.nome,
          value: item.id,
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de responsáveis', err)
    });
  }

  carregarOpcoesFornecedores() {
    this.fornecedorApiService.buscarFornecedores().subscribe({
      next: (dados: any) => {
        this.opcoesFornecedor = dados.map((item: any) => ({
          label: item.nome,
          value: item.id,
          subgrupoId: item?.subgrupo?.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de fornecedores', err)
    });
  }

  abrirModal() {
    this.formulario.reset();
    this.formulario.get('fornecedorId')?.setValue(this.despesa.fornecedorId)
    this.modalVisivel = true;
  }

  fecharModal() {
    this.modalVisivel = false;
  }

  gerarPlanejamento(){

  }

  adicionarParcela(){
    if (!this.formulario.valid) {
      const camposErros = validaCamposInvalidosFormulario(this.formulario).join(' - ');
      this.notificacao = [MensagemNotificacao(camposErros).formularioInvalido];
      return;
    }

    const valorFormulario = this.formulario.getRawValue();
    const listaAtual = this.despesa.parcelas ?? [];

    let novaLista: FaturaModel[];

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

  atualizaResponsavel(event: any){
    this.formulario.get('responsavelNome')?.setValue(event.originalEvent.currentTarget.ariaLabel)
  }

  atualizarIndTabela() {
    if (!this.despesa.parcelas?.length) {
      return;
    }

    const novaLista = this.despesa?.parcelas?.map((item, index) => ({
      ...item,
      indTabela: index
    }));

    this.parcelasChange.emit(novaLista);
  }
}
