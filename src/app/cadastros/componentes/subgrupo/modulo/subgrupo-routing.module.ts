import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SubgrupoListaComponent } from "../lista/subgrupo-lista.component";
import { SubgrupoFormularioComponent } from "../formulario/subgrupo-formulario.component";

const routes: Routes = [
  {
    path: 'lista',
    component: SubgrupoListaComponent
  },
  {
    path: 'formulario',
    component: SubgrupoFormularioComponent
  },
  {
    path: 'formulario/:id',
    component: SubgrupoFormularioComponent
  },
  {path: '', redirectTo: 'lista', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubgrupoRoutingModule{}
