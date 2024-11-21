import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FaturaModel } from "../../../../fatura/modelo/fatura.model";
import { Router } from "@angular/router";
import { navegacaoParcelaEditarCadastro } from "../../../../../servico/navegacao-despesa.service";

@Component({
  selector: 'app-parcela-component',
  templateUrl: './parcela.component.html',
  styleUrls: ['./parcela.component.scss']
})
export class ParcelaComponent{
  @Input() parcelas: FaturaModel[] = [];
  @Output() editar = new EventEmitter<FaturaModel>();
  @Output() remover = new EventEmitter<FaturaModel>();

  constructor(
    private router: Router
  ){

  }

  editarParcela(parcela: any) {
    this.router.navigate([navegacaoParcelaEditarCadastro(parcela.id, true).link])
  }

  removerParcela(parcela: FaturaModel) {
    this.remover.emit(parcela);
  }
}
