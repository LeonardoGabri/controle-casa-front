import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ResponsavelListaComponent } from "../lista/responsavel-lista.component";
import { ResponsavelFormularioComponent } from "../formulario/responsavel-formulario.component";

const routes: Routes =[
  {
    path: 'lista',
    component: ResponsavelListaComponent
  },
  {
    path: 'formulario',
    component: ResponsavelFormularioComponent
  },
  {
    path: 'formulario/:id',
    component: ResponsavelFormularioComponent
  },
  {path: '', redirectTo: 'lista', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsavelRoutingModule{

}
