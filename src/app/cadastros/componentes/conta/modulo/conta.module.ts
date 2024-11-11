import { NgModule } from "@angular/core";
import { ContaListaComponent } from "../lista/conta-lista.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ContaRoutingModule } from "./conta-routing.module";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@NgModule({
  declarations: [ContaListaComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ContaRoutingModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    MenuModule,
    OverlayPanelModule
  ],
    exports: [ContaListaComponent]
})
export class ContaModule{

}
