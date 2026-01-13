import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: 'patrimonio',
    loadChildren: () => import("../componentes/patrimonio/modulo/patrimonio.module").then((m) => m.PatrimonioModule)
  },
  {
    path: 'transacao',
    loadChildren: () => import("../componentes/transacao/modulo/transacao-module").then((m) => m.TransacaoModule)
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  })
export class ProventosRoutingModule { }
