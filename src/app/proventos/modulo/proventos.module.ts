import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {DataViewModule} from "primeng/dataview";
import {InputTextModule} from "primeng/inputtext";
import {ProventosRoutingModule} from "./proventos-routing.module";

@NgModule({
  declarations: [],
  imports: [ProventosRoutingModule, CommonModule, ButtonModule, InputTextModule, DataViewModule, FormsModule, HttpClientModule],
  providers: [DatePipe]
})
export class ProventosModule{}
