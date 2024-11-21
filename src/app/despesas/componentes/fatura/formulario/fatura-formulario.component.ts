import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FaturaModel } from "../modelo/fatura.model";
import { navegacaoDespesaEditarCadastro, navegacaoParcela, navegacaoParcelaNovoCadastro } from "../../../servico/navegacao-despesa.service";
import { ResponsavelApiService } from "../../../../cadastros/componentes/responsavel/servico/responsavel-api.service";
import { FaturaApiService } from "../servico/fatura.service";
import { Message } from "primeng/api";
import { MensagemNotificacao } from "../../../../shared/mensagem/notificacao-msg.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SituacaoEnum } from "../../../../shared/enum/situacao.enum";
import { NotificationService } from "../../../../shared/servico/notification.service";

@Component({
  selector: 'app-fatura-formulario',
  templateUrl: './fatura-formulario.component.html',
  styleUrls: ['./fatura-formulario.component.scss']
})
export class FaturaFormularioComponent implements OnInit{
  formulario!: FormGroup
  id: string | null = null;
  editaDespesa: string | null = null;
  notificacao: Message[] = [];
  nomePagina = navegacaoParcelaNovoCadastro.label;
  opcoesResponsavel: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private faturaApiService: FaturaApiService,
    private responsavelApiService: ResponsavelApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.criarFormulario()

    this.carregarOpcoesResponsaveis()

    this.id = this.route.snapshot.paramMap.get('id');
    this.editaDespesa = this.route.snapshot.paramMap.get('editaDespesa');
    console.log('PARAM', this.route.snapshot)
    if (this.id) {
      this.carregarParcela(this.id);
    }
  }

  criarFormulario(novoFormulario?: FaturaModel){
    this.formulario = this.formBuilder.group({
      id: [novoFormulario?.id],
      dataVencimento: [novoFormulario?.id, Validators.required],
      despesaFornecedor: [novoFormulario?.despesaFornecedor],
      responsavelId: [novoFormulario?.responsavelId, Validators.required],
      valor: [novoFormulario?.valor, Validators.required],
      situacao: [novoFormulario?.situacao],
      porcentagemDivisao: [novoFormulario?.porcentagemDivisao],
      parcelaAtual: [novoFormulario?.parcelaAtual],
      despesaId: [novoFormulario?.despesaId],
    })

    this.formulario.get('despesaFornecedor')?.disable()
    this.formulario.get('situacao')?.disable()
    this.formulario.get('porcentagemDivisao')?.disable()
  }

  carregarParcela(id: string) {
    this.faturaApiService.buscarParcelaPorId(id).subscribe({
      next: (despesa: any) => {
        this.formulario.patchValue(despesa);
        this.formulario.get('contaId')?.setValue(despesa.conta.id)
        this.formulario.get('fornecedorId')?.setValue(despesa.fornecedor.id)
        this.formulario.get('subgrupoId')?.setValue(despesa.subgrupo.id)
        if(!despesa.situacao){
          this.formulario.get('situacao')?.setValue(SituacaoEnum.ABERTA.toString())
        }
      },
      error: ({ error }) => {
        this.notificacao = [MensagemNotificacao(error.details).erroAoBuscarRegistro];
      },
    });
  }

  salvar() {
    if(this.formulario.valid){
      let request = this.formulario.getRawValue();
      delete request.responsavelNome
      delete request.despesaFornecedor
      delete request.id

      let metodo = this.id
        ? this.faturaApiService.editarParcela(this.id, request)
        : this.faturaApiService.salvarParcela(request);

      metodo.subscribe({
        next: (retorno: any) => {
          if (retorno) {
            this.notificationService.addMessage(MensagemNotificacao().salvarRegistro);
            this.cancelar();
          }
        },
        error: ({ error }) => {
          this.notificacao = new Array(MensagemNotificacao(error).erroSalvarRegistro);
        },
        complete: () => {},
      });
    }
  }

  cancelar() {
    let despesaId = this.formulario.get('despesaId')?.value
    if(this.editaDespesa == 'true'){
      this.router.navigate([navegacaoDespesaEditarCadastro(despesaId).link])
      return
    }
    this.router.navigate([navegacaoParcela.link]);
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
}
