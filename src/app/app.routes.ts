import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Cadastro } from './components/cadastro/cadastro';
import { ListaFuncionarios } from './components/lista-funcionarios/lista-funcionarios';
import { FormularioFuncionarios } from './components/formulario-funcionarios/formulario-funcionarios';
import { Enderecos } from './components/enderecos/enderecos';
import { Contatos } from './components/contatos/contatos';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'cadastro', component: Cadastro },
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: 'funcionarios', component: ListaFuncionarios },
      { path: 'funcionarios/novo', component: FormularioFuncionarios },
      { path: 'lista-funcionarios', redirectTo: 'funcionarios', pathMatch: 'full' },
      { path: 'formulario-funcionarios', redirectTo: 'funcionarios/novo', pathMatch: 'full' },
      { path: 'enderecos', component: Enderecos },
      { path: 'contatos', component: Contatos },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
