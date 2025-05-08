import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/componentes/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastros/modulo/cadastro.module').then(m => m.CadastroModule)
  },
  {
    path: 'despesas',
    loadChildren: () => import('./despesas/modulo/despesas.module').then(m => m.DespesasModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
