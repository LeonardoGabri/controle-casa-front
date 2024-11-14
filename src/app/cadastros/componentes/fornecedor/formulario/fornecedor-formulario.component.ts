import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Message } from "primeng/api";
import { navegacaoFornecedor, navegacaoFornecedorNovoCadastro } from "../../../servico/navegacao-cadastro.service";
import { GrupoApiService } from "../../grupo/servico/grupo-api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FornecedorApiService } from "../servico/fornecedor-api.service";
import { FornecedorModel } from "../modelo/fornecedor.model";
import { MensagemNotificacao } from "../../../../shared/mensagem/notificacao-msg.service";
import { SubgrupoApiService } from "../../subgrupo/servico/subgrupo-api.service";

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
    private route: ActivatedRoute
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
      nome: [novoFormulario?.nome],
      subgrupoId: [novoFormulario?.subgrupoId]
    })
  }

  carregarFornecedor(id: string) {
    this.fornecedorApiService.buscarFornecedorPorId(id).subscribe({
      next: (fornecedor: any) => {
        let retorno = {
          nome: fornecedor.nome,
          grupoId: fornecedor.grupo.id
        }
        this.formulario.patchValue(retorno);
      },
      error: ({error}) => {
        this.notificacao = [MensagemNotificacao(error).erroAoBuscarRegistro];
      }
    });
  }

  salvar() {
    let request = this.formulario.getRawValue();
    let id = request.id;
    delete request.id;

    let metodo = id ? this.fornecedorApiService.editarFornecedor(id, request) : this.fornecedorApiService.salvarFornecedor(request);

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
