import { NgModule } from "@angular/core";
import { GrupoRoutingModule } from "./grupo-routing.module";
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
import { GrupoListaComponent } from "../lista/grupo-lista.component";
import { GrupoFormularioComponent } from "../formulario/grupo-formulario.component";

@NgModule({
  declarations: [GrupoListaComponent, GrupoFormularioComponent],
  imports: [
    GrupoRoutingModule,
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
export class GrupoModule{}
