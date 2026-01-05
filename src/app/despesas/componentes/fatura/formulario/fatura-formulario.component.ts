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
import { validaCamposInvalidosFormulario } from "../../../../shared/servico/function/valida-formulario.service";
import { NotificationService } from "../../../../shared/mensagem/notification.service";

@Component({
  selector: 'app-fatura-formulario',
  templateUrl: './fatura-formulario.component.html',
  styleUrls: ['./fatura-formulario.component.scss']
})
export class FaturaFormularioComponent implements OnInit{
  formulario!: FormGroup
  id: string | null = null;
  editaDespesa: string | null = null;
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
    if (this.id) {
      this.carregarParcela(this.id);
    }
  }

  criarFormulario(novoFormulario?: FaturaModel){
    this.formulario = this.formBuilder.group({
      id: [novoFormulario?.id],
      dataVencimento: [novoFormulario?.id, Validators.required],
      fornecedor: [novoFormulario?.fornecedor],
      responsavel: [novoFormulario?.responsavel, Validators.required],
      valor: [novoFormulario?.valor, Validators.required],
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
        this.notificationService.error(MensagemNotificacao(error).erroAoBuscarRegistro.detail)
      },
    });
  }

  salvar() {
    if(this.formulario.valid){
      let request = {
        ...this.formulario.getRawValue(),
        responsavelId: this.formulario.getRawValue().responsavel.id
      };
      delete request.responsavel
      delete request.id

      let metodo = this.id
        ? this.faturaApiService.editarParcela(this.id, request)
        : this.faturaApiService.salvarParcela(request);

      metodo.subscribe({
        next: (retorno: any) => {
          if (retorno) {
            this.notificationService.error(MensagemNotificacao().salvarRegistro.summary)
            this.cancelar();
          }
        },
        error: ({ error }) => {
          this.notificationService.error(MensagemNotificacao(error).erroSalvarRegistro.detail)
        },
        complete: () => {},
      });
    }else{
      let camposErros = validaCamposInvalidosFormulario(this.formulario).join(" - ")
      this.notificationService.error(MensagemNotificacao(camposErros).formularioInvalido.detail)
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
