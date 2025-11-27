import { Routes } from '@angular/router';
import { TabsPage } from '../tabs/tabs.page';
import { AuthGuard } from '../services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('../login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('../register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'chat',
        loadComponent: () => import('../chat/chat.page').then((m) => m.ChatPage),
      },
      {
        path: 'publicacion',
        loadComponent: () => import('../publicacion/publicacion.page').then((m) => m.PublicacionPage),
      },
      {
        path: 'booking',
        loadComponent: () => import('../booking/booking.page').then((m) => m.BookingPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];