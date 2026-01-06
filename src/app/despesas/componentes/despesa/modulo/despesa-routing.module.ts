import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DespesaListaComponent } from "../lista/despesa-lista.component";
import { DespesaFormularioComponent } from "../formulario/despesa-formulario.component";

const routes: Routes = [
  {
    path: 'lista',
    component: DespesaListaComponent
  },
  {
    path: 'formulario',
    component: DespesaFormularioComponent
  },
  {
    path: 'formulario/:id/:idParcela',
    component: DespesaFormularioComponent
  },
  {path: '', redirectTo: 'lista', pathMatch: 'full'}

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DespesaRoutingModule{}
