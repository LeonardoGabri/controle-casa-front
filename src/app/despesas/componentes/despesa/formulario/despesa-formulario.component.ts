import { GrupoApiService } from './../../../../cadastros/componentes/grupo/servico/grupo-api.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DespesaModel, PlanejamentoParcelas } from '../modelo/despesa.model';
import { ContaApiService } from '../../../../cadastros/componentes/conta/servico/conta-api.service';
import { FornecedorApiService } from '../../../../cadastros/componentes/fornecedor/servico/fornecedor-api.service';
import { navegacaoDespesa, navegacaoDespesaNovoCadastro } from '../../../servico/navegacao-despesa.service';
import { MenuItem, Message } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DespesaApiService } from '../servico/despesa-api.service';
import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import moment from 'moment';
import { DatePipe } from '@angular/common';
import { SubgrupoApiService } from '../../../../cadastros/componentes/subgrupo/servico/subgrupo-api.service';
import { ResponsavelApiService } from '../../../../cadastros/componentes/responsavel/servico/responsavel-api.service';
import { FaturaModel } from '../../fatura/modelo/fatura.model';

@Component({
  selector: 'app-despesa-formulario',
  templateUrl: './despesa-formulario.component.html',
  styleUrls: ['./despesa-formulario.component.scss'],
})
export class DespesaFormularioComponent implements OnInit {
  formulario!: FormGroup;
  nomePagina = navegacaoDespesaNovoCadastro.label;
  notificacao: Message[] = [];
  id: string | null = null;
  opcoesConta: any[] = [];
  opcoesFornecedor: any[] = [];
  opcoesSubgrupo: any[] = [];
  meses = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
  parcelas: FaturaModel[] = []

  constructor(
    private formBuilder: FormBuilder,
    private despesaApiService: DespesaApiService,
    private contaApiService: ContaApiService,
    private fornecedorApiService: FornecedorApiService,
    private subgrupoApiService: SubgrupoApiService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.criarFormulario();

    this.carregarOpcoesConta();
    this.carregarOpcoesFornecedores();
    this.carregarOpcoesGrupo();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.carregarDespesa(this.id);
    }
  }

  criarFormulario(novoFormulario?: DespesaModel) {
    const dataAtual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.formulario = this.formBuilder.group({
      contaId: [novoFormulario?.contaId],
      fornecedorId: [novoFormulario?.fornecedorId],
      subgrupoId: [novoFormulario?.subgrupoId],
      dataLancamento: [dataAtual],
      mesInicioCobranca: [novoFormulario?.mesInicioCobranca],
      anoInicioCobranca: [
        novoFormulario?.anoInicioCobranca,
        [Validators.required, Validators.min(2010), Validators.max(new Date().getFullYear())]
      ],
      numeroParcelas: [novoFormulario?.numeroParcelas, [Validators.required, Validators.min(1)]],
      valorTotal: [
        novoFormulario?.valorTotal,
        [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]
      ],
      planejamentoParcelas: [novoFormulario?.planejamentoParcelas],
    });
  }

  carregarDespesa(id: string) {
    this.despesaApiService.buscarDespesaPorId(id).subscribe({
      next: (despesa: any) => {
        this.formulario.patchValue(despesa);
        this.formulario.get('contaId')?.setValue(despesa.conta.id)
        this.formulario.get('fornecedorId')?.setValue(despesa.fornecedor.id)
        this.formulario.get('subgrupoId')?.setValue(despesa.subgrupo.id)
        this.parcelas = despesa.parcelas
      },
      error: ({ error }) => {
        this.notificacao = [MensagemNotificacao(error).erroAoBuscarRegistro];
      },
    });
  }

  salvar() {
    let request = this.formulario.getRawValue();
    console.log('REQUEST', request)
    let metodo = this.id
      ? this.despesaApiService.editarDespesa(this.id, request)
      : this.despesaApiService.salvarDespesa(request);

    console.log('METODO', metodo);
    if(request.planejamentoParcelas){
      this.calcularTotalPorcentagemDivisao(request.planejamentoParcelas)
    }

    metodo.subscribe({
      next: (retorno: any) => {
        if (retorno) {
          this.notificacao = new Array(MensagemNotificacao().salvarRegistro);
          this.cancelar();
        }
      },
      error: ({ error }) => {
        this.notificacao = new Array(MensagemNotificacao(error).erroSalvarRegistro);
      },
      complete: () => {},
    });
  }

  cancelar() {
    this.router.navigate([navegacaoDespesa.link]);
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

  carregarOpcoesFornecedores() {
    this.fornecedorApiService.buscarFornecedores().subscribe({
      next: (dados: any) => {
        this.opcoesFornecedor = dados.map((item: any) => ({
          label: item.nome,
          value: item.id,
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de fornecedores', err)
    });
  }

  carregarOpcoesGrupo() {
    this.subgrupoApiService.buscarSubgrupos().subscribe({
      next: (dados: any) => {
        this.opcoesSubgrupo = dados.map((item: any) => ({
          label: item.nome,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de grupos', err)
    });
  }

  atualizarPlanejamentoParcelas(parcelasAtualizadas: PlanejamentoParcelas[]) {
    this.formulario.get('planejamentoParcelas')?.setValue(parcelasAtualizadas)
  }

  calcularTotalPorcentagemDivisao(planejamentoParcelas: PlanejamentoParcelas[]) {
    const somaPorcentagem = planejamentoParcelas.reduce((soma, item) => soma + (item.porcentagemDivisao || 0), 0);
     somaPorcentagem === 100;
     if(somaPorcentagem !== 100){
        this.notificacao.push(MensagemNotificacao().erroSomaPorcentagem)
     }
  }



  onEditarParcela(parcela: FaturaModel) {
    console.log("Editar parcela:", parcela);
    // Lógica para editar a parcela
  }

  onRemoverParcela(parcela: FaturaModel) {
    console.log("Remover parcela:", parcela);
    // Lógica para remover a parcela
  }
}
