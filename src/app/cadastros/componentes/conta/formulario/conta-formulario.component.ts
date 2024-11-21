import { ContaModel } from './../modelo/conta.model';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ContaApiService } from '../servico/conta-api.service';
import { Message } from 'primeng/api';
import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BancoApiService } from '../../banco/servico/banco-api.service';
import { ResponsavelApiService } from '../../responsavel/servico/responsavel-api.service';
import { navegacaoContaNovoCadastro } from '../../../servico/navegacao-cadastro.service';
import { validaCamposInvalidosFormulario } from '../../../../shared/servico/function/valida-formulario.service';
import { NotificationService } from '../../../../shared/servico/notification.service';

@Component({
  selector: 'app-conta-formulario',
  templateUrl: './conta-formulario.component.html',
  styleUrls: ['./conta-formulario.component.scss']
})
export class ContaFormularioComponent implements OnInit{
  formulario!: FormGroup
  notificacao: Message[] = [];
  nomePagina = navegacaoContaNovoCadastro.label
  opcoesBanco: any[] = [];
  opcoesResponsavel: any[] = [];
  id: string | null = null;

  constructor(
    private formBuilder:FormBuilder,
    private contaApiService: ContaApiService,
    private router: Router,
    private bancoApiService: BancoApiService,
    private responsavelApiService: ResponsavelApiService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ){}

  ngOnInit(): void {
    this.criarFormulario()

    this.carregarOpcoesBanco();
    this.carregarOpcoesResponsavel();

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.carregarConta(this.id);
    }
  }

  criarFormulario(novoFormulario?: ContaModel){
    this.formulario = this.formBuilder.group({
      id: [novoFormulario?.id],
      bancoId: [novoFormulario?.bancoId, Validators.required],
      responsavelId: [novoFormulario?.responsavelId, Validators.required]
    })
  }

  carregarConta(id: string) {
    this.contaApiService.buscarContaPorId(id).subscribe({
      next: (conta: any) => {
        let retorno = {
          bancoId: conta.banco.id,
          responsavelId: conta.responsavel.id
        }
        this.formulario.patchValue(retorno);
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

      let metodo = id ? this.contaApiService.editarConta(id, request) : this.contaApiService.salvarConta(request);

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
    this.router.navigate(['cadastro/conta/lista']);
  }

  carregarOpcoesBanco() {
    this.bancoApiService.buscarBancos().subscribe({
      next: (dados: any) => {
        this.opcoesBanco = dados.map((item: any) => ({
          label: item.nome,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de bancos', err)
    });
  }

  carregarOpcoesResponsavel() {
    this.responsavelApiService.buscarResponsaveis().subscribe({
      next: (dados: any) => {
        this.opcoesResponsavel = dados.map((item: any) => ({
          label: item.nome,
          value: item.id
        }));
      },
      error: (err) => console.error('Erro ao carregar opções de responsáveis', err)
    });
  }
}
