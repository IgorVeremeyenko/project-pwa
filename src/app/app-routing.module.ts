import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './dialogs/login/login.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'authorization', component: AuthComponent
  },
  {
    path: 'login', component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
