import {NgModule} from "@angular/core";
import {TransacaoRoutingModule} from "./transacao-routing.module";
import {InputMaskModule} from "primeng/inputmask";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {MenuModule} from "primeng/menu";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {DialogModule} from "primeng/dialog";
import {HttpClientModule} from "@angular/common/http";
import {DropdownModule} from "primeng/dropdown";
import {MessagesModule} from "primeng/messages";
import {InputNumberModule} from "primeng/inputnumber";
import {AccordionModule} from "primeng/accordion";
import {CardModule} from "primeng/card";
import {TransacaoFormularioComponent} from "../formulario/transacao-formulario.component";
import {TransacaoListaComponent} from "../lista/transacao-lista.component";

@NgModule({
  declarations: [TransacaoFormularioComponent, TransacaoListaComponent],
  imports: [
    TransacaoRoutingModule,
    InputMaskModule,
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
    MessagesModule,
    InputNumberModule,
    AccordionModule,
    CardModule
  ],
  exports: []
})
export class TransacaoModule {
}
