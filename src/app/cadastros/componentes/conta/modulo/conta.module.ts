import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { MessagesModule } from 'primeng/messages';
import { ContaListaComponent } from '../lista/conta-lista.component';
import { ContaRoutingModule } from './conta-routing.module';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ContaFormularioComponent } from '../formulario/conta-formulario.component';

@NgModule({
  declarations: [ContaListaComponent, ContaFormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContaRoutingModule,
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
  exports: [ContaListaComponent]
})
export class ContaModule{

}
