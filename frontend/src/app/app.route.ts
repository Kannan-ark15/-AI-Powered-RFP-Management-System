import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard-component/dashboard-component.component').then(m => m.DashboardComponent)
  },
  {
    path: 'create-rfp',
    loadComponent: () => import('./components/create-rfp-component/create-rfp-component.component').then(m => m.CreateRfpComponent)
  },
  {
    path: 'vendors',
    loadComponent: () => import('./components/vendors-component/vendors-component.component').then(m => m.VendorsComponent)
  },
  {
    path: 'send-rfp',
    loadComponent: () => import('./components/send-rfp-component/send-rfp-component.component').then(m => m.SendRfpComponent)
  },
  {
    path: 'inbox',
    loadComponent: () => import('./components/inbox-component/inbox-component.component').then(m => m.InboxComponent)
  },
  {
    path: 'compare',
    loadComponent: () => import('./components/compare-component/compare-component.component').then(m => m.CompareComponent)
  }
];