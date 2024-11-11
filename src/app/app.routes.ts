import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cadastro',
    loadChildren: () => import('./cadastros/modulo/cadastro.module').then(m => m.CadastroModule)
  },
];
