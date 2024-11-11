import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ContaListaComponent } from "../lista/conta-lista.component";

const routes: Routes = [
    {
      path: 'lista',
      component: ContaListaComponent
    },
    {path: '', redirectTo: 'lista', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContaRoutingModule{

}
