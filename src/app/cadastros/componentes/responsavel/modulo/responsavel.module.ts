import { NgModule } from "@angular/core";
import { ResponsavelRoutingModule } from "./responsavel-routing.module";
import { ResponsavelListaComponent } from "../lista/responsavel-lista.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { HttpClientModule } from "@angular/common/http";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { MenuModule } from "primeng/menu";
import { MessagesModule } from "primeng/messages";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { TableModule } from "primeng/table";
import { ResponsavelFormularioComponent } from "../formulario/responsavel-formulario.component";

@NgModule({
  declarations: [ResponsavelListaComponent, ResponsavelFormularioComponent],
  imports: [
    ResponsavelRoutingModule,
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
  ],
  exports: [ResponsavelListaComponent]
})
export class ResponsavelModule{

}
