import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'conta',
        loadChildren: () => import("../componentes/conta/modulo/conta.module").then((m) => m.ContaModule)
      },
      {path: '', redirectTo: 'conta', pathMatch: 'full'}
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadastroRoutingModule{}
