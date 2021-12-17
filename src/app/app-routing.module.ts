import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './auth/auth.component';
import { GuardService } from './services/guard.service';
import { ListComponent } from './components/list/list.component';
import { DetailsComponent } from './dialogs/details/details.component';

const routes: Routes = [
  {
    path: '', 
    component: HomeComponent, 
    canLoad: [GuardService]
  },
  {
    path: 'authorization', component: AuthComponent
  },
  {
    path: 'table', component: ListComponent
  },
  {
    path: 'details', component: DetailsComponent
  },
  {
    path: '**', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
