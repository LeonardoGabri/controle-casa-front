import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FaturaFormularioComponent } from '../formulario/fatura-formulario.component';
import { FaturaListaComponent } from '../lista/fatura-lista.component';

const routes: Routes = [
  {
    path: 'lista',
    component: FaturaListaComponent
  },
  {
    path: 'formulario',
    component: FaturaFormularioComponent
  },
  {
    path: 'formulario/:id',
    component: FaturaFormularioComponent
  },
  {path: '', redirectTo: 'lista', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaturaRoutingModule{}
