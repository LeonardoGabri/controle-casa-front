import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastros/modulo/cadastro.module').then(m => m.CadastroModule)
  },
  {
    path: 'despesas',
    loadChildren: () => import('./despesas/modulo/despesas.module').then(m => m.DespesasModule)
  },
];
