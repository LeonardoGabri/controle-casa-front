import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';

import { DespesaFormularioComponent } from '../formulario/despesa-formulario.component';
import { ParcelaComponent } from '../formulario/modal/parcelas/parcela.component';
import { PlanejamentoParcelasComponent } from '../formulario/modal/planejamento-parcelas/planejamento-parcelas.component';
import { DespesaListaComponent } from '../lista/despesa-lista.component';
import { DespesaRoutingModule } from './despesa-routing.module';
import {AccordionModule} from "primeng/accordion";
import {CardModule} from "primeng/card";

@NgModule({
  declarations: [DespesaListaComponent, DespesaFormularioComponent, PlanejamentoParcelasComponent, ParcelaComponent],
  imports: [
    DespesaRoutingModule,
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
})
export class DespesaModule{}
