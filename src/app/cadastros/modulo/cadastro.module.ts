import { ButtonModule } from 'primeng/button';
import { NgModule } from "@angular/core";
import { CadastroRoutingModule } from "./cadastro-routing.module";
import { CommonModule } from "@angular/common";

import { InputTextModule } from 'primeng/inputtext';
import { DataViewModule } from 'primeng/dataview';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ContaModule } from '../componentes/conta/modulo/conta.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, CadastroRoutingModule, ButtonModule, InputTextModule, DataViewModule, FormsModule, HttpClientModule]
})
export class CadastroModule{

}
