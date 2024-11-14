import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FaturaModel } from "../../../../fatura/modelo/fatura.model";

@Component({
  selector: 'app-parcela-component',
  templateUrl: './parcela.component.html',
  styleUrls: ['./parcela.component.scss']
})
export class ParcelaComponent{
  @Input() parcelas: FaturaModel[] = [];
  @Output() editar = new EventEmitter<FaturaModel>();
  @Output() remover = new EventEmitter<FaturaModel>();

  editarParcela(parcela: FaturaModel) {
    this.editar.emit(parcela);
  }

  removerParcela(parcela: FaturaModel) {
    this.remover.emit(parcela);
  }
}
