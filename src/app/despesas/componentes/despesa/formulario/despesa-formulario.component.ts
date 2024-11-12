import { GrupoApiService } from './../../../../cadastros/componentes/grupo/servico/grupo-api.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DespesaModel } from '../modelo/despesa.model';
import { ContaApiService } from '../../../../cadastros/componentes/conta/servico/conta-api.service';
import { FornecedorApiService } from '../../../../cadastros/componentes/fornecedor/servico/fornecedor-api.service';
import { navegacaoDespesa, navegacaoDespesaNovoCadastro } from '../../../servico/navegacao-despesa.service';
import { Message } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { DespesaApiService } from '../servico/despesa-api.service';
import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import moment from 'moment';
import { DatePipe } from '@angular/common';

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
  opcoesGrupo: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private despesaApiService: DespesaApiService,
    private contaApiService: ContaApiService,
    private fornecedorApiService: FornecedorApiService,
    private grupoApiService: GrupoApiService,
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

    this.formulario.get('dataLancamento')?.setValue(moment.now())
  }

  criarFormulario(novoFormulario?: DespesaModel) {
    const dataAtual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.formulario = this.formBuilder.group({
      contaId: [novoFormulario?.contaId],
      fornecedorId: [novoFormulario?.fornecedorId],
      grupoId: [novoFormulario?.grupoId],
      dataLancamento: [dataAtual],
      mesInicioCobranca: [novoFormulario?.mesInicioCobranca],
      anoInicioCobranca: [novoFormulario?.anoInicioCobranca],
      numeroParcelas: [novoFormulario?.numeroParcelas],
      valorTotal: [novoFormulario?.valorTotal],
      planejamentoParcelas: [novoFormulario?.numeroParcelas],
    });
  }

  carregarDespesa(id: string) {
    this.despesaApiService.buscarDespesaPorId(id).subscribe({
      next: (responsavel: any) => {
        this.formulario.patchValue(responsavel);
      },
      error: ({ error }) => {
        this.notificacao = [MensagemNotificacao(error).erroAoBuscarRegistro];
      },
    });
  }

  getHoraAtual(): string {
    const agora = new Date();
    return agora.toTimeString().split(' ')[0];
  }

  salvar() {
    let request = this.formulario.getRawValue();
    const dataLancamento = request.dataLancamento;
    const dataComHora = `${dataLancamento}T${this.getHoraAtual()}`;
    request.dataLancamento = dataComHora;
    console.log('REQUEST', request)
    let id = request.id;
    delete request.id;

    let metodo = id
      ? this.despesaApiService.editarDespesa(id, request)
      : this.despesaApiService.salvarDespesa(request);

    // metodo.subscribe({
    //   next: (retorno: any) => {
    //     if (retorno) {
    //       this.notificacao = new Array(MensagemNotificacao().salvarRegistro);
    //       this.cancelar();
    //     }
    //   },
    //   error: ({ error }) => {
    //     this.notificacao = new Array(MensagemNotificacao(error).erroSalvarRegistro);
    //   },
    //   complete: () => {},
    // });
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
        debugger
        this.opcoesFornecedor = dados.map((item: any) => ({
          label: item.nome,
          value: item.id,
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de fornecedores', err)
    });
  }

  carregarOpcoesGrupo() {
    this.grupoApiService.buscarGrupos().subscribe({
      next: (dados: any) => {
        this.opcoesGrupo = dados.map((item: any) => ({
          label: item.nome,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de grupos', err)
    });
  }
}
