import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Message } from "primeng/api";
import { ResponsavelModel } from "../modelo/responsavel.model";
import { MensagemNotificacao } from "../../../../shared/mensagem/notificacao-msg.service";
import { ResponsavelApiService } from "../servico/responsavel-api.service";
import { navegacaoResponsavel } from "../../../servico/navegacao-cadastro.service";

@Component({
  selector: 'app-responsavel-formulario',
  templateUrl: './responsavel-formulario.component.html',
  styleUrls: ['./responsavel-formulario.component.scss']
})
export class ResponsavelFormularioComponent implements OnInit{
  formulario!: FormGroup
  notificacao: Message[] = [];
  id: string | null = null;

  constructor(
    private formBuilder:FormBuilder,
    private responsavelApiService: ResponsavelApiService,
    private router: Router,
    private route: ActivatedRoute
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
      nome: [novoFormulario?.nome]
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
    let request = this.formulario.getRawValue();
    let id = request.id;
    delete request.id;

    let metodo = id ? this.responsavelApiService.editarResponsavel(id, request) : this.responsavelApiService.salvarResponsavel(request);

    metodo.subscribe({
      next: (retorno: any) => {
        if (retorno) {
          this.notificacao = new Array(MensagemNotificacao().salvarRegistro);
          this.cancelar()
        }
      },
      error: ({ error }) => {
        this.notificacao = new Array(MensagemNotificacao().erroSalvarRegistro);
      },
      complete: () => {
      }
    });
}

  cancelar(){
    this.router.navigate([navegacaoResponsavel.link]);
  }
}
