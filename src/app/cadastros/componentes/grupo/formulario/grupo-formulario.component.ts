import { Component, OnInit } from "@angular/core";
import { GrupoModel } from "../modelo/grupo.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Message } from "primeng/api";
import { GrupoApiService } from "../servico/grupo-api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MensagemNotificacao } from "../../../../shared/mensagem/notificacao-msg.service";
import { navegacaoGrupo, navegacaoGrupoNovoCadastro } from "../../../servico/navegacao-cadastro.service";
import { validaCamposInvalidosFormulario } from "../../../../shared/servico/function/valida-formulario.service";
import { NotificationService } from "../../../../shared/mensagem/notification.service";

@Component({
  selector: 'app-grupo-formulario',
  templateUrl: './grupo-formulario.component.html',
  styleUrls: ['./grupo-formulario.component.scss']
})
export class GrupoFormularioComponent implements OnInit{
  formulario!: FormGroup
  nomePagina = navegacaoGrupoNovoCadastro.label
  id: string | null = null;

  constructor(
    private formBuilder:FormBuilder,
    private grupoApiService: GrupoApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.criarFormulario();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.carregarGrupo(this.id);
    }
  }

  criarFormulario(novoFormulario?: GrupoModel){
    this.formulario = this.formBuilder.group({
      id: [novoFormulario?.id],
      nome: [novoFormulario?.nome, Validators.required]
    })
  }

  carregarGrupo(id: string) {
    this.grupoApiService.buscarGrupoPorId(id).subscribe({
      next: (responsavel: any) => {
        this.formulario.patchValue(responsavel);
      },
      error: ({error}) => {
        this.notificationService.error(MensagemNotificacao(error).erroAoBuscarRegistro.detail)
      }
    });
  }

  salvar() {
    if(this.formulario.valid){
      let request = this.formulario.getRawValue();
      let id = request.id;
      delete request.id;

      let metodo = id ? this.grupoApiService.editarGrupo(id, request) : this.grupoApiService.salvarGrupo(request);

      metodo.subscribe({
        next: (retorno: any) => {
          if (retorno) {
            this.notificationService.success(MensagemNotificacao().salvarRegistro.summary);
            this.cancelar()
          }
        },
        error: ({ error }) => {
          this.notificationService.error(MensagemNotificacao(error).erroSalvarRegistro.detail)
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
    this.router.navigate([navegacaoGrupo.link]);
  }
}
