import { HttpClientModule } from "@angular/common/http";
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
      {
        path: 'responsavel',
        loadChildren: () => import("../componentes/responsavel/modulo/responsavel.module").then((m) => m.ResponsavelModule)
      },
      {
        path: 'grupo',
        loadChildren: () => import("../componentes/grupo/modulo/grupo.module").then((m) => m.GrupoModule)
      },
      {path: '', redirectTo: 'conta', pathMatch: 'full'}
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes), HttpClientModule],
  exports: [RouterModule]
})
export class CadastroRoutingModule{}
