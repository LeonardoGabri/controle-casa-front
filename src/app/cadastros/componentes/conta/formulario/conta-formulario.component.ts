import { ContaModel } from './../modelo/conta.model';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ContaApiService } from '../servico/conta-api.service';
import { Message } from 'primeng/api';
import { MensagemNotificacao } from '../../../../shared/mensagem/notificacao-msg.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BancoApiService } from '../../banco/servico/banco-api.service';
import { ResponsavelApiService } from '../../responsavel/servico/responsavel-api.service';

@Component({
  selector: 'app-conta-formulario',
  templateUrl: './conta-formulario.component.html',
  styleUrls: ['./conta-formulario.component.scss']
})
export class ContaFormularioComponent implements OnInit{
  formulario!: FormGroup
  notificacao: Message[] = [];

  opcoesBanco: any[] = [];
  opcoesResponsavel: any[] = [];
  id: string | null = null;

  constructor(
    private formBuilder:FormBuilder,
    private contaApiService: ContaApiService,
    private router: Router,
    private bancoApiService: BancoApiService,
    private responsavelApiService: ResponsavelApiService,
    private route: ActivatedRoute
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
      bancoId: [novoFormulario?.bancoId],
      responsavelId: [novoFormulario?.responsavelId]
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
    let request = this.formulario.getRawValue();
    let id = request.id;
    delete request.id;

    let metodo = id ? this.contaApiService.editarConta(id, request) : this.contaApiService.salvarConta(request);

    metodo.subscribe({
      next: (retorno: any) => {
        if (retorno) {
          this.notificacao = new Array(MensagemNotificacao().salvarRegistro);
          this.cancelar();
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
