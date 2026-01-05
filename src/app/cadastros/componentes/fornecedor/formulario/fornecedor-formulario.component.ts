import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Message } from "primeng/api";
import { navegacaoFornecedor, navegacaoFornecedorNovoCadastro } from "../../../servico/navegacao-cadastro.service";
import { GrupoApiService } from "../../grupo/servico/grupo-api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FornecedorApiService } from "../servico/fornecedor-api.service";
import { FornecedorModel } from "../modelo/fornecedor.model";
import { MensagemNotificacao } from "../../../../shared/mensagem/notificacao-msg.service";
import { SubgrupoApiService } from "../../subgrupo/servico/subgrupo-api.service";
import { validaCamposInvalidosFormulario } from "../../../../shared/servico/function/valida-formulario.service";
import { NotificationService } from "../../../../shared/mensagem/notification.service";

@Component({
  selector: 'app-fornecedor-formulario',
  templateUrl: './fornecedor-formulario.component.html',
  styleUrls: ['./fornecedor-formulario.component.scss']
})
export class FornecedorFormularioComponent implements OnInit{
  formulario!: FormGroup
  nomePagina = navegacaoFornecedorNovoCadastro.label
  opcoesSubgrupo: any[] = [];
  id: string | null = null;

  constructor(
    private formBuilder:FormBuilder,
    private subgrupoApiService: SubgrupoApiService,
    private fornecedorApiService: FornecedorApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.criarFormulario()

    this.carregarOpcoesGrupo();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.carregarFornecedor(this.id);
    }
  }

  criarFormulario(novoFormulario?: FornecedorModel){
    this.formulario = this.formBuilder.group({
      id: [novoFormulario?.id],
      nome: [novoFormulario?.nome, Validators.required],
      subgrupoId: [novoFormulario?.subgrupoId]
    })
  }

  carregarFornecedor(id: string) {
    this.fornecedorApiService.buscarFornecedorPorId(id).subscribe({
      next: (fornecedor: any) => {
        let retorno = {
          id: fornecedor.id,
          nome: fornecedor.nome,
          subgrupoId: fornecedor.subgrupo?.id ?? null
        }
        this.formulario.patchValue(retorno);
      },
      error: ({error}) => {
        this.notificationService.error(MensagemNotificacao().erroAoBuscarRegistro.detail)
      }
    });
  }

  salvar() {
    if(this.formulario.valid){
      let request = this.formulario.getRawValue();
      let id = request.id;
      delete request.id;

      let metodo = id ? this.fornecedorApiService.editarFornecedor(id, request) : this.fornecedorApiService.salvarFornecedor(request);

      metodo.subscribe({
        next: (retorno: any) => {
          if (retorno) {
            this.notificationService.success(MensagemNotificacao().salvarRegistro.summary);
            this.cancelar();
          }
        },
        error: ({ error }) => {
          this.notificationService.error(MensagemNotificacao().erroSalvarRegistro.detail)
        },
        complete: () => {
        }
      });
    }else{
      let camposErros = validaCamposInvalidosFormulario(this.formulario).join(" - ")
      this.notificationService.error(MensagemNotificacao(camposErros).formularioInvalido.detail)
    }
}

  cancelar(){
    this.router.navigate([navegacaoFornecedor.link]);
  }

  carregarOpcoesGrupo() {
    this.subgrupoApiService.buscarSubgrupos().subscribe({
      next: (dados: any) => {
        this.opcoesSubgrupo = dados.map((item: any) => ({
          label: item.nome,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de subgrupos', err)
    });
  }
}
