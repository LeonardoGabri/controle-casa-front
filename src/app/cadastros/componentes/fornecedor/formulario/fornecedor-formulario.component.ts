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
import { NotificationService } from "../../../../shared/servico/notification.service";
import { validaCamposInvalidosFormulario } from "../../../../shared/servico/function/valida-formulario.service";

@Component({
  selector: 'app-fornecedor-formulario',
  templateUrl: './fornecedor-formulario.component.html',
  styleUrls: ['./fornecedor-formulario.component.scss']
})
export class FornecedorFormularioComponent implements OnInit{
  formulario!: FormGroup
  notificacao: Message[] = [];
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
          subgrupoId: fornecedor.subgrupo.id
        }
        this.formulario.patchValue(retorno);
      },
      error: ({error}) => {
        this.notificacao = [MensagemNotificacao(error).erroAoBuscarRegistro];
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
            this.notificationService.addMessage(MensagemNotificacao().salvarRegistro);
            this.cancelar();
          }
        },
        error: ({ error }) => {
          this.notificacao = new Array(MensagemNotificacao().erroSalvarRegistro);
        },
        complete: () => {
        }
      });
    }else{
      let camposErros = validaCamposInvalidosFormulario(this.formulario).join(" - ")
      this.notificacao = new Array(MensagemNotificacao(camposErros).formularioInvalido);
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
