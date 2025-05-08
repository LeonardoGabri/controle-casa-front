import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/api';

import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import { navegacaoSubgrupo, navegacaoSubgrupoNovoCadastro } from '../../../servico/navegacao-cadastro.service';
import { SubgrupoModel } from '../modelo/subgrupo.model';
import { SubgrupoApiService } from '../servico/subgrupo-api.service';
import { GrupoApiService } from '../../grupo/servico/grupo-api.service';
import { validaCamposInvalidosFormulario } from '../../../../shared/servico/function/valida-formulario.service';
import { NotificationService } from '../../../../shared/mensagem/notification.service';

@Component({
  selector: 'app-subgrupo-formulario',
  templateUrl: './subgrupo-formulario.component.html',
  styleUrls: ['./subgrupo-formulario.component.scss']
})
export class SubgrupoFormularioComponent implements OnInit{
  formulario!: FormGroup
  nomePagina = navegacaoSubgrupoNovoCadastro.label
  id: string | null = null;
  opcoesGrupo: any[] = [];

  constructor(
    private formBuilder:FormBuilder,
    private subgrupoApiService: SubgrupoApiService,
    private grupoApiService: GrupoApiService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.criarFormulario();

    this.carregarOpcoesGrupo()

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.carregarSubGrupo(this.id);
    }
  }

  criarFormulario(novoFormulario?: SubgrupoModel){
    this.formulario = this.formBuilder.group({
      id: [novoFormulario?.id],
      nome: [novoFormulario?.nome, Validators.required],
      grupoId: [novoFormulario?.grupoId]
    })
  }

  carregarSubGrupo(id: string) {
    this.subgrupoApiService.buscarSubgrupoPorId(id).subscribe({
      next: (subgrupo: any) => {
        this.formulario.patchValue(subgrupo);
        this.formulario.get('grupoId')?.setValue(subgrupo?.grupo?.id)
      },
      error: ({error}) => {
        this.notificationService.error(MensagemNotificacao().erroAoBuscarRegistro.detail + error)
            }
    });
  }

  salvar() {
    if(this.formulario.valid){
      let request = this.formulario.getRawValue();
      let id = request.id;
      delete request.id;

      let metodo = id ? this.subgrupoApiService.editarSubgrupo(id, request) : this.subgrupoApiService.salvarSubgrupo(request);

      metodo.subscribe({
        next: (retorno: any) => {
          if (retorno) {
            this.notificationService.error(MensagemNotificacao().salvarRegistro.summary)
            this.cancelar()
          }
        },
        error: ({ error }) => {
          this.notificationService.error(MensagemNotificacao().erroSalvarRegistro.detail + error)
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
    this.router.navigate([navegacaoSubgrupo.link]);
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
