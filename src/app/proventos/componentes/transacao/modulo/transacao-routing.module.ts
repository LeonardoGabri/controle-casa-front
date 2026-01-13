import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TransacaoListaComponent} from "../lista/transacao-lista.component";
import {TransacaoFormularioComponent} from "../formulario/transacao-formulario.component";

const routes: Routes = [
  {
    path: 'lista',
    component: TransacaoListaComponent
  },
  {
    path: 'formulario',
    component: TransacaoFormularioComponent
  },
  {
    path: 'formulario/:id',
    component: TransacaoFormularioComponent
  },
  {path: '', redirectTo: 'lista', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransacaoRoutingModule { }
