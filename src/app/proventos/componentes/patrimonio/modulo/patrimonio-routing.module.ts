import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PatrimonioFormularioComponent} from "../formulario/patrimonio-formulario.component";
import {PatrimonioListaComponent} from "../lista/patrimonio-lista.component";

const routes: Routes = [
  {
    path: 'lista',
    component: PatrimonioListaComponent
  },
  {
    path: 'formulario',
    component: PatrimonioFormularioComponent
  },
  {
    path: 'formulario/:id',
    component: PatrimonioFormularioComponent
  },
  {path: '', redirectTo: 'lista', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatrimonioRoutingModule { }
