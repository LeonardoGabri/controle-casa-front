import {NgModule} from "@angular/core";
import {PatrimonioFormularioComponent} from "../formulario/patrimonio-formulario.component";
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
import {PatrimonioRoutingModule} from "./patrimonio-routing.module";
import {PatrimonioListaComponent} from "../lista/patrimonio-lista.component";
import {TransacaoModule} from "../../transacao/modulo/transacao-module";

@NgModule({
  declarations: [PatrimonioFormularioComponent, PatrimonioListaComponent],
  imports: [
    PatrimonioRoutingModule,
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
    CardModule,
    TransacaoModule
  ],
})
export class PatrimonioModule { }
