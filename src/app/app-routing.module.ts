import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { GuardService } from './services/guard.service';
import { ListComponent } from './components/list/list.component';
import { DetailsComponent } from './dialogs/details/details.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

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
