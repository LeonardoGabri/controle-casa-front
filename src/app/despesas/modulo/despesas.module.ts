import { NgModule } from "@angular/core";
import { DespesasRoutingModule } from "./despesas-routing.module";
import { CommonModule, DatePipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DataViewModule } from "primeng/dataview";
import { InputTextModule } from "primeng/inputtext";

@NgModule({
  declarations: [],
  imports: [DespesasRoutingModule, CommonModule, ButtonModule, InputTextModule, DataViewModule, FormsModule, HttpClientModule],
  providers: [DatePipe]
})
export class DespesasModule{}
