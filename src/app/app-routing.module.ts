import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from './services/guard.service';

const routes: Routes = [
  {
    path: 'costumers', 
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule),    
  },
  { 
    path: 'unauthorized', 
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule)
    
  },
  {
    path: 'authorization', 
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'add-client',
    loadChildren: () => import('./components/add-client/add-client.module').then(m => m.AddClientModule)
  },
  {
    path: '',
    loadChildren: () => import('./components/list/list.module').then(m => m.ListModule),
    canLoad: [GuardService]
  }
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
