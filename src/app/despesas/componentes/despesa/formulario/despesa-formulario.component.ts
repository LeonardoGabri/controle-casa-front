import { FornecedorModel } from './../../../../cadastros/componentes/fornecedor/modelo/fornecedor.model';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';

import { ContaApiService } from '../../../../cadastros/componentes/conta/servico/conta-api.service';
import { FornecedorApiService } from '../../../../cadastros/componentes/fornecedor/servico/fornecedor-api.service';
import { SubgrupoApiService } from '../../../../cadastros/componentes/subgrupo/servico/subgrupo-api.service';
import { SituacaoEnum } from '../../../../shared/enum/situacao.enum';
import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import { navegacaoDespesa, navegacaoDespesaNovoCadastro } from '../../../servico/navegacao-despesa.service';
import { FaturaModel } from '../../fatura/modelo/fatura.model';
import { DespesaModel, PlanejamentoParcelas } from '../modelo/despesa.model';
import { DespesaApiService } from '../servico/despesa-api.service';
import { validaCamposInvalidosFormulario } from '../../../../shared/servico/function/valida-formulario.service';
import { NotificationService } from '../../../../shared/mensagem/notification.service';
import {ResponsavelApiService} from "../../../../cadastros/componentes/responsavel/servico/responsavel-api.service";
import {forkJoin, map} from "rxjs";

@Component({
  selector: 'app-despesa-formulario',
  templateUrl: './despesa-formulario.component.html',
  styleUrls: ['./despesa-formulario.component.scss'],
})
export class DespesaFormularioComponent implements OnInit {
  formulario!: FormGroup;
  nomePagina = navegacaoDespesaNovoCadastro.label;
  id: string | null = null;
  opcoesConta: any[] = [];
  opcoesFornecedor: any[] = [];
  opcoesSubgrupo: any[] = [];
  planejamentoAberto = true;

  constructor(
    private formBuilder: FormBuilder,
    private despesaApiService: DespesaApiService,
    private contaApiService: ContaApiService,
    private fornecedorApiService: FornecedorApiService,
    private responsavelApiService: ResponsavelApiService,
    private subgrupoApiService: SubgrupoApiService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();

    this.carregarOpcoesConta();
    this.carregarOpcoesFornecedores();
    this.carregarOpcoesGrupo();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.planejamentoAberto = false
      this.carregarDespesa(this.id);
    }
  }

  criarFormulario(novoFormulario?: DespesaModel) {
    const dataAtual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

    this.formulario = this.formBuilder.group({
      contaId: [novoFormulario?.contaId, Validators.required],
      fornecedorId: [novoFormulario?.fornecedorId, Validators.required],
      subgrupoId: [novoFormulario?.subgrupoId],
      descricao:[novoFormulario?.descricao],
      dataLancamento: [dataAtual],
      referenciaCobranca: [novoFormulario?.referenciaCobranca, Validators.required],
      numeroParcelas: [
        novoFormulario?.numeroParcelas ?? 1,
        [Validators.required, Validators.min(1)]
      ],
      valorTotal: [
        novoFormulario?.valorTotal,
        [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]
      ],
      planejamentoParcelas: [novoFormulario?.planejamentoParcelas || this.iniciaParcelas()],
      parcelas: [novoFormulario?.parcelas],
    });

    this.formulario.get('situacao')?.disable()
  }

  iniciaParcelas(): PlanejamentoParcelas[]{
    return [
      {
        indTabela: 0,
        porcentagemDivisao: 100,
        responsavelId: "c721651f-a6ae-4491-a496-599750a6ff90",
        responsavelNome: "Leonardo",
      }
    ]
  }

  carregarDespesa(id: string) {
    this.despesaApiService.buscarDespesaPorId(id).subscribe({
      next: (despesa: any) => {
        this.formulario.patchValue(despesa);
        this.formulario.get('contaId')?.setValue(despesa.conta.id)
        this.formulario.get('fornecedorId')?.setValue(despesa.fornecedorId)
        this.formulario.get('subgrupoId')?.setValue(despesa.subgrupoId)
        if(!despesa.situacao){
          this.formulario.get('situacao')?.setValue(SituacaoEnum.ABERTA.toString())
        }
        let planejamentoAjustado = new Array()
        despesa.planejamentoParcelas.forEach((item: any, index: number) => {
          planejamentoAjustado.push({
            indTabela: index,
            porcentagemDivisao: item.porcentagemDivisao,
            responsavelId: item.responsavelId,
            responsavelNome: item.responsavelNome,
          })
        })
        this.formulario.get('planejamentoParcelas')?.setValue(planejamentoAjustado)

        despesa.parcelas.forEach((item:any, index: number) => {
          item.indTabela = index
        })
        this.formulario.get('parcelas')?.setValue(despesa.parcelas)
      },
      error: ({ error }) => {
        this.notificationService.error(MensagemNotificacao(error).erroAoBuscarRegistro.detail)
      },
    });
  }

  salvar() {
    if (!this.formulario.valid) {
      const camposErros = validaCamposInvalidosFormulario(this.formulario).join(' - ');
      this.notificationService.error(
        MensagemNotificacao(camposErros).formularioInvalido.detail
      );
      return;
    }

    if (
      this.formulario.get('valorTotal')?.dirty &&
      !this.formulario.get('planejamentoParcelas')?.value
    ) {
      this.notificationService.error(
        MensagemNotificacao().erroSomaPorcentagem.detail
      );
      return;
    }

    const request = this.formulario.getRawValue();

    if (request.planejamentoParcelas) {
      this.calcularTotalPorcentagemDivisao(request.planejamentoParcelas);
      request.planejamentoParcelas.forEach((item: PlanejamentoParcelas) => {
        delete item.responsavelNome;
        delete item.indTabela;
      });
    }

    // 🔹 Se tem parcelas → resolve nomes → envia
    if (request.parcelas?.length) {
      forkJoin(
        request.parcelas.map((parcela: FaturaModel) =>
          this.responsavelApiService.buscarResponsavelPorId(parcela.responsavelId).pipe(
            map((response: any) => ({
              ...parcela,
              responsavelNome: response.nome
            }))
          )
        )
      ).subscribe({
        next: (parcelasAjustadas) => {
          request.parcelas = parcelasAjustadas;
          this.enviarRequest(request); // ✅ ÚNICO DISPARO
        },
        error: () => {
          this.notificationService.error('Erro ao buscar responsáveis');
        }
      });

    } else {
      // 🔹 Sem parcelas → envia direto
      this.enviarRequest(request); // ✅ ÚNICO DISPARO
    }
  }


  cancelar() {
    this.router.navigate([navegacaoDespesa.link]);
  }

  private enviarRequest(request: any) {
    const metodo = this.id
      ? this.despesaApiService.editarDespesa(this.id, request)
      : this.despesaApiService.salvarDespesa(request);

    metodo.subscribe({
      next: () => {
        this.notificationService.success(
          MensagemNotificacao().salvarRegistro.summary
        );
        this.cancelar();
      },
      error: ({ error }) => {
        this.notificationService.error(
          MensagemNotificacao(error).erroSalvarRegistro.detail
        );
      }
    });
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
          subgrupoId: item?.subgrupo?.id
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
    this.formulario.get('planejamentoParcelas')?.setValue(parcelasAtualizadas);
    this.formulario.get('planejamentoParcelas')?.markAsDirty();
  }

  atualizarParcelas(parcelas: FaturaModel[]) {
    this.formulario.get('parcelas')?.setValue(parcelas)
  }

  calcularTotalPorcentagemDivisao(planejamentoParcelas: PlanejamentoParcelas[]) {
    const somaPorcentagem = planejamentoParcelas.reduce((soma, item) => soma + (item.porcentagemDivisao || 0), 0);
     somaPorcentagem === 100;
     if(somaPorcentagem !== 100){
      this.notificationService.error(MensagemNotificacao().erroSomaPorcentagem.detail)
     }
  }

  onEditarParcela(parcela: FaturaModel) {
    console.log("Editar parcela:", parcela);
  }

  onRemoverParcela(parcela: FaturaModel) {
    console.log("Remover parcela:", parcela);
  }

  alteraFornecedor(fornecedor: any){
    let opcoeEncontrada = this.opcoesFornecedor.find((item: any) => {
      return item.value == fornecedor.value
    })
    this.formulario.get('subgrupoId')?.setValue(opcoeEncontrada?.subgrupoId)
  }
}
