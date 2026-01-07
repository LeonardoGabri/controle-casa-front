import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: 'despesa',
    loadChildren: () => import("../componentes/despesa/modulo/despesa.module").then((m) => m.DespesaModule)
  },
  {
    path: 'fatura',
    loadChildren: () => import("../componentes/fatura/modulo/fatura.module").then((m) => m.FaturaModule)
  },
  {
    path: 'resumo-mensal',
    loadChildren: () => import("../componentes/resumo-mensal/modulo/resumo-mensal.module").then((m) => m.ResumoMensalModule)
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DespesasRoutingModule{}
