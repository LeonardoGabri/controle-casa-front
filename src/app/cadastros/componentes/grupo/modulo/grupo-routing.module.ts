import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GrupoListaComponent } from "../lista/grupo-lista.component";
import { GrupoFormularioComponent } from "../formulario/grupo-formulario.component";

const routes: Routes = [
  {
    path: 'lista',
    component: GrupoListaComponent
  },
  {
    path: 'formulario',
    component: GrupoFormularioComponent
  },
  {
    path: 'formulario/:id',
    component: GrupoFormularioComponent
  },
  {path: '', redirectTo: 'lista', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoRoutingModule{}
