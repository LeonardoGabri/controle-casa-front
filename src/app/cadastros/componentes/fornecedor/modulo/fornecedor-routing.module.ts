import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FornecedorListaComponent } from "../lista/fornecedor-lista.component";
import { FornecedorFormularioComponent } from "../formulario/fornecedor-formulario.component";

const routes: Routes =[
  {
    path: 'lista',
    component: FornecedorListaComponent
  },
  {
    path: 'formulario',
    component: FornecedorFormularioComponent
  },
  {
    path: 'formulario/:id',
    component: FornecedorFormularioComponent
  },
  {path: '', redirectTo: 'lista', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedorRoutingModule{}
