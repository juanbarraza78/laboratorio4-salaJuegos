import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'aboutme',
    loadComponent: () =>
      import('./components/aboutme/aboutme.component').then(
        (m) => m.AboutmeComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'ahorcado',
    loadComponent: () =>
      import('./components/juegos/ahorcado/ahorcado.component').then(
        (m) => m.AhorcadoComponent
      ),
  },
  {
    path: 'mayormenor',
    loadComponent: () =>
      import('./components/juegos/mayormenor/mayormenor.component').then(
        (m) => m.MayormenorComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
