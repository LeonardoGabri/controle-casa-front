import { NgModule } from "@angular/core";
import { FaturaRoutingModule } from "./fatura-routing.module";
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
import { FaturaFormularioComponent } from "../formulario/fatura-formulario.component";
import { FaturaListaComponent } from "../lista/fatura-lista.component";

@NgModule({
  declarations: [FaturaListaComponent, FaturaFormularioComponent],
  imports: [
    FaturaRoutingModule,
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
export class FaturaModule{}
