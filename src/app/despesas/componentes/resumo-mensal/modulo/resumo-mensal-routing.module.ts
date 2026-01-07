import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ResumoMensalListaComponent} from "../lista/resumo-mensal-lista.component";

const routes: Routes = [
  {
    path: 'lista',
    component: ResumoMensalListaComponent
  },
  {path: '', redirectTo: 'lista', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResumoMensalRoutingModule{

}
