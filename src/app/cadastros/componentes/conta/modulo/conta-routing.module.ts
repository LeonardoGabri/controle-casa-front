import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContaListaComponent } from "../lista/conta-lista.component";
import { ContaFormularioComponent } from "../formulario/conta-formulario.component";

const routes: Routes = [
    {
      path: 'lista',
      component: ContaListaComponent
    },
    {
      path: 'formulario',
      component: ContaFormularioComponent
    },
    {
      path: 'formulario/:id',
      component: ContaFormularioComponent
    },
    {path: '', redirectTo: 'lista', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContaRoutingModule{

}
