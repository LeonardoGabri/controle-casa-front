import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: 'despesa',
    loadChildren: () => import("../componentes/despesa/modulo/despesa.module").then((m) => m.DespesaModule)
  },
  // {
  //   path: 'fatura',
  //   loadChildren: () => import("../componentes/responsavel/modulo/responsavel.module").then((m) => m.ResponsavelModule)
  // },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DespesasRoutingModule{}
