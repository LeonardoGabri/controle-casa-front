import { NgModule } from "@angular/core";
import { SubgrupoRoutingModule } from "./subgrupo-routing.module";
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
import { SubgrupoListaComponent } from "../lista/subgrupo-lista.component";
import { SubgrupoFormularioComponent } from "../formulario/subgrupo-formulario.component";

@NgModule({
  declarations: [SubgrupoListaComponent, SubgrupoFormularioComponent],
  imports: [
    SubgrupoRoutingModule,
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
export class SubgrupoModule{}
