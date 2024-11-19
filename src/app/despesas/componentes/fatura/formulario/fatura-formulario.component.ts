import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FaturaModel } from "../modelo/fatura.model";
import { navegacaoParcela, navegacaoParcelaNovoCadastro } from "../../../servico/navegacao-despesa.service";
import { ResponsavelApiService } from "../../../../cadastros/componentes/responsavel/servico/responsavel-api.service";
import { FaturaApiService } from "../servico/fatura.service";
import { Message } from "primeng/api";
import { MensagemNotificacao } from "../../../../shared/mensagem/notificacao-msg.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SituacaoEnum } from "../../../../shared/enum/situacao.enum";

@Component({
  selector: 'app-fatura-formulario',
  templateUrl: './fatura-formulario.component.html',
  styleUrls: ['./fatura-formulario.component.scss']
})
export class FaturaFormularioComponent implements OnInit{
  formulario!: FormGroup
  id: string | null = null;
  notificacao: Message[] = [];
  nomePagina = navegacaoParcelaNovoCadastro.label;
  opcoesResponsavel: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private faturaApiService: FaturaApiService,
    private responsavelApiService: ResponsavelApiService,
    private router: Router,
    private route: ActivatedRoute,

  ){}

  ngOnInit(): void {
    this.criarFormulario()

    this.carregarOpcoesResponsaveis()

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.carregarParcela(this.id);
    }
  }

  criarFormulario(novoFormulario?: FaturaModel){
    this.formulario = this.formBuilder.group({
      id: [novoFormulario?.id],
      dataVencimento: [novoFormulario?.id],
      despesaFornecedor: [novoFormulario?.despesaFornecedor],
      responsavelId: [novoFormulario?.responsavelId],
      valor: [novoFormulario?.valor],
      situacao: [novoFormulario?.situacao],
      porcentagemDivisao: [novoFormulario?.porcentagemDivisao],
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
