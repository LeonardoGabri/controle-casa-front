import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Message } from "primeng/api";
import { ResponsavelModel } from "../modelo/responsavel.model";
import { MensagemNotificacao } from "../../../../shared/mensagem/notificacao-msg.service";
import { ResponsavelApiService } from "../servico/responsavel-api.service";
import { navegacaoResponsavel, navegacaoResponsavelNovoCadastro } from "../../../servico/navegacao-cadastro.service";
import { validaCamposInvalidosFormulario } from "../../../../shared/servico/function/valida-formulario.service";
import { NotificationService } from "../../../../shared/servico/notification.service";

@Component({
  selector: 'app-responsavel-formulario',
  templateUrl: './responsavel-formulario.component.html',
  styleUrls: ['./responsavel-formulario.component.scss']
})
export class ResponsavelFormularioComponent implements OnInit{
  formulario!: FormGroup
  nomePagina = navegacaoResponsavelNovoCadastro.label
  notificacao: Message[] = [];
  id: string | null = null;

  constructor(
    private formBuilder:FormBuilder,
    private responsavelApiService: ResponsavelApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.criarFormulario();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.carregarResponsavel(this.id);
    }
  }

  criarFormulario(novoFormulario?: ResponsavelModel){
    this.formulario = this.formBuilder.group({
      id: [novoFormulario?.id],
      nome: [novoFormulario?.nome, Validators.required]
    })
  }

  carregarResponsavel(id: string) {
    this.responsavelApiService.buscarResponsavelPorId(id).subscribe({
      next: (responsavel: any) => {
        this.formulario.patchValue(responsavel);
      },
      error: ({error}) => {
        this.notificacao = [MensagemNotificacao(error).erroSalvarRegistro];
      }
    });
  }

  salvar() {
    if(this.formulario.valid){
      let request = this.formulario.getRawValue();
      let id = request.id;
      delete request.id;

      let metodo = id ? this.responsavelApiService.editarResponsavel(id, request) : this.responsavelApiService.salvarResponsavel(request);

      metodo.subscribe({
        next: (retorno: any) => {
          if (retorno) {
            this.notificationService.addMessage(MensagemNotificacao().salvarRegistro);
            this.cancelar()
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
    this.router.navigate([navegacaoResponsavel.link]);
  }
}
