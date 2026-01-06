import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import { FaturaModel } from "../../../../fatura/modelo/fatura.model";
import { Router } from "@angular/router";
import { navegacaoParcelaEditarCadastro } from "../../../../../servico/navegacao-despesa.service";
import {ResponsavelApiService} from "../../../../../../cadastros/componentes/responsavel/servico/responsavel-api.service";
import {FornecedorApiService} from "../../../../../../cadastros/componentes/fornecedor/servico/fornecedor-api.service";

@Component({
  selector: 'app-parcela-component',
  templateUrl: './parcela.component.html',
  styleUrls: ['./parcela.component.scss']
})
export class ParcelaComponent{
  @Input() parcelas: FaturaModel[] = [];
  @Output() editar = new EventEmitter<FaturaModel>();
  @Output() remover = new EventEmitter<FaturaModel>();
  opcoesFornecedor: any[] = [];


  constructor(
    private router: Router,
  ){}

  editarParcela(parcela: any) {
    this.router.navigate([navegacaoParcelaEditarCadastro(parcela.id, true).link])
  }

  removerParcela(parcela: FaturaModel) {
    this.remover.emit(parcela);
  }
}
