import { NgModule } from "@angular/core";
import { DespesaRoutingModule } from "./despesa-routing.module";
import { DespesaListaComponent } from "../lista/despesa-lista.component";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { MessagesModule } from "primeng/messages";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { TableModule } from "primeng/table";
import { DespesaFormularioComponent } from "../formulario/despesa-formulario.component";

@NgModule({
  declarations: [DespesaListaComponent, DespesaFormularioComponent],
  imports: [
    DespesaRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    MenuModule,
    OverlayPanelModule,
    DialogModule,
    HttpClientModule,
    DropdownModule,
    MessagesModule
  ]
})
export class DespesaModule{}
